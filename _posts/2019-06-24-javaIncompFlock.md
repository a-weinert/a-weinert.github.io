---
layout: weAutPost
title: Java's incompatible file lock
bigTitle: Java&amp;flock
permalink: /:title.html
date:   2019-06-24
categories: Java Linux flock Raspberry
lang: en
dePage: javaIncompFlock_de.html
copyrightYear: 2019
revision: 1
reviDate: 2019-06-24
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 5
commentShare: javaIncompFlock_de.html
---
[![Frame4J](/assets/icons_logos/frame4jlogo-02t.png "&gt; Frame4J"){: .imgonright height="40px" width="206px"}](https://frame4j.de/index_en.html)
## Java on the Pi
Working on a [project](raspiGPIOjava.html) dealing with process IO with Java on a Raspberry Pi I got Java applications
that must compete for a lock with existing C control programs on the little
machine. As usual since decades with Unix/Linux the C programmes know the 
path of an existing (empty) lock file and use flock() to compete for it.

```c
/*  Lock file handle. */
int lockFd;

/* Common path to a lock file for GpIO use */
char const  * const lckPiGpioPth = "/home/pi/bin/.lockPiGpio";

/*  Basic start-up function failure. */
int retCode;

/*  Open and lock the lock file.
 *
 *  @param lckPiGpioFil   lock file path name
 *  @return 0: OK, locked; 97: lckPiGpioFil does not exist;
 *                         98: can't be locked
 */
int justLock(char const * lckPiGpioFil){
  char const * lckPiGpio = lckPiGpioFil != NULL
                          ? lckPiGpioFil : lckPiGpioPth;
  if ((lockFd = open(lckPiGpio, O_RDWR, 0666))  < 0) {
    return retCode = 97;
  } // can't open lock file (must exist)
  if (flock(lockFd, LOCK_EX | LOCK_NB) < 0) {
    close (lockFd);
    return retCode = 98;
  } // can't lock lock file
  return retCode = 0;
} // justLock(char const *)

/*  Unlock the lock file. */
void closeLock(void){
  flock(lockFd, LOCK_UN);
  close(lockFd);
} // closeLock()
```
Excerpt from [weUtil.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/weRasp/weUtil.c)
<br /> &nbsp;

Quite logically, for a Java application, one would use what Java has on board 
for file locking:

```java
/** Common path to a lock file for GpIO use. */
  static public final String lckPiGpioPth = "/home/pi/bin/.lockPiGpio";
  File lockFil;
  RandomAccessFile lockFile;
  FileChannel lockFileChannel;
  FileLock lock;
  
/** Open and lock lock file. 
 * 
 *  @param lckPiGpioFil if not null or empty use this path instead of the
 *                       default one ({@link lckPiGpioPth})
 *  @param verbose true: make the lock process verbose (by option -v) on
 *                       standard output                     
 *  @return  err 0: OK; else: error, see {@link #ERR_NoLOCKFILE}, 
 *                    {@link #ERR_NOT_LOCKED}
 */
  @Override public int openLock(final String lckPiGpioFil, boolean verbose){
     final String lckPiGpio = lckPiGpioFil != null
             &&  lckPiGpioFil.length() > 3 ? lckPiGpioFil : lckPiGpioPth;
     int ret = 0;        
     try {
         lockFil = new File(lckPiGpio);
         if (lockFil.exists()) {
            lockFile = new RandomAccessFile(lockFil, "rw"); 
         } else {
            ret = ERR_NoLOCKFILE;
         }
      } catch (FileNotFoundException e) {
          ret = ERR_NoLOCKFILE;
          lockFile = null;
      }
      if (lockFile != null) lockFileChannel = lockFile.getChannel();  
      if (lockFileChannel == null) {
         ret = ERR_NoLOCKFILE;
      } else try {
         lock =  lockFileChannel.tryLock();
         if (lock == null) ret =  ERR_NOT_LOCKED; // 98
      } catch (IOException e) {
         ret =  ERR_NoLOCKPROC; // should not happen98
      }
      if (ret != 0 && verbose) {
          System.out.println("JustNotFLock lock error: " + errorText(ret));
      }
       
       return ret; // no error
  } // openLock(String, boolean)

/**  Unlock the lock file. */
  @Override public  void closeLock(){
     if (lock != null) {
       try {
         lock.release();
       } catch (IOException e) { } // ignore
     } // lock
     if (lockFile != null) {
       try {
         lockFile.close();
       } catch (IOException e) { } // ignore
     } // lockFile
  } // closeLock()
```
Excerpt from [JustNotFLock.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/JustNotFLock.java) and [PiUtil.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/PiUtil.java)
<br />  &nbsp;

Besides being a bit longer than C the Java equivalent seems to work: of any two or more Java applications competing for the same lock file this way only one will win.

## Incompatible file lock 

But, alas, it turned out that locking a random access file fully and 
exclusively with Java (java.nio.channels.FileLock) on a Linux
system is incompatible with Linux C file locking by flock() &mdash; the 
standard approach on Linux. From all C programmes or program
instances (processes) competing for one lock file the first would win and 
the others would have to end or wait. The same can be said of all Java 
program instances using java.nio.channels.FileLock &mdash; but even if a 
C program has a lock (flock()) on the very same file.

This incompatibility would lead to a violation of the singleton use of certain process resources when having control programs both in Java and in C. This is,
of course, not acceptable. This problem had to be solved before releasing 
Java to a real life control module. You can not, for example, allow a process
control program going in cyclic run mode and having a Java calibration /
service application touching parts of the sensors or actuators. 

### It is Java's fault

Considering the prevalence C on small embedded systems and considering being 
on Linux one has to judge all rights thereto accrue to flock(). The Java 8 port to Linux has a buggy FileLock implementation. 

### Looking for a solution 

Wrapping flock() etc. with JNI seems an obvious approach. But besides being outright ugly it impedes Java's platform independence, one of its best features when it comes to cross developing and building. (It might be prejudice. Whenever I had to use JNI, I simply loathed it.)

The other way round, wrapping FileLock for C, can be ruled out for several reasons.

For the solution implemented, tested and used in the end one may need to 'think outside the box' a bit: 

### Holding a process instead of locking a file

A nice pure C and pure Java solution arises when
 - stopping to bring a Linux/C compatible file lock to Java<br />
   and substitute the file lock (where Java is bad at) with
 - starting a program and holding the running (!) process and
 - finish &mdash; i.e. unlock &mdash; by killing the process held.
 
Well, starting programs and handling processes, does work with pure Java on all platforms used so far. The program is a little C helper program 
[justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c). When started this program tries to open and lock (by flock(), of course) the given lock file. When it gets the lock it will
run endlessly, i.e. until being killed. It will then unlock the file in its shut down hook. When the file in question does not exist or can't be locked, the program will exit with an error code. In the end [justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c) is a C process control program stripped from all control (IO) functions.

The handling of [justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c) will be done by two lock methods (openLock() and closeLock) in
[Frame4J: de.weAut.PiUtil](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/PiUtil.java "openLock() and closeLock()"). Hence, the flock() compatible file lock for Java is almost as simple as 
in C.

### Demonstrating the incompatibility

Running this little program ([justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c)) directly from the shell or putty as well as the 
Java application [JustNotFLock](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/JustNotFLock.java "de.weAut.tests.JustNotFLock (needs Frame4J installed") at the same time will demonstrate the double lock on the same file. [JustNotFLock](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/JustNotFLock.java "de.weAut.tests.JustNotFLock (needs Frame4J installed") uses Java's own file lock by java.nio.channels.FileLock.


## Repositories

Find most of the sources on the GitHub repository
[weAut](https://github.com/a-weinert/weAut/) which mirrors parts of the larger
[SVN development repositories](https://weinert-automation.de/svn/ "guest:guest")
essential for this project. For comments and
issues on [this project](https://github.com/a-weinert/weAut/) use this 
post's comment function, which by the way is a GitHub issue.   
