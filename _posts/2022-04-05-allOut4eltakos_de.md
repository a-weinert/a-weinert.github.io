---
layout: weAutPost
title: '"Alles Aus" mit Komfort für viele Eltako- (Licht-) Stromkreise'
bigTitle: Alles Aus mit Stromstoßschaltern
headline: Komfortables "Alle Lichter Aus" Aus mit Stromstoßschaltern
permalink: /:title.html
date:   2022-04-05
categories: home electric light latching relays Eltako 
lang: de
enPage: allOut4eltakos.html
copyrightYear: 2022
revision: 1
reviDate: 2022-04-05
itemtype: "http://schema.org/BlogPosting"
isPost: true
published: true
commentIssueId: 1
commentShare: ./eclipDic_de.html
---
## Licht schalten mit Tasten und Stromstoßrelais

Wenn mehrere Schalter für Lichtstromkreise gefordert sind ist der Einsatz
von Tastern und Stromstoßrelais -- vulgo Eltako -- häufig<!--more--> [<img 
src="/assets/images/postEltako/eltako1-sm.jpg" width="327" height="189" 
title="Licht mit Stromstoßrelais; click: groß"  alt="Licht mit Eltako"
class="imgonright" />](/assets/images/postEltako/eltako1.jpg "click: groß"){:target="_blank"}
die unaufwändigere Lösung im Vergleich zu Wechsel- oder gar Kreuzschaltungen.

Außerdem kann der (elektromechanische) Eltako ohne weitere Modifikationen 
durch einen (elektronischen) Dimmer ersetzt werden. Dieser ist dann auch
von mehreren Stellen aus bedienbar. [<img 
src="/assets/images/postEltako/eltako2-sm.jpg" width="327" height="168" 
title="Licht mit Stromstoßrelais; click: groß"  alt="Licht mit Eltako"
class="imgonleft" />](/assets/images/postEltako/eltako2.jpg "click: groß"){:target="_blank"}
Dies&nbsp;ist mit Standard-Dimmern i.a. 
nicht realisierbar. 

Anstelle von gegen L schaltenden Tastern der ersten Schaltung (links) kann
man auch gegen N schaltende Taster (2. Schaltung, links) einsetzen.
Dieser Ansatz spart i.A. Aufwand bei Verdrahtung und Verkabelung und man
gewinnt Flexibilität. Dies gilt insbesondere bei ausgedehnten Räumlichkeiten
mit zahlreichen Schaltstellen und Lichtkreisen -- vor allem, wenn diese auch 
noch zu unterschiedlichen Stromkreisen / Sicherungsautomaten / Phasen
gehören.    
Hinweis: In dem Falle müssen dann aber alle betreffenden Lichtstromkreise am
selben (oder an keinem) 
<abbr title="Fehlerstrom, engl. RC(D)">FI</abbr>-Schutzschalter
hängen.<br clear="left" />

## Zusätzliche Forderung "Alles-Aus"-Tasten

Insbesondere bei großen Räumlichkeiten werden manchmal und dann i.A.
an den Ausgangstüren zusätzliche Taster gefordert, die alle Lichter
ausschalten. Über einen zusätzlichen Eltako ist das einfach zu
realisieren. Dieses "Alles Aus"-Stromstoßrelais unterbricht alle
Lichtstromkreise (das L zu den Eltakos vgl. oben) entweder selbst 
oder über ein zusätzliches "Ausschalt"-Relais mit einer passenden 
Anzahl von (Ruhe- oder Wechsel-) Kontakten mit hinreichender Belastbarkeit.
   
Erneutes Drücken einer "Alles-Aus"-Taste beendet den Zustand "Alles-Aus".
Es sind also auch "Wieder-An"-Tasten.

## Weitere Forderung "Wieder An" mit jeder Taste 

Die einfache "Alles-Aus"-Lösung hat folgende Konsequenz:   
Falls jemand beim Verlassen die "Alles-Aus"-Taste betätigt, kann eine 
unbemerkte Person im Dunkeln zurückbleiben. Diese müsste dann eine solche
Taste oder wenigstens einen Ausgang finden. Unter diesem Aspekt kam in 
einem Projekt die Forderung auf, dass **jede** "normale" Taste von
**jedem** Lichtkreis den Zustand "Alles Aus" zurücksetzt. Den nächstgelegenen
oder zuletzt selbst betätigten Lichtschalter bzw. irgendeinen findet man
bei schlechten Sichtverhältnissen ja leichter und mit weniger Gefahr. Ein
solches Funktionsmerkmal (feature) kann also einen Sicherheitsgewinn
bedeuten.

Das feature bringt aber auch einfach Komfort und vermeidet zusätzlichen
Erklärungsbedarf gegenüber Besuchern: "Wenn Du
einen Lichtschalter betätigst und Nichts passiert, musst Du zu einem 
dieser Schalter gehen und ..."

Also "Wieder An" mit jeder Taste? Bei einem gegebenen Ansatz mit Relais
ist man geneigt, dies (ohne 
<abbr title="speicherprogrammierbare Steuerung">SPS</abbr> oder
<abbr title="Mikro-Controller">µC</abbr>-Einsatz) als
undurchführbar abzulehnen. Es gibt aber eine überraschend einfache Lösung.

## Komfortables "Wieder An" -- die Lösung mit Relais

