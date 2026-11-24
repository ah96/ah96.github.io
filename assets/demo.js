// The scene in the Research section: a robot drives to a shelf on a small grid.
// The visitor places chairs, and the robot answers two questions.
// Every answer is derived from the plan that the robot computes here, in the page.
// It illustrates the idea of an explanation that is grounded in the planner.
// It is not the method of a publication.
(function () {
  "use strict";
  var host = document.getElementById("demo");
  var svg = document.getElementById("demo-svg");
  if (!host || !svg || !document.createElementNS) return;

  var NS = "http://www.w3.org/2000/svg";
  var COLS = 12, ROWS = 7, CELL = 48;          // the room, in cells, and the size of a cell
  var START = [0, 3], GOAL = [10, 3];          // where the robot starts and where it stops at the shelf
  var TABLE = [[4, 4], [5, 4], [4, 5], [5, 5]];
  var SOFA = [[7, 1], [8, 1]];
  var SHELF = [[11, 2], [11, 3], [11, 4]];
  var FIRST_CHAIRS = [[5, 3]];                 // the chair that stands in the room at the beginning
  var STEP_MS = 260;                           // time for one cell
  var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var fixed = {};
  TABLE.concat(SOFA, SHELF).forEach(function (c) { fixed[key(c)] = true; });

  var chairs = {};        // key of a cell -> true
  var cause = {};         // chairs that an answer names as the cause
  var advice = {};        // chairs that an answer asks the person to move
  var pos = START;
  var state = "idle";     // idle, moving, blocked, arrived
  var timer = null;
  var cursor = [5, 2];    // the marker for the keyboard

  function key(c) { return c[0] + "," + c[1]; }
  function same(a, b) { return a[0] === b[0] && a[1] === b[1]; }
  function steps(n) { return n + (n === 1 ? " step" : " steps"); }

  // ---------------------------------------------------------------- planning

  // A cell can be entered if it is in the room and holds no furniture and no chair.
  // "ignore" names chairs that are treated as absent: null for none, "all" for every chair, or a set.
  function open(x, y, ignore) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return false;
    var k = x + "," + y;
    if (fixed[k]) return false;
    if (!chairs[k] || ignore === "all") return true;
    return Boolean(ignore && ignore[k]);
  }

  // Shortest way from a cell to the shelf, as a list of cells, or null if there is none.
  // Distances are counted from the goal. The way then prefers to go straight on,
  // so that it has few turns.
  function plan(from, ignore) {
    var dist = {}, queue = [GOAL], i, c, n;
    var moves = [[1, 0], [0, -1], [0, 1], [-1, 0]];
    dist[key(GOAL)] = 0;
    for (i = 0; i < queue.length; i++) {
      c = queue[i];
      moves.forEach(function (m) {
        n = [c[0] + m[0], c[1] + m[1]];
        if (open(n[0], n[1], ignore) && dist[key(n)] === undefined) {
          dist[key(n)] = dist[key(c)] + 1;
          queue.push(n);
        }
      });
    }
    if (dist[key(from)] === undefined) return null;
    var path = [from], last = null;
    c = from;
    while (!same(c, GOAL)) {
      var order = last ? [last].concat(moves) : moves, next = null;
      for (i = 0; i < order.length && !next; i++) {
        n = [c[0] + order[i][0], c[1] + order[i][1]];
        if (dist[key(n)] === dist[key(c)] - 1) { next = n; last = order[i]; }
      }
      c = next;
      path.push(c);
    }
    return path;
  }

  function len(path) { return path ? path.length - 1 : Infinity; }

  // The smallest set of chairs whose removal shortens the way, or opens one.
  // One chair is tried first, then two. If two are not enough, the chairs on the
  // shortest way through the empty room are named, which always suffices.
  function smallestRequest() {
    var now = len(plan(pos, null));
    var list = Object.keys(chairs), best = null, i, j, set, l;
    if (now === len(plan(pos, "all"))) return null;
    for (i = 0; i < list.length; i++) {
      set = {}; set[list[i]] = true;
      l = len(plan(pos, set));
      if (l < now && (!best || l < best.len)) best = { set: set, len: l };
    }
    if (best) return best;
    for (i = 0; i < list.length; i++) {
      for (j = i + 1; j < list.length; j++) {
        set = {}; set[list[i]] = true; set[list[j]] = true;
        l = len(plan(pos, set));
        if (l < now && (!best || l < best.len)) best = { set: set, len: l };
      }
    }
    if (best) return best;
    return { set: onShortestWay(), len: len(plan(pos, "all")) };
  }

  // The chairs that stand on the shortest way through the room without chairs.
  function onShortestWay() {
    var set = {};
    plan(pos, "all").forEach(function (c) { if (chairs[key(c)]) set[key(c)] = true; });
    return set;
  }

  // ---------------------------------------------------------------- answers

  function answerWhy() {
    cause = {}; advice = {};
    if (state === "arrived") return "I have reached the shelf.";
    var now = len(plan(pos, null)), free = len(plan(pos, "all")), n;
    if (now === Infinity) {
      cause = smallestRequest().set;
      n = Object.keys(cause).length;
      return (n === 1 ? "The marked chair blocks" : "The " + n + " marked chairs block") + " my way to the shelf.";
    }
    if (now === free) return "This is the shortest way to the shelf. No chair is in my way.";
    cause = onShortestWay();
    n = Object.keys(cause).length;
    return (n === 1 ? "The marked chair blocks" : "The " + n + " marked chairs block") +
      " the shortest way, so I go around. That takes " + steps(now - free) + " more.";
  }

  function answerWhat() {
    cause = {}; advice = {};
    if (state === "arrived") return "Nothing is needed. I have reached the shelf.";
    var now = len(plan(pos, null)), request = smallestRequest();
    if (!request) return "Nothing is needed. My way is free.";
    advice = request.set;
    var n = Object.keys(advice).length;
    var please = n === 1 ? "Please move the marked chair." : "Please move the " + n + " marked chairs.";
    if (now === Infinity) return please + " Then I can reach the shelf in " + steps(request.len) + ".";
    return please + " That saves me " + steps(now - request.len) + ".";
  }

  // ---------------------------------------------------------------- drawing

  function el(name, attrs, parent) {
    var node = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (a) { node.setAttribute(a, attrs[a]); });
    (parent || svg).appendChild(node);
    return node;
  }
  function mid(c) { return [c[0] * CELL + CELL / 2, c[1] * CELL + CELL / 2]; }
  function block(cells, cls, label, turned) {
    var x0 = cells[0][0], y0 = cells[0][1], x1 = x0, y1 = y0;
    cells.forEach(function (c) { x1 = Math.max(x1, c[0]); y1 = Math.max(y1, c[1]); });
    var x = x0 * CELL + 5, y = y0 * CELL + 5, w = (x1 - x0 + 1) * CELL - 10, h = (y1 - y0 + 1) * CELL - 10;
    el("rect", { x: x, y: y, width: w, height: h, rx: 9, "class": cls });
    var t = el("text", { x: x + w / 2, y: y + h / 2, "class": "d-label", "text-anchor": "middle", "dominant-baseline": "central" });
    if (turned) t.setAttribute("transform", "rotate(-90 " + (x + w / 2) + " " + (y + h / 2) + ")");
    t.textContent = label;
  }

  svg.setAttribute("viewBox", "0 0 " + COLS * CELL + " " + ROWS * CELL);
  var x, y;
  for (x = 0; x < COLS; x++) for (y = 0; y < ROWS; y++) {
    el("circle", { cx: x * CELL + CELL / 2, cy: y * CELL + CELL / 2, r: 1.6, "class": "d-dot" });
  }
  block(TABLE, "d-furniture", "table");
  block(SOFA, "d-furniture", "sofa");
  block(SHELF, "d-shelf", "shelf", true);
  el("circle", { cx: mid(START)[0], cy: mid(START)[1], r: 17, "class": "d-start" });
  el("circle", { cx: mid(GOAL)[0], cy: mid(GOAL)[1], r: 17, "class": "d-goal" });
  var cursorBox = el("rect", { width: CELL - 6, height: CELL - 6, rx: 9, "class": "d-cursor" });
  var way = el("polyline", { "class": "d-way" });
  var chairLayer = el("g");
  var robot = el("g", { "class": "d-robot" });
  el("circle", { r: 20, "class": "d-halo" }, robot);
  el("circle", { r: 15, "class": "d-body" }, robot);
  el("circle", { cx: -5, cy: -3, r: 2.6, "class": "d-eye" }, robot);
  el("circle", { cx: 5, cy: -3, r: 2.6, "class": "d-eye" }, robot);

  function draw() {
    while (chairLayer.firstChild) chairLayer.removeChild(chairLayer.firstChild);
    Object.keys(chairs).forEach(function (k) {
      var c = k.split(",").map(Number), m = mid(c);
      var g = el("g", { "class": "d-chair" + (cause[k] ? " is-cause" : "") + (advice[k] ? " is-advice" : ""),
                        transform: "translate(" + m[0] + " " + m[1] + ")" }, chairLayer);
      el("circle", { r: 21, "class": "d-ring" }, g);
      el("rect", { x: -12, y: -6, width: 24, height: 19, rx: 5, "class": "d-seat" }, g);
      el("rect", { x: -12, y: -14, width: 24, height: 6, rx: 3, "class": "d-seat" }, g);
    });
    var path = state === "arrived" ? null : plan(pos, null);
    way.setAttribute("points", path ? path.map(function (c) { return mid(c).join(","); }).join(" ") : "");
    robot.setAttribute("transform", "translate(" + mid(pos)[0] + " " + mid(pos)[1] + ")");
    robot.setAttribute("class", "d-robot" + (state === "blocked" ? " is-blocked" : ""));
    cursorBox.setAttribute("x", cursor[0] * CELL + 3);
    cursorBox.setAttribute("y", cursor[1] * CELL + 3);
  }

  // ---------------------------------------------------------------- the exchange

  var question = document.getElementById("demo-question");
  var reply = document.getElementById("demo-reply");
  var whyButton = document.getElementById("demo-why");
  var whatButton = document.getElementById("demo-what");
  var againButton = document.getElementById("demo-again");
  var clearButton = document.getElementById("demo-clear");

  // With a question the person's line is shown. Without one the robot speaks by itself.
  function say(asked, text) {
    question.querySelector(".t").textContent = asked || "";
    question.style.visibility = asked ? "visible" : "hidden";
    reply.querySelector(".t").textContent = text;
  }
  function setState(next) {
    state = next;
    whyButton.textContent = state === "blocked" ? "Why did you stop?" : "Why this way?";
  }

  // ---------------------------------------------------------------- driving

  function schedule() {
    if (timer === null) timer = window.setTimeout(drive, STEP_MS);
  }
  function drive() {
    timer = null;
    if (state !== "moving") return;
    var path = plan(pos, null);
    if (!path) {
      setState("blocked");
      cause = {}; advice = {};
      say(null, "I have stopped.");
    } else if (path.length === 1) {
      setState("arrived");
      cause = {}; advice = {};
      say(null, "I have reached the shelf.");
    } else {
      pos = path[1];
      schedule();
    }
    draw();
  }
  function send() {
    pos = START;
    cause = {}; advice = {};
    setState("moving");
    say(null, "I am going to the shelf.");
    draw();
    schedule();
  }

  function toggle(c) {
    var k = key(c);
    if (fixed[k] || same(c, pos) || same(c, GOAL) || same(c, START)) return;
    if (chairs[k]) delete chairs[k]; else chairs[k] = true;
    cause = {}; advice = {};
    react();
    draw();
  }

  // After a change of the chairs the robot stops at once if no way is left,
  // and goes on if a way has opened.
  function react() {
    var path = plan(pos, null);
    if (state === "blocked" && path) {
      setState("moving");
      say(null, "My way is free again.");
      schedule();
    } else if ((state === "moving" || state === "idle") && !path) {
      setState("blocked");
      say(null, "I have stopped.");
    }
  }

  svg.addEventListener("click", function (event) {
    var box = svg.getBoundingClientRect();
    var c = [Math.floor((event.clientX - box.left) / box.width * COLS),
             Math.floor((event.clientY - box.top) / box.height * ROWS)];
    if (c[0] < 0 || c[1] < 0 || c[0] >= COLS || c[1] >= ROWS) return;
    cursor = c;
    toggle(c);
  });
  svg.addEventListener("keydown", function (event) {
    var move = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[event.key];
    if (move) {
      cursor = [Math.min(COLS - 1, Math.max(0, cursor[0] + move[0])), Math.min(ROWS - 1, Math.max(0, cursor[1] + move[1]))];
      draw();
    } else if (event.key === "Enter" || event.key === " ") {
      toggle(cursor);
    } else {
      return;
    }
    event.preventDefault();
  });
  whyButton.addEventListener("click", function () { var asked = whyButton.textContent; say(asked, answerWhy()); draw(); });
  whatButton.addEventListener("click", function () { say("What can I do?", answerWhat()); draw(); });
  againButton.addEventListener("click", send);
  clearButton.addEventListener("click", function () {
    chairs = {}; cause = {}; advice = {};
    react();
    draw();
  });

  // ---------------------------------------------------------------- start

  FIRST_CHAIRS.forEach(function (c) { chairs[key(c)] = true; });
  host.classList.add("is-live");
  Array.prototype.forEach.call(host.querySelectorAll("[hidden]"), function (node) { node.hidden = false; });
  setState("idle");
  say("Why this way?", answerWhy());
  draw();

  // The robot sets off when the scene comes into view. With reduced motion it waits for the button.
  if (!calm && "IntersectionObserver" in window) {
    var seen = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && state === "idle") {
        seen.disconnect();
        setState("moving");
        schedule();
      }
    }, { threshold: 0.6 });
    seen.observe(svg);
  }
})();
