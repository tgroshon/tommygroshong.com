---
title: "Python Objects: Mutable vs Immutable"
date: 2013-12-24T17:39:21-04:00
tags:
  - Python
---

Not all python objects handle changes the same way. Some objects are mutable, meaning they can be altered.  Others are immutable; they cannot be changed but rather return new objects when attempting to update. What does this mean when writing python code?

This post will talk about (a) the mutability of common data types and (b) instances where mutability matters.

## Mutability of Common Types

The following are some immutable objects:

  - int
  - float
  - decimal
  - complex
  - bool
  - string
  - tuple
  - range
  - frozenset
  - bytes

The following are some mutable objects:

  - list
  - dict
  - set
  - bytearray
  - ...user-defined classes (unless specifically made immutable)

The way I like to remember which types are mutable and which are not is that *containers* and *user-defined* types tend to be mutable while scalar types are almost always immutable. Then remember some notable exceptions: *tuple* is an **immutable** container, *frozenset* is an **immutable** version of *set*. *Strings* are **immutable**; what if you want to do some in-place modifications like character swapping? Use a `bytearray`.

## When Mutability Matters

Mutability might seem like an innocuous topic, but when writing an efficient program it is essential to understand. For instance, the following code is a straightforward solution to concatenate a string together:

```python
string_build = ""
for data in container:
    string_build += str(data)
```

In reality, this is very inefficient. Because strings are immutable, concatenating two strings together actually creates a third string which is the combination of the previous two. If you are iterating a lot and building a large string, you will waste a lot of memory creating and throwing away objects. Also, at the end of the iteration you will be allocating and throwing away very large string objects which is even more costly.

The following is a more efficient and pythonic way:

```python
builder_list = []
for data in container:
    builder_list.append(str(data))
"".join(builder_list)

### Another way is to use a list comprehension
"".join([str(data) for data in container])

### or use the map function
"".join(map(str, container))
```

This code takes advantage of the mutability of a single list object to gather your data together and then allocate a single result string to put your data in. That cuts down on the total number of objects allocated by almost half.

Another pitfall related to mutability is the following scenario:

```python
def my_function(param=[]):
    param.append("thing")
    return param

my_function() # returns ["thing"]
my_function() # returns ["thing", "thing"]
```

What you might think would happen is that by giving an empty list as a default value to param, a new empty list is allocated each time the function is called and no list is passed in. But what actually happens is that every call that uses the default list will be using the same list.  This is because Python (a) only evaluates functions definitions once, (b) evaluates default arguments as part of the function definition, and (c) allocates one mutable list for every call of that function.

Do not put a mutable object as the default value of a function parameter. Immutable types are perfectly safe. If you want to get the intended effect, do this instead:

```python

def my_function2(param=None):
    if param is None:
        param = []
    param.append("thing")
    return param
```

## Conclusion

Mutability matters. Learn it. Primitive-like types are probably immutable. Container-like types are probably mutable.
References

    Python Data Model
    Python Data Types
    The Hitchhiker's Guide to Python: Common Gotchas
