---
layout: weAutPost
title: Raspberry Pi IO with Java
bigTitle: PiGpioJava
date:   2019-05-18
categories: Java Raspberry PI GPIO frame4j
lang: en
copyrightYear: 2019
revision: 1
reviDate: 2019-05-18
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 3
commentShare: /posts/2009/05/frame4j.html
---

[![Frame4J](/assets/icons_logos/frame4jlogo-02t.png "&gt; Frame4J"){: .imgonright height="40px" width="206px"}](https://frame4j.de/index_en.html)
The natural language for a small Linux controller, like a Raspberry PI, is
C &mdash; especially when it comes to process control using PI's  GPIO
(general purpose input and output). This we and others did with good success.
See the 
[publication](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services")
or the 
[SVN repo](https://weinert-automation.de/svn/rasProject_01/ "rasProject_0 (guest:guest)").

Nevertheless, some people would like to use Java on a PI, too. That's not a
problem. You can have a Java 8 on a Pi3 and even have 
[Frame4J](https://frame4j.de/index_en.html "project home") installed and 
enjoy all the tools etc. <br />
Problems start when wanting process control with Java. To get the know how
I ported a demo 
[rasProject_01](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services")
C program 
[rdGnPiGpioDBlink.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/rdGnPiGpioDBlink.c "C GPIO demo").
The C program uses the pigpio library in the daemon/server variant and a 
Linux C lock file standard procedure to force control programs using process
IO (and optionally the Pi watch-dog) singleton, as well as shutdown hooks 
to leave process IO in an inactive 
safe state. The little demo shows process IO (by three LEDs) as well as 
professional approaches. Well, the little demos does not use the watch-dog, 
as do the real control programs. (See all in above mentioned
[publication](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services")).

[rdGnPiGpioDBlink.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/rdGnPiGpioDBlink.c "C GPIO demo")
with all its behaviour was ported to
[rdGnPiGpioDBlink.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/RdGnJPiGpioDBlink.java "Java GPIO demo"). As of now (April 2019) we use a part of Neil Kolban's
[JNI library](https://github.com/nkolban/jpigpio "interface to pigpio[d]"). We 
like to replace this by a pure Java solution in near future.

An immediate problem that had to be solved in the light of porting 
"all its behaviour" was implementing the lock file approach (for singleton use
of process IO and watch-dog) established in all our control installations with
PIs and consorts. It turned out that locking a random access file fully and
exclusively with Java (java.nio.channels.FileLock) on a Linux system is 
incompatible with Linux C flock(). From all C programmes or program instances
(processes) competing for one lock file the first would win and the others
would have to end or wait. The same can be said of all Java program instances
using java.nio.channels.FileLock &dash; but even if a C programme has a lock
(flock) on the very same file. This violation of the singleton use of certain
process resources when having control programs also in Java is, of course,
not acceptable. This problem had to be solved before leaving the state of
just play programs. The current solution are two lock methods in
[Frame4J: de.weAut.PiUtil](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/PiUtil.java "openLock() and closeLock()") 
using a 
[C helper justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c).
