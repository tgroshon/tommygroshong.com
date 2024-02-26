---
title: "Schrödinger's Code Smells"
date: 2023-08-16T10:41:20-04:00
draft: true
---

## Introduction

Dear reader, do you know what a "code smell" is?

## Code Smells

What a code smell is not:

- I disagree with what you wrote.
- I don't like your code, but I can't tell you well.

There exists an actual list of 22 "Classic Code Smells", reproduced in the collapsible box for
convenience.

<details>
<summary>22 Classic Code Smells List</summary>

1. Alternative Classes w/ Different Interfaces
1. Comments
1. Data Class
1. Data Clumps
1. Divergent Change
1. Duplicated Code
1. Feature Envy
1. Inappropriate Intimacy
1. Incomplete Library Client
1. Large Class
1. Lazy Class
1. Long Method
1. Long Parameter List
1. Message Chains
1. Middle Mane
1. Parallel Inheritance Hierarchies
1. Primitive Obsession
1. Refused Bequest
1. Shotgun Surgery
1. Speculative Generality
1. Switch Statements
1. Temporary Field
</details>

## Schrödinger's Cat - A Quantum Thought Experiment

The thought experiment was created by physicist Erwin Schrödinger in 1935 in a
discussion with Albert Einstein. It's purpose was to illustrate what Schrödinger
saw as the problems of the Copenhagen interpretation of quantum mechanics. Over
time, the thought experiment became part of the foundation of the modern
understanding quantum mechanics.

Original text as written by Schrödinger is reproduced in the collapsible box for
convenience.

<details>
<summary>Original Text</summary>

One can even set up quite ridiculous cases. A cat is penned up in a steel
chamber, along with the following device (which must be secured against direct
interference by the cat): in a Geiger counter, there is a tiny bit of
radioactive substance, so small, that perhaps in the course of the hour one of
the atoms decays, but also, with equal probability, perhaps none; if it happens,
the counter tube discharges and through a relay releases a hammer that shatters
a small flask of hydrocyanic acid. If one has left this entire system to itself
for an hour, one would say that the cat still lives if meanwhile no atom has
decayed. The first atomic decay would have poisoned it. The psi-function of the
entire system would express this by having in it the living and dead cat (pardon
the expression) mixed or smeared out in equal parts.

It is typical of these cases that an indeterminacy originally restricted to the
atomic domain becomes transformed into macroscopic indeterminacy, which can then
be resolved by direct observation. That prevents us from so naïvely accepting as
valid a "blurred model" for representing reality. In itself, it would not embody
anything unclear or contradictory. There is a difference between a shaky or
out-of-focus photograph and a snapshot of clouds and fog banks.

</details>

The short(er) version of the thought experiment (it was never intended to
actually be done, just thought through the implications) is as follows:

A cat, a flask of poison, and a randomized timer that may or may not trigger
(originally, a radioactive source attached to a Geiger counter) are placed in a
sealed box. If the timer triggers, the flask is shattered, releasing the poison,
which kills the cat.

Once in the box and after a period of time, the cat can be considered
_simultaneously alive and dead_. However, when the box is opened, the cat is
observed as either alive or dead, not both alive and dead. This poses the
question of when exactly quantum superposition ends and reality resolves into
one possibility or the other.

Fundamentally, the Schrödinger's cat thought experiment asks (a) how long
superpositions last and (b) when (or whether) they collapse.

If you're more of a visual learner, I offer you this Futurama clip for your
viewing pleasure (also, everyone should just watch this clip anyways):
https://youtu.be/qr78nv5CR2s?t=126

Don't worry if it feels paradoxical or silly; some of Schrodinger's
contemporaries agreed. I'll break down the key elements below.

### Key Elements

Some key elements of the Schrodinger's Cat thought experiment that apply to our
overall discussion of Code Smells:

1. _Unobservable_: cat is in a closed box
1. _Existential risk_: a vial of poison; since "existential" is a little
   melodramatic for later discussion, generalize it as "a risk capable of
   transitioning to completely new and incompatible state."
1. _Silent Randomness_: the randomized timer may trigger, or may not. We don't
   know when it will, if it will, or if it already did.

All three of these elements are required assumptions for the thought experiment
to work. If any one of them are missing, the experiment is useless. For example:

1. _Change box to be transparent glass._ No longer unobservable; you will observe
   the state change. No quantum superposition of states.
1. _Remove the vial of poison or the timer._ No risk event with enough magnitude
   to affect the state. No quantum superposition of states.
1. _Set the timer to a predictable value._ No randomness to the risk; you know
   at all times whether the risk has been realized or not via independent
   measurements of shared state (i.e. _time_), even if you can't observe within
   the box. No quantum superposition of states.

## Climax: The one where he finally relates Schrodinger's Cat to Code Smells

-- TODO: finish

## Links

- [Schrödinger's Cat](https://en.wikipedia.org/wiki/Schr%C3%B6dinger's_cat)
- [Sandi Metz - Get a Whiff of This (RailsConf 2016 talk)](https://www.youtube.com/watch?v=PJjHfa5yxlU)
