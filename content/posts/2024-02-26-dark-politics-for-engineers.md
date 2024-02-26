---
title: "Dark Politics for Engineers: Part 1"
date: 2024-02-26T10:17:32-05:00
description: "Corporate politics done ethically gets good projects approved and deserving people promoted. Done unethically yields the contemptible opposites. Politics has both it's light and it's dark sides. Let's talk about Dark Politics in Software Organizations and how it is likely to manifest."
categories:
  - Web Development
  - Management
---

> "Put your sword back into its place. For all who take the sword will perish by
> the sword."
>
> _--- Jesus of Nazareth, 1st century Jewish Rabbi, Lord and Savior_

## Corporate Politics

Corporate politics: The human behaviors of exercising power and authority in
the workplace.

To double-down on this: politics is _always_ the exercise of power and
authority. Not sometimes. _Always_.

Politics is neither _good_ nor _evil_; but it can achieve both.

Politics is fire. Productive in harnessed application. Destructive in unchecked
liberation. Always powerful.

And, importantly, you _cannot escape_ politics. You can choose not to play, but
all that does is cede the power and decisions of how to employ it to someone
else. Power and authority will still exist and be exercised to shape your
experience.

If you have good and wise leaders, you may be happy and secure in ceding your
political trust to them. We do not always have good and wise leaders. (left as
an exercise to the reader to derive this fact)

> You: "I am not interested in politics."
>
> Universe: "Well, politics is very interested in you."

Corporate politics done ethically toward productivity gets good projects
approved and bad projects cancelled; it gets deserving people promoted and toxic
people fired.

Corporate politics done unethically toward destruction, is the opposite: bad
projects approved and good projects cancelled; toxic people promoted and
deserving people ousted.

You can think of politics, like _The Force_, as having both light and dark
sides:

> Luke: "Is the dark side stronger?"
>
> Yoda: "No, no no. Quicker, easier, more seductive."

(For years, I thought Yoda said "more destructive" instead of "more seductive".
I still like to ponder on both versions.)

Today, let's talk _Dark Politics_ in context of Software Organizations. All
examples and references come from first-hand witness or (ashamed to say) prior
usage in my decade of experience as a Software Engineer (+5 years as a Manager).

## Dark Political Strategies

A strategy is a high-level, long-term goal and plan of action to achieve it:
"big picture", Commissioned Officers stuff.

These tend to be pretty broad and universal things like the following:

1. Get promotions you do not deserve
2. Get ideas approved that are bad
3. Get rid of people you do not like

We will not spend time on these, as they tend to be motivationally self-evident
and, bluntly, everyone has both witnessed one or more of these first-hand, and
the honest and self-introspective amongst us will admit to, at minimum, feeling
the lure of them in their own lives.

## Dark Political Tactics

In contrast, tactics are small-level procedures and practices to achieve
immediate short-term goals: "on the ground" Sergeant/NCO stuff.

I will address two today.

### 1. Character Assassination

As **_Software Engineers_**, we like to pretend that we are rational beings,
above the petty emotional squabbles of the mere non-programmer. This is
believed, by someone to some degree, in every software organization in the
world. It is disbelieved by every person outside that organization looking in on
it.

In actuality, as populations and samples go, the active crop of programmers at
any point in time tend to skew their averages towards particular personality
traits:

- low(er) emotional intelligence
- high(er) rational intelligence
- low(er) empathy
- high(er) orderliness
- low(er) charisma
- high(er) inquisitivenss

Or, to put in 1980s John Hughes film terms:

- Nerds
- Dweebs
- Geeks
- Dorks
- Freaks
- Weirdos

Or, to put in yet other terms:

- Emotionally stunted, socially awkward, well-akshually-ers

Now, dear reader, I am not saying _**you**_ are like this. Obviously not. But,
your co-workers? Maybe some of them, just a little bit? Yeah? Yeahhhhh?

<span style="font-size: 20px;">😏</span>

_NOTE: None of my current or recent co-workers are anything like this. This
applies to everyone else, but not them._

Anyways, my point is that **_we_** are no more above personal insults, idle gossip,
petty grievances, and High School Glee Club drama fests than anyone else. If
anything, we are probably on average worse about it than many professions.

Because I, like you fellow kids, am a highly rational, intelligent, and orderly
mind, I will enlighten you with this taxonomy of drama: I call it, _The Division
of Drama Actor Labor_, and it is thus:

1. The Victim
1. The Instigator
1. The Mob

**The Victims**: Technically, anyone can be the victim, but certain people are
easier or harder to victimize than others. This is a combo of intrinsic
qualities and individual choices: victim mentality, while not being 100%
explanatory, is still very real. Programmers, for reasons listed earlier, have
an elevated incidence rate of victim mentality: they're simply easier to bully,
on average.

**The Instigators**: May be "bullies", "gossips", or "drama queens/kings", etc..
You know the behavior when you see it. The goal of The Instigator is to
influence and manipulate The Mob.

