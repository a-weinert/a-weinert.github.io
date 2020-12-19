---
layout: weAutPost
title: Javas nicht kompatible Dateisperre
bigTitle: Java&amp;flock
permalink: /:title.html
date:   2019-06-24
categories: Java Linux flock Raspberry
lang: de
enPage: javaIncompFlock.html
copyrightYear: 2019
revision: 2
reviDate: 2020-10-06
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 5
commentShare: javaIncompFlock.html
---
[![Frame4J](/assets/icons_logos/frame4jlogo-02t.png "&gt; Frame4J"){: .imgonright height="40px" width="206px"}](https://frame4j.de/index_en.html)
## Java auf dem Pi

Bei der Arbeit an einem [Projekt](raspiGPIOjava_de.html) über Prozessein-
und -ausgabe mit Java auf Raspberry Pi entstanden Java-Applikationen die 
Sperrdateien<!--more--> (lock files) im Kooperation mit
existierenden C-Steuerungsprogrammen verwenden müssen. Wie seit langem
bei C und auf Linux-Plattformen Usus benutzen die C-Programme hierfür flock().

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
Auszug aus
[weUtil.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/weRasp/weUtil.c)
<br /> &nbsp;

Bei einer Java-Applikation würde man naheliegenderweise für diese 
Dateisperren das nutzen, was Java hierzu zu bieten hat:

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
Auszug aus
[JustNotFLock.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/JustNotFLock.java)
und [PiUtil.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/PiUtil.java)
<br />  &nbsp;

Abgesehen davon, dass es ein bisschen länger als mit C ist, scheint das
Java-Äquivalent zu funktionieren: Von zwei oder mehr Java-Applikationen,
die die selbe Sperrdatei haben wollen, gewinnt auf diese jeweils nur eine.

## Nicht kompatible Dateisperre 

Aber leider zeigte es sich, das das Sperren einer Datei (as random access
file fully and exclusively) mit Java auf einer Linux-Plattform nicht mit
Linux' 
flock() &mdash; _dem_ Standardvorgehen &mdash; kompatibel ist! Von 
allen C-Programmen oder Programminstanzen (Prozessen) im Wettbewerb 
um eine Sperrdatei gewinnt das erste, und die anderen müssen warten 
oder aufhören. Und genau dasselbe kann über Java-Applikationen mit
java.nio.channels.FileLock gesagt werden &mdash; allerdings selbst
dann, wenn bereits ein C-Program eine Sperre (mit flock()) auf
dieselbe Datei hat.

Diese Inkompatibilität führt zur Verletzung von singleton-Bedingungen
bei der Nutzung bestimmter kritischer Ressourcen &mdash; in 
den Beispielen hier Prozess-IO. Das ist ein Unding mit hohem 
Schadenspotential. Das muss gelöst werden, bevor man Java-Anwendungen
auf beispielsweise einem Prozesskontrollmodul verwendet. 

### Der Fehler liegt bei Java

Wenn man die Übermacht von C auf kleinen (eingebetteten) Systemen
sieht und wenn man in Betracht zieht, dass wir auf einem Linux-System
sind, erkennen wir eindeutig die älteren Rechte von Flock() an. Die
Java8-Portierung nach Linux hat eine fehlerhafte Implementierung
von FileLock. 

### Lösung gesucht

Das verpacken von flock() etc. mit JNI scheint der naheliegende Weg. Aber
von seiner Hässlichkeit abgesehen beeinträchtigt es die 
Plattformabhängigkeit und damit eines der dicksten Pfunde, die Java
beim Cross-Übersetzen und -Bauen hat.
(Es mag ein Vorurteil sein. Aber, wann immer ich JNI einsetzen musste,
habe ich es verabscheut.)

Andersherum, nämlich FileLock für C verpacken, sollte man aus
vielen Gründen ablehnen.

Für die letztlich verwirklichte, getestete und benutzte Variante
muss man ein bisschen 'um die Ecke' denken.

### Das Halten eines Prozesses anstelle einer Datei

Eine nette Lösung mit reinem C und reinem Java erscheint, wenn man
 - aufhört, Java das Linux/C-kompatible flock() beibringen zu wollen   
   und stattdessen das Dateisperren (worin Java schlecht ist) zu ersetzen durch
 - das Starten eines Programms und das Halten des laufenden
   (!) Prozesses sowie
 - Beenden &mdash; das bedeutet Entsperren &mdash; durch
   das Töten dieses Prozesses.
 
Denn das Starten von Programmen und das Handhaben von Prozessen 
funktioniert gut und mit reinem Java auf allen bisher hierzu benutzen
Plattformen. Das betreffende Programm ist das kleine C_Hilfsprogramm 
[justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c).
Nach seinem Start versucht es die gegebene Sperrdatei zu öffnen und
(natürlich mit flock()) zu sperren. Falls es die Sperre bekommt, läuft
es endlos, bis es getötet wird. Daraufhin (im sog. shut down hook) wird es
die Datei entsperren. Wenn die betreffende Sperrdatei nicht existiert
oder nicht gesperrt werden kann, endet das Programm sofort mit einem
Fehlerkode. Letztlich ist 
[justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c)
ein C-Prozesssteuerprogramm, dass all seiner Prozesssteuerfunktionen
entkleidet ist.

Die Handhabung von 
[justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c)
wird über zwei Methoden (openLock() and closeLock) in
[Frame4J: de.weAut.PiUtil](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/PiUtil.java "openLock() and closeLock()") vermittelt. Somit ist die zu flock() kompatible Dateisperre für Java
genauso einfach wie in C.

### Die Inkompatibilität vorführen

Wenn man das kleine Programm 
([justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c))
direkt von der Konsole bzw. mit putty ausführt und dies gleichzeitig mit
der Java-Applikation 
[JustNotFLock](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/JustNotFLock.java "de.weAut.tests.JustNotFLock (needs Frame4J installed)")
tut, bekommt man zwei Sperren zur selben Zeit auf die selbe Datei. [JustNotFLock](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/JustNotFLock.java "de.weAut.tests.JustNotFLock (needs Frame4J installed") nutzt Javas eigene Dateisperre mit java.nio.channels.FileLock, welche von Dateisperren des Betriebssystems offensichtlich nichts weiß.


## Repositories

Finden Sie bitte die meisten Quellen im GitHub repository
[weAut](https://github.com/a-weinert/weAut/). Es spiegelt dieTeile der größeren
[SVN Entwicklungs-Repositorys](https://weinert-automation.de/svn/ "guest:guest"),
welche für dieses Projekt essentiell sind. Für Kommentare und Probleme
[dieses Projekts](https://github.com/a-weinert/weAut/) nutzen Sie bitte die
Kommentarfunktion dieses Beitrags, die übrigens ein "GitHub issue" ist.   
