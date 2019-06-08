---
layout: weAutPost
title: Raspberry Pi Ein- und Ausgabe mit Java
bigTitle: PiGpioJava
permalink: /:title.html
date:   2019-06-08
categories: Java Raspberry Pi GPIO pigpio Frame4j
lang: de
enPage: raspiGPIOjava.html
copyrightYear: 2019
revision: 1
reviDate: 2019-06-08
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 3
commentShare: raspiGPIOjava.html
---
[![Frame4J](/assets/icons_logos/frame4jlogo-02t.png "&gt; Frame4J"){: .imgonright height="40px" width="206px"}](https://frame4j.de/index_en.html)
## Pi IO und Prozesssteuerung mit C
Bei sehr kleinen Linux-Rechnern, wie einem Raspberry Pi, ist die Sprache der 
Wahl C &mdash; besonders bei Prozesssteueranwendungen, welche z.B. beom Pi die 
GPIO (general purpose input and output) für Sensoren und Aktoren nutzen. So
arbeiten wir und Andere mit gutem Erfolg. Siehe auch die
[Publikation](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services") 
oder das 
[SVN repo](https://weinert-automation.de/svn/rasProject_01/ "rasProject_0 (guest:guest)").
Erklecklichen Anteil am guten Gelingen hat die C-Bibliothek
[pigpio](http://abyz.me.uk/rpi/pigpio/index.html) von Joan N.N..

## Java auf dem Pi
Nichtsdestotrotz möchten manche auf dem Pi auch Java nutzen. Das ist an sich
kein Problem. Man kann ein Java&nbsp;8 auf einem Pi&nbsp;3 und sogar mit
[Frame4J](https://frame4j.de/index_en.html "project home") mit allen seinen 
Tools und APIs ergänzen.

Der Spaß mit Java hört &mdash; übrigens auf jeder Plattform &mdash; auf, wenn 
man Prozesssteuerung mit Java machen will. Um dies (d.h. auch die direkte 
Ansteuerung von Aktoren und Sensoren mit Java) auf dem Pi zu lernen portierte
ich aus
[rasProject_01](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services") ein C-Demoprogramm
[rdGnPiGpioDBlink.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/rdGnPiGpioDBlink.c "C GPIO demo").
"Überraschenderweise" wurde daraus ein [Projekt](https://github.com/a-weinert/weAut/), das immer noch wächst.

## Native (JNI) oder pure Java
Diese C-Pprogramm nutzt die Bibliothek
[pigpio](http://abyz.me.uk/rpi/pigpio/index.html) in der 
Dämon/Server Variante und das Linux/C Standardvorgehen mit Sperrdateien (lock
files; flock()), um einen exklusiven (singleton) Zugang zu Prozess-IO und dem
Pi-watchdog für Steuerprogramme zu gewährleisten. Hinzu kommt immer eine 
Abfahr-Routine (shutdown hook), welche die Ein- und Ausgabe in einem sicheren
Zustand hinterlässt. Das kleine Demo-Programm mit drei LEDs als Ausgabe zeigt
(außer dem watchdog) diese professionellen Ansätze. (Siehe hierzu Alles 
in der erwähnten 
[Publikation](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services")).
[rdGnPiGpioDBlink.c](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/rdGnPiGpioDBlink.c "C GPIO demo")
wurde mit all diesem Verhalten nach 
[rdGnPiGpioDBlink.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/RdGnJPiGpioDBlink.java "Java GPIO demo") portiert. 

Für die IO nutzt diese erste Portierung Neil Kolbans
[Bibliothek](https://github.com/nkolban/jpigpio "interface to pigpio[d]")
welche u.a. auch die Socket-Schnittstelle von  
[pigpio](http://abyz.me.uk/rpi/pigpio/sif.html "socket interface docu") 
benutzt. So haben wir alle Vorteile des
[Ansatzes](http://abyz.me.uk/rpi/pigpio/index.html "pigpio library")
von Joan N.N.. Andererseits enthält Neil Kolbans
[Bibliothek](https://github.com/nkolban/jpigpio "interface to pigpio[d]") 
auch eine JNI-Implementierung mit ihrer C-Schicht um die Nicht-Socket-Schnittstelle
von pigpiod; das macht es nicht übersichtlicher. Die Bibliothek versucht an 
keiner Stelle Wegwerfobjekte zu vermeiden.

Wegen dieser und anderer Gesichtspunkte wurde eine kompakte reine Java 
Lösung zum Anschluss an die pigpio[d] Socket-Schnittstelle begonnen. Die
wichtigen Basisfunktionen sind da und werden mit einem anderen Port von C
nach Java,
[RdGnPiGpioDBlink.java](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/RdGnPiGpioDBlink.java "compact pure Java"), demonstriert.

## Weiter Probleme mit Java GPIO und Prozesssteuerung
### Nicht kompatible Dateisperre
 
Ein unmittelbar zu lösendes Problem erschien im Lichte von Portieren "mit
allem Verhalten" bei der Linux-üblichen und ja schon eingesetzten 
Datei-Sperre (lock file, flock()) für den exklusiven Zugriff auf Prozess-IO 
und watchdog. Es stellte sich heraus, dass ein Java lock einer Datei als 
"random access file, fully and exclusively" mit java.nio.channels.FileLock
auf einer Linux-Plattform  inkompatibel zu dort etablierten Datei-Sperre mit
der Prozedur flock() ist. Mit flock() und FileLock bekommen alle C-Programme
eine Sperre auf eine Datei und alle Java-Anwendungen noch eine. 

Zwei volle Sperren auf ein und dieselbe Datei macht den Ansatz kaputt. Dies
kann man als einen Fehler der JDK/JRE-Portierung nach Linux sehen. Nicht nur
bei unseren Anwendungen ist das natürlich nicht akzeptabel. Bevor man 
Java-Ports echter Prozessanwendungen auf Linux loslässt.

Die kompatible Lösung sind zwei Methoden (openLock() and closeLock) in
[Frame4J: de.weAut.PiUtil](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/PiUtil.java "openLock() and closeLock()"), welche ein C-Hilfsprogramm
[justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c) nutzen. Wenn Sie 
dieses kleine Programm ([justLock](https://github.com/a-weinert/weAut/blob/master/rasProject_01part/justLock.c)) direkt starten und 
dann auch gleichzeitig die Java-Applikation 
[JustNotFLock](https://github.com/a-weinert/weAut/blob/master/frame4j_part/de/weAut/tests/JustNotFLock.java "de.weAut.tests.JustNotFLock (needs Frame4J installed") laufen lassen,
demonstriert dies die zweifache Sperre ein und derselben Datei.

## Repositorys

Finden Sie bitte die meisten Quellen im GitHub repository
[weAut](https://github.com/a-weinert/weAut/). Es spiegelt dieTeile der größeren
[SVN Entwicklungs-Repositorys](https://weinert-automation.de/svn/ "guest:guest"),
welche für dieses Projekt essentiell sind. Für Kommentare und Probleme
[dieses Projekts](https://github.com/a-weinert/weAut/) nutzen Sie bitte die
Kommentarfunktion dieses Beitrags, die übrigens ein "GitHub issue" ist.   
