---
title: "Conditional Rendering Tactics for React Components"
description: "A simple exploration and comparison of two tactics for handling conditionally rendering components in React."
date: 2020-02-03T20:44:15-04:00
categories:
  - JavaScript
  - Web Development
tags:
  - React
  - JavaScript
---

_Originally posted on the Test Double blog [here](https://blog.testdouble.com/posts/2020-02-04-react-conditional-rendering-tactics/)_


## Introduction

A common situation when writing React components is needing to render a particular
component only under certain conditions. There are many ways to accomplish this,
but the route you take often has nuanced implications or differing utility based
on the current state of the code/component/system.

Let us consider the case of a component that requires some prop data to render. The
following are two, general tactics for handling missing prop data:

1. Have the parent decide not to render the child if the prop is unavailable
2. Have the child itself decide to return nullish if a prop is unavailable

### Tactic 1:
```javascript
const Child = ({requiredProp}) => {
  return <div className="some-class">{requiredProp}</div>
}

const App = (props) => {
  let importantData = useImportantData()
  return (
    <div>
      <Header />
      <Main />
      {importantData && <Child requiredProp={importantData} />}
      <Footer />
    </div>
  )
}
```

### Tactic 2:
```javascript
const Child = ({requiredProp}) => {
  if (!requiredProp) {
    return null
  }
  return <div className="some-class">{requiredProp}</div>
}

const App = (props) => {
  let importantData = useImportantData()
  return (
    <div>
      <Header />
      <Main />
      <Child requiredProp={importantData} />
      <Footer />
    </div>
  )
}
```

**Note**: I'm using "null checks" as the use case but this could easily apply to
other kinds of validation, i.e. missing attributes, unsupported types, etc.

Both are valid approaches that are useful in varying cases. However, I find
Tactic 2 (let child decide rendering) to be a better default approach.

## Preferring Tactic 2

I find Tactic 2 preferable in many cases because it is better at (1) pushing
rendering decisions down into more-relevant components and (2) encapsulating
knowledge about a component and its internal needs.

The following are specific areas it performs better:

1. Avoids extra boolean and ternary expressions
2. Prevents reliance on weak PropType "guarantees"
3. Avoids duplicating checks among many parents

### Avoids extra boolean and ternary expressions

It can prevent boolean and ternary expressions a la `{requiredProp && <Child
prop={requiredProp} />}` in our example. Like many programming constructs,
they're fine in small amounts but can get easily out of hand: (1) too many
expressions, (2) nested expressions, or (3) overly large expressions. Also,
these expressions have some annoying gotchas for JSX rendering because of
[falsiness](https://developer.mozilla.org/en-US/docs/Glossary/Falsy "MDN Falsy")
in JavaScript: `''` or `0` values for `requiredProp` would fail the `&&` check
and not render Child.

Expecting the Child component to deal with returning a nullish value itself if
it doesn't have the data it needs (1) simplifies the parent, (2) allows for more
rigorous validation that may be clumsy in a simple expression, and (3) further
encapsulates the knowledge of what a component needs to render.

### Prevents reliance on weak PropType "guarantees"

Using PropTypes to denote a prop as required is simple:

```javascript
Child.propTypes = {
  requireProp: PropTypes.object.isRequired()
}
```

However, this provides only a very weak guarantee with several problems:

1. PropTypes failures only log to the console, so they are easy to miss
2. PropTypes are commonly stripped from production builds
3. The common penalty for using a nullish prop is raising a TypeError
   that breaks the whole render tree

Because of this, the safest approach is to expect a component to do its own
validation regardless of what its parent does or its PropTypes "guarantee".
However, if you're doing TypeScript, required props in interfaces are more
useful because of the compiler checks.

### Avoids duplicating checks among many parents

If some piece of data is not available in one parent component, it's equally
likely that it may not be available in another. So, every parent who renders the
Child component must duplicate the validation done by Tactic 1. Obviously, this
is not a big deal if the Child component is used in only one place, but who
knows what next sprint will bring.

## Case for Tactic 1
I have found Tactic 1 (let parent decide rendering) to be the better tactic in the following cases:

1. Rendering modal-like things
2. Rendering components that are known to have a costly setup or render (i.e.,
   trigger lots of side effects, render large trees, or perform expensive
   calculations)

Be warned, the assumption of "costly" by the parent can easily be wrong or
outdated. Maybe the Child intuitively seems costly but in actuality isn't; maybe
the Child was costly in the past but isn't anymore. I find it best to start with
Tactic 2 and then refactor to Tactic 1 if it becomes a problem; then it's just
another optimization decision.

## Tactic 2B: the interrupting component

Tactic 2 is very useful for the average case, but as explained earlier some
cases are not a natural fit. It can also be annoying if a component is using
many React Hooks which, by the [Rules of
Hooks](https://reactjs.org/docs/hooks-rules.html), need to always come before
any `if` statements.

```javascript
const Child = ({requiredProp}) => {
  // Will execute once even though we'd rather return early
  useEffect(() => {
    if (requiredProp) {
      doSomething(requiredProp)
    }
  }, [requiredProp])

  if (!requiredProp) {
    return null
  }
  return <div className="some-class">{requiredProp}</div>
}
```

Now this is fine for a few simple hooks, but if the hooks grow substantially in
size, complexity, or number then a variation of Tactic 2 becomes enticing. I'll
denote the following variation as Tactic 2B. It fixes the problem with an
intermediate component that interrupts the render flow:

```javascript
const InnerChild = ({requiredProp}) => {
  useEffect(() => {
    doSomething(requiredProp)
  }, [requiredProp])
  return <div className="some-class">{requiredProp}</div>
}

const Child = (props) => {
  if (!props.requiredProp) {
    return null
  }
  return <InnerChild {...props} />
}

const App = (props) => {
  let importantData = useImportantData()
  return (
    <div>
      <Header />
      <Main />
      <Child requiredProp={importantData} />
      <Footer />
    </div>
  )
}
```

While this is overkill in our contrived example, it can be very powerful in
complex, real-world cases and can actually be elegant across module boundaries
where the API looks the same from the outside:

```javascript
// Child.js

const Child = ({requiredProp}) => {
  useEffect(() => {
    doSomething(requiredProp)
  }, [requiredProp])
  return <div className="some-class">{requiredProp}</div>
}

const ChildInterrupt = (props) => {
  if (!props.requiredProp) {
    return null
  }
  return <Child {...props} />
}

export default ChildInterrupt
```

I suppose you could also accomplish this with a Higher-order Component (HOC),
but I'm bad at writing those so I avoid writing them altogether.

## Conclusion

As I said, both tactical approaches have their place depending on your
situation. However, in many cases it's best to push rendering decisions down
into the components and encapsulate as much knowledge about them as you can.
With that in mind, some variation of Tactic 2 is often the best default
approach.