**The Mob**: Arguably, the most important actor in all drama. Whether it's
traditional bullying, gossiping, back-biting, whatever, the immediate goals are
always to influence The Mob: (a) decrease the social standing of The Victim
_among The Mob_, and/or (b) increase the social standing of The Instigator
_among The Mob_. We engineer-types, as a group, are _highly susceptible_ to
being unsuspecting drama mobs, because it takes a degree of emotional
intelligence and empathy to see through The Instigator's play.

The Mob is the one that actually applies the social costs/benefits, which is why
it's so bad to be the gullible conscript in one: you're the one manipulated into
giving The Instigator what they want, at The Victim's expense.

When, where, and how are character assassinations, bullying, and drama likely to occur?

- Code (Pull Request) Reviews
- Annual Peer (365) Reviews
- (Not So Blameless) Post Mortems
- Chat DMs (aka the most evil place in the office)

### 2. Technical Disparagement

As **_Software Engineers_**, we like to pretend that everything we do is highly
scientific and objective. Furthermore, that our very subjective opinions are not
opinions at all, but self-evident, rational, even universal truths. And while,
when done right, our jobs have plenty of measurable, logical processes and
techniques, a significant amount of our work is (a) highly _subjective_ and (b)
deeply _contextual_.

> Software is read more than it is written, and it is executed more than it is
> read.

We write software for two audiences: (a) target computers and (b) future
programmers. Spoiler: the target computer that will execute your software, to
the delight or disgust of your customers, doesn't care one iota about your
Software Patterns, Function Purity, Monads, CLEAN Architecture, DRY principles,
or white-space discipline. We write all that shit for squishy humans behind
keyboards. What's worse, the moment you hand a software project off to someone
other than the original author(s), the inheritor will inevitably conclude that
whatever organizational patterns and principles initially employed were
hopelessly misguided.

Good software:

1. Works for the people using it.
2. Makes sense to the people maintaining it.

#1 is more objective (_more_ not totally) than #2, but both are subjective and
contextual to the specific people actually involved.

The key to _technical disparagement_ is that it is biased and faux-scientific.
When **Done Right™**, it has superficial objectivity and impartiality, but is
suspiciously lacking in context and dishonest about either tradeoffs,
subjectivity, or both.

Warning flags:

- Overwhelming jargon usage
- Shifting blame off themselves
- [Bullshit Firehose](https://en.wikipedia.org/wiki/Firehose_of_falsehood) (overwhelming the
  hearer with an excessive number of poor arguments)

Code Reviews are a fantastical place to see technical disparagement, as the
contestants hide personal attacks behind gossamer veils of "this is a code
smell", "can't this be cleaner?", 30x "whitespace problem here".

As well, _technical disparagement_ doesn't require the attacker to be more
technically competent than the victim. Once any person in any technical-role
surpasses early mid-level experience (aka beyond entry level), they have likely
acquired enough jargon, superficial understanding, and key feedback phrases to
pull it off. Call this the **_Gainsay Threshold_**.

While it is easier done downward, senior to junior, because of the _Gainsay Threshold_,
it can be effectively employed in any direction: up, down, lateral.

- The overbearing senior engineer who incessantly review-bombs the PRs of a
  junior they don't like.
- The plucky mid-level engineer that get's combative on every decision of the
  project lead.
- The aggressively ambitious manager who erroneously heaps blame on another
  team for slowing them down, hoping to shift criticism off themselves.

### Solutions to Character Assassinations and Technical Disparagements

1. Recognize Drama and your role in it
   - Are you instigating?
   - Are you allowing yourself to be made a victim?
   - Are you being courted or manipulated into joining the mob?
1. Shun instigators when they are instigating.
   - Not all instigators are lost causes, but never reward the bad behavior.
1. Immediately critique all negatively charged emotion directed at an
   individual
   - Even if you may personally want to believe it.
1. Do the self-work to purge victim mentality from yourself.
1. Always trend technical discussions away from "absolutes" and into "trade-offs".
   - If you mentally said "Only Sith deal..." you proved everything said in
     "Character Assassinations" section.
   - If you are an engineer who does not talk in trade-offs, you are not an
     engineer. You are a motivational speaker.
1. Eschew jargon not common to the audience
   - The point of jargon is to save communication time and effort among people
     with established pools of shared meaning.
   - Keep yourself honest by defining jargon the first time you use it in a new
     interaction.
   - Keep others honest by asking for jargon definition when in interactions
     with new or mixed company.
   - Always define jargon during written work.
1. Blameless post mortems for problems
   - This is not squishy bullshit to spare people's feelings.
   - You are explicitly choosing to interrogate the SYSTEM and the PROCESSES
     for failure, not people.
   - You are bulwarking the improvement cycle from being commandeered for Dark
     Politics.
1. Suffer not the toxic process to live.
   - If your code reviews are habitually nitpicky and cursed, it would be
     better to do away with them completely.
   - If your _Annual 365 Performance Reviews™_ are addicted to negative feedback,
     they are easy to hijack for Dark Politics.

## Conclusion

I'm tired of writing. So, I'm done now.

Don't be evil at work.

## Links

- My prior article ["Good Software: The Engineer's Perspective"](https://tommygroshong.com/posts/engineering-perspective-on-good-software/)
- Harvard Business Review: ["You can't Sit Out Office Politics"](https://hbr.org/2021/07/you-cant-sit-out-office-politics)
