---
layout: weAutPost
title: Raspberry Pi IO with Java
bigTitle: PiGpioJava
date:   2019-06-11
categories: Java Raspberry Pi GPIO pigpio Frame4j
lang: en
dePage: raspiGPIOjava_de.html
copyrightYear: 2019
revision: 11
reviDate: 2020-10-06
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 3
commentShare: /frame4j.html
---
{% include referenceLinks.txt %}
[![Frame4J](/assets/icons_logos/frame4jlogo-02t.png "&gt; Frame4J"){: .imgonright height="40px" width="206px"}](https://frame4j.de/index_en.html)
## Pi IO and process control with C
The natural language for a small Linux controller, like a Raspberry Pi, is
C &mdash; especially when it comes to process control using Pi's  GPIO
<!--more-->(general purpose input and output) to control actuators
and read sensors. This we and others did with good success.
See the 
[publication](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services")
or the 
[SVN repo](https://weinert-automation.de/svn/rasProject_01/ "rasProject_0 (guest:guest)").
One part of the success story is using Joan N.N.'s C 
[pigpio library](http://abyz.me.uk/rpi/pigpio/index.html) with its daemon/server approach.

## Java on the Pi
Nevertheless, some people would like to use Java on a Pi, too. That's not a
problem. You can have a Java&nbsp;8 on a Pi&nbsp;3 and even have 
[Frame4J][f4j_en]{: class="bbi"} installed and 
enjoy all the tools etc. 

Problems start &mdash; on any platform by the way &mdash; when wanting 
process control with Java. To get the know how for Raspberry Pi I ported a 
[rasProject_01](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services")
C demo program 
[rdGnPiGpioDBlink.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/rdGnPiGpioDBlink.c "C GPIO demo"). All of a sudden I had a growing
[project](https://github.com/a-weinert/weAut/) and a German
[publication](https://a-weinert.de/publication_en.html) on Java Magazin.

## Native (JNI) or pure Java
The C program uses the 
[pigpio library](http://abyz.me.uk/rpi/pigpio/index.html) in the 
daemon/server variant and a 
Linux C lock file standard procedure to force control programs using process
IO (and optionally the Pi watch-dog) singleton, as well as shutdown hooks 
to leave process IO in an inactive 
safe state. The little demo shows process IO (by three LEDs) as well as 
professional approaches. Well, the little demo does not use the watch-dog, 
as do the real control programs. (See all in above mentioned
[publication](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services")).
[rdGnPiGpioDBlink.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/rdGnPiGpioDBlink.c "C GPIO demo")
with all its behaviour was ported to
[rdGnPiGpioDBlink.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/RdGnJPiGpioDBlink.java "Java GPIO demo"). 

For the IO part this port uses a part of Neil Kolban's
[library](https://github.com/nkolban/jpigpio "interface to pigpio[d]")
that also uses 
[pigpio's](http://abyz.me.uk/rpi/pigpio/sif.html "socket interface docu") 
socket interface. Hence we have all the advantages of 
Joan N.N.'s [approach](http://abyz.me.uk/rpi/pigpio/index.html "pigpio library"). On 
the other hand Neil Kolban's
[library](https://github.com/nkolban/jpigpio "interface to pigpio[d]") 
includes a JNI implementation plus its C layer for pigpiod's non socket 
interface. The library is nowhere written with the aspect of avoiding throw
away objects.

Considering that and some other points, I started to implement a compact 
pure Java pigpio[d] socket solution. The base functionality
is implemented and demonstrated by another port from C
[RdGnPiGpioDBlink.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/RdGnPiGpioDBlink.java "compact pure Java").

## Side problems with Java GPIO or process control
### Incompatible file lock 

An immediate [problem](javaIncompFlock.html "see also extra post") that had
to be solved in the light of porting 
"all its behaviour" was implementing the lock file approach (for singleton
use of process IO and watch-dog) established in all our control installations
with Raspberries and consorts. It turned out that locking a random access
file fully and exclusively with Java (java.nio.channels.FileLock) on a Linux
system is incompatible with Linux C file locking by flock() &mdash; the 
standard approach on Linux. From all C programmes or program
instances (processes) competing for one lock file the first would win and 
the others would have to end or wait. The same can be said of all Java 
program instances using java.nio.channels.FileLock &mdash; but even if a 
C program has a lock (flock()) on the very same file.

This violation of the singleton use of certain process resources when having control programs in Java, too, is, of course,
not acceptable. This problem had to be solved before releasing Java to a 
real life control module. You can't allow the process control program going in cyclic
run mode while a Java calibration / service application (e.g.) is touching 
parts of the sensors or actuators. 

The compatible solution are two lock methods (openLock() and closeLock) in
[Frame4J: de.weAut.PiUtil](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/PiUtil.java "openLock() and closeLock()") 
using a C helper program 
[justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c). Running this little program ([justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c)) directly and the 
Java application [JustNotFLock](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/JustNotFLock.java "de.weAut.tests.JustNotFLock (needs [Frame4J][f4j_en]{: class="bbi"}
installed") at the same time will demonstrate the double lock on the same file.

### Throw away objects
With OO languages and Java the garbage collector is widely seen as a risk for a real time behaviour otherwise assessed theoretically and experimentally. A WG on automating critical processes with OO languages demanded no objects to be created while in cyclic run mode. Even if one would perhaps not be such strict, it is a good principle. It relieves you from the risks of garbage collection and of memory administration.

And all demo examples here and the corresponding Java applications adhere to it. Mutable classes are used instead of making new immutable objects, like StringBuilder en lieu de String and (own) Container classes instead of Long.

By constantly using mutable objects garbage collection and memory allocation etc. go out of the job. But, the widely used Linux approach "file as device" does not go well with Java. The listing (excerpt from [Pi1WireThDemo](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/Pi1WireThDemo.java "de.weAut.tests.Pi1WireThDemo")) shows one reading of a 1-wire thermometer. They are available in a stainless casing, too, and, by standard dimensions, suitable for boilers, e.g..  
```java
  String line1;
  String line2;
  final String devID = args[0]; // 28-02119245cd92 e.g.
  BufferedReader thermometer; 
  File  thermPath = new File(
    "/sys/bus/w1/devices/w1_bus_master1/" + devID + "/w1_slave");
  for(;runningOn;) { // cyclic run mode
    thermometer = new BufferedReader(new FileReader(thermPath));
    line1 = thermometer.readLine();
    line2 = thermometer.readLine();
    // Auswertung
```
The 1-wire Linux device (as file) driver yields one reading as two text lines [sic!]. Having read them the file closes automatically. Hence, opening that file has to go in the endless loop, hinting the cyclic run mode. Every reading thus makes:
 - 1 BufferedReader, 
 - 1 FileReader and indirectly 
 - 1 FileInputStream, 
 - 1 FileDescriptor etc.
plus finally 
 - 2 String objects.
 
We have at least, 6 objects per temperature reading. By using a byte array and spoiling all readability only the Reader and the Strings could be avoided. Of course, a thermometer would seldom be read more than once per second. But imagine such thing in a 10ms  or in an 1ms cycle on a little (embedded) computer.

The Pi (BCM) watchdog, also implemented as device as file, is in this aspect much better: The dog &mdash; i.e. with Java his OutputStream &mdash; stays open for writing all the time. Here we are lucky. But, alas, we have no influence on device drivers deeply embedded in the OS.

## Repositories

Find most of the sources on the GitHub repository
[weAut](https://github.com/a-weinert/weAut/) which mirrors parts of the larger
[SVN development repositories](https://weinert-automation.de/svn/ "guest:guest")
essential for this project. For comments and
issues on [this project](https://github.com/a-weinert/weAut/) use this 
post's comment function, which by the way is a GitHub issue.   
