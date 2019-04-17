---
layout: weAutPost
title: Windows verweigert .exe
bigTitle: .exe geht nicht
date:   2008-10-21
categories: Windows .exe. Explorer IE
lang: de
copyrightYear: 2008
revision: 12
reviDate: 2019-04-17
itemtype: "http://schema.org/BlogPosting"
isPost: true
---

### Das Phänomen

Windows lässt den Admin ein Programm nicht starten.

Beim Starten einer .exe (mit Doppelklick) sagt Ihnen Windows 2003 enterprise edition:

Auf das angegebene Gerät bzw. den Pfad oder die Datei kann nicht zugegriffen werden. Sie verfügen evtl. nicht über ausreichende Berechtigungen …

Sie sind wohlgemerkt als (Domain-) Administrator mit Vollzugriff auf alles Betreffende remote eingeloggt.

### Hintergrund
Der Hintergrund der Verweigerung ist das ungefragte Anwenden von Sicherheitseinstellungen des Internetexplorers (IE) auf alles Mögliche. Sie sind nicht im Internet und verwenden den IE sowie so nie? Ja trotzdem! Wer’s zum ersten mal hört, glaubt es einfach nicht. 

Microsoft tut mit mit so etwas ganz viel, um selbst eingefleischte Nutzer zu ärgern und zu vertreiben. Und leider macht selbst Mozilla inzwischen das böse IE-Spiel mit.

### Abhilfe 1
Eine Reparatur ist das entsprechende Verstellen der IE-Sicherheitseinstellungen, die man auch unter System>Internetoptionen findet. Hier muss man dann Laufwerke und Server zu Sites hinzufügen etc.  (Muss man dies bei vielen client-Rechnern in gleicher Weise tun, geht man besser gleich mit einer .reg-Datei in die jeweilige Registry.)

Bei remote-Anmeldungen wird auch dieses (interaktive) Tun an den Internetoptionen gelegentlich verweigert. Alles das ist umständlich, unklar in den Nebenwirkungen, unerfreulich und im obigen Zusammenhang (Berechtigter will Programm starten,
Datei kopieren oder Ähnliches) total widersinnig. Das ist wirklich zum Weglaufen.

### Abhilfe 2
Beim Starten eines Programms (.exe etc.) mit 
Doppelklick gehts auch einfacher:<br />
 &nbsp; Shell öffnen, Datei hinziehen, return.

Das geht. Entsprechendes gilt fürs Dateien Kopieren etc. mit XCopy, RoboCopy 
etc. statt mit Explorer-Drag&Drop.

Microsoft ärgert mit dem Internet-Explorer also unter vielem Anderen wohl den eigenen Explorer aber nicht die Command-Shell.<br />
Liebe Microsoft-Entwickler, lasst wenigstens das weiterhin so!

