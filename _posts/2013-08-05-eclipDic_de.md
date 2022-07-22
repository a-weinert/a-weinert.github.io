---
layout: weAutPost
title: Deutsches Wörterbuch für Eclipse
bigTitle: eclipse dictionary
categories: eclipse German dictionary Wörterbuch Deutsch
lang: de
enPage: ./eclipDic.html 
copyrightYear: 2013
revision: 24
reviDate: 2022-04-07
date: 2020-10-06
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 1
commentShare: ./eclipDic.html
---
{% include referenceLinks.txt %}
Wer nicht nur Englisch schreibt sondern auch viele deutsche Texte in JavaDoc-
oder Doxygen-Kommentaren<!--more--> sowie in seinem XML und HTML hat,
wird von Eclipses
Rechtschreibhilfe oft eher gestört. Hier gibt es nun ein deutsches Wörterbuch
mit etwa 28.000 deutschen Wortformen, das neben der Alltagssprache vor allem
auch Fachbegriffe aus Java, OO und (Leit-) Technik enthält.

### Holen und Installieren
Download: [weinert-automation.de/software/eclipse/de_DE.dic](https://weinert-automation.de/software/eclipse/de_DE.dic).<br />
Speichern Sie es, wo Sie wollen, z.B. unter: `C:\util\eclipse\dropins`

Installiert in Eclipse wird es einfach als “User defined directory” unter: `Window>Preferences>General>Editors>Texteditors>spelling`.

Hinweis: Eclipse verlangt (vermutlich) Schreibrechte für seinen Benutzer
auf der Datei `C:\util\eclipse\dropins\de_DE.dic`. <br />
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
- keine Wiederholungen auch nicht mit großem Anfangsbuchstaben   
  Wenn „wandern“ drin ist, akzeptiert Eclipse „Wandern“ sowieso. Folglich
  wird das [Frame4J][f4j_en]{: class="bbi"} tool 
  UCopy (option -eclipDic) die groß geschriebene Dublette rauswerfen.
- keine Punkte am Ende   
  Eclipse akzeptiert „etc.“ im Text nur mit einem .dic-Eintrag „etc“.
- keine Bindestrichworte   
  Eclipse prüft „Baden-Württemberg“ sowie so nur gegen die getrennten 
  Einträge „baden“ (auch ein Verb) und „Württemberg“.
- unsortiert   
  Eclipse scheint .dic-files beim Laden nach eigenem Ermessen zu sortieren.
  (Andere Informationen sind willkommen?)   
  &nbsp; 
  
### Selbst modifizieren
 
Das [Frame4J][f4j_en]{: class="bbi"}-Tool UCopy kann eine Textdatei mit Aufruf
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

Im Übrigen sollte man ab und zu beim [Download-Link](#holen-und-installieren)
schauen, da immer mal neue Wortformen ergänzt werden.


