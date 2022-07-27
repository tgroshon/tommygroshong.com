---
title: Good Software from the Software Engineer's Perspective
date: 2022-07-26
description: "What does it mean for software to be good? Some of the attributes that make software good are within the control of engineers, but others clearly are not. What's the difference? How can engineers maximize their contribution to a software project and make it good?"
categories:
  - JavaScript
  - Web Development
  - Management
tags:
  - JavaScript
---

What does it mean for a software application to be _good_? Here's my ranked
ordered list of "good software" attributes:

 1. **Solution**: Provides a service or solves a problem, and does it well
 1. **Design**: Cohesive, intuitive interface
 1. **Quality**: Minimal bugs and defects; good performance
 1. **Delivery**: Continual, helpful updates

## Solution and Design: What we don't control

The *Solution* and *Design* are the most visible and obvious parts of "good
software", and at the end of the day, if they're good enough, they can make up
for all the following things to a shocking degree. Users will put up with a hell
of a lot of ugly, stale, slow, and buggy software if it does something they
vitally need.

In the same way, a beautiful design can paper over a lot of defects and
performance problems. In the inverse case, few users will appreciate a 3x speed
improvement, an objectively phenomenal improvement, if it's made to the same
ugly, tired UI; and the violin playing crickets are the only audience for a
beautiful defect-free application that nobody needs or wants.

As much as we'd like to take credit for those first two attributes, often the
credit really lies with the designers and product managers exercising experience
and judgment while working tirelessly to observe customer behavior and collect
feedback; which they then communicate to us. Engineers are usually downstream
the the *Solution* and *Design* process.

Does that mean we ignore *Solution* and *Design* as an external concern? God forbid. 
Because so much of that work happens outside of our view, it represents a huge risk
of miscommunication and failed hand-offs. One of the most important aspects in
Agile project management is trying to elevate and streamline communication and
coordination between Engineering and other teams. Building proactive and
reactive mechanisms into your process for improving cooridination is crucial to a
successful team and good software.

## Quality and Delivery: What we do control

*Quality* and *Delivery*, are where Engineers get to shine. We have direct
control over both of them, and they are vital. I'll now reverse what I said
earlier about users putting up with shitty software if it looks good enough or
if it solves an important enough problem, which is all still theoretically true
but practical reality has something else to say:

> The software ecosystem is so saturated with applications and competititors
> that the likelihood that any one application is the only or best solution to
> any particular problem is exceptionally low.

Most applications aren't solving important or unique enough problems to get away
with all that much. This is especially true in consumer software; less true in
business software, but the gap between business and consumer software is closing
each year. In this way, competition is doing exactly what a market enthusiast would
expect: competition is driving down customer tolerance for poor quality and the
length of time they are willing to tolerate it.

### Quality and it's nuances

*Quality* is a fixed standard set by the people building the product. It can be
objectively measured by quantifying all known defects, bugs, security
vulnerabilities, and performance bottlenecks. This doesn't mean that a team must
choose to block all work until absolutely positive that it's bug and defect
free. It means that the people building the app should set a standard of what is
and isn't acceptable quality in their application, and stick to it. In the same
way manufactured parts have acceptable tolerances and spec-compliant variation,
so too can software have it's **WONTFIX** bugs and put off certain performance
improvements because the current behavior is _good enough_.


Often, when Engineers talk *Quality* they think of bugs, but they do not always
think of security vulnerabilities and poor performance. These are also defects
and addressing them is fundamental to *Quality*.

*Quality* in a software application can be improved by (a) better defect discovery
mechanisms and (b) increasing the standard (i.e. lowering the threshold of tolerable 
defects). Better discovery often involves better reporting; chances are good that most
defects have been discovered by somebody

In some project management interpretations, *Quality* is considered to be one of
a project's available _interrelated constraint levers_ with the big 3: time, 
resources, and scope. Adjust one, and the others are affected. Increase resources, and you can
accomplish more project scope, or do the same scope in less time. Lower the
scope, you can also lower resources or lower the time required. But can you
lower *Quality* and cause time, resources, or scope to change? Hell no. This is
a foolish notion and Software Engineers (and especially their managers), should
expunge it from their brains so fast that it dislodges all the neighboring bad
ideas that nested nearby.

Don't ship a feature you know is broken, it will just upset your users when
they realize it doesn't work. Instead, cut the broken feature from the release until
it works; i.e. reduce the scope. Don't ship a 1/2 broken feature. Instead, you cut 
the parts that don't work and ship only the 1/2 that does work;
i.e. reduce the scope. Ideas that cutting *Quality* can be advantageous for
short-term scope, time, or resource gain are ridiculous. When *Quality* is on the table,
the lever you should be adjusting is scope.


### Delivery: The Magic Unicorn

*Delivery* is an extra special magic unicorn of an attribute. Users care the
least about it in the short-term, but the most about it in the long-term. On our
side, a good *Delivery* is what can fix problems in any and all attributes above
it.

