---
layout: weAutPost
title: Raspberry Pi IO with Java
bigTitle: PiGpioJava
date:   2019-05-18
categories: Java Raspberry Pi GPIO pigpio Frame4j
lang: en
copyrightYear: 2019
revision: 3
reviDate: 2019-05-23
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 3
commentShare: /posts/2009/05/frame4j.html
---
## Pi IO and process control with C
[![Frame4J](/assets/icons_logos/frame4jlogo-02t.png "&gt; Frame4J"){: .imgonright height="40px" width="206px"}](https://frame4j.de/index_en.html)
The natural language for a small Linux controller, like a Raspberry Pi, is
C &mdash; especially when it comes to process control using Pi's  GPIO
(general purpose input and output). This we and others did with good success.
See the 
[publication](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services")
or the 
[SVN repo](https://weinert-automation.de/svn/rasProject_01/ "rasProject_0 (guest:guest)").
One part of the success story is using Joan N.N.'s C 
[pigpio library](http://abyz.me.uk/rpi/pigpio/index.html).

## Java on the Pi
Nevertheless, some people would like to use Java on a Pi, too. That's not a
problem. You can have a Java&nbsp;8 on a Pi&nbsp;3 and even have 
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

## Native (JNI) or pure Java
[rdGnPiGpioDBlink.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/rdGnPiGpioDBlink.c "C GPIO demo")
with all its behaviour was ported to
[rdGnPiGpioDBlink.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/RdGnJPiGpioDBlink.java "Java GPIO demo"). This port uses a part of Neil Kolban's
[JNI library](https://github.com/nkolban/jpigpio "interface to pigpio[d]")
that also uses 
[pigpio's](http://abyz.me.uk/rpi/pigpio/sif.html "socket interface docu") 
socket interface. Using an extra large C layer with JNI to get to pigpiod's
socket interface seems pure overhead. 

Hence we like to replace this by a pure Java solution. The base functionality
is implemented and demonstrated by another port from C
[RdGnPiGpioDBlink.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/RdGnPiGpioDBlink.java "100% pure Java").

## Side problems with Java GPIO or process control

An immediate problem that had to be solved in the light of porting 
"all its behaviour" was implementing the lock file approach (for singleton
use of process IO and watch-dog) established in all our control installations
with Raspberries and consorts. It turned out that locking a random access
file fully and exclusively with Java (java.nio.channels.FileLock) on a Linux
system is incompatible with Linux C flock(). From all C programmes or program
instances (processes) competing for one lock file the first would win and 
the others would have to end or wait. The same can be said of all Java 
program instances using java.nio.channels.FileLock &dash; but even if a 
C program has a lock (flock()) on the very same file.

This violation of the singleton use of certain
process resources when having control programs also in Java is, of course,
not acceptable. This problem had to be solved before leaving the state of
just play programs. The current solution are two lock methods in
[Frame4J: de.weAut.PiUtil](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/PiUtil.java "openLock() and closeLock()") 
using a C helper program 
[justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c).

## Repositories

Find most the sources on the GitHub repository
[weAut](https://github.com/a-weinert/weAut/) which mirrors parts of the larger
[SVN development repositories](https://weinert-automation.de/svn/ "guest:guest")
essential for this project. For comments and
issues on [this project](https://github.com/a-weinert/weAut/) use this 
post's comment function, which by the way is a GitHub issue.   
