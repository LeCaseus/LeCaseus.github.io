# lecaseus.github.io

This is the repository for my personal site at [lecaseus.github.io](https://lecaseus.github.io). Feel free to poke around, borrow what you want, or just read this for fun.

---

## The story

This site has actually been rebuilt four times because each version was an honest reflection of where I was at. (but mainly because I was bored and couldn't decide on one theme)

**v1** started as a Node.js/Express app with a PostgreSQL database hosted on Vercel and Neon. I had no business building a backend at the time and I knew it, but I did it anyway. I wanted to make my own micro-blogging/blogging platform which was basically me refusing to use Twitter. It worked, barely, but I wasn't proud of it.

I realized that I had built something that I don't really understand, and couldn't maintain in the long run so, I stripped the backend entirely. Went fully static. The database was overkill for a personal site and I was just worried about getting hacked not knowing how the network works.

**v2** was the editorial brutalist era. Big red type, my photo against a dark city backdrop, aggressive layout. I just saw this on Pinterest and was fixated on getting noticed by employers and I let that show a little too much. It looked cool. It didn't feel like me.

**v3** was the Jekyll diagnostic redesign. I went for a Jekyll SSG because I wanted something to modularize my source code and make things easier to navigate. The site had a dark background, phosphor green accent, biosignal waveforms everywhere, posts called *readings*. The whole site read like a piece of medical equipment. I was happy with the direction. But now I've come to realize that jumping across Jekyll files, especially since I'v moved to helix, was just a hassle really, and jumping across files just to change one line isn't really it.

So, **v4** is this. Plain HTML, CSS, and JS. No build step, no SSG, no framework. I know I went full circle back to the start. Nevertheless, I've improved the visual direction from v3, same design language, same waveforms, but now all in one place. The kind of thing you can open, read, and change without switching files. It made sense to go back to basics.

The plan is to eventually wire up my own C++ backend for the blog and notes, so new posts don't require editing a JS array. But that's a near future project. For now, this is it.

---

## Stack

| | |
|---|---|
| Hosting | GitHub Pages |
| Fonts | Instrument Serif · Inter Tight · Fira Code |
| Styling | Vanilla CSS |
| JS | Vanilla JS |
| Backend | coming soon! |

---

## Past designs

| Version | Look |
|---|---|
| v1 | warm beige, editorial, photo-forward |
| v2 | brutalist red/black, huge type, dark city |
| v3 | Jekyll, dark diagnostic, phosphor green |
| v4 | plain stack, same diagnostic direction, simpler |

---

## Running locally

```bash
python -m http.server 8080
```

Visit `localhost:8080`. That's it.

---

*Chezter Vargas — [lecaseus.github.io](https://lecaseus.github.io)*
