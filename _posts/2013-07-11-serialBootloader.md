---
layout: weAutPost
title: A serial bootloader for weAut_01, ArduinoMega and akin
bigTitle: serial bootloader
date:   2013-07-11
categories: serial bootloader AVR ATmega
lang: en
dePage: ./serialBootloader_de.html 
copyrightYear: 2013
revision: 13
reviDate: 2019-04-14
itemtype: "http://schema.org/BlogPosting"
isPost: true
---

This is an AVR ATmega development report on a serial bootloader for 
ATmega1284P, ATmega328P and ATmega2560 based systems. The advantages of this bootloader are:

- No (more) need for extra programming hardware
- Using a standard communication link, often used anyway in normal operation
- Using a standard programming protocol (AVR109)
- Utilising the standard professional tool chain
- Good integration / co-operation with system / application software
- Available without fee, open source
- Kind of ArduinoMega’s “jail break” – Free Arduino!


### Development report on an AVR109 bootloader — Table of content
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

The report also gives some background on ATmega architecture, bootloader, 
avr-gcc, bootloader linking and on some common errors and problems. One of 
those problems, well known with Arduinos and serial bootloaders, is the 
dreaded: 
```powershell
avrdude: error: programmer did not respond to command: set addr
```
Read the report at [AVRserBootl.pdf](https://a-weinert.de/pub/AVRserBootl.pdf "full paper") (on
[a-weinert.de/p...](https://a-weinert.de/publication_en.html "some of Albrecht's publications") 
/ [pub/](https://a-weinert.de/pub/ "publications download")).