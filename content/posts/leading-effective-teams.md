---
title: Leading Effective React Teams
date: 2022-07-27
description: "What does it mean for a React team to be productive and effective?"
categories:
  - JavaScript
  - Web Development
  - Management
tags:
  - JavaScript
---
## Introduction

What does it mean for a React team to be effective? Productive? Happy?
Impactful? Since moving back into management after a several year hiatus, this
has been on my mind a lot. I've begun to collect my thoughts into this post.
Many of the ideas apply to projects of any kind, but some of the advice I'll
give will be tailored specifically to React projects and teams. Many of the
ideas here build off of this earlier article ["Good Software from the Software
Engineer's
Perspective"](https://tommygroshong.com/posts/engineering-perspective-on-good-software/)
where I analyze the things that make an Application "good".

1. Evaluate performance
2. Cultivate collaboration
3. Invest in testing
4. Enrich the developer experience
5. Manage projects with agility 
6. Regulate tool adoption

### Evaluate performance

> "The real problem is that programmers have spent far too much time worrying
> about efficiency in the wrong places and at the wrong times; premature
> optimization is the root of all evil (or at least most of it) in programming."
>  - Donald Knuth, _The Art of Programming_

How do you avoid premature optimization? You wait to optimize code until it has
demonstrated a measureable problem, and then you tailor a solution to address
that measured problem. The process begins with creating a benchmark, a metric,
to compare against.

In this way, people are the same. To get clear improvement, begin by identifying
a relevant metric, and then tailor solutions to improve that metric. This is
true for individuals as well as teams. Do you think the team could get more done
in a sprint? Measure velocity, report on it, follow-up on it, talk about it as a
team. Identify confounding variables and metrics within sprint velocity that may
contribute to pulling the final velocity result down:

  - Are engineers (especially the most experienced ones) spending too much time in meetings?
    + Cut and combine meetings
    + Require all meetings to have an agenda
    + Pare invite lists down to the most essential particpants, and mark everyone else as optional
  - Are task and story estimates routinely too low?
    + Ensure tasks are well-defined at the time they're estimated with an explicit description of it's scope
    + Ensure there is a shared definition and standard for estimation; perhaps different people
      include or exclude different parts of the development process when estimating
    + Ensure the people executing a task are the ones estimating it
  - Are engineers spending a lot of time blocked on tasks?
    + Identify common blockers
    + Create a psychologically-safe, blame-free environment where blockers can be freely discussed
    + Never skip sprint retrospectives; use them to identify action items to address systemic blockers
    + Clarify an explicit *Blocker Escalation Process* so that engineers know how and when to raise issues
    + Focus daily standup meetings on identifying and resolving blockers and questions rather than rote status updates
 
The goal is to identify something that could be better, find a metric that
measures it, and then dig into the behavior to discover the underlying behaviors
that effect that metric.

Note of caution: you get what you measure. Metrics are a double-edged blade,
cutting in both directions. When you put emphasis on a metric, you are putting
your thumb on the scale of incentives, and as any economist knows, incentive
manipulation is tricksy business with a level of unpredictability. Humans are
really good at gaming the system, engineers doubly so. And they often don't do
it maliciously or even consciously. Be on the lookout for the potential that
emphasizing some metric may be driving behaviors you don't actually want.

A light touch is the most preferable way to adjust incentives unless you're
absolutely sure of the risk-reward tradeoff of doubling down on some metric.
Tying metric behavior to compensation is the opposite of light touch, and if
you've ever been involved in a Sales floor, that is blatantly obvious. Remember,
sales teams get away with tying all their metrics to compensation because they
are very comfortable with firing low performers based on the metrics they
identify.  Are you confident enough in your metrics to fire a team member over
them?  Is the cost of finding and onboarding a new engineer the same as a new
salesperson? In my experience, "no" is usually the answer.

### Cultivate collaboration

Onboarding to a new project is notoriously difficult in the software world.
Different paradigms, new terminology, unfamiliar problem domain, human
programmer idiosyncrasies; all combine to a mountain of mental effort for a
newcomer engineer. The problem plays out on the small scale as well as engineers
get introduced to new parts of the system after weeks or months of working in
others.

At the same time, your team is at constant risk of *siloization* as engineers
become more knowledgeable in some subsystem or skilled with a certain set of
tactical approaches. Engineer brains often turn inward as they get mentally
comfortable.

#### Pair Programming

*Pair programming* is an excellent antidote to both problems. In a pairing
experience, you can ask all the little nitty gritty questions that come up
during the work but that you never remember by tomorrow's daily standup or next
week's manager 1:1. This is valuable not only to the newbie but also to the
long-time team member just stepping into a new tree of React components that
they hadn't ever worked on.

I've found it useful to set team goals and follow-up plans when introducing or
increasing the amount of pair programming on a team. Setting daily targets of 30
minutes or cumulative weekly targets of 2-3 hours can be a good starting point.
Also, having a rule similar to "pair with at least N different people" can be
good to introduce some variety into the pool, and break up that one friend group
that you would easily believe spends 2 hours a day "pairing" exclusively with
each other where they just gab about their amazing Pokemon' collection
nonstop.

#### Cut the DMs

To aid in collaboration and breaking down silos, I've become a firm believer in
pushing project discussions out of private chat DMs and into shared team
channels. The majority of collaboration can and should take place in public
channels to promote open sharing of information. Project work and questions
should not be conducted and raised via direct messages or private group
messages. If one person on the team has a question about the project, likely
others do. If important decisions were made or information exchanged relevant to
future project work, there's a very good chance it will need to be communicated
to other team members in the future and then reiterated all over again.

Encourage your team to think this way about communication. Consider each new
message thread and ask yourself if the team would possibly benefit from
visibility into that conversation. More often than not, the answer ends up being
"yes".

My goto approach is to have two channels per-team: one public, one private. The
public channel is where stakeholders and other teams interact with this team.
The private channel is scoped to only the team members to create a comfortable
space for them to use team understood technical or project jargon, brainstorm
ideas that aren't ready for external adoption or follow-up, and generally
experience togetherness and companionship as a team. This is the channel for all
your cat memes where you don't have to worry about the boss judging your
comedic tastes. 

Within these two channels, all project and team coordination occurs. Need to ask
a specific team member a question about a ticket or some React Component?
Mention them in private chat and start a threaded conversation. In this way,
other team members have the opportunity to jump in or to simply be edified by
just reading the discussion. Do you start that question in public or private
chat? That decision is more nuanced, but generally breaks down to whether the
question is fundamentally about technical implementation or the problem domain.
If technical: private team chat. If problem domain, public chat where the
stakeholders (i.e. domain experts) can see and optionally become involved.

I've also found this practice to be a good way to decrease or prevent altogether
negative or abusive communications, which usually rely on happening in private
chats and DMs. A bad actor on the team has a hard time (a) acting on abusive
tendencies and (b) hiding it, so this approach both reduces harm and speeds up
discovery. Having a team-wide policy on this "all convos in team channel"
approach also provides an additional protective tool to potential victims: if
someone slides into your DMs with inappropriate or negative comments, you have
an opportunity to blamelessy redirect the conversation "the team rule is to have
these discussions in the team channel, so if you want to continue this
conversation, we will have it there". I encourage my team, and lead by example,
to copy-paste the DM convo into the team-chat and continue the discussion in a
thread there. When intentions are good, this can be done effortlessly and
blamelessly. When intentions are bad, this has a desirable chilling effect on
shitty, underhanded, and passive-aggressive comments.

### Invest in Testing

This is the part where I plagiarize myself on the article I wrote prior about
["Good Software from the Software Engineer's
Perspective"](https://tommygroshong.com/posts/engineering-perspective-on-good-software/):

> The tenants of Test Driven Development (TDD) tells us that there's a _difference
> in kind_ between "testing for defects" and "testing to drive code design". They
> are not the same thing, even though they may use the same tooling and involve
> similar code. Unit tests in TDD are valuable not because they catch defects, but
> because of *__when__* they can catch defects: in a tight feedback loop of the
> development process at the moment of the pertinent change. Because they are used
> this way, unit tests can enable API experimentation as the Engineer receives
> immediate feedback while taking the viewpoint of the consumer of the API, rather
> than only as it's author.

First rule of testing in React: component tests aren't unit tests, they're
integration tests. I will die on this hill. React component tests are
Integration tests. Period. Full stop.

If you want good unit tests in your React project, it presupposes that you
extracted code out of your React layer so it can be separately designed and
tested. I'll go further and say you should intend to pull as much logic out of
your React layer as possible. Do it 'til it hurts. This includes pulling logic
and code out of Components, Hooks, and Context Providers. With the logic outside
of React, you can truly _unit test_ it and focus on making a good design and
modeling of your problem domain. Again, your goal with unit tests of this code
is more than to just verify the behavior. The tests are also helping you refine
your API and providing scenario based documentation for the code under test.

Your React Component tests, which you're writing with [React Testing
Library](https://testing-library.com/docs/react-testing-library/intro/) and
trying to model after real user interactions (right?!), are your integration
tests and that's where you can do your real verification of features and low-key
user flow verification. Remember, the goal here is to see how things interact,
so you want to mock some things, but not everything. Remember, these aren't unit
tests. You shouldn't be intending to test a component in total isolation.
Instead, your goal should be verifying this Component with all of it's
collaborators is behaving as intended.

End-to-end tests I'll just mention briefly as a good tool for validating the
application as a whole, especially during important checkpoints such as pre- or
post-deploy. These tests shouldn't mock hardly anything. They are probably
written in Selenium or Cypress. Don't try to test too much with these tests
because they are slow to write and to run. Use them for broad strokes
verification of key workflows.

### Enrich Developer Experience (DevEx)

As programmers, we aren't too dissimilar from other craftspeople, and
craftspeople commonly spend time making and refining their own tools. Carpenters
and machinists alike make templates and jigs to speed up their repetitive work.
We can and should lean into this where we can, while keeping our eye on the
prize for why we do it: to improve our ability to deliver quality software.

Script all the things. The repetitive tasks are prime candidates. And utilize
your [NPM scripts](https://docs.npmjs.com/cli/v8/using-npm/scripts) facility. I
recommend writing scripts in Node.js sans-typescript to avoid a compile step and
lean into the constraint that scripts should be small interchangeable utilities
where possible, which doesn't fit well with the TypeScript model anyways.

Add [Prettier](https://prettier.io) and [ESLint](https://eslint.org) to your
project. Use the
[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) and
let Prettier own all _formatting_ decisions while ESLint owns simple static
analysis and code style guide.

Run tests and and enforce your formatting and linting checks in your CI system.
Oh, also, have a CI system. Yeah, that's important. Now, everyplace that hosts
code also includes a built-in way to execute tasks on PR, push, and merge. Set
that shit up.

Which leads to this next one: enforce behavior in CI, not in git hooks. This is
really just a continuance of my everlasting crusade to personally rip Husky out
of every project I find. But biases aside, let me be clear: git hooks are a
terrible place to run formatting, linting, type checks, and other static
analysis. Just terrible as a model. It's like doing validation on the client.
You may get the feedback earlier, but you open a can of worms where can't depend
on the data being clean when it goes to the backend because so many ways exist
to bypass your client. Git hooks are the same way. They always make git
interactions slower, and dear gawd, why would we punish developers for making
commits when it's an objectively good practice for developers to commit small
changes often; a pre-commit hook running any Node.js tool is guaranteed to make
that good behavior painful. Again, think of incentives. So, git hooks always have
a cost, but you can't rely on their benefit because it's trivial to purposely or
accidentally disable the git hook locally. In the end, if you want to be sure,
you always have to run your enforcement in CI anyways.

Fail the CI build if a PR (a) fails tests, (b) doesn't pass prettier formatting,
(c) fails linting, or (d) fails type-checking.

When talking about linting, I add a word of caution about overdoing it on the
"code style guides" and "consistency" demands. Let me tell you, as your friend,
that your code style is the least interesting thing about you and least
important of your skills.

Don't fall down the style and consistency pit. Sometimes they matter, many times
they're irrelevant. It really doesn't matter if the code base consistently uses
`const fn = () => {};` or `function fn() {}` for all functions. What matters is
that the code design and architecture is cohesive and you don't have competing
patterns or half-migrated patterns where you have the old and new ways of doing
some operation, coexisting now for 3 years because nobody took the time to go
and fix all those old code paths.

> "A foolish consistency is the hobgoblin of little minds, adored by little
> statesmen and philosophers and divines. With consistency a great soul has
> simply nothing to do. He may as well concern himself with his shadow on the
> wall. Speak what you think now in hard words, and to-morrow speak what
> to-morrow thinks in hard words again, though it contradict every thing you
> said to-day. — 'Ah, so you shall be sure to be misunderstood.' — Is it so bad,
> then, to be misunderstood? Pythagoras was misunderstood, and Socrates, and
> Jesus, and Luther, and Copernicus, and Galileo, and Newton, and every pure and
> wise spirit that ever took flesh. To be great is to be misunderstood."
>
>   - Ralph Waldo Emerson, "Self-Reliance"

Lastly, configure an automatic deploy to some staging or integration environment
for every merge to your main trunk. Just do it. The feedback of having an
automatic deploy is hugely beneficial to the engineering team and also provides
a natural way to get immediate feedback from external stakeholders.

### Manage projects with agility (aka Agile Project Management)

In my career, I've been on highly successful Scrum teams, Kanban teams, Extreme
Programming (XP; my fav) teams, and even once ... gasp ... a _waterfall team_.
You can launch a successful project and run a productive team in all of these
ways. A key to remember is that you're dealing with people and how they interact
with each other. The goal, more often than not, is to tailor a process to fit
your people, not people to fit your process.

All that being said, I've seen Agile based processes work well the most
consistently, and my theory is that they do the best job at reacting to change
and incorporating feedback into the process. I have some pointers about parts of
the project management process that are often overlooked, regardless of the
methodology you're using.

#### Short Iterations

First, choose the shortest iteration/sprint length that the team and
organization can handle. If you find sprint planning long and hard, or have
difficulty planning work for the last week of a sprint, your sprint might be too
long. Reducing the sprint will give you shorter planning horizons. If
stakeholders are changing the requirements in the middle of a sprint, your
sprint might be too long. Reducing the sprint length will bring you more in line
with the external rate of change.

I've found one (1) week to be the Gold Standard iteration length. It's short
enough that you almost never have to interrupt an iteration for some
high-priority change because the next sprint is only a few days away. It's long
enough to let you do meaty things. Accurately forecasting which tasks can be
done in one week is much easier than multi-week. If a task is big enough that
it's expected to take longer than a week, it almost certainly needs to be broken
down further. As well, capacity planning for time-off and holidays is very easy
when looking at just one week.

The key, practical difficulty in implementing a one week sprint is that a team
has to be *really* effective at the sprint planning (start) and retrospective
(end) meetings, because you do them so often. But there's a balancing action
here because your planning horizon is so short, you usually have less to plan
and subsequently less to review in retrospective.

The only serious pushes for shorter iterations than 1 week are from the Kanban
crowd, which pushes the "sprint" to a timeframe of "one task", and thereby
destroys the concept of sprint, and I'm not fully sold on that outside of
special case scenarios. I find value in organizing work into finite iterations,
with defined and periodic start and end times, with clear commitments, and
standardized touch-points before, during and after.

#### Control WIP

Second, control work in progress (WIP). It's not good for engineers to have
multiple tickets "In progress" at the same time. Having a pile up of tickets
waiting for code review (or QA review, or product review) also represents a
significant risk. The goal is to expedite tasks through the process as quickly
as possible to your defined _Done_ state (ideally, "Done" means "in front of
users"). Key to expediting work is avoiding (a) context switching and (b)
re-work.

Context switching most often happens when engineers move on too quickly from
task transitions to picking new tasks. They forget that "In review" is also WIP,
just like "In progress". Usually, it's better to wait before picking up your
next task, so that you can be unencumbered while the following steps of the
process complete and be ready to step in where appropriate. It's better to move
to reviewing other PRs immediately after you put one up for review rather than
immediately picking up another ticket to move "In progress".

I'm also a big fan of _locally conducted PR reviews (LCPR)_, which involve
pulling down PR branches to your own machine and reviewing the changes within
your development environment. Then, as you have suggestions, committing your
suggestions to the branch and pushing to that PR. This process should be
explicit upfront, because it can be jarring to have team mates unexpectedly push
to a branch that you are working on. With proper expectations in place, it has
many benefits. First, nitpicks aren't nearly as big of a deal if the person
making them is also the person fixing them. Second, it de-incentivizes _drive-by
reviews_ where an engineer makes suggestions for vague and speculative changes
without clear costs and benefits in mind, or when they suggest extravagant
changes that have sweeping implications for the rest of the implementation
(perhaps even outside of the scope of the original task). In an LCPR, the
expectation would be for the reviewer to contribute to this implementation them
self, which has the magical effect of making them far more aware of the actual
cost-benefits of their suggestions.


### Regulate tool adoption

Newsflash, things change a lot in the JavaScript and React ecosystem. Not quite
as much as they were circa 2014-17, but they still move at an impressively
daunting speed. Part of our job is staying on-top-of new developments in the
ecosystem, porting the useful ones to our application, and generally keeping our
application well-positioned in the ever-changing and shifting terrain.

#### The Risk of Ecosystem Shifts

"Bit rot" has long been derided as myth, but engineers should be wary before
dismissing it out of hand. While nothing may be physically rotting in your
computer's memory or storage, the ecosystem around it is constantly shifting.
The real risk for a React application becoming stale is it's dependencies
becoming out-of-date and eventually unavailable. This could be styling and
component libraries, state management libraries, build tooling, API querying and
caching tools, test runners, linters and formatters, typescript, or Node.js
itself.

The real risk isn't that those things randomly stop working, because as long as
the correct version of everything remains available the code will still build
and run (although the
[left-pad](https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code/)
debacle showed us that isn't necessarily a safe assumption). BUT, the moment you
want to change something, each change causes larger ripples of changes
throughout the app. If you update one library with a critical bug or
vulnerability, all of a sudden you break several other libraries that depend on
it and need updated themselves. Down the rabbit hole you go. Then, before you
know it, what would have been a trivial change 4 years ago takes you a week now
because you need to clean-up and and refactor code before you even get the
chance to make the original change. Anyone who has ever tried to go back and
pickup a side-project from years before knows exactly what I mean.

And then, let's think about all the little supplemental changes to the
ecosystem. You ever try finding documentation for an obsolete version of a small
library? How about finding blog posts on how to use some old tool from 5 years
ago that nobody uses anymore. Search engines prioritize new content, so you'll
always be fighting the algorithm on your web searching. Not to mention, since so
much of our community content is published by amateur writers in their spare
time, it's a common occurrence that blog posts simply disappear after a few
years.

#### Your responsibility to navigate the shifts

Your job at work is to ensure that doesn't happen to the company application on
your watch. Which means that you need to build into your project time and
manpower to routinely be updating and refactoring the code base to keep it
positioned within the center of the ecosystem.

On the other hand, you need to balance this pull with a crystal clear
understanding that there's a lot of unnecessary churn in React-land that is
irrelevant in the long-term, and not waste time chasing every new fad and
incorporating every new tool or library just because it _might_ be a big deal.
Thus, this section is called "regulate tool adoption" because you need to find
the right balance and internal regulation for how you approach adopting new tools.

One suggestion that I'll give is to always require that any new tool or library
that's added to the project should have a pre-requisite of a clear and
documented plan (probably as developer task tickets) for migrating the whole
code base to adopt that new tool/library. This helps avoid fracturing the code
base with every new addition, while also acting as a self-limiter on
enthusiastic developers who may be overly excited about a tool before they've
adequately considered the costs. The goal should be to minimize the time that
the application is in some _intermediate state_ between migrations. Stop
starting, and start finishing.

## Conclusion

So yeah. That's my initial thoughts after getting back on the React team
management bandwagon these last few months. Give them a think over. Reach me at
[@tgroshon](https://twitter.com/tgroshon) on Twitter.
