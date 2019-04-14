---
layout: weAutPost
title: Deutsches Wörterbuch für Eclipse
bigTitle: eclipse dictionary
date:   2013-08-05
categories: eclipse German dictionary Wörterbuch Deutsch
lang: de
enPage: ./eclipDic.html 
copyrightYear: 2013
revision: 12
reviDate: 2019-04-14
itemtype: "http://schema.org/BlogPosting"
isPost: true
---

Wer nicht nur Englisch schreibt sondern auch viele deutsche Texte in JavaDoc-
oder Doxygen-Kommentaren sowie in seinem XML und HTML hat, wird von Eclipses Rechschreibhilfe oft eher gestört. Hier gibt es nun speziell für Entwickler
ein Wörterbuch mit etwa 24.600 deutschen Wortformen, das vor allem auch
Fachbegriffe aus Java, OO und (Leit-) Technik enthält.


### Holen und Installieren
Download: [weinert-automation.de/software/eclipse/de_DE.dic](https://weinert-automation.de/software/eclipse/de_DE.dic).<br />
Speichern am besten unter: `C:\Programme\eclipse\dropins`

Installiert in Eclipse wird es einfach als “User defined directory” unter: `Window>Preferences>General>Editors>Texteditors>spelling`.

Hinweis: Eclipse verlangt (vermutlich) Schreibrechte für seinen Benutzer
auf der Datei `C:\Programme\eclipse\dropins\de_DE.dic`. <br />
Unter Windows macht man die entsprechenden Einstellungen mit dem Explorer 
oder mit cacls in der shell. Unter Linux erreicht man das nötigenfalls 
sinngemäß so
```powershell
    sudo cp '/where/it/is/de_DE.dic' '/usr/lib/eclipse/dropins'
    sudo chmod 777 /usr/lib/eclipse/dropins/de_DE.dic
```
Hinweis 2: Da von allen Eclipse-Editoren die Rechtschreibprüfung beim „Text Editor“ am besten funktioniert, sollte man diesen ab und zu nutzen, falls das `.java, .xml, .php, .html`  oder was immer einen nennenswerten Anteil lesbaren Texts hat.

### Aufbau der Datei
Die hier verwendete einfachste Form einer von Eclipse nutzbaren 
.dic-Datei ist
- eine Wortform pro Zeile
- keine Wiederholungen auch nicht mit großem Anfangsbuchstaben <br />
  Wenn „wandern“ drin ist, akzeptiert Eclipse „Wandern“ sowieso. Folglich
  wird das [Frame4J](https://frame4j.de/index_en.html) tool 
  UCopy (option -eclipDic) die groß geschriebene Dublette rauswerfen.
- keine Punkte am Ende <br />
  Eclipse akzeptiert „etc.“ im Text nur mit einem .dic-Eintrag „etc“.
- keine Bindestrichworte <br />
  Eclipse prüft „Baden-Württemberg“ sowie so nur gegen die getrennten 
  Einträge „baden“ (auch ein Verb) und „Württemberg“.
- unsortiert <br />
  Eclipse scheint .dic-files beim Laden nach eigenem Ermessen zu sortieren.
  ( Andere Informationen?)<br />
  &nbsp; 
  
### Selbst modifizieren
 
Das Frame4J-Tool UCopy kann eine Textdatei mit Aufruf
```powershell
    java UCopy source.txt -eclipDic -v destination.dic
```
weitgehend in diese Form bringen, indem es
- die Worte in Zeilen separiert,
- einen nachlaufenden Punkt beseitigt,
- Einzelbuchstaben und Dubletten (auch solche die sich nur durch großen
  Anfangsbuchstaben unterscheiden) beseitigt sowie 
- Worte, die Ziffern oder ausschließlich Großbuchstaben enthalten, entfernt.

Dieses Tool erleichtert die Erstellung und Ergänzung einer solchen 
.dic-Datei erheblich: Ohne Rücksicht auf Zeilenstruktur und bereits
Vorhandenes ergänzt man beliebige korrekt (!) geschriebene Wortformen und 
lässt dann UCopy mit der -eclipdic Option darüber laufen.
