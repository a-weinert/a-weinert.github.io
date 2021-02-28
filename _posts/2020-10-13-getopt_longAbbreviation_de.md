---
layout: weAutPost
title: getopt_long akzeptiert Abkürzungen
bigTitle: abbreviation bug
permalink: /:title.html
date:   2020-10-13
categories: C GCC 
lang: de
enPage: getopt_longAbbreviation.html
copyrightYear: 2020
revision: 1
reviDate: 2021-02-28
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---
Gestern (13.10.2020) verdeutlichte ich eine eine Programmoption von 
```--DCF``` auf
[```--DCF77```](/dcf77decOnPi.html "Handling DCF77 AM signals with a Pi")
und musste 
feststellen, dass die vorherige immer noch ging.
Die C-Bibliotheksfunktion getopt_long akzeptiert also<!--more--> auch Abkürzungen.
Wenn Ihre  ```struct option```
(getopt.h) eine Option cons definiert wird diese
durch ```--cons --con --co```
getriggert aber nicht durch ```--c```.

Als alter [Entwickler](http://a-weinert.de/cv-pub.html) hochverfügbarer
und sicherer Automatisierungssysteme 
kam ich nicht umhin, meine Entdeckung als potentiell gefährlichen Bug
anzusehen. Stellen sie sich eine Option ```--scharfeMunition```
vor, für die auch das unschuldige ```--sc```
genügt.

## Das manual

[Hier](https://linux.die.net/man/3/getopt_long "man/3/getopt_long") kann
man lesen:  
"Long option names may be abbreviated if the abbreviation is unique or is
[not?] an exact match for some defined option."   

Wer also des Lesens fähig ist, muss dies also nicht "entdecken". Allerdings
ist nicht dokumentiert, dass eine Einbuchstabenabkürzung nicht reicht.

## Was Andere dazu sagen

Weiteres Lesen ergab, dass auch andere Kollegen das standardmäßige 
Akzeptieren solcher Abkürzungen als bug ansehen. Die Entwickler
von glibc wollten dies allerdings nie akzeptieren.

Gefundene Reparaturen:
 1. Dort wo auf die Option reagiert wird, hole man sich die triggernde Option
    oder Abkürzung mit ```argv[optind-1]```
    und vergleiche sie mit der nicht abgekürzten.
 2. Wechseln zu einer anderen Bibliothek und Funktion
    anstelle von ```getopt_long()```.
 
Gut solche Lösungen zu finden -- doch ich mochte beide nicht.   
Lösung **2** würde den gesamten vorhandenen Kode zur Handhabung der 
Startoptionen umwerfen. Und mit dem Verlassen des weitverbreiteten 
Ansatzes (getopt.h) würde man das Erkennen auf den ersten Blick durch die
sehr viele erfahrene Programmierer verlieren.   
Lösung **1** ist diesbezüglich OK. Aber sie trennt die Definition einer
Option in ```struct option```
vom Verbot, sie auch abgekürzt zu akzeptieren. Darüberhinaus muss man den
betreffenden String mit vorgesetzten Minuszeichen an der anderen Stelle
wiederholen. Und wenn man man beispielsweise eine Option
von ```besilent```
nach ```beSilent``` ändert, muss man an diese andere (entfernte) Stelle
denken. Auch versagt der (auf den ersten Blick einleuchtende Ansatz mit
"false positive"), falls ein Nutzer die Syntax ```--besilent=stupid``` 
verwendet.
      
## Meine Lösung 

Direkt hinter die Definition einer Option, die ich nicht abgekürzt haben 
mag, setze ich eine um ein oder auch mehrere Zeichen kürzere Pseudo-Option,
welche zur Hilfeausgabe (+Programmende) leitet.
Ein beispielhafter ```struct option```-Auszug zeigt das besser als
viele Worte:
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

