---
layout: weAutPost
title: Jekyll-Tricks
bigTitle: Zwei Jekyll-Tricks
permalink: /:title.html
categories: Typo3 Markdown Jekyll php Apache
lang: de
enPage: twoJekyllTricks.html
copyrightYear: 2020
revision: 2
reviDate: 2021-08-16
date:   2020-12-29
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---
Meine 
[Schluss&shy;be&shy;mer&shy;kun&shy;gen](/leaveTypo3_de.html#dr-jekylls-site-generator "Dr. Jekyll's site generator")
in [Weg von Typo3](/leaveTypo3_de.html "Aus für Typo3") zeigen, dass ich
ein engagierter Befür&shy;worter der statischen Generierung von Web-Bereichen
bin. Diese sind schneller als jedes 
<abbr title="content management systems">CMS</abbr> und fühlen sich auch auf 
preiswerten Servern wohl, die kaum mehr als Apache<!--more--> 2.4 zu
bieten ha&shy;ben und die man viel&shy;leicht mit dutzenden an&shy;de&shy;ren Kunden teilt.

Mit dem direkten Bearbeiten der .html-Dateien kommt man natürlich nicht weit. 
Vielmehr wird man den Bereich aus übersichtlichen Textblöcken -- sozusagen
den Quelldateien -- zu&shy;sam&shy;men&shy;setzen bzw. mit Tools bereits auf
dem Entwicklungsrechner generieren lassen, am Besten mit Test und Vorschau.
    
Idealerweise läuft der selbe Generator auch auf dem Server des
Versions&shy;verwaltungs&shy;systems für besagte Quell&shy;dateien. Im Fall von 
<abbr title="Subversion">SVN</abbr> würde ein post commit*) hook den 
Bereich neu generieren und geänderte Inhalte zum Web-Server**)
transferieren.    
<small>Anm. *):&nbsp; Bei GIT wäre das ein "post push hook".
<br />Anm. **): Der SVN server und der (Apache) Web-Server müssen nicht 
auf derselben Maschine sein, um diesen Komfort für Web-Autoren zu
ermöglichen.</small>

