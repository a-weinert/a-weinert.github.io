---
layout: weAutPost
title: getopt_long accepts abbreviation
bigTitle: abbreviation bug
permalink: /:title.html
date:   2020-10-13
categories: C GCC 
lang: en
dePage:
copyrightYear: 2020
revision: 2
reviDate: 2020-10-13
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---
Today (13.10.2020) I discovered getopt_long accepting abbreviations of 
long options. If your ```struct option``` (getopt.h) defines an option
cons it will be triggered by ```--cons --con --co```
but not by ```--c```.

As a developer of reliable and safe automation systems I couldn't help
considering this as a potentially dangerous bug. Accordingly, I was shocked
by my discovery. Consider an
option ```destroyMyShipInSightOfEnemy```
triggered by innocent ```-de```.

## What the manual says

Further reading revealed the 
[manual](https://linux.die.net/man/3/getopt_long) saying   
"Long option names may be abbreviated if the abbreviation is unique or is
[not?] an exact match for some defined option."   

Hence, people, being able to read would have known and not having had to
"discover" it. Well, the manual won't say that a one letter abbreviation
won't suffice.

## What others say

Still further reading showed that some colleaguesconsider accepting
abbreviations always or even by default as bug, too. And the glibc
developers, constantly, won't accept it.

Remedies found are:
 1. On the place acting upon the option get the triggering option 
     by '''argv[optind-1]'''
     and check if it is the full one.
 2. Switch to another library and function instead
      of ```getopt_long()```.
 
So it is good to have solutions at hand; but I didn't like both.    
Solution **2** would change all own code code handling options. 
And leaving the main stream (getopt.h) means loosing a broad recognition
of the semantic at first sight.   
Solution **1** is OK in this respect. But is separates the prohibiting
of abbreviating a certain option from its definition in 
the ```struct option```. 
Additionally one has to repeat the option string in question prepended
by two Minus there. If one changes an option (from ```besilent```
to ```beSilent```, e.g.) one has to remember ...
And, when using the ```--besilent=stupid``` syntax, the approach may
fail with a false positive.   
      
## My solution 

Behind options not to be abbreviated I put a pseudo option one character
shorter, guiding to the help. An exemplary ```struct option```
excerpt shows how:
```c
static struct option longOptions[] = {
  {"help",  no_argument,         NULL, 'h'},
::::
  {"noWD",  no_argument, &useWatchdog, OFF}, // no watchdog (default)
  {"useWD", no_argument, &useWatchdog,  ON}, // don't forget to trigger
  {"useW",  no_argument,         NULL, 'h'}, // block abbreviation

  {"DCF77", no_argument,         NULL, 640}, // DCF77 decoder
  {"DCF7",  no_argument,         NULL, 'h'}, // block abbreviation
//{"DCF7_", no_argument,         NULL, 'h'}, // also works
  {NULL, 0, NULL, 0} // longOptions end marker
}; // struct option (getopt.h)
```

