---
layout: weAutPost
title: Web-Silbentrennung
bigTitle: Silbentrennung für Jekyll
permalink: /:title.html
categories: Jekyll html markdown hyhenation
lang: de
enPage: webHyphenation.html
copyrightYear: 2021
revision: 1
reviDate: 2021-07-16
date:  2021-07-16
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---
Die Leser von [Jekyll-Tricks](/twoJekyllTricks_de.html) und 
[Fort von Typo3](/leaveTypo3_de.html "Aus für Typo3") wissen, dass ich
ein engagierter Befür&shy;worter der statischen Generierung von Web-Bereichen
bin. Über zwölf Jahre habe ich statische Generierung von Web-Bereichen mit
[Frame4](https://frame4j.de/index.html "ein Java (8) framework")-Tools
betrieben. 2019 habe ich meine sowie die mir anvertrauten
Web-Bereiche auf Jekyll (/Liquid) umgestellt.

## Silbentrennung

Eine großzügige Dosis von von bedingten -- oder "weichen" (soft) --
Trennstrichen (<code>"&amp;shy;"</code>) kann das Erscheinungsbild  eines
Webbereichs sehr verbessern insbesondere bei variablen Abmessungen und 
abschaltbaren Menus. Andererseits ist das Einbringen der von "&amp;shy;s"
mühselig und fehlerträchtig, und es beeinträchtigt die Lesbarkeit für
Entwickler und Autoren. Ein bisschen Werkzeugunterstützung und Automatismen
wären willkommen. 

Aber die Silbentrennung ist leider für viele Werkzeuge und Editoren ein
eher düsteres Kapitel -- und das oft selbst dann, wenn die Sprache
bloß Englisch ist. Jekyll mach da keine Ausnahme.    
Diese Beitrag zeigt ein Werkzeug, mit dem man die (markdown) Texte und 
(html) layouts mit bedingten ("weichen" &amp;shy;) Trennstrichen versehen
oder diese wieder entfernen kann.

Man benötigt lediglich ein aktuelles (implementation version >= 1.21.06)
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework"), am besten
als "installed extension" unter Java8 sowie eine Definitionsdatei der
gewünschten Trennungen in einer einfachen Syntax gemäß
[dieses Beispiels](https://weinert-automation.de/software/jekyll/hyphDef_de.txt),
passend zu Sprache und Themenbereichen Ihrer Texte.

Für alles Folgende brauchen Sie nur die Applikation
[de.frame4j.FuR](https://weinert-automation.de/java/docs/frame4j/de/frame4j/FuR.html).   
Falls Sie diese mit einem der folgenden Kommandos zum Angucken der Hilfe
starten können, haben Sie es.

```bash
java de.frame4j.FuR -help -de # show help in German (de)
java FuR -help -de # show help with comfort starter in English

```

## Die Trennungsdatei

Der Auszug aus der oben erwähnten Beispieldatei zeigt die
"ein Wort pro Zeile mit der gewünschten bedingten Trennung"-Grammatik:

```markdown
---
# Definitions for [de-]hyphenation by de.frame4j.FuR

# A collection for German language for markdown texts and 
# Jekyll web layouts. This file's encoding is UTF-8.
# Copyright  2021  Albrecht Weinert     a-weinert.de
# $Revision: 58 $ # $Date: 2021-07-08 $)
---
Aus&shy;bil&shy;dungs&shy;tag
Aus&shy;dauer
aus&shy;ge&shy;nom&shy;men
Be&shy;rufs&shy;wahl&shy;messe
Blu&shy;men&shy;ge&shy;stecke
dem&shy;sel&shy;ben
elek&shy;tro&shy;ni&shy;sches
Ent&shy;scheidungen
ent&shy;wor&shy;fen
er&shy;hielt
Er&shy;zie&shy;hungs&shy;be&shy;rech&shy;tigte
...   und so weiter und so fort
```

Für eine bessere Lesbarkeit -- und um die Datei der Germanistin Ihres
Vertrauens zur Korrektur zu geben -- nutzen Sie das Tool FuR um 
<code>&amp;shy;</code> durch <code>-</code> zu ersetzen.

```bash
D:\eclips...>java FuR hyphDef_de.txt -omitFrntM  "&shy;" "-"
  D:\eclipse18-09WS\web-hansibo\factory\hyphDef_de.txt
  157 occurrences of search texts
```

Der erste Parameter benennt die (in diesem Fall einzige) zu bearbeitende
Datei. Die Option <code>-omitFrntM</code> sagt "Lass die Finger vom
sog. front matter", während der zweite und dritte Parameter das 
Suchmuster und und seinen Ersatz definieren. Das Ergebnis ist

```markdown
---
# Definitions for [de-]hyphenation by de.frame4j.FuR

# A collection for German language for markdown texts and 
# Jekyll web layouts. This file's encoding is UTF-8.
# Copyright  2021  Albrecht Weinert     a-weinert.de
# $Revision: 58 $ # $Date: 2021-07-08 $)
---
Aus-bil-dungs-tag
Aus-dauer
aus-ge-nom-men
Be-rufs-wahl-messe
Blu-men-ge-stecke
dem-sel-ben
elek-tro-ni-sches
Ent-scheidungen
ent-wor-fen
er-hielt
Er-zie-hungs-be-rech-tigte
...   und so weiter und so fort
```

Nach der in dieser Form durchgeführten Schlussredaktion vergessen Sie nicht 
die fürs Einfügen und Entfernen von bedingten Trennungen verwendbare From
wieder herzustellen:

```bash
D:\eclips...>java FuR hyphDef_de.txt -omitFrntM  "-" "&shy;"
  D:\eclipse18-09WS\web-hansibo\factory\hyphDef_de.txt
  157 occurrences of search texts
```
Außer der Vertauschung von Suchmuster und Ersatz ist es dasselbe Kommando
wie eben. Nur so herum wird die Option <code>-omitFrntM</code> wichtig, da
man sonst die Kommentare am Anfang verdirbt.


## Das Trennen von Jekylls markdown Quelltexten

Um einen von Jekyll generierten Web-Bereich mit bedingten Trennungen zu 
versehen, geht man am besten in's Wurzelverzeichnis der betreffenden Quellen
mit beispielsweise   
 &nbsp; &nbsp;<code>  cd /D D:\eclipse18-09WS\web-hansibo\hansiboDE </code>
   
In einem realistischen Beispiel würden wir zu allen Texten (Erweiterung
.md für markdown) ebenso wie zu allen Liquid templates (Erweiterung
.html oder .htm)  bedingte Trennungen zufügen. Wir möchten dies auch in 
allen Unterverzeichnissen tun, aber die Verzeichnisse
<code>.jekyll-cache</code>, <code>_data</code> and <code>_site</code>
und deren Unterverzeichnisse ausschließen.

### Schritt 0: Alle bisherigen &amp;shy;s entfernen

Bevor wir &amp;shy;s gemäß unserer Definitionsdatei einfügen, mag man meist
das bisher "Handgemachte" entfernen. Im erwähnten Wurzelverzeichnis der 
der Jekyll-Quellen macht     
 &nbsp; &nbsp;<code> java FuR -r .md;.html;.htm -filUTF8 -OmitDirs _site;.jekyll-cache;_data -omitFrntM </code>&amp;shy<code>;" -v</code>  
genau das.   
<code>FuR : </code> Die beliebtesten / am meisten genutzten
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework")-Tools 
haben eine Start-Applikation im unbenannten Verzeichnis. <code>FuR</code>
delegiert schlicht und einfach an 
[de.frame4j.FuR](https://weinert-automation.de/java/docs/frame4j/de/frame4j/FuR.html).   
<code>-r .md;.html;.htm -filUTF8 : </code> Rekursiv (vom aktuellen
Verzeichnis aus) besuche alle Dateien mit den gegebenen Endungen (Typen)
und nimm als deren Textkodierung UTF-8 an.
<code>-OmitDirs _site;.jekyll-cache;_data : </code> Beim Besuchen des (Unter-)
Verzeichnisbaums (bei . beginnend) lass die benannten Verzeichnisse und
ihre Kinder aus.
<code>-omitFrntM : </code> In den besuchten Textdateien ändere nichts an einem 
ggf. "front matter" im Laufe des Findens und Ersetzens.    
<code>"&amp;shy;" </code> (und kein weiterer Parameter): Suche das Muster
<code>&amp;shy;</code> und ersetze es durch nichts.
<code>-v: </code> Ausführlichere Ausgaben (optional).

### Schritt 1: Trennungen gemäß der Definitionsdatei

Unter Verwendung derselben Kriterien für Dateien und Verzeichnisse wie im 
Beispiel "Schritt 0" ist der Befehl hierfür:    
 &nbsp; &nbsp;<code> java FuR -r .md;.html;.htm -filUTF8 -OmitDirs _site;.jekyll-cache;_data -omitFrntM -hyphen ..\factory\hyphDef_de.txt</code>

<code>-hyphen ..\factory\hyphDef_de.txt </code> trenne alle betreffenden
Dateien bzw. Texte gemäß den Definitionen der nach der option genannten
Datei (<code>hyphDef_de.txt</code im Beispiel)..   
alle anderen Optionen und Parameter: Wie für den "Schritt 0" erklärt.

Technisch gesehen erzeugt jede Zeile in der "Trennungsdatei" ein Suchmuster
(jeweils ohne die <code>&amp;shy;</code>s) und einen Ersatztext (mit ihnen).
dann laufen im weitesten Sinne die gleichen Vorgänge ab, als hätte man mit
einer gesonderten .properties-Datei viele "Finde und ersetze"-Definitionen
vorgegeben -- was über viele Jahre FuR's Hauptbeschäftigung auf einigen
Servern war.

Anm. 1: Zur Zeit  (19.07.2021) sind so bis 1024 Trennungsdefinitionen 
möglich. (Könnte erhöht werden.)    
Anm. 2: Diese früheren und neuen Aufgaben mit n Mustern * m Dateien, wobei
diese Zahlen in der Größenordnung 100 bzw. 1000 (und mehr) liegen, würden mit
Javas String-Suche nicht so gut laufen. Wie auch andere
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework")-Tools 
nutzt auch
[de.frame4j.FuR](https://weinert-automation.de/java/docs/frame4j/de/frame4j/FuR.html)
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework")s
Implementierung der Rabin-Karp-Algorithmen. Rabin-Karp bringt die Suche 
eines Sub-Texts in einem String von O(t*s) (naive String.indexOf()
und Konsorten) auf deutlich weniger als O(t), wobei t die Länge des Texts
und s die Länge des zu findenden Teiltexts  ist.
Anm. 3 : Schritt 1 ist der wichtigste Vorgang -- hierfür wurde diese
Erweiterung gemacht.  Wir generieren Web-Bereich auf einem SVN-Server mit
Jekyll im post commit hook und verbreiten (deploy) sie dann (mit FTP) zum
jeweiligen Web-Server. Dieser "Schritt 1" wird Teil dieser post commit hooks
werden.

### Schritt 2: Die Trennungen (wieder) beseitigen

Mit einem ganz ähnlichen Kommando wie in "Schritt 1" kann FuR genau die dort
applizierten Trennungen entfernen:     
 &nbsp; &nbsp;<code> java FuR -r .md;.html;.htm -filUTF8 -OmitDirs _site;.jekyll-cache;_data -omitFrntM -dehyphen ..\factory\hyphDef_de.txt</code>

<code>-dehyphen ..\factory\hyphDef_de.txt </code> beseitige die in der nach
Option genannten Trennungsdatei (<code>hyphDef_de.txt</code>) definierten
Trennungen.  
Alle anderen Optionen und Parameter: Wie in "Schritt 0" erklärt.

Das Anwenden von "Schritt 1" und dann das Anwenden von "Schritt 2" auf
einen von vornherein (oder nach "Schritt 0") "trennungslosen" Satz von
Dateien / Texten sollte diesen in den ursprünglichen
Zustand zurück versetzen. Oder mit anderen Worten: die eine Operation ist
die Inverse der anderen.   

Anm. 4: Seien Sie sich gewisser "Abschattungseffekte" bewusst, insbesondere 
bei Wortverbindungen, wie runter, gekommen und runtergekommen, deren
Trennungen beispielsweise so definiert würden:
```markdown
run&shy;ter&shy;ge&shy;kom&shy;en
run&shy;ter
ge&shy;kom&shy;en
kom&shy;en
```
Wenn Sie hier die Reihenfolge ändern und beispielsweise
<code>"kom&amp;shy;men"</code> nach vorne setzten, würde dies alle weiteren
Trennungen bei <code>"gekommen"</code> und
<code>"runtergekommen"</code> verhindern.    
Anm. 5: Weil 
[de.frame4j.FuR](https://weinert-automation.de/java/docs/frame4j/de/frame4j/FuR.html)
die Reihenfolge der "Finden-und-ersetzen"-Aufträge
bei <code>-dehyphen</code> gegenüber derjenigen bei <code>-hyphen</code>
umkehrt, sollte die "inverse Operationen"-Eigenschaft zugesichert sein.   
Anm. 6: Wenn Sie "[Trennungsdateien](#die-trennungsdatei)" schreiben oder 
bearbeiten, haben Sie immer <code>-hyphen</code> auf dem Schirm.
Daumenregel: Zusammensetzungen und durch Vor- oder Nachsilben verlängerte
Worte nach vorn.   
Mathematische Frage an die schlauen Leser: Wäre ein Sortieren der
Trennungsdatei nach Wortlänge -- ohne die <code>&amp;shs;</code>s genommen
-- hinreichend?

Glückliche (automatische) Trennung

