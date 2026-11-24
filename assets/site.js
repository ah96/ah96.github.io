// The button in the top bar switches between light and dark colours.
// Without a stored choice the page follows the setting of the system.
(function () {
  "use strict";
  var root = document.documentElement;
  var button = document.getElementById("theme-toggle");
  if (!button) return;

  function current() {
    var set = root.getAttribute("data-theme");
    if (set === "light" || set === "dark") return set;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  button.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* the choice then holds for this visit only */ }
  });
})();

// The link of the section in view is marked in the top bar.
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  var links = {};
  document.querySelectorAll(".nav a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      Object.keys(links).forEach(function (id) {
        if (id === entry.target.id) links[id].setAttribute("aria-current", "true");
        else links[id].removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-25% 0px -70% 0px" });
  Object.keys(links).forEach(function (id) {
    var section = document.getElementById(id);
    if (section) observer.observe(section);
  });
})();

// The search field above the publications shows the entries that hold every word typed.
(function () {
  "use strict";
  var tools = document.getElementById("pub-tools");
  var field = document.getElementById("pub-search");
  var count = document.getElementById("pub-count");
  var none = document.getElementById("pub-none");
  if (!tools || !field) return;
  var entries = Array.prototype.slice.call(document.querySelectorAll(".pub"));
  var groups = Array.prototype.slice.call(document.querySelectorAll(".year-group"));
  // The year of the group is added to the text of an entry, so that a year can be typed.
  var texts = entries.map(function (entry) {
    var year = entry.closest(".year-group").querySelector(".year").textContent;
    return (entry.textContent + " " + year).toLowerCase();
  });

  function update() {
    var words = field.value.toLowerCase().split(/\s+/).filter(Boolean);
    var shown = 0;
    entries.forEach(function (entry, i) {
      var match = words.every(function (word) { return texts[i].indexOf(word) !== -1; });
      entry.hidden = !match;
      if (match) shown += 1;
    });
    groups.forEach(function (group) { group.hidden = !group.querySelector(".pub:not([hidden])"); });
    none.hidden = shown !== 0;
    count.textContent = (words.length ? shown + " of " : "") + entries.length + " publications";
  }
  tools.hidden = false;
  field.addEventListener("input", update);
  update();
})();

// The button next to the e-mail address copies it.
(function () {
  "use strict";
  var button = document.getElementById("copy-mail");
  if (!button || !navigator.clipboard) return;
  button.hidden = false;
  button.addEventListener("click", function () {
    navigator.clipboard.writeText(button.getAttribute("data-copy")).then(function () {
      button.textContent = "Copied";
      window.setTimeout(function () { button.textContent = "Copy"; }, 1600);
    });
  });
})();

// Parts of the page below the first screen come in when they are scrolled into view.
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".section .body, .section h2, .demo, .year-group").forEach(function (part) {
    if (part.getBoundingClientRect().top < window.innerHeight) return;
    part.classList.add("reveal");
    observer.observe(part);
  });
})();
