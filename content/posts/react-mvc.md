---
title: "A Model View Controller Pattern for React"
date: 2019-11-06T20:44:15-04:00
categories:
  - JavaScript
  - Web Development
tags:
  - React
  - JavaScript
---

_Originally posted on the Test Double blog [here](https://blog.testdouble.com/posts/2019-11-04-react-mvc)_

## Introduction

React is an amazing library. Over the last 5 years it has transformed the
landscape of frontend development and spawned an incredible ecosystem of tools,
libraries, and patterns. Over that time, React has changed quite a bit. As React
has evolved, so too have our applications, tools, and approaches.

This year (2019), React went through one of its biggest changes with _[React
v16.8: The One With
Hooks](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html)_. Combined with
the [official Context API in
v16.3](https://reactjs.org/blog/2018/03/29/react-v-16-3.html), this update
dropped a grenade into the React world. As developers like Kent C. Dodds
[pointed
out](https://kentcdodds.com/blog/application-state-management-with-react),
complex state management became something that any React developer could
implement—without bringing in tools like Redux, MobX, or Apollo.

So we (by we I mean "me") did what Dan Abramov from the React team said [not to
do](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html#no-big-rewrites). We
started rewriting our app in Hooks…and it was glorious! Hooks helped us pull
behavior into common locations, re-use that behavior across other components,
and catch prop-state syncing bugs that most of us didn't know about.

Something else happened. Once we got that behavior pulled up and isolated, we
took a look at it. Realization was dawning upon us: **Our components knew too
much!**

What did our components know?

 - Our API backend
 - Our data model
 - Our business logic

What did this mean? We had to update our React components whenever any of
those things changed. It laid the groundwork for future issues:

 - **Shotgun surgery**: one change results in many components needing edited
 - **Divergent changes**: one component needs multiple edits to accomodate one change
 - **Duplicated code**: same code structure in multiple components that requires parallel edits for a change
 - **Primitive obsession**: reluctance to create useful data types which results in repetitive low-level logic
 - **Repeated conditionals**: same conditional switching logic in different components

With this realization, my team and I started experimenting with patterns to
reduce how much our components knew. Through research and experimentation, we
discovered the following: a pattern already existed, and you've probably heard
of it.

**Model View Controller (MVC)!**

## MVC?!

> Probably the widest quoted pattern in UI development is Model View Controller
> (MVC)—it's also the most misquoted.
> <br/>&nbsp;&nbsp;— [Martin Fowler](https://www.martinfowler.com/eaaDev/uiArchs.html)

The guiding light of Model View Controller (MVC) is _separating presentation_
from domain. Why is that important to do? Our application's "domain" is where we
_model_ our perception of the problem and its solution. By making this code
separate—without reference to any UI—it could be modeled more correctly,
tested more deeply, and presented more numerously.

The most important part of MVC is the model. In truth, you aren't doing MVC
until you have a model. Sadly, "model" is a hugely overloaded term (especially
in the object-oriented patterns space). In this case, we will define it more
similarly to the broader concept of a "data model": a construct to contain your
domain-specific data and logic. Ideally, a model would have _no idea_ a UI even
existed. For our purposes, don't think of a model as "an instance of a class
inheriting from a `Model` object" but rather "a collection of functions and
objects that are specific to my app's domain."

## MVC in React?!

But MVC is an object-oriented programming (OOP) pattern, and React isn't an
object-oriented library, is it? It's a functional programming (FP) library,
right?  But all kinds of alternative view libraries popped up after React
_specifically_ because React isn't _FP enough_ (looking at you Cycle.js :wink:).

Gahhh!!! What is React?!

Like most code, React isn't soley OOP or FP; it's a mix of both and that's OK.
Not only that, but it fits inside a broader application that can be modeled with
either approach.

So why MVC in React? As far back as Pete Hunt, React has been described as the
"**V** in **MVC**". I haven't heard anyone describe React that way in years
because it doesn't make as much sense in the current JS landscape. When you put
that statement in the context of the times (Ember, Angular 1, Backbone, etc.),
what I think Pete was really saying was "React doesn't tell you how to do
models".

That was a big departure at the time because models—or similar positioned
constructs with different names (looking at you Angular)—were a prime feature
of all the big frontend frameworks. By leaving this out, React was bucking a
trend to instead focus on making a _productive view library_. It worked!

However, we felt the pain around losing our frameworks on day 1. Facebook told
us about [Flux
Architecture](https://reactjs.org/blog/2014/07/30/flux-actions-and-the-dispatcher.html)
which they turned to after experiencing growing pains with their previous MVC
architecture (after which they boldly declared that "MVC doesn't scale"). At first,
they only provided high-level overviews and no code but eventually released a
[Flux Dispatcher](https://github.com/facebook/flux) example implementation. In
time, after many other libraries implemented the Flux architecture, Dan Abramov gave
us [Redux](https://github.com/reduxjs/redux). Redux implemented a similar
architecture and became somewhat of a standard architectural pattern for React
applications.

If you find yourself productive in a Flux/Redux-style architecture, that's
great! No need to rewrite. However, I contend that the "MVC doesn't scale"
argument is overstated and invite you to read on and experiment with some of the
following ideas.

## Implementing MVC Patterns in React

The MVC pattern described here breaks down into the following two pillars:

1. A Presentation Layer of Controller and View React Components
2. A UI-Agnostic Data Model

### Pillar 1: Presentation Layer of Controller and View React Components

This pillar is about separating components by their role regarding
access/knowledge of domain objects and logic. In other words, we're categorizing
components by (a) what they know about and (b) what they can do. We group
components into two categories:

1. Controller Components
2. View Components

A "controller component" knows a lot about the rest of the world. It knows how
to access and update "domain data" (application state) and how to choose and
execute "domain logic". For instance, a controller component may know how to query and mutate data via a RESTful
API or read/update objects stored in React Context. Generally, controllers are
aware of context, side effects, and domains (application state and behavior).

Contrast that with a "view component", which should be agnostic of most things a
controller would know about. A view component shouldn't know anything about
application state (reading or writing), network protocols, or non-UI
providers farther up the chain. Views shouldn't know what protocol you use to
speak to a backend or the format that data takes. Views shouldn't know about
your custom state contexts and providers for sharing domain data (application
state).

Views and controllers are both allowed to have their own state, but state in
views is _only for UI purposes_. As such things most often belong in
controllers, a view should not call hooks `useEffect()` and `useContext()`
except for UI-specific cases like the following:

1. Accessing context for UI-specific data and behavior: e.g. theming and routing
2. Syncing prop changes with local state with `useEffect()`

#### Code Example

Here's an example component that gives us an opportunity to refactor.

```javascript

function App() {
  return <EditCustomer id={1} />;
}

function EditCustomer({ id }) {
  let { customers, dispatch } = useCustomers(); // access context and probably trigger side effects

  let customer = customers.find(c => c.id === customerId);
  if (!customer) {
    return <NotFound />;
  }

  let [errors, setErrors] = React.useState()
  let [saving, setSaving] = React.useState(false)
  let [name, setName] = React.useState(customer.name);
  let [email, setEmail] = React.useState(customer.email);

  let saveCustomer = () => {
    setSaving(true)
    fetch({
      url: `/api/customers/${id}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email })
    })
      .then(response => response.json())
      .then(apiCustomer => {
        // Formatting for differences between backend and frontend
        //   e.g. Rails/Django snake_case into JavaScript camelCase
        dispatch({
          type: "UPDATE_CUSTOMER",
          payload: formatChangeForFrontend(apiCustomer)
        });
      })
      .catch(error => {
        setErrors(error)
      });
      .finally(() => {
        setSaving(false)
      })
  };

  return (
    <div>
      {errors && <ErrorDisplay errors={errors} />}
      <input
        type="text"
        name="name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="text"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={saveCustomer} disabled={saving}>Save</button>
    </div>
  );
}

```

#### Refactor to Controller-View pattern

Here we will separate the UI from the domain logic.

```javascript

function App() {
  return (
    <EditCustomerController id={1} />;
  )
}

// Notice explicit suffix "Controller"
function EditCustomerController({ id }) {
  let { customers, dispatch } = useCustomers();

  let customer = customers.find(c => c.id === id);
  if (!customer) {
    return <NotFound />;
  }

  let onSave = (newCustomerData) => {
    return fetch({
      url: `/api/customers/${id}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCustomerData)
    })
      .then(response => response.json())
      .then(apiCustomer => {
        // Formatting for differences between backend and frontend
        //   e.g. Rails/Django snake_case into JavaScript camelCase
        dispatch({
          type: "UPDATE_CUSTOMER",
          payload: formatChangeForFrontend(apiCustomer)
        });
      })
  };

  return <CustomerForm onSave={onSave} initialName={customer.name} initialEmail={customer.email} />
}

// Notice no special name; just a React component that knows about React things
function CustomerForm({onSave, initialName, initialEmail}) {
  let [errors, setErrors] = React.useState()
  let [saving, setSaving] = React.useState(false)
  let [name, setName] = React.useState(initialName);
  let [email, setEmail] = React.useState(initialEmail);

  let onSaveWrapped = () => {
    setSaving(true)
    onSave({name, email})
      .catch((error) => {
        setErrors(error)
      })
      .finally(() => {
        setSaving(false)
      })
  }

  return (
    <div>
      {errors && <ErrorDisplay errors={errors} />}
      <input
        type="text"
        name="name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        type="text"
        name="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button onClick={onSaveWrapped} disabled={saving}>Save</button>
    </div>
  );
}

```

Upsides of this code:

1. View component `<CustomerForm />` is far easier to test than the previous
   component. It requires no mocking of the network or provider/context setup.
   Tests of it are **unit tests**.
2. Any tests for the original `<EditCustomer />` component _will still pass_
   after you update the import/name! Those tests are now **integration tests**.
3. All of the non-UI concerns are isolated in the controller component
   `<EditCustomerController />` and passed into the view. All the view knows is
   it gets initial values for name and email and async `onSave()` callback.
4. The coupling between the view and the rest of our app is minimal. This view
   could be dropped into _any other location_ of your React tree.
5. The UI concerns around form control, error, and saving states is kept inside
   the view.
6. This same pattern works in TypeScript as well.

If you're sticking with JavaScript as your language, you could _even further_
decouple the controller from the view thusly:

```javascript

function App() {
  return (
    <EditCustomerController id={1}>
      <CustomerForm />
    </EditCustomerController>
  );
}

function EditCustomerController({ id, children }) {
  // ... all the same code
  return React.cloneElement(children, {
    initialName: customer.name,
    initialEmail: customer.email,
    onSave
  });
}

// ... view stays the same

```

Some of you may feel uneasy, but stick with me for a moment.

Upsides of this code:

1. Same testing benefits.
2. The controller is uncoupled from the view and could be composed with _any other
   view_ that accepts those props.
3. The composing parent could add _additional_ props to the view that it knows
   about and the controller may not.

Item #3 is especially interesting in cases like the following where the `<App/>`
had some bit of additional data that the controller was ignorant of:

```javascript

function App() {
  let importantData = {
    /* things */
  };
  return (
    <EditCustomerController id={1}>
      <CustomerForm importantData={importantData} />
    </EditCustomerController>
  );
}

// ... controller stays the same

function EditCustomerController({ id, children }) {
  // ... all the same code
}

// ... view accepts extra prop `importantData`
function CustomerForm({ onSave, initialName, initialEmail, importantData }) {
  // does things
}

```

### Pillar 2: UI-Agnostic Data Model

Now that our controller and view have been separated, let's look at our controller:

```javascript

let { customers, dispatch } = useCustomers();

let customer = customers.find(c => c.id === id);
if (!customer) {
  return <NotFound />;
}

let onSave = newCustomerData => {
  return fetch({
    url: `/api/customers/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCustomerData)
  })
    .then(response => response.json())
    .then(apiCustomer => {
      // Formatting for differences between backend and frontend
      //   e.g. Rails/Django snake_case into JavaScript camelCase
      dispatch({
        type: "UPDATE_CUSTOMER",
        payload: formatChangeForFrontend(apiCustomer)
      });
    });
};

```

If you take away the `useCustomers()` custom hook, how much of that looks like
presentation code? Or stuff that React should care about? Not much? Then ...

> **WHY IS IT IN OUR COMPONENT!?**

You know what that looks like? It looks like domain logic! Where does domain logic go?
Definitely not in our presentation layer. Why should our React component know
that stuff? What kinds of things does it know?

1. Our data is accessed via `fetch` at an HTTP URL
2. Our backend speaks JSON
3. Our backend gives us data with a non-friendly casing (snakes on our GUI!)
4. Our backend expects the keys "name" and "email" when creating a customer

And this is just a simple, contrived example. I guarantee you'll find _all
kinds_ of _far better_ domain logic in your **actual, production applications**.

How could we fix this? Pull it out of our component! Let's start with something
easy, like the handler:

```javascript

function EditCustomerController(props) {
  // ...

  let onSave = async newCustomerData => {
    // NOTE: new line!
    let latestCustomer = await performCustomerUpdate(props.id, newCustomerData);

    dispatch({ type: "UPDATE_CUSTOMER", payload: latestCustomer });
  };

  // ...
}

// NOTE: new function!
async function performCustomerUpdate(id, newCustomerData) {
  let response = await fetch({
    url: `/api/customers/${id}`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCustomerData)
  });
  let apiCustomer = await response.json();
  return formatChangeForFrontend(apiCustomer);
}

```

We just pulled this function out of our React component because it wasn't
presentation logic. There is more logic we could do this with. In this case, we
used a simple function, but what if you wanted to do something more complicated?

```javascript

function EditCustomerController(props) {
  // ...

  let onSave = async newCustomerData => {
    // NOTE: yep, that's a `new` keyword
    let gateway = new CustomerGateway();
    let latestCustomer = await gateway.update(props.id, newCustomerData);

    dispatch({ type: "UPDATE_CUSTOMER", payload: latestCustomer });
  };

  // ...
}

// NOTE: A class!!!
class CustomerGateway {
  constructor(fetchFn = fetch) {
    this.fetch = fetchFn;
  }

  async update(id, data) {
    await this.fetch({
      url: `/api/customers/${id}`,
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    let formattedData = this.formatChangeForFrontend(await response.json());

    // do more things ...
    return formattedData;
  }

  formatChangeForFrontend(apiData) {
    // return transform data from snake_case to camelCase
  }
}

```

We could even go _another step_ toward passing these functions/objects in as
props to our controller component.

```javascript

function EditCustomerController({ Gateway = CustomerGateway }) {
  // ...

  let onSave = async newCustomerData => {
    let gateway = new CustomerGateway();
    let latestCustomer = await gateway.update(props.id, newCustomerData);
    // ...
  };

  // ...
}

/* OR */

function EditCustomerController({ updater = performCustomerUpdate }) {
  // ...

  let onSave = async newCustomerData => {
    let latestCustomer = await updater(props.id, newCustomerData);
    // ...
  };

  // ...
}

```

These contrived examples are meant to illustrate two things:

1. Keep moving non-UI behavior and knowledge out of components.
2. Use the modeling technique that (a) you are comfortable with and (b) fits the
   problem.

Are you great at functional programming? Use it to handle your domain logic.
Write pure functions. Compose those functions together. Put your domain data
into persistent, immutable structures. You do you!

Are you great with object-oriented programming? Do it! Make classes. Compose
those classes together. Practice SOLID principles. You do you!

Are you like most developers and _basically comfortable_ with both? Mix them!
Well-designed systems and code, regardless of the "paradigm", look very similar
and trend toward short, precise, low-coupled functions and methods.

None of these things need to seriously impact your React code. In fact, they
shouldn't. Because regardless of how you get there, separating your presentation
and domain _will help you_. Testing will be easier. Changes will be easier to
implement. Business changes won't send you spelunking into your React tree to
update _every instance_ of a certain `if...else` statement that is broken now
that your API added a new value to the returned data.

## Contrast: Container and Presentational Components

[Container and Presentational
Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
came from Dan Abramov, and the idea has been important in the Redux community.
Controller and View Components are _very similar_. Generally, `Controller ==
Container && View == Presentational`.

In 2019, Dan Abramov added a disclaimer on his post:

> I wrote this article a long time ago and my views have since evolved. In
> particular, I don’t suggest splitting your components like this anymore. If you
> find it natural in your codebase, this pattern can be handy. But I’ve seen it
> enforced without any necessity and with almost dogmatic fervor far too many
> times. The main reason I found it useful was because it let me separate complex
> stateful logic from other aspects of the component. Hooks let me do the same
> thing without an arbitrary division. This text is left intact for historical
> reasons but don’t take it too seriously.
> <br/>&nbsp;&nbsp;— Dan Abramov

I think I understand his change of position, but disagree for a few reasons:

1. Idealistic, dogmatic adherence to a pattern is possible and negative with
   _any pattern_. Avoiding such dogma is a discipline unconnected to the
   patterns themselves.
2. In practice, most custom hooks still fall into one of two roles: UI hooks and
   non-UI hooks (e.g. data fetching, mutation, and caching). Custom hooks rarely
   do both; always one or the other. Calling UI hooks from View components and
   non-UI hooks from Controller components is simple and provides useful
   separation.
3. Regardless of the method used (i.e. hooks or lifecycle methods), explicitly
   recognizing components by _roles_ is very helpful for testing, organization,
   and re-use.
4. Determining where to split components is difficult and patterns that provide
   guidance for that are very helpful. Generally, React developers struggle with
   having components that are too large and do too much rather than the inverse.

## Conclusion

Today, MVC is commonly viewed as a "server-side architecture" that doesn't map
well to GUI programs. This assumption ignores (a) the origins of MVC as a
Smalltalk invention _specifically for GUIs_ and (b) the numerous successful
implementations of MVC and derivatives (MVVM, MVPM, MVP, MVT) across many UI
platforms today (e.g., iOS on mobile, Qt on desktop, Backbone/Angular/Ember on web).
MVC is an even _better_ design philosophy for GUIs than it is for server-side
systems.

Flux and Redux have been good patterns for the React ecosystem not least because
of the exposure to functional programming principles (especially Redux and its
influence from Elm). Before React and Redux, FP was primarily a niche concept in
web frontends. Today, it's clearly a preferred pattern in building React
applications. Sadly, I worry that the pendulum has swung too far towards FP and
caused a narrowing of thought where alternative design strategies are never even
considered.

The patterns proposed here, (1) Controller + View Components and (2) UI-Agnostic
Data Model, do not require strict OOP or FP styles. This is _a good thing_
because JavaScript is a very general language that favors a mixed style far
better than a single one. The patterns also mesh well with the spirit of React
as "just a view library".

I hope you find useful concepts in this proposal that will enable you to manage
the complexity of your applications and prevent some of the maintenance pains that plague so many
systems.
