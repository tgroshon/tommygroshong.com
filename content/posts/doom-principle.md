---
title: The Doom Principle of Programming
date: 2021-12-13
description: "The Doom Principle: some general patterns will somehow, sometime, inevitably lead to doom, always."
draft: true
categories:
  - Programming
---

As the software world is reeling over the log4j exploit (aka
[Log4Shell](https://news.sophos.com/en-us/2021/12/12/log4shell-hell-anatomy-of-an-exploit-outbreak/),
aka
[CVE-2021-44228](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-44228)),
I can't help but feel a little tinge of unhealthy schadenfreude over the Java
ecosystem. As I see it, Java's infatuation with remote object directories and
service providers directly led to this whack-a-mole-security-vulnerability
reality that Java has been stuck in for decades.

- Java Naming and Directory Interface - [JNDI](https://docs.oracle.com/javase/tutorial/jndi/overview/index.html)
- Common Object Request Broker Architecture - [CORBA](https://docs.oracle.com/javase/7/docs/technotes/guides/idl/corba.html)
- Remote Method Invocation - [RMI](https://docs.oracle.com/javase/7/docs/technotes/guides/rmi/hello/hello-world.html)

It brings to mind Moxie Marlinspike's 2011 article ["The Cryptographic Doom
Principle"](https://moxie.org/2011/12/13/the-cryptographic-doom-principle.html)
where he laid out the following:

> When it comes to designing secure protocols, I have a principle that goes like
> this: if you have to perform any cryptographic operation before verifying the
> MAC on a message you’ve received, it will somehow inevitably lead to doom.

He then detailed two examples of cryptographic exploits that demonstrated the
rule before concluding:

> even if these particular cases don’t apply, the general pattern will somehow
> inevitably cause trouble. It always does.

Not only was Moxie spot-on, I think the pattern of his analysis is generally
applicable to most programming, not just cryptography.

Consider this generalization:

> "Some general patterns will somehow, sometime, inevitably lead to doom, always."

I look at the Java ecosystem and interpret the world as follows:

> **Java**: "We have shipped this awesome ecosystem of tools to make dynamic code
> discovery, loading, and execution across networks and organizations easy!"
>
> **Java, the next day**: "We have identified some remote code execution
> vulnerabilities that need patched."
