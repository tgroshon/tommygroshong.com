---
title: Tommy's Dope React (TDR) Project Layout
date: 2021-11-16
description: "Wondering how to layout your React project? Tommy shares his Project Layout to help prioritize file organizing patterns conducive to refactoring, hiding implementation details, and growing with your project."
categories:
  - Web Development
tags:
  - React
  - JavaScript
---

## Introduction

A few upsides come with adopting an opinionated framework like Ruby on Rails.
One of them is having a clear pattern to the layout of a project's source code
directories and guidance on where specific code should live. This reduces the
friction of creating new code modules and provides guideposts for navigating the
code base. Human brains like patterns, and organizing your code into clear
patterns helps developers find their way; both the newly onboarding devs and the
grisled veteran devs.

Opinionated direction is something we severely lack in many aspects of React
projects, and directory layout is definitely one. Tools like Create React App
have done a great job at scaffolding a working React project with a few
top-level files, configs, and folders with a functional build pipeline, linting
toolchain, and test harness already configured. But CRA gives you a `src/`
directory for all your application code with no guidance on how the files inside
should be organized.

Once you're inside a `src/` folder of a React project, it's the wild west, and
this often works against projects and teams because unless they have already
done a few React projects and cut themselves on all the sharp corners, it's easy
to stumble into traps and pitfalls that actively work against good React
behaviors. Refactoring code becomes scary, exposed implementation details cause
unnecessary tight coupling, and the pain gets worse as your project grows.

But all is not lost!


## How to layout your React project src/ folder?

> “You have brains in your head. You have feet in your shoes. You can steer
> yourself any direction you choose. You're on your own. And you know what you
> know. And YOU are the one who'll decide where to go...”
>
> ― Dr. Seuss, _Oh, the Places You'll Go!_

Let’s lay some foundational principles that are conducive to refactoring, hide
implementation details, and grow with your project.

1. Implementation code should always live in _meaningfully named files_.
2. A particular piece of code should have a _short list of good potential locations_ to live.
3. Implementation details should be hidden behind a module interface to make refactoring easier.
4. The _location_ of a module or file provides hints on how and where that code is intended to be used.
5. The _layers_ of the application and their _dependencies between eachother_ should be apparent by the layout.
6. The directory layout should provide _meaningful guidance regardless of size_: whether 30 files or 3000 files.
7. The directory layout should _reward you for good React behaviors_: e.g.
   extracting many small components to meaningful places, extracting non-UI code
   out of React all together.

With those principles in hand, let’s look at an example of a project layout
following these principles. I call it **Tommy's Dope React (TDR) Project
Layout**, and have used it to great success with my clients:

```
.
├── build/                               #
├── docs/                                #
├── src/                                 #
│   ├── lib/                             # 'lib/' is Non-UI Code
│   │   ├── __tests__/                   # Put tests into `__tests__/` directories near the code they test
│   │   │   └──  ...                     #
│   │   ├── core/                        # 'core/' is bedrock application domain code; ideally modules containing pure Javascript functions - and definitely no react code..
│   │   │   ├── __tests__/               #
│   │   │   │   ├──  invoices.test.js    #
│   │   │   │   ├──  tasks.test.js       #
│   │   │   │   └──  ...                 #
│   │   │   ├── index.js                 # Only does public exports for this module
│   │   │   ├── invoices.js              # pure functions implementing business logic for 'invoices' domain
│   │   │   ├── tasks.js                 # ... 'tasks' domain
│   │   │   └── (otherDomains).js        #
│   │   ├── ...                          # Other infrastructural code that isn't tied to our domain
│   │   ├── httpClient.js                #
│   │   ├── moneyFormatter.js            #
│   │   ├── dateFormatter.js             #
│   │   ├── websocketHandler.js          #
│   │   └── ...                          #
│   ├── pages/                           # Entrypoint components for routes (If Next.js, follow Next.js regarding index files)
│   │   ├── auth/                        # Each directory should roughly map to a path prefix in the URL
│   │   │   ├── index.js                 # If Next.js, this is where implementation of Login page goes, otherwise it exports Login.js
│   │   │   ├── Login.js                 # If not Next.js, this is where implementation of Login page goes
│   │   │   ├── ForgotPassword.js        #
│   │   │   └── Logout.js                #
│   │   ├── invoices/                    #
│   │   │   ├── index.js                 #
│   │   │   ├── InvoiceDetails.js        #
│   │   │   └── InvoiceList.js           #
│   │   └── dashboard/                   #
│   │       └── ...                      #
│   ├── ui/                              # React components, contexts, and hooks
│   │   ├── login/                       # Grouped by a domain or category of things
│   │   │   ├── __tests__/               #
│   │   │   │   ├──  LoginForm.test.js   #
│   │   │   │   └──  ...                 #
│   │   │   ├── index.js                 # Only does public exports for this module
│   │   │   ├── LoginForm.js             # Login related Component
│   │   │   ├── useAuthStatus.js         # Login related hook
│   │   │   └── AuthProvider.js          # Login related context provider
│   │   ├── forms/                       #
│   │   │   ├── __tests__/               #
│   │   │   ├── index.js                 # Only does public exports for this module
│   │   │   ├── TextInput.js             # A lone component
│   │   │   ├── button/                  #
│   │   │   │   ├── index.js             # Only does public exports for this module
│   │   │   │   ├── some_helper.js       #
│   │   │   │   ├── InnerButton.js       # Private, non-exported component
│   │   │   │   └── FancyButton.js       # Primary implementation of component
│   │   │   ├── checkbox/                #
│   │   │   │   └── ...                  #
│   │   │   └── select/                  #
│   │   │       └── ...                  #
│   │   └── avatars/                     #
│   │       └── ...                      #
│   ├── ...                              #
│   ├── App.js                           # `src/App.js` is where you setup your top-level routes
│   └── index.js                         # `src/index.js` is where you (a) render App with app-wide context providers and (b) mount React to DOM.
├── LICENSE
└── README.md
```

