# ah96.github.io

Source of my personal website: <https://ah96.github.io/>

It is one static page with my research topics, publications, teaching, talks and contact.
Plain HTML and CSS with a little JavaScript. No build step, no tracking, nothing loaded from other servers.

## Editing

| What | Where |
|---|---|
| Text | `index.html` |
| A new publication | copy one `<li class="pub">` block in `index.html` into the list of its year |
| Colours | the variables at the top of `assets/style.css` |
| The robot scene in the Research section | `assets/demo.js` |

To preview, open `index.html` in a browser. A push to `main` publishes the page.

## The robot scene

The small scene in the Research section is a toy: a robot plans a shortest way on a grid, and its answers are derived from that plan. It only illustrates the idea of explanations that come from the robot's own planner. It is not the method of any of my papers.

## Credits

The font is [Inter](https://github.com/rsms/inter), under the SIL Open Font License (`assets/fonts/OFL.txt`).