*Delivery* includes two aspects: time and value. What is delivered must be _the
right thing_ and arrive _soon enough_ to matter. Low value changes delivered
quickly and high value changes delivered slowly are two sides of the same coin
and result in the same negative consequence: the user becomes frustrated and
abandons the application.

Notice in the previous section that I didn't connect *Quality* with anything
regarding source code structure, abstractions, or architectures; patterns, in
short. Additionally, I didn't say anything explicit about *testing* when
discussing *Quality*. This is also intentional. That doesn't mean those things
aren't important. They are exceptionally important, but not for *Quality*.
Again, *Quality* is an objective measure, but the relevance of the different
patterns of organizing your source code is purely subjective. Instead, I posit
that *testing* and *patterns* are key drivers of *Delivery*, not *Quality*.

First, code patterns. They exist as mechanisms to help us squishy brained humans
make sense of the highly rigid logic of computer programs. Our brains are
evolved to work well with patterns, and when we can map a difficult problem to
an existing pattern, or break it down into a collection of patterns, we are
substantially better able to reason about it; and to alter it to create new
desired behaviors. The machine does not care about our puny abstractions and
architectures. The CPU, compiler, and virtual machine are indifferent to the
best laid plans of IDE's and men. Patterns exist for people. Code patterns exist
for the mad few we call programmers.

Second, testing. Formal testing is certainly one way to discover bugs and
defects. Manual testing is the prime way to do this because of it's looser and
often exploratory nature. Automated testing on the other hand will only find
problems that the Engineer was able to divine through pseudo-precognitive
abilities. For this reason, automated tests can be an occasionally useful tool 
for *Quality* but it will always be lagging, which limits it's utility.

The tenants of Test Driven Development (TDD) tells us that there's a _difference
in kind_ between "testing for defects" and "testing to drive code design". They
are not the same thing, even though they may use the same tooling and involve
similar code. Unit tests in TDD are valuable not because they catch defects, but
because of *__when__* they can catch defects: in a tight feedback loop of the
development process at the moment of the pertinent change. Because they are used
this way, unit tests can enable API experimentation as the Engineer receives
immediate feedback while taking the viewpoint of the consumer of the API, rather
than only as it's author.

Next question: what makes well-designed code valuable? We can attack the same
question backwards by asking: what does it mean for code to be "well-designed"?
Let's make another list:

  - Maintainable
  - Changeable
  - Proveable
  - Discoverable
  - Understandable
  - Efficient (-able?)

Are there objective measures for these things? None that I know of. Maybe some
for "proveable", but people have designed entire programming languages chasing
that mythical sasquatch (and they usually only have blurry pictures to show for
it). Generally, these tend to be subjective things that Engineers *feel* about
their code base. They also have very weak connections to the objective
measurements of *Quality*, which are independent of an Engineer's feelings about
their code base. I've never met a Senior Engineer who could keep a straight
place while claiming their application's **Superior Architecture** is why their
code base is bug-free. These qualities do however have incredibly strong
connections to the speed and ease of development. That's *Delivery*, baby! We
care about software design so that we can easily and quickly deliver predictable
changes to the code.

Now, I have taken a bit of an erroneous logical stance which I'll make a
handwavy attempt at rectifying. I've hinted (without explicitly stating) that
*Delivery* can't be objectively measured. That's untrue. *Delivery* is
just as straightforward to objectively measure as *Quality*. The plucky
Engineering Manager or Scrum Master has an array of metrics available to measure
delivery. Here's just a few:

- Sprint velocity
- Lead time to production
- Cycle time by developer
- Downtime during deployment

My favorite is "lead time to production" i.e. "length of time between when a 
feature is requested and when it's available in production". If *lead time* for 
the average task on your team is very low (e.g. small number of days), *Delivery* 
is probably doing very well.

But, it's still interesting that while both *Delivery* and *Quality* have
objective measurements, it's *Delivery* that is primarily driven by underlying subjective
attributes. You might be able to argue that *Quality* is as well, but you would
have to argue that there's strong subjectivity in the classification of a bug or
defect, and while that's not a ridiculous stance, I don't think it's
particularly strong. Software defects are like pornography; hard to define, but
you know them when you see them. Well-designed code on the other hand is highly 
context dependent and directly tied to the subjective interpretation of the team
working on that system; what may be easily maintainable for one group of engineers
may be unworkable for another group. Human brains don't have identical preferences
for patterns, so we should *expect* engineers to come up with different patterned
approaches.

## Conclusion

Every effort to improve the process of creating good software should map to one of the following efforts:

1. Indirect Improvements to *Solutions* and *Design*
  A. Better communication and coordination mechanisms
  B. Proactive integration of external work and feedback
  C. Quick reactions to external changes
2. Direct Improvements to *Quality* and *Delivery*
  A. Improve defect discovery mechanisms
  B. Increase the standard of quality for the project
  C. Decrease lead time of tasks by improving the software design so that changes take less time

So yeah. Give this a think over. Reach me at
[@tgroshon](https://twitter.com/tgroshon) on Twitter.
