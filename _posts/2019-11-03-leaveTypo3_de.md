---
layout: weAutPost
title: Weg von Typo3
bigTitle: Aus für Typo3
permalink: /:title.html
date:   2020-10-04
categories: WWW CSM Typo3 Markdown Jekyll
lang: de
enPage: leaveTypo3.html
copyrightYear: 2019
revision: 4
reviDate: 2020-10-06
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---

Typo3 ist ein weit verbreitetes sehr mächtiges content management system 
(CMS). Es umfasst Nutzer&shy;ver&shy;waltung, front end<!--more--> und back end und
es gibt den Seiten&shy;autoren design und layout-Regeln vor. Alles
wird auf dem Sever
in einer Datenbank gehalten. Daneben ist PHP und ein Webserver (z.B. Apache)
erforder&shy;lich, auf dem man gewisse
Kon&shy;fi&shy;gurations&shy;frei&shy;heiten benötigt.

Die Vorzüge von Typo3 sind gut dokumentiert. Insbesondere wird darauf 
abgehoben, dass eine breite Autorenschaft ohne jegliche Kenntnisse in 
Web-Techniken und -Sprachen (HTML, CSS, JS usw.) eingebunden werden kann.

## Warum sollte jemand von Typo3 weg wollen?

Bei aller berichteten Beliebtheit gibt es doch Fälle, in denen die Nutzer
Typo3 nicht mehr wollen. Die Hauptgründe sind meist
 - zu wenig Freiheiten durch das enge Korsett der vom Admin/Programmierer
   vorgegebenen Designs oder Layouts. So bekommt man beispielsweise 
   sachlich unpassende Navigationsspalten nicht weg oder kann keine
   Mehrsprachigkeit bieten, wenn das nicht "vorgekaut" ist.
 - keine Testvorschau
 - keine Versionsverwaltung (die den Namen verdient)
 - Die Seitenautoren kommen mit dem back end einfach nicht klar.
 
Der letzte und häufigste Wechselgrund mag erstaunen, da die
voraus&shy;setzungs&shy;lose Simpli&shy;zität beim Schreiben meist der
eigent&shy;liche Grund oder Vor&shy;wand zum Einführen von Typo3 war. 
Tat&shy;sächlich lässt sich das back end
so frei konfigurieren bzw. programmieren, dass man kaum zwei Installationen 
mit gleichem back end- / Editor-Verhalten findet.

Deshalb gib es zwar dicke und gute Lehrbücher für Typo3-Admins / 
-Programmierer aber nichts Vergleichbares für die Web-Autoren. Stattdessen 
gibt es in manchen Institutionen nach Typo3-Einführung mehrteilige 
Schulungen, deren Umfang auch für einem HTML-CSS-Grundkurs gereicht hätte,
womit man dann etwas Allgemeines und mit Lehrbüchern gut unterstütztes 
gelernt hätte. 

Bei Institutionen kommt oft noch hinzu, dass man wegen der Komplikation der
Typo3-Einrichtung und -Administration hierzu einen externen Dienstleister
genommen hat. Dies kann auf Dauer zu zusätzlichen Problemen mit Kosten,
Zuständigkeiten und Totzeiten führen.

## Weg, aber wohin?

Wenn man wirklich weg will ist das Wohin die schwierigste Frage. Für die 
gegebenen Verhältnisse und Mitspieler muss die neue Lösung ja besser im Sinne
von nicht mehr problematisch sein. Die Möglichkeiten sind
 1. anderes neu aufgesetztes CSM (mit PHP, Datenbank und back end)
 2. direkt oder mit leichter tool-Unterstützung erstelltes HTML (CSS, JS)
 3. statische site Generierung aus einfachen Sprachen, z.B. aus Markdown
 
Ziel 1, also wieder CMS,  egal ob neues Typo3, Wordpress oder Ähnliches ist
nach hinreichendem Leidensdruck i.A. "verbrannt" und soll hier nicht weiter 
betrachtet werden. Wenn doch, muss man dringend Konvertierungs- bzw. Export-
und Import-tools klären -- es sei denn der Web-Bereich ist winzig und man 
will Alles von Null an neu machen.

Ziel 2 ist direktes Pflegen von statischem HTML, CSS und JS. Mit geeigneten
tools, Syntax&shy;unterstützung und Versions&shy;verwaltung (Eclipse
und SVN z.B.) 
kann man allein oder in kleinen Teams erstaunlich gut arbeiten.