Here are some callouts to discuss:

1. Nesting modules
1. `lib/`
1. `pages/` vs. `ui/`
1. Dependencies

## Nesting Modules

Notice this layout is more deep than wide, more nested than flat. This is by
design. By nesting modules the developer can indicate dependency relationships
between code. For instance, components that are only meant to be consumed by a
specific higher-level component are nested within that higher-level component's
folder. For example:

```
└── src/
    └── ui/
        └── forms/
            ├── button/
            │   ├── index.js
            │   └── Button.js
            ├── checkbox/
            │   ├── index.js               # Only exports 'Checkbox' component
            │   ├── SimpleCheckbox.js      # Imports 'CheckSelectOverlay'
            │   ├── FancyCheckbox.js       # Imports 'CheckSelectOverlay'
            │   └── CheckSelectOverlay.js  # Only relevant to checkbox components
            └── select/
                └── ...
```

The `forms/` module is composed individually of `button/`, `checkbox/`,
`select/`, and potentially many more "forms" related modules exporting their own
components. Those sub-modules can judiciously decide which code from which
modules to expose via the `index.js` file, but they could also have deeping
nesting inside of them if it makes sense.

## The "lib/" Folder

The `lib/` folder is the place to collect your non-UI code. The kind of code and
operations that could/should survive completely changing your JavaScript
framework. The `lib/core/` folder is a personal favorite, as that is the place
to collect your domain objects and business logic, usually in the form of pure
functions. The wider `lib/` folder should contain infrastructural code like
network layer clients, formatting utilities, platform communication like Browser
Storage or IndexDB, etc.

It is appropriate to further subdivide `lib/` into useful modules as it grows.
For instance:

```
src/
└── lib/
    ├── core/
    │   ├── index.js
    │   ├── invoices.js
    │   └── tasks.js
    ├── network/
    │   ├── index.js
    │   ├── httpClient.js
    │   └── websocketHandler.js
    ├── storage/
    │   ├── index.js
    │   ├── webIndexDB.js
    │   └── localStorage.js
    ├── formatters/
    │   ├── index.js
    │   ├── dateFormatter.js
    │   └── moneyFormatter.js
    ├── testUtils/
    │   ├── index.js
    │   └── dataFactories.js
    └── ...
```

At the start of a project, I recommend beginning with only `lib/` and
`lib/core/`, and to let the remaining folders _emerge organically_.

## "pages/" vs. "ui/"

The split between `src/pages/` and `src/ui/` is also purposeful and by design.
While `ui/` is meant to be a collection of reusable React code(i.e. components,
hooks, and contexts ), `pages/` specifically (a) maps components to routes and
(b) composes `ui/` and `lib/` code together. Generally speaking, code should
never depend upon (i.e. import) code from `pages/` except for (a) `src/App.js`
setting up the top-level routes and (b) parent pages on sub-pages (i.e.
component for route `http://example.org/invoices` imports component page handing
route `http://example.org/invoices/:id`.).

## Dependencies: Made More Explicit

By knowing the location of code, you should have an idea on what code is most
likely to depend or not depend on it. In this layout, the following rules are
expected to hold:

- Code from `lib/` _never_ imports code from `ui/` or `pages/`.
- Code from `pages/` _should_ import implementation code from `ui/` or `lib/`.
- Code from `ui/` _may_ import code from `lib/` but _never_ from `pages/`.
- Generally, code _may_ import from within their own top-level namespace: i.e.
  `pages/`, `lib/`, `ui/`.

## Conclusion

The TDR Project Layout prioritizes patterns that are conducive to refactoring,
hide implementation details, and grow with your project. This pattern works for
(a) Create React App projects, (b) Next.js projects, (c) React Native projects,
and ... even non-React projects. GASP! As more and more frameworks get on the
"component" bandwagon, they hit the same code organization growing pains. This
layout can be easily modified to work for Vue, Angular, and vanilla Web
Components as well. It even supports very nicely JavaScript alternatives like
TypeScript and Flow: easy to put shared interfaces in meaningful locations and
the dependency rules still work.

This explanation of the TDR Project Layout is good 80%-rule guidance: 80% of the
time it works every time. However, it doesn't clearly explain more niche or
esoteric cases, but hopefully it gives you enough of a starting point that you
can make those decisions with confidence.

So give it a shot, and let me know what you think. Reach me at
[@tgroshon](https://twitter.com/tgroshon) on Twitter.
