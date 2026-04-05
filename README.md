# CV. — lecaseus.github.io

```
┌─────────────────────────────────────────────────────────────┐
│  SIGNAL ACTIVE — WELLINGTON, NZ  ●  41°17'S 174°46'E        │
│  SUBJECT: CHEZTER VARGAS                                    │
│  STATUS: ONLINE                                             │
└─────────────────────────────────────────────────────────────┘
```

Hello and welcome to my website's official repository. Feel free to explore my files if you wanna see how I built this site or go check out my commit history or something. Also feel free to use this code for your own stuff.

> *"Everyone's online. Nobody's present."*

---

## Stack

| Layer | What |
|---|---|
| Generator | Jekyll (GitHub Pages native) |
| Hosting | GitHub Pages |
| Fonts | Space Mono · DM Sans |
| Styling | Vanilla CSS |
| JS | Vanilla JS |
| Backend | N/A yet. |

I do not have yet the knowledge to build a website's backend and I feel like I'd get hacked if I do so...

---

## Structure

```
.
├── _config.yml
├── _layouts/
│   ├── default.html        # base shell
│   ├── post.html           # blog post layout
│   └── project.html        # project page layout
├── _includes/
│   └── nav.html
├── _posts/                 # blog posts as Markdown
├── _projects/              # my showcase collection
├── assets/
│   ├── css/style.css
│   └── js/script.js
├── index.html
├── blog.html
└── portfolio.md            # I think this is a dead placeholder
```

Posts live at `/readings/:year/:month/:day/:title/`.  
Projects live at `/projects/:name/`.

---

## JS Functions

```js
init_reveal()        // intersection observer, staggered entry
init_blog_filter()   // tag filtering on blog index
boot_sequence()      // diagnostic boot animation on load
waveform_ambience()  // ambient SVG biosignal animation
scroll_triggers()    // scroll-linked effects
```

Everything lives in `assets/js/script.js`. UI behaviour only.

---

## Design Language

**Palette**

```
Background  #080c10   near-black
Accent      #4ecba0   phosphor green
Text        #c8d8e8   cool light
```

**Motifs**  
Biosignal waveforms as dividers. Diagnostic interface copy. Coordinates in the footer.  
Posts are called *readings*. You get the point.

**Typography**  
Space Mono for everything structural i.e. headings, labels, UI chrome.  
DM Sans (300 weight) for prose. The contrast does the work.

---

## Writing

New post:

```bash
_posts/YYYY-MM-DD-title-here.md
```

Front matter:

```yaml
---
layout: post
title: "Your Title Here"
date: YYYY-MM-DD
tag: career          # or: biomedical / misc / tech
---
```

Write in Markdown. Jekyll handles the rest.

---

## Running Locally

```bash
gem install bundler jekyll
bundle exec jekyll serve
```

Visit `localhost:4000`. Changes hot-reload.

---

## Philosophy

I originally wanted to make a hybrid micro-blogging and blogging platform because I quit using socials like Twitter, BlueSky, and Threads. Too many platforms to get my point across. So I made version 1 as a way to dump my thoughts somewhere in the internet.

Version 2 ended up more of a creative portfolio because I was so fixated on getting potential employers to notice me and to channel my professional side of things but in the end I lost its original purpose in version 1.

This latest rendition I came up with I believe is a best of both worlds kind of situation. The focus is now back to my blogs, but if people want to get to know more of what I can do, I also showcase my projects and have a downloadable CV in my about section.

---

```
▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  SIGNAL MAINTAINED
```

*LeCaseus / Chezter Vargas*
