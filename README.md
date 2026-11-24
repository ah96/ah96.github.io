# ah96.github.io

The personal website of Amar Halilovic: one page with research topics, publications, teaching, talks and contact.
It is written for researchers, students and anyone who looks up the name.
GitHub Pages serves this repository at <https://ah96.github.io/>.

## How it works

The page is plain HTML, CSS and two small scripts. There is no build step and no generator, so the files in the repository are the files that are served.
The file `.nojekyll` tells GitHub Pages to serve them as they are.

Nothing is loaded from another server: no web fonts from a font service, no analytics, no cookies. A visit therefore sends no data to third parties, and the page needs no consent banner.

## What a visitor can do

| Element | What it does |
|---|---|
| The scene in the Research section | A robot drives to a shelf on a small grid. The visitor places or removes chairs, and asks "Why this way?" (or "Why did you stop?") and "What can I do?". The robot marks the chairs it speaks of. |
| Search field above the publications | Shows the entries that hold every word typed: title, author, venue or year. |
| Button in the top bar | Switches between light and dark colours and remembers the choice in the browser. |
| "Copy" next to the e-mail address | Copies the address. |

The scene is an illustration of the idea of an explanation that comes from the robot's own plan. The script computes a shortest way on the grid and derives every answer from it: the chairs on the shortest way are the cause, and the smallest set of chairs whose removal helps is the request. It is not the method of a publication, and the page says so beside the scene.

Without scripts the page shows all its content. The scene is then replaced by one question and one answer, and the search field and the copy button are absent.

Motion (the robot, parts that come in on scroll) is switched off for visitors whose system asks for reduced motion. The robot then drives only when "Send the robot again" is pressed.

## Look at it

Open `index.html` in a browser. All paths are relative, so it works from the disk.

## Publish it

1. Create an empty public repository named `ah96.github.io` on GitHub.
2. Commit the files, add the repository as remote and push `main`.
3. In the repository settings, under Pages, choose "Deploy from a branch", branch `main`, folder `/ (root)`.

The name of the repository must be `<account>.github.io`. Only then is the page served at the root address.

## Change it

| To change | Edit |
|---|---|
| Any text | `index.html`. Each section starts with a comment line that names it. |
| A new publication | Copy one `<li class="pub">` block in `index.html` into the list of its year. A new year is a new `<div class="year-group">`. |
| The portrait | Replace `assets/portrait.jpg` with a square image, 560 pixels wide, without camera metadata. |
| The room of the scene | The constants at the top of `assets/demo.js`: size of the grid, start, goal, furniture, first chair. |
| The robot's sentences | The functions `answerWhy` and `answerWhat` in `assets/demo.js`. |
| Colours, sizes | The variables at the top of `assets/style.css`. The dark colours stand there twice, for the reason given in the comment. |
| The address of the site | `canonical`, `og:url`, `og:image` and the JSON-LD block in the head of `index.html`. |

After a change, update "Last updated" in the footer.

## Files

| Path | What |
|---|---|
| `index.html` | the page and all its text |
| `assets/style.css` | layout, colours, light and dark mode, print |
| `assets/site.js` | colour switch, mark of the current section in the top bar, publication search, copy button, motion on scroll |
| `assets/demo.js` | the scene with the robot: planning, answers, drawing |
| `assets/portrait.jpg` | the portrait |
| `assets/favicon.svg` | the icon in the browser tab |
| `assets/fonts/` | the Inter font in four cuts, reduced to Latin characters, and its licence `OFL.txt` |
| `.nojekyll` | switches off the Jekyll build of GitHub Pages |

## Where the content comes from

Accessed on 24 November 2026.

