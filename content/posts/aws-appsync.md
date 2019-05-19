---
title: "Overview of AWS AppSync"
date: 2019-04-11T20:24:55-04:00
categories:
  - DevOps
tags:
  - AWS
  - Serverless
  - GraphQL
  - AppSync
---

## Introduction

I recently learned about [AWS AppSync](https://aws.amazon.com/appsync/) while perusing A Cloud Guru
courses and stumbling on this one: ["Introduction to AWS AppSync"](https://acloud.guru/learn/intro-aws-appsync).
I am excited! AppSync is a managed service for deploying GraphQL APIs. Think of it like
[API Gateway](https://aws.amazon.com/api-gateway/) but for GraphQL instead of HTTP requests.

GraphQL is to AppSync as HTTP is to API Gateway.


From the course learnin and my trials so far, the workflow breaksdown like this:

1. Upload a GraphQL schema document
2. Configure data sources
3. Map schema to data sources with resolvers

Let's do a quick dive into each.  I am gonna cheat and not go into a couple topics: authentication and
querying. I'll save those for other posts.  But I am happy that AppSync supports AWS Cognito out-of-the-box.

## Upload a GraphQL Schema Document

You create a GraphQL schema of the same format explained by the official [schema docs](https://graphql.github.io/learn/schema/)
namely:

A. Declare types
B. Declare queries, mutations, subscriptions

GraphQL is strongly typed. It has some built-in data types like `ID`, `String`, `Boolean`, `Int`, etc.
AWS also included some [custom types](https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html)
like `AWSDate`, `AWSEmail`, and `AWSPhone` that are automatically validated.

### Schema Example

A simple schema could look like this:

{{<highlight graphql "linenos=table" >}}
# List out the types for your models
type User {
  id: ID!  # Exlamation point denotes a required field
  name: String!
  email: AWSEmail!
}

type Comment {
  id: ID!
  author: User
  content: String
  post_time: AWSDateTime
}

type Post {
  id: ID!
  title: String!
  content: String!
  comments: [Comment] # Square brackets denote an array
}

# List out your inputs; complex parameters passed to functions
input PostInput {
  id: ID!
  title: String!
  content: String!
  comments: [Comment]
}

input UserInput {
  id: ID!
  name: String!
  email: AWSEmail!
}

# All the queries (reads) that can be done - RPC style!
type Query {
  getUser(id: ID!): User
  listUsers: [User]
  getPost(id: ID!): Post
  listPosts: [Posts]
}

# All the mutations (writes) that can be done - RPC style!
type Mutation {
  createPost(input: PostInput): Post
  createUser(input: UserInput): User
}

# Your API Schema declaration!!!
schema {
  query: Query
  mutation: Mutation
}
{{</highlight>}}

## Configure Data Sources

AppSync has the ability to connect directly to backend services. So far, it can connect to the following
sources:

1. Dynamo tables
2. Lambda functions
3. AWS Elasticsearch domain
4. RDS (only Aurora so far)
5. Arbitrary HTTP endpoint

Dynamo tables and Lambda functions will be your bread and butter data sources. GraphQL data can be stored
easily as JSON, which makes Dynamo a natural choice. Then Lambda fills the slot for most your other
important side effects (sending emails/texts/notifications, generating reports from multiple tables,
or hitting external API endpoints).


## Map Schema to Data Sources with Resolvers

Resolvers is a common concept for GraphQL backends, but AppSync's implementation is pretty unique.
A resolver attaches one of your schema fields (usually a Query or Mutation field) to a data source.
In the case of a DynamoDB Table data source, your resolver creates a JSON doc which will instruct
the AppSync engine what operation to perform and the variables to use: e.g. GetItem, PutItem,
UpdateItem, Query, Scan, etc.

Resolvers come in two flavors: request and response.  The request resolvers are where you (a) perform
authorization checks (the authentication already performed by AppSync according to your API settings),
and you (b) construct the JSON doc instructing the AppSync engine on the operation.  The response
resolvers are where you (a) format the data to match your GraphQL schema return type and (b) optionally
filter out any data that should not be returned. The majority of your work with resolvers will be with
the *request* flavor while often just accepting the default response template.

Resolvers use the Apache [Velocity Template Language](http://velocity.apache.org/engine/1.7/user-guide.html)
(a.k.a. VTL) to template out the JSON control docs. VTL is just a template system like Jinja2, ERB,
and PHP. VTL is implemented in Java, which is probably the reason it's chosen: just a guess that AppSync
is probably itself written in Java ;).

AWS adds a few niceties to try and make you forget they are making you learn a new language (I'm on to
you guys). For example, they have a `$util` object with a bunch of useful conversion and helper functions.
Also, they have a good collection of pre-built VTL templates that do a surprisingly good job helping you
learn basic VTL syntax and providing some useful recipes around doing authorization checks and constructing
some of the more tricky pieces like DynamoDB expressions. The following are some examples of resolvers


### Resolver Example

Most common *response* resolver:

```
$util.toJson($context.result)
```

Common *request* resolvers (note that Lambda Function names and DynamoDB Table Names are not specified because
each function and table is a unique data source and resolvers are configured for a specific data source):


{{<highlight javascript "linenos=table" >}}
// Invoking a lambda function data source
{
    "version" : "2017-02-28",
    "operation": "Invoke",
    "payload": {
      // ... any arguments you want included in the event body
      "arguments": $util.toJson($context.arguments)
    }
}


// Scan DynamoDB Table
// NOTE: AWS template are pre-built to support paginating results with limits and next tokens

#set( $limit = $util.defaultIfNull($context.args.limit, 20) )
{
  "version": "2017-02-28",
  "operation": "Scan",
  "filter":   #if( $context.args.filter )
$util.transform.toDynamoDBFilterExpression($ctx.args.filter)
  #else
null
  #end,
  "limit": $limit,
  "nextToken":   #if( $context.args.nextToken )
"$context.args.nextToken"
  #else
null
  #end
}

// Query DynamoDB Global-Secondary Index

#set( $expression = "#day = :day" )
#set( $expNames = {"#day": "day"} )
#set( $expValues = {":day": $util.dynamodb.toDynamoDB($ctx.args.day)} )

#if ($ctx.args.type)
  #set($expression = "$expression and begins_with(#id, :type)")
  $util.qr($expNames.put("#id", "id"))
  $util.qr($expValues.put(":type", $util.dynamodb.toDynamoDB($ctx.args.type)))
#end

{
    "version" : "2017-02-28",
    "operation" : "Query",
    "index": "ScheduledByDay",
    "query" : {
      "expression": $util.toJson($expression),
      "expressionNames": $util.toJson($expNames),
      "expressionValues": $util.toJson($expValues)
    },
    "limit": $util.defaultIfNull(${ctx.args.limit}, 50),
    "nextToken": $util.toJson($util.defaultIfNullOrBlank($ctx.args.nextToken, null))
}

{{</highlight>}}

Honestly, I was a little miffed at needing to learn _yet-another-template-language_, but after a few
hours it did fade into the background. If you are proficient with whatever your underlying data source
is (Lambda Functions, DynamoDB, etc.), the VTL is a pretty small hurdle to clear.


## Conclusion

After toying around with AppSync for awhile, I am impressed enough to use it on my next consulting
project. I really like GraphQL and DynamoDB, and the AppSync integration of those two is really great.
I am also very excited that AppSync API's support Cognito (and the docs seem to **prefer** Cognito as
the auth strategy). Authentication is such a oft-implemented workflow that it honestly feels like a
huge waste of time whenever I build one. The included `auth` module in Django is one of the biggest
reasons I prefer to use it when building traditional, monolithic web apps.

Anyways, I hope you go and try out AppSync.  I know I will!!!
