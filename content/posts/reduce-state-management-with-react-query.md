---
title: Reduce State Management Footprint with React Query
date: 2021-05-26
description: "State management got you down? Miss the days when your React application was simple and fun? Use React Query and say goodbye to all that pesky cognitive overload."
categories:
  - Web Development
tags:
  - React
  - JavaScript
---

_Originally posted on the Test Double blog [here](https://blog.testdouble.com/posts/2021-05-03-reduce-state-management-with-react-query/)_


As a consultant who has worked with React since 2014, I have been fortunate to
see and work with many dozens of production React codebases. In that time, I’ve
noticed many patterns of use (and pain) that crop up even between very different
applications. I also, regularly, get asked about the React ecosystem more
generally and what things I’m excited for (or dreading).

In recent months, [React Query (RQ)](https://www.npmjs.com/package/react-query)
has been at the top of that list of things I’m excited about.

## The Case for React Query

Why am I excited about React Query? Because it fits into this sweet spot of the ecosystem:

- It is focused on a particular, difficult problem that it handles very well.
- It is un-opinionated about the rest of your stack.
- It is compatible with the future of concurrent mode and suspense.
- It reduces the amount of “state management” your app needs.


This last point is something I'll talk more about, because I feel it is
under appreciated about React Query, and really is one of its best superpowers.
I feel confident in predicting that most early-stage, production, React
applications adopting RQ will find they need no additional state
management solution at all for a good long while.


In my experience, the most common reason leading to introducing a 3rd party
state management library to a React app is to handle remote data: fetching,
mutating, and sharing between components. I’ve seen this decision pattern
repeated time and again in organizations and apps of all different sizes. You
will rarely find a production React application that does not need to make
network requests for data, and React includes no high-level abstractions for
doing it.


When a developer is given an approach or tool specialized to handle remote data,
many apps have only a trivial amount of application-wide state to manage. In
many cases, especially early on in a project, that surface area of state
management is small enough you could even do it with a one-off local state and
context solutions using React’s built-in state management tools. Remember, React
itself is also a state management library. (See [Application State Management
with React](https://kentcdodds.com/blog/application-state-management-with-react)
by Kent C. Dodds.)


If you haven't seen React Query before, it looks like this:


```javascript
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'

// Two Async functions that perform API actions with fetch, axios, or other
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Queries
  const query = useQuery('todos', getTodos)

  // Access the client for use in "onSuccess" mutation callback
  const queryClient = useQueryClient()

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos')
    },
  })

  return (
    <div>
      <ul>
        {query.data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```
(Example adapted from React Query [documentation](https://react-query.tanstack.com/quick-start).)


This is a good single-page example, but it downplays very natural improvements
in your code that are possible.


We can extract these React Query hook calls to our own custom hooks and tighten
up the calling code:

```javascript
// ... same earlier code

function useTodos() {
  return useQuery('todos', getTodos)
}


function useTodoCreate() {
  const queryClient = useQueryClient()

  const {mutate} = useMutation(postTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos')
    },
  })

  return mutate
}


function Todos() {
  const todosResult = useTodos()
  const createTodo = useTodoCreate()

  return (
    <div>
      <ul>
        {todosResult.data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          createTodo({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}
```


Sometimes an app has tricky, UI/UX behavior that requires complex managing of
mutable state. Those cases certainly warrant reaching for tools like Redux
(preferably [Redux Toolkit](https://redux-toolkit.js.org/) which is the best
way to Redux), [XState](https://www.npmjs.com/package/xstate),
[MobX](https://www.npmjs.com/package/mobx), or
[Recoil](https://www.npmjs.com/package/recoil). But even in those cases, it
still makes sense to also be using React Query because it reduces the surface
area that must be handled by your state management solution.


My current opinion is that any data that is conceptually “owned” by a remote
source is probably a poor fit for generic state management containers like
Redux, MobX, or XState. These libraries are best used for managing
application-wide **view** state, more than your application state generally
(regardless of what their marketing material may say). That’s not to say you
can’t use them for extra-view things, but rather that the amount of hassle is
directly proportional to the amount of data you put them in charge of.


## Implementation on a Personal Project


Take the example of a personal project I've been working on occasionally for
about a year. This project was using [MobX State Tree
(MST)](https://mobx-state-tree.js.org/) for its state management. MST is a
great library and I really enjoyed using it, but once I made the switch to React
Query, I found that MST wasn’t doing much heavy lifting. Most of the code was
doing transforms between RQ and MST, and a smaller amount was doing core domain
logic. I set to work extracting those core domain bits into functions outside of
my MobX code and realized ... I didn’t really need MobX anymore. Apart from a
couple site-wide modals, all of my application state was being managed by RQ,
and those modals were easy to move to a one-off Context + useReducer solution (a
la [that Kent Dodds
post](https://kentcdodds.com/blog/application-state-management-with-react)).


This pattern has repeated with other codebases. Migrating to React Query
resulted in atrophied state management code ripe for removal. It also pushed my
coding practice toward a “functional core” design where my domain logic was
entirely pure functions that operated on data primarily owned by React Query.
This design keeps your core logic very easy to test.


Next, on that same project, I decided to migrate off of GraphQL and to a
REST-ful API (don’t ask, long story, maybe another blog post). It was around 50
distinct Query and Mutation types: not massive, but not trivial either. One key
to React Query’s success is that its API allows you to hide away that
networking layer behind the same abstraction. Is an API implemented with REST or
GraphQL? Both via different enpoints? The consuming view layer (React) doesn’t
need to care about any of that.


This project first made data requests with a simple GraphQL Client package
([graphql-request](https://www.npmjs.com/package/graphql-request)), and was going
to migrate to a simple Fetch interface. Once the migration was finished, I had
not changed a single React component. I won’t lie and say the migration was
painless (mostly because I was unrolling a lot of handwritten stuff), but it
definitely wasn’t the root canal level hardship I was expecting at the outset.


A huge factor of that low-pain experience was how contained the change was. All
the updates lived at the same layer of my application and were scoped to a very
small number of files. In fact, I did almost all the work in a single file until
I got it working and later extracted it for a more pleasing file structure.


The GraphQL version of the app was something like this:

```javascript
import { GraphQLClient } from "graphql-request";

const gqlClient = new GraphQLClient('/api/graphql')

async function getUserDetails(userId) {
  const { users_by_pk: data } = await gqlClient.request(
    /* GraphQL */ `
      query QueryUserDetails($userId: Int!) {
        users_by_pk(id: $userId) {
          id
          first_name
          last_name
          email
        }
      }
    `,
    {
      userId: userId,
    }
  );

  return transformSnakeCase(data);
}

export function useUserDetails() {
  return useQuery("user", getUserDetails);
}
```

Then after the change to a REST-ful backend, it was something like this:

```javascript
async function getUserDetails(userId) {
  const response = await fetch('/api/user');
  const data = await response.json()
  return transformSnakeCase(data);
}

// ... same custom hook
```

The specifics of the implementation differences of `getUserDetails()` isn't what
I care about here. Both versions were doing essentially the same work, and I left
out the error handling and authentication stuff because that was almost
identical between them. The important note is that _everything above stayed the
same_. My custom hook didn't need to change. My React components didn't need to
change. My tests didn't even change.


## Conclusion


For most new React projects, I recommend the first library installed after
`react` and `react-dom` to be `react-query`. For a simple application, it's very
straightforward, but as time passes and commits accumulate, React Query has been
the best remote data fetching solution at growing with your codebase. It has
saved my bacon more times than once, as I needed to regain control of a
complexity exploding engagement. And it has pushed me down better paths of
design with clearer layer distinctions and interfaces between them.

If you haven't tried it yet, give it a shot.