Über zwölf Jahre habe ich statische Generierung von Web-Bereichen mit
[Frame4](https://frame4j.de/index.html "ein Java (8) framework")-Tools
betrieben. Von 2019 bis heute habe ich meine so&shy;wie die mir an&shy;ver&shy;trau&shy;ten
Web-Bereiche auf Jekyll/Liquid umgestellt.


## Eine kleine Dosis PHP -- Trick Nr. 1

Bei allen Vorzügen statisch generierten Web-Bereiche Despite gegenüber
dynamisch auf dem Web-Server mit PHP (jedenfalls meist, selten mit Java)
und <abbr title="Datenbanksystemen">DBS</abbr> braucht man doch mal
Informationen vom Web-Server. Ein Bei&shy;spiel ist die Anzeige des (Konto-)
Namens eines eingeloggten Nutzers. Dies ist mit PHP auf dem Server trivial
aber wohl (fast?) unmöglich mit einem client-seitigen Pro&shy;gramm 
(i.a. JavaScript).

Obgleich Jekyll gar nichts von PHP weiß, können wir ein bisschen PHP im
Markdown einer Seite unterbringen und Jekyll veranlassen, sie als .php statt
als .html zu erzeugen.
[Exzerpt](https://weinert-automation.de/software/jekyll/index_en.md "Sehen Sie die ganze Datei index_en.md"):

```markdown
---
layout: weAutSimple
.....
headline: Users and Accounts
permalink: userInfo/index_en.php # for production
# permalink: userInfo/index_en.html # to test appearance
copyrightYear: 2020
---
-(%- include referenceLinks.txt %}-(%- raw %}
<?php $user_account = $_SERVER['REMOTE_USER']; ?>-(% endraw %}
Some of our informations and [services][enServer] require 
authentication. If you read this, you've successfully logged
in with the weinert-automation.de (domain) account
<b>-(% raw %)<?php  echo($user_account);?>-(% endraw %)}</b>.
...
```

<small>Note: Ersetzen Sie -( durch {. Wegen eines Bugs führt
Jekyll Anweisungen in einem Markdown-Kodebeispiel aus
anstatt dieses (hier) lediglich darzustellen.</small>  

Wie das 
[Exzerpt](https://weinert-automation.de/software/jekyll/index_en.md "Sehen Sie die ganze Datei index_en.md")
zeigt
 - injiziert man ein bisschen PHP mit einem Paar raw/endraw tags und
 - befiehlt das Erzeugen von .php statt
   .html mit permalink im "front matter".    
   permalink funktioniert auch für "normale" Seiten und nicht nur für
   Beiträge bzw. posts.
   
Das Ergebnis können Sie auf 
[weinert-automation.de/userInfo/index_en.php](https://weinert-automation.de/userInfo/index_en.php "Users and Accounts")
sehen, wenn Sie sich mit guest:guest ein&shy;loggen. Der 
Jekyll-Entwicklungs-Web-Server zeigt allerdings keine .php-Seiten an. So was
muss dann letztlich auf dem "echten" Web-Server getestet wer&shy;den.

Diesen Trick Nr. 1 habe ich nicht erfunden sondern ziemlich häufig ge&shy;funden.
Vermisst (und versucht hier zu ergänzen) habe ich eine vollständige
Dar&shy;stel&shy;lung der wesentlichen Punkte.   

Anmerkung Juli 2021: Nach über einjähriger Verwendung funktioniert Trick
Nr.&nbsp;1 ohne er&shy;kenn&shy;baren Grund nicht mehr. Bei Jekyll ist "raw" nicht mehr
"roh = exakt wie es ist". Zwischen 'raw' und 'endraw' wer&shy;den nun < und >
durch &amp;lt; und &amp;gt; ersetzt, was PHP-Anweisungen zu an&shy;ge&shy;zeig&shy;tem
Text macht.   
Die Rettung für obige Anwendung: PHP kommt ins template und setzt
dort 'REMOTE_USER' als Text in ein verstecktes 'span', von wo es mit
JavaScript ins Ziel (ein 'span' im markdown-Text) getragen wird. Funktioniert
-- ist aber äußerst hässlich.

Aber den Trick Nr. 2 habe ich erfunden und in der Kette Entwicklungs-PC 
Web-Server anwendungsreif gemacht. Nun, bestimmt bin ich doch nicht der
Erste, aber ge&shy;funden habe ich zu die&shy;sem Ansatz bis jetzt
(22.12.2020) nichts.

## Apaches "fancy indexing" mit Kopf und Fuß -- Trick Nr. 2

Der Apache Web-Server kann wirklich hübsche "fancy" Verzeichnislisten
generieren
 - für Verzeichnisse, für die man dies ausdrücklich mit   
   Options +Indexes or Options +FancyIndexing z.B. erlaubt und 
 - wenn das betreffende Verzeichnis keine im DirectoryIndex aufgeführte
   Datei enthält; üblicherweise sind dies index.html, index.htm und index.php.
   
Für ein besonders hübsches listing mit Zusatzinformationen kann man noch zwei
HTML-Fragmente liefern, welche vor und hinter die von Apache generierte 
Verzeichnistabelle gesetzt wer&shy;den. Diese wer&shy;den
 - mit den Optionen HeaderName und ReadmeName konfiguriert und
 - und hier durchgehend pub-header.htm und pub-footer.htm genannt.
 
Diese Fragmente pub-header.htm und pub-footer.htm können in den 
betreffenden Verzeichnissen gehalten und gepflegt wer&shy;den.
Freundlicherweise kopiert Jekyll diese nach _site, von wo sie der der
Aus&shy;lie&shy;fe&shy;rungs&shy;pro&shy;zess (das deployment) zum echten
Web-Server bringt.  
Soweit also kein Problem. Ansonsten aber ist das Halten und Hüten von
pub-header.htm und pub-footer.htm ein ziemliches Ärgernis:

 1. Ein Eclipse mit HTML-Kenntnissen wird beide Dateien wegen vieler Fehler
    rot einfärben. Schließlich ha&shy;ben sie (notwendigerweise) einen ganzen
    Haufen nicht geschlossener bzw. ungeöffneter tags. Die Fülle falscher 
    Fehler macht letztlich die Syntaxprüfung von Eclipse nutzlos.
 2. Während der Ent&shy;wick&shy;lung kann man das Erscheinungsbild dieser Dateien 
    nicht prüfen, da Jekylls Testserver wie gesagt keine Verzeichnislisten
    macht.
 3. Partner und Kunden, die man mit Jekyll und Markdown vertraut gemacht
    hat, könnten diese -- nie zu sehenden -- HTML-Fragmente verwirren.
 4. Diese pub-header.htm und pub-footer.htm enthalten eine Menge wiederholten
    Kodes, was der Philosophie der statischen Bereichsgenerierung 
    zuwiderläuft.
    
Die Idee bzw. der Trick zum Heilen dieser Situa&shy;tion ist an sich ein&shy;fach -- 
mit allerdings teilweise ziemlichen Schwierigkeiten in der
durchgehenden Realisierung:

 1. Von jedem zusammengehörigen Paar pub-header.htm und pub-footer.htm 
    machen Sie eine index.htm -- nicht .html wie all die an&shy;de&shy;ren.    
    Vorteil: Eclipse ist glücklich und der Testserver von Jekyll zeigt sie
    (ohne die Verzeichnistabelle).
 2. Finden Sie nun die Gemeinsamkeiten und mit Liquid leicht handhabbaren 
    Unterschiede und erstellen ein passendes layout file. Da alle Ihre
    Verzeichnislisten ähnlich aussehen sollten müsste ein layout file 
    genügen, in meinem Falle
    [_layouts/weAutDirHF.htm](https://weinert-automation.de/software/jekyll/weAutDirHF.htm.txt).
 3. An der Vereinigungs- bzw. Trennstelle der vorherigen pub-header.htm und
    pub-footer.htm fügen Sie eine Zeile mit nur einem ganz bestimmten
    HTML-Kommentar ein:    
    ```<!-- Apache 2 fancy directory index -->``` 
 4. Nun machen Sie aus allen übrig gebliebenen pub-header.htm und 
    pub-footer.htm oder index.htm ein index.md, welches sich auf das gerade
    erstellte Layout (weAutDirHF.htm) bezieht.
 5. Lassen Sie diese index.md zu index.htm generieren -- nicht zu .html
    wie alle Übrigen.
 6. Nur bei der Aus&shy;lie&shy;fe&shy;rung (dem deployment) zerlegen Sie alle Dateien
    index.htm an besagter HTML-Kommentarzeile in pub-header.htm
    und pub-footer.htm.
    
Diese Zerlegung geht so 
```
  csplit index.htm "/^<small>listing generated by/"
  mv xx00 pub-header.htm
  mv xx01 pub-footer.htm
 ```
auf einer Linux-Maschine (Web-Server) und der Windows-Workstation
(Entwicklung). 
csplit ist ein Linux-Tools. Auch auf Windows ha&shy;ben Sie es (und vieles 
andere), falls Sie WinRaspi, WinAVR oder dergleichen installiert ha&shy;ben und
deren Werkzeuge im "PATH".     
Alle weiteren Details mögen sich aus den (echten, so verwendeten) 
[Bei&shy;spieldateien](https://weinert-automation.de/software/jekyll/) 
erschließen.

## Silbentrennung

Dies ist für viele Werkzeuge und Editoren ein düsteres Kapitel, selbst wenn
die Sprache bloß Englisch ist. Jekyll mach da keine Ausnahme.    
Ein anderer [Beitrag](/webHyphenation_de.html) zeigt ein Werkzeug, mit dem man
die (markdown) Texte und 
(html) layouts mit bedingten ("weichen" &amp;shy;) Trennstrichen versehen
oder diese wieder entfernen kann.   
Insofern ist dies kein (dritter) Jekyll-Trick, sondern der gezielte Einsatz
eines Werkzeugs im Entwicklungs- und Aus&shy;lie&shy;fe&shy;rungs&shy;pro&shy;zess. 