| Element | Source | How it was checked |
|---|---|---|
| Position, start in April 2021, studies, research interests | page at the Institute of Artificial Intelligence, <https://www.uni-ulm.de/en/in/institute-of-artificial-intelligence/inst/team/amar-halilovic/> | read in full |
| Links to Google Scholar, ORCID and ResearchGate | the same page | read in full |
| Link to DBLP | <https://dblp.org/pid/296/8164.html> | found by a web search. The page itself refuses automated reading, so it was not opened. |
| Title of the thesis | list of publications of the thesis submission | read in full |
| Main research question, five topics, current work | slides of the exchange seminar, which quote Chapter 1 of the thesis | read in full |
| The exchange "Why did you stop?", methods and tools | poster "Robots that explain themselves". The robot's answer was written for the poster and is no quotation from a publication. | read in full |
| The scene with the robot and its sentences | written for this page. The poster gave the scene (robot, chair, shelf) and the two ideas: the cause comes from the robot's own plan, and the robot asks for the smallest change that frees the way. | computed in the page, see `assets/demo.js` |
| Publications | list of publications of the thesis submission | every DOI compared with its record at Crossref (title, authors, year, pages), every arXiv number with arXiv |
| Pages of the xAI 2025 and EvoApplications 2026 entries | Crossref | records of the two DOIs |
| "Towards Fast Visual Explanations of Local Path Planning with LIME and GAN", link | <https://ceur-ws.org/Vol-3841/Paper1.pdf> | first page of the PDF read |
| "Framework for the Planning of Affordance-Based Explanations in Robot Path Planning" | Google Scholar profile, and <https://journals.phl.univie.ac.at/meicogsci/article/view/749> | Scholar entry read. The journal page was found by a web search and answered with a server error on the day, so its volume and year rest on Scholar alone. |
| Course names | page at the institute, and the names of the current course material | read in full |
| Guest lecture in Sarajevo | title slide of the lecture | read in full |
| Interview | <https://aihub.org/2025/06/10/interview-with-amar-halilovic-explainable-ai-for-robotics/> | read in full |
| Invited talk in London | list of publications and talks of the thesis submission | read in full |
| E-mail address | footer of the poster | read in full |

## What it does not contain

- Manuscripts under review. A public list could break the anonymity of a double-blind review.
- Results, numbers and citation counts. The page states topics and research questions, and the publications carry the results.
- Dates of single semesters. They go out of date every half year.
- Entries of the Google Scholar profile that have no venue there, and "Explanation-Driven Task Planning Under Social Uncertainty" (ICRA 2026 workshop), whose venue name could not be confirmed in full.

## What was tested, and what not

Tested: the page was rendered with Chrome at 1440 and 390 pixels width, in light and in dark colours, and looked at. All links to DOIs and arXiv were confirmed as records. The files inside the repository that the page names exist.

The scene and the search were run in headless Chrome with simulated clicks: one chair on the way, no chair, one, two and three closed rows of chairs, sending the robot into a closed row, and removing all chairs. The answers and the marked chairs were as expected in each case. The search was tried with two words, a year, a word without a match and an empty field.

Not tested: the page as served by GitHub Pages, other browsers, a touch screen, the keyboard control of the scene, a screen reader, and the print layout on paper.

## Before you publish

- [ ] The scene with the robot. It is an illustration written for this page. Decide whether it represents your work as you want it, and whether the robot's sentences are yours.
- [ ] The three topics under "Current work". If one of them is under double-blind review, decide whether it may stand on a public page under your name.
- [ ] The status of the thesis. The page gives its title only, with no word on submission or defence.
- [ ] "PhD researcher" as the title of the position.
- [ ] The portrait: the right to use it on a public page, if a photographer took it.
- [ ] The author list of "Towards Probabilistic Planning of Explanations for Robot Navigation". The page follows the submission list and Google Scholar (three authors). The arXiv record 2411.05022 names two.
- [ ] The entries left out, see above. Add those that should be listed.
- [ ] An imprint and a privacy note. German law may ask for them on a page that is more than private, and GitHub as the host records the addresses of visitors.
- [ ] A licence for the repository, if others should be allowed to reuse the page.
- [ ] The DBLP link, since the page could not be opened here.
