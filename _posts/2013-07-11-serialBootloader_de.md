---
layout: weAutPost
title: Ein serieller Bootloader für weAut_01, ArduinoMega &c
bigTitle: serieller bootloader
date:   2013-07-11
categories: serial bootloader AVR ATmega
lang: de
enPage: ./serialBootloader.html 
copyrightYear: 2013
revision: 12
reviDate: 2019-04-13
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare: serialBootloader.html
---

Dies ist ein Entwicklungsbericht über einen seriellen Bootlader für ATmega1284P, ATmega328P und ATmega2560 basierte Systeme. Seine Vorzüge sind:

- keine Programmierhardware mehr nötig
- Nutzung von Standardkommunikationsschnittstellen, welche für den normalen 
  Betrieb häufig sowieso verwendet werden
- Verwendung des verbreiteten Standardprotokolls AVR109 für 
  Programmiergeräte bzw. Bootlader
- Passend zu professionell üblicherweise genutzten Werkzeugketten
- Gute Integration bzw. gutes Zusammenwirken mit der System- und
  Anwendungssoftware
- Ohne Lizenzgebühren, open source
- Befreit den Arduino — ArduinoMega’s “jail break”

### Development report on an AVR109 bootloader — Inhalt
1. Motivation<br />
   1.1   Solution and targets<br />
   1.2   Advantages
2. Targets<br />
   2.1   Modules<br />
   2.2   Controllers
3. Bootloader operation<br />
   3.1   Entering and leaving<br />
   3.2   Features and limitations
4. Bootloader integration<br />
   4.1  Initialisation and services<br />
   4.2   Using bootloader functions and variables in the application
5.   Resume
6.   Abbreviations
7.   References

Der Entwicklungsbericht bringt auch einige Hintergrundinformationen über die ATmega-Architektur, Bootlader, avr-gcc, Linker und Bootlader sowie über einige häufig zu erlebende Fehler und Probleme. Ein beispielhaftes solches Problem, das gerne bei Arduinos und seriellen Bootladern auftaucht, ist das gefürchtete: 
```powershell
avrdude: error: programmer did not respond to command: set addr
```
Lesen Sie den report als [AVRserBootl.pdf](https://a-weinert.de/pub/AVRserBootl.pdf "full paper") (auf
[a-weinert.de/p...](https://a-weinert.de/publication_en.html "einige Publikationen von  Albrecht Weinert") 
/ [pub/](https://a-weinert.de/pub/ "download")).