---
layout: post
title: 'I Tried to Fine-Tune My Own AI But My Laptop Had Other Plans'
date: 2026-03-30
category: coding
read_time: 3
---

At some point during my local AI journey, I stumbled upon what sounded like a rather ambitious idea. Instead of trying to wrap a general purpose chatbot in Python, and given that my hardware wasn't strong enough to run the larger models that actually give decent answers, why not just fine-tune a small language model to fit one of my specific needs? Like a coding assistant that would give me a base code structure for me to fill in with my own logic and variables. Now that sounded like a proper game plan, right?

So I started researching. I read about parameter-efficient fine-tuning methods, about datasets, about training loops. I started putting together what I'd need. The good thing was that most of these I just pulled from Hugging Face all together. The harder part was figuring out what models and data to actually pull. I started with an 8B parameter model which I knew could at least run fine on inference on my poor laptop, and paired it with a standard coding dataset so that the model could specialize in programming languages.

And immediately, I hit a brick wall.

Every time I tried to run the training process, there was always a parameter that was too extensive for my hardware and it just wouldn't execute the way I hoped. So I tweaked everything to work within my 4GB VRAM and even downgraded to a 3B parameter model, and still, even though I got it running, it took almost an hour or two just to train 0.01% of the model.

Yikes.

Don't get me wrong. My laptop's RTX 3050 is not a bad GPU for most things. I can play high end AAA games at a solid 45 to 60 FPS most of the time, but I guess LLMs are just on a completely different league than your average video game. Fine-tuning, even on a small model, asks for a level of VRAM that the 3050 simply doesn't have. I think even 6 to 8GB would be the bare minimum to fine-tune the smallest models out there, and I'm sitting below that ceiling.

My hardware just said no. And I was genuinely frustrated by that. Not because I didn't understand the idea. Not because I didn't have a plan. Just because of the raw reality of what my machine could do.

After that, I decided to stop trying to do the most ambitious version of what I wanted, and just start thinking about the most meaningful version I could actually finish.