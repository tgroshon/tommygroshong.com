---
title: "Mini-React-Redux Framework in Django"
date: 2017-01-20
categories:
  - Web Development
tags:
  - JavaScript
  - React
  - Redux
  - Django
  - Python
---

## Introduction

I have built several production web applications using React and Redux and generally have had an excellent experience with those technologies.  One of React's greatest assets IMO is it's ability to integrate into all kinds of stacks and setups but still play nice with the other kids.  That was something that impressed me back in Spring 2014 when I first used React.  We got React running in the jQuery spaghetti code of a massive, legacy Ruby on Rails application with incredibly little effort and huge productivity benefits to the team.  Redux is also incredible for the amount of good it does you with so little code.

There are lot's of blogs and tutorials on how to build a full single-page application (SPA) complete with client-side routing, persistent state, and even server-side rendering to boost that time-to-interactivity metric.  What if I don't need that?  What if I already have a site built using an "old-school" server-side framework like Ruby on Rails or Django, but I have one specific page that should be highly interactive and need something more robust than simple jQuery?  React and Redux could still be hugely beneficial, but how do I do it without (a) getting bogged down in boilerplate or (b) over-engineering the solution?

Mini React-Redux Framework to the rescue!

## Ready, Set, Go!

Let's make the skeleton of a super, tiny JavaScript framework that can fit our use case for a Django website.

Here are the steps we'll follow:

 - Install our client dependencies
 - Setup Webpack with Django
 - Implement the Mini React-Redux Framework

## Install our client dependencies

The following are the NPM dependencies I am relying on:

```javascript
{
  "dependencies": {
    "babel-core": "~6.3.26",
    "babel-loader": "~6.2.0",
    "babel-preset-es2015": "~6.3.13",
    "babel-preset-react": "~6.16.0",
    "react": "~15.4.2",
    "react-dom": "~15.4.2",
    "redux": "~3.6.0",
    "redux-logger": "~2.7.4",
    "redux-thunk": "~2.2.0",
    "webpack": "~1.13.2",
    "webpack-bundle-tracker": "0.0.93"
  }
}
```

Include these dependencies in your `package.json` and run `npm install`.

## Setup Webpack with Django

For this step, we are going to use the django-webpack-loader tool to give us the power to load Webpack bundles onto a templated page.  The setup is very simple if you have a vanilla Django application; just follow the loader tutorial.  I will give a high-level overview.

We need a webpack.config.js. Here is a pre-v2 webpack config file that we can use:

```javascript

var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  context: __dirname,
  entry: {
    myapp: './client/myapp/index',
  },
  output: {
      // IMPORTANT: Need to match this up with settings STATICFILES_DIRS and WEBPACK_LOADER
      path: path.resolve('./static/bundles/'),
      filename: "[name]-[hash].js",
      // OPTIONAL: In this setup, it can be helpful to namespace the exported files
      library: 'MyCompanyApp',
      libraryTarget: 'var'
  },

  plugins: [
    // IMPORTANT: django-webpack-loader needs to know where this file is
    new BundleTracker({filename: './webpack-stats.json'})
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'react', 'stage-2'],
          cacheDirectory: true
        }
      }
    ]
  }
}
```

You will need to throw in some settings for the Django webpack loader plugin so it knows where to find certain key files. Here are some simple defaults:

```python
INSTALLED_APPS = (
    # ...
    'webpack_loader'
)

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

WEBPACK_LOADER = {
    'DEFAULT': {
        # Lets not cache for dev builds; you can enable for prod builds
        'CACHE': False,
        # NOTE: where, inside the staticfiles, are the output? Must end with slash
        'BUNDLE_DIR_NAME': 'bundles/',
        # NOTE: STATS_FILE is the path to the file that the BundleTracker webpack plugin is writing.
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
        'POLL_INTERVAL': 0.1,
        'TIMEOUT': None,
        'IGNORE': ['.+\.hot-update.js', '.+\.map']
    }
}
```

That should do for now.

## Implement the Mini React-Redux Framework

Dan Abramov is a smart guy. He wrote Redux. He encourages devs not to use Redux until you know that you need it; just use Props and State. I strongly support that! However, in this post I want to demonstrate the more complicated case of using Redux including with some middlewares just to show how simple it is. I encourage you to pair this example down to only what you need.

Here is the source I came up with for our mini framework:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'
import MyComponent from './components/MyComponent'

/**
 * Redux Reducer.
 * @params:
 *  - state: the previous state of the store
 *  - action: an object describing how the state should change
 * @returns:
 *  - state: a new state after apply appropriate changes
 */
const rootReducer = (state = { clicks: 0 }, action) => {
  // ... change state based on action
  return state
}

/**
 * Redux Store object with three functions you should care about:
 *  - getState(): returns the current state of the store
 *  - dispatch(action): calls the reducer with a given action
 *  - subscribe(): called after a reducer runs
 *
 * The store has two optional middlewares to showcase how you would add them:
 *  - redux-thunk: allows `store.dispatch()` to receive a thunk (function) or an object
 *                 See http://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559
 *  - redux-logger: logs out redux store changes to the console. Only in dev.
 */
const middlewares = process.env.NODE_ENV === 'production'
    ? applyMiddleware(thunk)
    : applyMiddleware(thunk, createLogger())
let store = compose(middlewares)(createStore)(rootReducer)

/**
 * Helper function to render the Gradebook component to the DOM.
 * Makes the following props available to the Gradebook component:
 *  - storeState: an object of the latest state of the redux store.
 *  - dispatch: a function that dispatches actions to the store/reducer.
 */
const render = (nodeId, component) => {
  let node = document.getElementById(nodeId)
  ReactDOM.render(<component storeState={store.getState()} dispatch={store.dispatch} />, node)
}

/**
 * Function that bootstraps the app.
 *  - render the component with initial store state.
 *  - re-render the component when the store changes.
 */
const start = () => {
  render('app', MyComponent)
  store.subscribe(() => render('app', MyComponent))
}
```

To start the application, (a) load the bundle on the page and (b) call the exported start function when the page loads. Here's an example using jQuery:

```html
{% load render_bundle from webpack_loader %}
{% render_bundle 'myapp' %}

<script>$(() => MyCompanyApp.start())</script>
```

## Explanation

This little proof-of-concept is interesting to me because of how much usefulness it provides with so little code.  With this code, we create a Redux store with some basic middlewares and a reduce that does nothing interesting (yet).  Then we render a component to the DOM, giving it the current store state and a function for the component to dispatch actions if necessary, and setting up a store subscription so that the component will be re-rendered whenever the store changes.

Another cool part about this approach is that a lot of the setup code can be pulled out and made reusable.  The render(), start(), and store setup would probably be the same for every Mini App we would create.  Then we could simplify this whole file down to just the reducer and passing in the node and component to the start function (not implemented here).

## Conclusion

With very little effort and Boilerplate, we have a React application using Redux as it's storage system.  With this in place, you can build quite sophisticated widgets and still have the flexibility to get more complex if you need to do something more involved.
