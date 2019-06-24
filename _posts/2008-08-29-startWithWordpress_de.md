---
layout: weAutPost
title: Start mit Wordpress
bigTitle: wordpress blog start
date:   2008-08-29
categories: Wordpress setup theme
lang: de
enPage: ./startWithWordpress.html
copyrightYear: 2008
revision: 14
reviDate: 2019-06-24
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare: ./startWithWordpress.html
---

Dieser Blog war bis April 2019 bei 1&1 gehostet und verwendete dort 
WordPress. Hier finden Sie ein paar Anmerkungen zum Einsatz und Erfahrungen.

### Die Software
Dieser Blog lief seit 2008 mit der deutschen Version 2.6.0 von WordPress und 
benutzte damals ein modifiziertes TerraFirma-theme (siehe unten). Im August 2009 wurde (händisch) auf 2.8.4 aufgedatet.

Im Januar 2013 wurde auf eine (neue) Datenbank mit MySQL5.0 umgestellt, nachdem die (im Vertrag 1&1 business 5) vorher verwendete 4er-Version dem PHP die Verbindung verweigerte. Versuche, die Datenbank und den Blog auf einen anderen (1&1 virtual) Server mit WordPress 3.5 zu migrieren und Alles in einen Webbereich mit anderer Kodierung zu übertragen, verliefen gelinde ausgedrückt unerfreulich. So wurde ohne Umzug händisch aufgedatet (auf 3.5.1 „on spot“) und vieles andere (theme, style, translations) renoviert.

Die ganze WordPress Software ist in recht viel PHP geschrieben. Dazu gibt es noch eine ganze Menge JavaScript, zum Beispiel für die auf dem client laufenden Editoren. Die optionale Übersetzung englischer Texte im .php-Kode in eine andere Zielsprache wird durch sehr umfangreiche Dateien (im PHP mo-po-Standard) dargestellt, die umsonst zu haben sind. (Die Übersetzung ins Deutsche erfordert, je nach Einsatzziel, schon einige Überarbeitung.)

Nun ist ein Blog ein Web-Dienst, wie viele andere auch — Wikis, Shops, Web-Bedienoberflächen für Automatisierungssysteme etc. pp. Da stellt sich für eingefleischte Java-Web-Dienstleister die Grundfrage, wieso man also einen Blog nicht auch als J2EE-Webservice implementiert bzw. einen solchen vorhandenen nimmt.

Die Antwort hierauf ist: Man hat oft keine Wahl. 
- Die meisten Provider, wie das hier genutzte 1&1, bieten J2EE bis in mittlere Vertragskategorien kaum an, während man einen Vertrag ohne PHP oder ganz ohne MySQL schon suchen oder „erknausern“ muss. 
- Hinzu kommt, dass PHP wegen der wesentlich geringen Einstiegshürden und der viel flacheren Lernkurve für kleine Projekte verbreiteter ist als J2EE. 

Und wenn ein PHP-Projekt in Problembereiche gewachsen ist, die man bei J2EE per se gar nicht hat, ist der Umstieg oft zu blutig. So gibt es für Blogs, Wikis etc. halt ein Überangebot an PHP-Ansätzen, während man Java-Lösungen — zumindest freie — schon wie die Stecknadel im Heuhaufen suchen muss.

### Host und Installation
Wie die WWW-Bereiche a-weinert.de etc. ist dieser Blog auch bei 1&1 gehostet. Der Vertrag — hier Business 5.0 — bietet standardmäßig hinreichende PHP- und MySQL-Möglichkeiten (aber, wie bereits diskutiert, keinen J2EE-Container, wie beispielsweise Tomcat) .

1&1 bietet in diesem und auch in einfacheren Verträgen direkt einen Blog an, der vermutlich auch WordPress-basiert ist. Den kann man mit ganz wenigen Mausklicks aktivieren und bräuchte man selbst weder WordPress installieren noch sich um Themes, Updates etc. kümmern oder gar in PHP hinein denken.

Warum sollte man also WordPress oder eine andere Blog-Software im eigenen 1&1-Webbereich installieren? Die Beschreibung des 1&1-Blogs zeigt (übrigens ganz offen), dass seine stark vereinfachte Anfangshandhabung mit Einschränkungen erkauft ist. Wer diese auf Dauer nicht akzeptieren mag, sollte diese Angebot nicht nutzen. Erst mal unbesehen nehmen und hinterher darüber in Foren meckern ist allerdings ziemlich verbreitet — und, gelinde gesagt, unfair.

Vor der Installation von WordPress muss man die MySQL-Datenbank aktivieren, wenn dies noch nicht geschehen ist. Die Zugangsdaten zu dieser Datenbank benötigt man während der WordPress-Installation.

![terraFirma theme](/assets/images/oldStartTheme.jpg "Ursprüngliches Aussehen (TerraFirma) vor neuem theme"){: .imgonright}
Die Installation von WordPress und ggf. von zusätzlichen themes und plug-ins geschieht durch Hochladen (FTP). Man folgt hier einfach WordPress‘ 5-Minuten-Installation. Na ja, etwas länger dauert’s schon, bis Alles einigermaßen so aussieht und läuft, wie man will. Das recht „umwerfende“ Update von 2.6.0 nach 2.8.4 und später nach 3.5.1 macht man auch am besten von Hand; es läuft letztlich auf das Löschen aller allgemeinen WordPress-Dateien — sprich alle ohne Blog-spezifische Individualisierungen — und Hochladen der übrigen neuen Dateien hinaus.

### Zum theme

Ein theme ist die zumindest prinzipiell leicht auswechselbare Gestaltungsoberfläche eines WordPress-Blogs. Dieser Blog verwendete ganz zu Anfang TerraFirma (Abbildung), welches aber bald zur Nicht-Wiedererkennbarkeit modifiziert wurde.

So war es letztlich nur konsequent sich ganz von einem mitgelieferten oder nachgeladenen theme zu verabschieden und genau das Gewünschte direkt (from scratch) zu erstellen. Dies passend Selbermachen ist mit den geeigneten Tools (SVN, Eclipse) und etwas hinein Denken in WordPress und PHP gar nicht so schwer, wenn man die Anfangshemmschwelle überwindet. Die Implikationen für updates sind die selben wie bei zusätzlichen plug-ins. Ein Schlüssel für die Konsistenz mit anderen Web-Auftritten ist die Verwendung eines gemeinsamen CSS.