Vor Allem, wenn Autoren Inhalte (fast) ohne HTML-Kontakt bereitstellen und
pflegen sollen, wird man das Ziel 3, d.h. statische site Generierung, z.B.
mit Jekyll aus Markdown, anstreben. Der beste Weg dorthin führt aber über 
einen vollständigen, konsistenten, d.h. i.A. reparierten statischen 
Web-Auftritt. 

Ziel 3 bedingt also meist Ziel 2, wenn auch nicht mit der dann fortgesetzten
Pflege in HTML etc.  
  
## Go static -- Ziel 2

Wenn man den kompletten betreffenden Web-Auftritt als statisches HTML hat 
und (via FTP) auf dem selben Server unter derselben domain bereit stellt,
ist man Typo3 (und Datenbank und PHP) los und die Besucher merken nichts --
außer vielleicht besserer performance.

Für ein komplettes statisches Abbild des Bereichs auf der 
Entwicklungs-workstation benötigt man glücklicherweise keine Konvertierungs-
tools oder Daten&shy;bank&shy;zu&shy;griffe; lediglich der
Web&shy;auf&shy;tritt (mit http[s]) muss
laufen. Man installiert sich das freie Tool WinHTTrack.exe -- z.Z Version
3.49-2 -- und lässt es laufen. Wichtig sind die Einstellungen 
 - Local structure: site structure
 - rewrite links: Relative URI / Absolute URI
 - Verbote in robots.txt ignorieren
 
Das Ergebnis sollte mit einer file://-URL lokal laufen -- hoppla wir haben
eine lokale Testvorschau -- und nach Hochladen
auf den Server ist man, wie gesagt, fertig. Eigentlich.

Bei näherem Hinsehen erweist sich der von Typo3 als Ganzes gelieferte 
Bereich in den meisten Fällen als riesiges Durcheinander mit schrecklicher 
Verzeichnisstruktur, furchtbaren Dateinamen und ganz viel Überflüssigem. Dies 
sollte man mit einem entsprechenden Eclipse (bulk search and replace) nach
und nach aufklären und "gerade ziehen". Das ist mühsam, lohnt sich aber in
vielerlei Hinsicht; insbesondere bekommt man eine Einsicht in Struktur und 
Aufbau des Auftritts. 

Wenn man dabei ist, sollte man style sheets, Skripte und grundlegende Bilder
in solchen Struktur (ab site root) ablegen.
```
├── assets
|   ├── css
|   ├── images
|   └── js
```
Dies entspricht den Gepflogenheiten bei Jekyll.

## Dr. Jekylls markdown

Jetzt kann man relativ einfach zur Generierung eines statischen Web-Auftritts
mit markdown und Jekyll übergehen. Hintergründe und Installation sind gut 
dokumentiert und leicht zu finden. Wenn man Github server pages verwendet --
vielleicht auch für einen blog wie diesen -- hat man das eh schon. 

Das Ganze funktioniert auch ohne Github und ohne Blog. Und mit das Beste 
daran ist die Vorschau-Funktion.

Der Übergang ist einfach und fließend zu gestalten, weil Jekyll

 &nbsp; a) alles statisch vorhandene einfach 1:1 kopiert und <br />
 &nbsp; b) eine syntaktisch korrekte .html-Seite ein syntaktisch richtiges
    Template (in Jekylls template-Sprache Liquid) ist.
    
Ein solches template ist per se sinnlos, da es nur genau die eine Seite
generieren kann. Findet man aber n .html-Seiten, die bis auf Titel und einen 
Inhaltsblock gleich sind, macht man daraus recht leicht 1 Template und n 
.md- (markdown) Dateien. Wenn man das beherrscht, ist das Eis gebrochen.

## Dr. Jekyll's site generator

Der Befehl   
``` 
  jekyll serve              oder  
  bundle exec jekyll serve  
 ```
(in Abhängigkeit von der Installation) erzeugt die statische web site im 
Verzeichnis _site. Von da kann man es mit Jekylls eingebautem Web-Server
unter     
&nbsp; &nbsp; http://127.0.0.1:4000/
anschauen. Jedwede Änderung bei templates, assets oder markdown regeneriert
automatisch die web site im Directory _site.

Das ist wirkliche lokale Vorschau. Und bei Zufriedenheit lädt man 
einfach den generierten Inhalt von _site zum richtigen Web-Server. Bei
Github server pages genügt commit und push, denn Githubs eingebautes Jekyll
erledigt die selbe Generierung auf dem Server. Aber, wie gesagt, das Ganze 
funktioniert auch ohne Github mit jedem Web-Server auf den man Dateien laden
kann.
 