Sie benötigt lediglich ein zusätzliches Relais sowie die doppelte Anzahl an
(Wechsel-) Kontakten beim Ausschaltrelais. Wenn alle Eltakos [<img 
src="/assets/images/postEltako/allOffLogic-sm.jpg" width="532"
height="252" title="Relaislogik komfortables Alles Aus; click: groß"
alt="Alles aus mit Komfort"
class="imgonright" />](/assets/images/postEltako/allOffLogic.jpg
"click: groß"){:target="_blank"}
in einer Verteilung untergebracht sind -- was bei der hier ins
Auge gefassten Größe der Anlage die Regel sein wird -- fällt praktisch
kein erhöhter Verdrahtungsaufwand an.  
Hinweis: Klicken Sie auf das Bild für eine große Variante in einem anderen
Fenster  oder "Tab".

Das Betätigen einer Alles-Aus-Taste ("All off" im Stromlaufplan) ändert den
Zustand eine eines Eltakos ("all off latch"), der im Zustand "gesetzt" 
das Alles-Aus-Relais (all off relay) einschaltet. Dies unterbricht mit einem 
Wechselkontakt (erster von rechts) die L-Versorgung der Kontakte der
betreffenden "Licht-Eltakos". Mit der 
<abbr title="normally open; Arbeitskontakt">NO</abbr>-Seite
dieses Kontakts kann man ein Nachtlicht / Orientierungslicht versorgen.  
Für die einfache "Alles-Aus"-Funktion wäre das schon Alles.

Der zweite Wechselkontakt schaltet die L-Versorgung der Spulen der
betreffenden "Licht-Eltakos" vom "Kontakt-L" auf eine Leitung (button pushed
when all out) zu dem einem Extra-Relais ("on again sense relay" im Stromlauf)
um.    
Hinweis: Die Trennung der L-Versorgung der Spulen erfolgt bewusst über zwei
hintereinander geschaltete Kontakte, da die Umschaltung auf die selbe Leitung
/ dasselbe Relais auch für andere Lichtgruppen (im Stromlauf links angedeutet)
erfolgt, die zu anderen Sicherungsautomaten und ggf. auch Phasen gehören.

Bei Betätigung eines beliebigen Licht-Tasters wird nun das Extra-Relais 
("on again sense relay") betätigt, welches mit seinem Arbeitskontakt den
Alles-Aus-Eltako ("all off latch") betägtigt -- und in diesem Zustand
zurücksetzt. Damit fällt das Alles-Aus-Relais (all off relay) ab und als
unmittelbare Folge auch das "sense relay".

Der potentiell kritische Teil dieses Ansatzes ist, dass beim geschilderten
"Wieder-Alles-An"-Vorgang das sog. "sense"-Relais (Eltako R12-100) und ein
Stromstoßrelais (Eltako S12-100) hintereinander geschaltet an 230 V~
liegen. Beide haben eine Nennspulenspannung von 230V, die sie nicht wirklich
benötigen -- aber bei halber Spannung (115 V) ziehen sie nicht an.  
Es funktioniert trotzdem zuverlässig, da der S12-110 bei Nennspannung 
den doppelten Strom (ca. 25mA) zieht und somit bei der Reihenschaltung nur
1/3 der Spannung bekommt (und sich so nicht bewegt).
   
Die Befürchtung, dass elektronische Relais und Dimmer mit potentialfreier
sog. Universal-Steuerspannung 8..230 V hier nicht funktionieren würden,
erwies sich als unbegründet. Die haben eine Einschaltstromspitze von deutlich
über 30mA und das "sense"-Relais in Reihe zieht zuverlässig an. Die oben
genannte problemlose Austauschbarkeit ohne Funktionsverlust von
(elektromechanischem) Eltako und (elektronischem) bleibt
gegeben.<br clear="right" />
 
## Der Aufbau in einem Schaltschrank
 
[<img 
src="/assets/images/postEltako/schaltSchrGes-sm.jpg" width="285"
height="429" title="Im Schaltschrank; click: groß"
alt="Aufbau gesamt"
class="imgonleft" />](/assets/images/postEltako/schaltSchrGes.jpg
"click: groß"){:target="_blank"} 
Im realisierten Projekt "wohnt" das Ganze gut passend und handhabbar in
einem Standard-Verteiler (Hager), der oben um eine zusätzliche Hutschiene
ergänzt wurde.


1\. Hutschiene:    
 &nbsp; &nbsp; &nbsp; Rangierfeld Lampen

2\. Hutschiene:    
 &nbsp; &nbsp; &nbsp; Ausschaltrelais 4*Um mit roter LED    
 &nbsp; &nbsp; &nbsp; bzw. seine Fassung  
 &nbsp; &nbsp; &nbsp; Netzteil für Türsprechanlage (hier unbeteiligt)
    
3\. Hutschiene:   
 &nbsp; &nbsp; &nbsp; Die Relais
 
4\. Hutschiene:    
 &nbsp; &nbsp; &nbsp; Rangierfeld Taster     
 &nbsp; &nbsp; &nbsp; Zwei Schalter (hier unbeteiligt)<br clear="left" />[<img 
src="/assets/images/postEltako/schaltSchrDet-sm.jpg" width="327"
height="254" title="Aufbau im Detail; click: groß"
alt="Aufbau im Detail"
class="imgonright" />](/assets/images/postEltako/schaltSchrDet.jpg
"click: groß"){:target="_blank"}

## Aufbau im Detail

Die 12 Relais auf der 3. Hutschiene sind:   
 - 5 Eltakos für Lichtstromkreise Raum A    
 - Das oben sogenannte "sense"-Relais
 - Der "Alles-Aus"-Eltako (all out latch)
 - 5 Stromstoßschalter *) für Lichtstromkreise Raum B
 
 _________ &nbsp;    
 Anm. *): Zumindest der weiße "Nicht-Eltako" wird gegen einen "blauen" 
 Dimmer getauscht werden.
 