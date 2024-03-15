---
title: "React Context for Dependency Injection Not State Management"
date: 2021-05-26
authors:
  - tommy-groshong
description: "Dive into the concept that React Context API is primarily a tool for injecting dependencies into a React tree and how we can use that to improve testability, reusability, and maintainability of our apps."
categories:
  - Web Development
tags:
  - React
  - JavaScript
---

_Originally published on the Test Double blog [here](https://blog.testdouble.com/posts/2021-03-19-react-context-for-dependency-injection-not-state/)_

In discussions of React application architecture, [React
Context](https://reactjs.org/docs/context.html) is often brought up as a way to
implement "State Management" yourself. Some really great blog posts exist that
provide techniques for implementing that exact thing like ["Application State
Management with
React"](https://kentcdodds.com/blog/application-state-management-with-react) by
Kent C. Dodds. This technique can be useful for specific, one-off cases but less
so for an entire application architecture. An article by Mark Erikson,
maintainer of Redux, titled [“Why React Context is Not a "State Management" Tool
(and Why It Doesn't Replace
Redux)"](https://blog.isquaredsoftware.com/2021/01/context-redux-differences/)
provides some excellent arguments and marshalls other great articles as
reference.

In this post, I would like to summarize some of Mark Erikson's ideas and expand
on an idea he introduces there: React Context is a tool for _dependency
injection_, not state management.

## Recap of "Why React Context is Not a State Management Tool"

Let’s start with some definitions he provides (many sourced from other great
articles):

  - **What is state?** Data that describes the behavior of an application
    ([ref](https://daveceddia.com/visual-guide-to-state-in-react/)).
  - **What is state management?** The way "state" changes over the lifetime of
    the application ([ref
    ](https://twitter.com/DavidKPiano/status/1347723896800346112))
  - **What are the requirements of state management?** There are four:

      1. store an initial value
      1. read the current value
      1. update a value
      1. notify when the value changes

Libraries like Redux, MobX, Recoil, Apollo, and React Query perform the four
requirements of “state management” and so are all well classified as “state
management libraries”. React Context on the other hand does not meet all the
requirements. Technically, Context allows storing a value, reading a value, and
notifying on changes to a value, after a fashion, but updating a value is
non-existent. The only way to change the value stored in Context is to pass in a
new prop to the context provider, but then where is that prop coming from? It’s
either coming from a separate React State call (e.g. useState, useReducer, or
class component `this.state`) or an external system. React Context can almost
update a value itself, but not quite.

Mark also points out one of the primary problems with storing state values
directly inside of React Context:

>  “[When Context receives] a new state value, all components that are subscribed
>  to that context will be forced to re-render, even if they only care about part
>  of the data.”

Now this may lead to problems, or it may not. React core team architect
Sebastian Markbage [describes the use cases of Context
](https://github.com/facebook/react/issues/14110#issuecomment-448074060) as
follows:

>  “My personal summary is that new context is ready to be used for low frequency
>  unlikely updates (like locale/theme). It's also good to use it in the same way
>  as old context was used. I.e. for static values and then propagate updates
>  through subscriptions. It's not ready to be used as a replacement for all
>  Flux-like state propagation.”

The article ends with well-reasoned recommendations for how to go about choosing
a state management library and approach.

## React Context in the Wild

Here are real-world code examples showing exactly what Mark Erikson described:
most (all?) State Management libraries use React Context for dependency
injection but not for transmitting raw data.

The following are source code snippets from Redux (react-redux), Recoil, Apollo,
and React Query showing that what they actually store in Context is a Stateful
container object that manages your data.

The official React bindings for Redux, react-redux, passes the Redux
store and a Subscription object via context ([ ref ](https://github.com/reduxjs/react-redux/blob/754c1059ded0c1ea3a9b6dc1d870e31c22d8c3b7/src/components/Provider.js)).

```javascript
import { ReactReduxContext } from './Context'
import Subscription from '../utils/Subscription'

function Provider({ store, context, children }) {
  const contextValue = useMemo(() => {
    const subscription = new Subscription(store)
    subscription.onStateChange = subscription.notifyNestedSubs
    return {
      store,
      subscription,
    }
  }, [store])

  // ... other stuff

  const Context = context || ReactReduxContext

  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

[React
Query](https://github.com/tannerlinsley/react-query/blob/7e98e1ca3c4f4e90a682cc3d26857339b8d72037/src/react/QueryClientProvider.tsx)
and
[Apollo](https://github.com/apollographql/apollo-client/blob/4a5822ae2bf0130d75ec23dc8bfe23bbc342e39d/src/react/context/ApolloContext.ts)
both pass “client” objects via context that use observers to watch and mutate
their data.
[Recoil](https://github.com/facebookexperimental/Recoil/blob/4a86cb4ea99c84e0fdea342be58f3fbcba81d60f/src/core/Recoil_RecoilRoot.react.js)
uses two contexts to track a “Store” and “MutableSource” which also, you guessed
it, implement an observation/subscription model to watch and mutate its data.
[MobX
React](https://github.com/mobxjs/mobx/blob/52ad5047df7fb8847b2269dff214909c327c4579/packages/mobx-react/src/Provider.tsx)
includes one optional “Provider/Inject” feature that uses context to … pass MobX
observables down the tree.

In all these cases, context is used as a dependency injection mechanism for
passing some kind of observable/subscribable/container object down the React
component tree to be accessed by other library code. The actual “4 requirements
of state management” are implemented by the library, not React Context.

## Dependency Injection Generally

Dependency Injection (DI) is a technique to manage the dependencies of your
program. Why do we care about that? Because a dependency represents a risk. Now
"Coupling" is a tightly related issue that many programming aphorisms, thought
leaders, and books remind us to minimize—"Loose coupling; high cohesion" is one
of those. Coupling refers to the degree of dependency between parts of your
code. The greater extent one piece of code depends on another, the greater the
two are _coupled_. Some coupling and dependence is necessary because without it
you couldn't use abstractions to build your code upon. And without abstractions,
we would be writing all our software as CPU instructions at best, or be
hardwiring circuit boards at worst.

Dependency injection can be as simple as passing the dependencies of a module or
component into it rather than having them hardcoded in.

Consider this `HttpClient` JavaScript class that uses the browser Fetch API to
request data from a RESTful backend:

```javascript
// services/HttpClient.js

export class HttpClient {
  async fetchProducts() {
    const resp = await fetch('/api/products');
    return resp.json();
  }

  async fetchOrders() {
    const resp = await fetch('/api/orders');
    return resp.json();
  }

  // ... more API endpoint stuff ...
}
```

And it, in turn, is consumed by a `ProductsService` that is more "products
aware" and provides higher-level operations:

```javascript
// services/ProductsService.js
import {HttpClient} from './HttpClient.js'

export class ProductsService {
  constructor() {
    this.client = new HttpClient();
  }

  async lookupNewProducts() {
    const products = await this.client.fetchProducts();
    return products.filter(product => product.isNew);
  }

  async lookupProductsWithPromo() {
    const products = await this.client.fetchProducts();
    return products.filter(product => product.promos.length > 0);
  }

  // ... more product specific stuff ...
}
```

Here's what this code would look like implementing a common dependency injection
technique called "Constructor Injection":

```javascript
import {HttpClient} from './HttpClient.js'

export class ProductsService {
  constructor(client) {
    this.client = client || new HttpClient();
  }

  // ... everything else the same ...
}
```

In this approach, we allow the caller to supply its own "client" as a
constructor argument. The change is small, but it provides us a few benefits
that make it easier to test and safely reuse our code.

Here's a test in Jest of the original code before we injected the client:

```javascript
// services/__tests__/ProductsService.test.js
import {ProductsService} from '../ProductsService.js';
import {HttpClient} from './HttpClient.js';

// Setup our method mock and then the import mock. I need to
// look this particular recipe up everytime I use it.
const mockFetchProducts = jest.fn();
jest.mock('./HttpClient.js', () => {
  return jest.fn().mockImplementation(() => {
    return {fetchProducts: mockFetchProducts}
  })
});


// Don't forget these lines or else our tests will bleed
// into eachother.
beforeEach(() => {
  HttpClient.mockClear();
  mockFetchProducts.mockClear();
})

describe('ProductsService', () => {
  describe('lookupNewProducts()', () => {
    it('filters for only new products', async () => {
      // Set the inner mock of the inner dependency to
      // return our test data
      mockFetchProducts.mockReturnValueOnce([
        { id: 1, isNew: true },
        { id: 2, isNew: false }
      ]);
      const service = new ProductsService();

      const result = await service.lookupNewProducts();

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({id: 1, isNew: true})
    })
  })

  // ... etc.
})

```

Now here's a test of our _dependency injected_ `ProductsService`:

```javascript
// services/__tests__/ProductsService.test.js
import {ProductsService} from '../ProductsService.js';

describe('ProductsService', () => {
  describe('lookupNewProducts()', () => {
    it('filters for only new products', async () => {
      // Simply pass a fake object that implements the same
      // client interface needed by the system under test
      const service = new ProductsService({
        async fetchProducts() {
          return [{ id: 1, isNew: true }, { id: 2, isNew: false }]
        }
      });

      const result = await service.lookupNewProducts();

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual({id: 1, isNew: true})
    })
  })

  // ... etc.
})
```

More clean, concise, and focused with the following upsides:

- No import mocking
- No required mock resetting to avoid tests bleeding into each other
- No reliance on features specific to our Test Runner (jest)

Beyond testing, what if we needed to do some special setup to our `HTTPClient`
when it was running under a particular user like set some default HTTP Headers?
We could instantiate the client ourselves and provide any configurations we wanted
before passing it into our service:

```javascript
const client = new HttpClient()
client.setDefaultHeaders({'X-APP-ROLE': 'cool user'});
const service = new ProductsService(client);
```
The service remains oblivious to these changes.

Or maybe, we need to migrate our API backend to GraphQL, but only on our *Beta*
site until it's stable and tested. We could re-use our same `ProductsService`
with an alternative `GraphQLClient` that implemented the same interface and
simply pass it into the constructor `new ProductsService(new GraphQLClient())`
and _BLAM!_ it would be doing GraphQL for that instance but REST for other
instances.

```javascript
const client = checkIfBetaAccount()
  ? new GraphQLClient()
  : new HttpClient();
const service = new ProductsService(client);
```

Before you think that DI is only for object-oriented or class-based code, here's
the same concept using closures as a factory:

```javascript
// services/productServicesFactory.js

export const productServicesFactory = initialClient => {
  const client = initialClient || new HttpClient();

  return {
    async lookupAllProducts() {
      return client.fetchProducts();
    }

    async lookupNewProducts() {
      const products = await client.fetchProducts();
      return products.filter(product => product.isNew);
    }

    async lookupProductsWithPromo() {
      const products = await client.fetchProducts();
      return products.filter(product => product.promos.length > 0);
    }
  }
};

// Usage:
//   const {lookupNewProducts} = productServicesFactory();
//   lookupNewProducts.then(newProducts => { /* do stuff */ });
```

## Dependency Injection with React Context

So how can we use React Context to implement simple dependency injection into
our React applications, and what benefits can it give us?

Let's dive into a small React example. Consider this scenario:

```javascript
// components/Products.jsx
import React from 'react';

const INITIAL_STATE = {
  loading: true,
  error: null,
  products: []
};

function Products() {
  const [response, setResponse] = useState(INITIAL_STATE);

  useEffect(() => {
    fetch('/api/products')
      .then(resp => resp.json())
      .then(data => setResponse({loading: false, products: data}))
      .catch(error => setResponse({loading: false, error}))
  }, [])

  if (response.loading) {
    return <LoadingSpinner />
  }

  if (response.error) {
    return <ErrorPage error={response.error} />
  }

  return (
    <div>
      {response.products.map(product => (
        <Product {...product} />
      ))}
    </div>
  )
}
```

Now, how would we write an automated test with [React Testing
Library](https://testing-library.com/docs/react-testing-library/intro) for this
component? You'll need to mock out our network layer for starters. Here's an
example almost verbatim from the RTL docs:

```javascript
// components/__tests__/Products.test.jsx
import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {Products} from '../Products.jsx'

// Mock out the entire network layer!
const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json([
      {id: 1, title: 'First Product', /* more data */},
      {id: 2, title: 'Second Product', /* more data */}
    ]))
  })
)

// Don't forget these or else your test cases and test suites
// will bleed together :/
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('loads and displays products', async () => {
  render(<Products />)

  // Wait for some UI element that appears when loading finishes
  await waitFor(() => screen.getByText('Products List'))

  // Make assertions on what should be on the screen
  expect(screen.queryByTitle('First Product')).toBeInTheDocument()
  // ... moar assertions ...
})

test('loads a different list of products', async () => {
  // shadow the URL handler with a NEW handler
  server.use(
    rest.get('/api/products', (req, res, ctx) => {
      return res(ctx.json([
        {id: 3, title: 'Third PROMO Product', promotion: {}},
        {id: 4, title: 'Fourth Product'}
      ]))
    })
  );

  render(<Products />)

  // moar awaits and assertions
})
```

So because we're using the global Fetch API directly in our React component, we
now need to set up (and tear down) an entire network mocking service. And we'll
need to do it for every component test suite we ever write. Hmmmm ok. There's
definitely a place for that approach. But consider some issues, not particularly
with the mocking itself, but with the _design_ of our Component:

  1. If our API endpoint `/api/products` changes its data format, we need to
     update every React component that queries it _and_ every corresponding test.
  1. For handling the myriad of network error cases (400, 401, 404, 500, oh my),
     we'll need to deal with them right here in our view component.

Why do my view components know about networks again?

Now, we can address these things better by adding some indirection by extracting
to a separate function/module, but what if we go a step further and take a page
out of the book of all those other libraries like Redux, Recoil, and Apollo and
inject our services factory example from earlier via context into this
component.

First, create the custom context:

```javascript
// DepsContext.js
import {createContext, useContext} from 'react';

const DepsContext = createContext({});

export function useDeps() {
  return useContext(DepsContext);
}

export function DepsProvider({children, ...services}) {
  return (
    <DepsContext.Provider value={services}>
      {children}
    </DepsContext.Provider>
  )
}
```

Then introduce our context provider into our React tree. We'll just stick it
at the top with `App` since it's static and never changes.

```javascript
// App.jsx
import React from 'react';
import {DepsProvider} from './DepsContext.js';
import {Products} from './components/Products.jsx';
import {
  productServicesFactory
} from './services/productServicesFactory.js';

export function App() {
  return (
    <DepsProvider productServicesFactory={productServicesFactory}>
      <Products />
    </DepsProvider>
  )
}
```

And now consume the context value to get our services factory function and
replace our `fetch()` call inside of the `useEffect()`:

```javascript
// components/Products.jsx
import {useDeps} from '../DepsContext.js';

// ... same ...

function Products() {
  const {productServicesFactory} = useDeps();
  const [response, setResponse] = useState(INITIAL_STATE);

  useEffect(() => {
    const {lookupAllProducts} = productServicesFactory();
    lookupAllProducts()
      .then(data => setResponse({loading: false, products: data}))
      .catch(error => setResponse({loading: false, error}));

    // Add to deps array cuz we're good citizens, but it won't
    // break if we didn't
  }, [productServicesFactory]);

  // ... same ...
}
```

Stick with me here because the component change is _super small_ and easy to
underappreciate. On the surface, it seems like all we did was swap `fetch()` for
`lookupAllProducts()` which wouldn't be very interesting. Instead, focus on that
first line of the component:

```javascript
const {productServicesFactory} = useDeps();
```

We didn't just alias our global `fetch()` to a custom function. We _injected_
our custom function into the component via context. The implications of this
change become more obvious when we add supporting code like tests, or when we
want to use our component in a different way.

How much can we simplify our test now that we started injecting the dependency?

```javascript
// components/__tests__/Products.test.jsx
import React from 'react'
import { render, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import {Products} from '../Products.jsx'
import {DepsProvider} from '../../DepsContext.jsx'

const getFactory = data => () => {
  return {
    async lookupAllProducts() {
      return data
    }
  }
}

test('loads and displays products', async () => {
  render(
    <DepsProvider
      productServicesFactory={getFactory([
        {id: 1, title: 'First Product', /* more data */},
        {id: 2, title: 'Second Product', /* more data */},
      ])}
    >
      <Products />
    </DepsProvider>
  )
  // Wait for some UI element that appears when loading finishes
  await waitFor(() => screen.getByText('Products List'))

  // Make assertions on what should be on the screen
  expect(screen.queryByTitle('First Product')).toBeInTheDocument()
  // ... moar assertions ...
})

test('loads a different list of products', async () => {
  render(
    <DepsProvider
      productServicesFactory={getFactory([
        {id: 3, title: 'Third PROMO Product', promotion: {}},
        {id: 4, title: 'Fourth Product'}
      ])}
    >
      <Products />
    </DepsProvider>
  )

  // moar awaits and assertions
})
```

That's a _lot_ simpler with a much smaller surface area in concepts and 3rd-party packages.

1. No Mock Service Worker or other network mocking magic
2. No import mocking
3. No reliance on features specific to one or another Test Suite

What does a Storybook preview file look like?

```javascript
// components/__stories__/Products.stories.js
import React from 'react';
import { DepsProvider } from '../../DepsContext.jsx'
import { Products } from '../Products';

const productServicesFactory = () => {
  return {
    async lookupAllProducts() {
      return [
        {id: 1, title: 'First Product', /* more data */},
        {id: 2, title: 'Second Product', /* more data */},
      ]
    }
  }
}

export default {
  title: 'Products',
  component: Products,
  decorators: [
    (Story) => (
      <DepsProvider productServicesFactory={productServicesFactory}>
        <Story />
      </DepsProvider>
    ),
  ],
};
```

This looks quite a bit like our test file. In fact, because our solution isn't
tied to either the Storybook or Jest libraries, we could apply some standard
engineering practices and extract our factory setup to a shared fixtures module
where we stored common setup.

What if we had gone down the **mocks** road in our tests? We could set up Mock
Service Worker (which has a handy [Storybook
addon](https://github.com/itaditya/msw-storybook-addon)) in both tests and
Storybook and that would solve our networking problem, but it's still just
addressing a symptom of our problem rather than the root cause. And how
confident are you that you'll _only_ ever need to mock out network calls? I'm
not confident. And remember, outside of our test suite, mocking may be hard.

So dependency injection actually helped us side-step coupling issues not only in
our application code, but also in our _support code_: e.g. tests and previews.
Why? Because our code is more flexible about its dependencies, it can be
naturally used in more places. We got a lot of reusability for a very small
investment.

That has other big implications. As I said in a previous example, DI lets us
swap out implementations easily.

```javascript
// App.jsx
// ... same imports ...
import {useIsBetaOptInUser} from './hooks'
import {
  productServicesFactory,
  NEW_productServicesFactory
} from './services/productServicesFactory.js';

export function App() {
  const isBeta = useIsBetaOptInUser();
  const factoryDep = isBeta
    ? NEW_productServicesFactory
    : productServicesFactory;

  return (
    <DepsProvider productServicesFactory={factoryDep}>
      <Products />
    </DepsProvider>
  )
}
```

Or maybe something _really wild_:

```javascript
// App.jsx
// ... same imports ...

export function App() {
  const isBeta = useIsBetaOptInUser();
  return (
    isBeta ? (
      <DepsProvider productServicesFactory={NEW_factory}>
        <BetaApp>
          <Products />
          <NewComponent />
          <AnotherNewComponent />
        </BetaApp>
      </DepsProvider>
    ) : (
      <DepsProvider productServicesFactory={OLD_factory}>
        <LegacyApp>
          <Products />
        </LegacyApp>
      </DepsProvider>
    )
  );
}
```

Notice that none of these scenarios required _even a single change_ to the
`<Products />` component. This is the upside of dependency injection with React
Context. And we did it all ourselves with only a few lines of code that are
clear, use APIs that are unlikely to change, and we have total ownership over.
That's a great recipe for maintainability!

## Shameless Plug for React Decoupler

You'll notice that while our little DI system is clear, explicit, and useful, it
isn't very powerful. The dependency we actually want to replace is our
`HttpClient` inside our `ProductsService` (or `productServicesFactory`) but we
need to either replace or instantiate our direct dependency first in order to
get at the inner dependency.

So I wrote a thing: [React
Decoupler](https://github.com/testdouble/react-decoupler). It's not _super_
fancy, but it's a little more powerful. And it's reached v1 now with a stable
API. It's a very simple dependency injection utility designed to help you
decouple your React components from outside concerns and make it easier to
reuse, refactor, and test your code. It's all based around a `ServiceLocator`
container object (read some Martin Fowler about [service
locator](https://martinfowler.com/articles/injection.html#UsingAServiceLocator)
objects) which is passed through React Context and keeps track of registered
dependencies and their relationships with other dependencies.

A condensed example looks like this:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import {
  DecouplerProvider, ServiceLocator, useServices, Lookup
} from 'react-decoupler';
import {ProductsService} from './services/ProductsService.js';
import {HttpClient} from './services/HttpClient.js';

const locator = new ServiceLocator();

// NOTE: Register dependencies (services) on the locator with
// a key and the dependency
locator.register('HttpClient', HttpClient);

// NOTE: In the options, a dependency can indicate it's own
// dependencies with the `Lookup()` function.
locator.register('ProductsService', ProductsService, {
  withParams: [Lookup('HttpClient')]
});

// NOTE: Any code with a reference to the `locator` instance
// can lookup registered dependencies directly.
//
// const [dep1] = locator.resolve(['<dep1-key>']);

function App() {
  const [ProductsService] = useServices(['ProductsService'])
  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    const service = new ProductsService()
    service.lookupAllProducts()
      .then(setData)
      .finally(() => setLoading(false))
  }, [ProductsService])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* do stuff with data*/}
    </div>
  )
}

ReactDOM.render(
  <DecouplerProvider locator={locator}>
    <App />
  </DecouplerProvider>,
  document.getElementById('app')
)
```

Checkout the project's
[`example/`](https://github.com/testdouble/react-decoupler/tree/main/example)
directory for an even more in-depth example.

I'll admit upfront that it doesn't have any TypeScript or FlowType annotations
yet because (a) I don't use them, and (b) I haven't taken the time to think
through the static types for this project (IoC Containers like this can be
tricky to statically type). If that's a dealbreaker, I understand. Maybe you'll
consider being the contributor that helps get static types into the project. ;)

## Conclusion

Don't think of React Context as "a way to manage React state". Think of it as "a
way to manage React dependencies". When you have some bit of code that isn't
necessarily dependent on React, consider extracting it and perhaps even
injecting it with the React Context API. All the best libraries do it: Redux,
Apollo, React Query, Recoil, MobX. And you should too. Your components will be
more testable, more reusable, and more maintainable.

Thank you for reading!
