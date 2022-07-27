---
layout: weAutPost
title: '4 Schalter an 2 (3) Leitungen'
bigTitle: Zu wenig Adern &mdash;  was nun
headline: Vier Schalter an zwei (3) Leitungen
permalink: /:title.html
date:   2022-07-27
categories: home electric light latching relays Eltako 
lang: de
enPage: 4switchesOn2Lines.html
copyrightYear: 2022
revision: 1
reviDate: 2022-07-27
itemtype: "http://schema.org/BlogPosting"
isPost: true
published: true
commentIssueId: 1
commentShare: ./eclipDic_de.html
---
Der Artikel beschreibt eine Lösung, um 4 Schalter oder Taster über nur 2 (3)
(anstatt 4 (5)) Leitungsadern mit einer Verteilung zu verbinden, in der sie 
vier Relais oder<!--more--> Eltakos steuern. Siehe auch
[Komfort mit Eltakos](allOut4eltakos.html "Komfortables Alle Lichter Aus mit Stromstoßschaltern").

## Der Anlass -- ein Unglück

Für vier Taster an einer entfernten Wand war ein 7-adriges NYM-Kabel von der 
in
[Komfort mit Eltakos](allOut4eltakos_de.html "Komfortables Alle Lichter Aus mit Stromstoßschaltern")
beschrieben Verteilung zu einer Doppel-UP-Dose in der abgehängten Decke
verlegt worden: 7 Adern - 1 PE - 1 Reserve waren die 5 für standardmäßig
erforderlichen Leitungsdrähte.
  
Bei der Montage der Deckenheizung wurde eine Schraube an der Lattung
vorbei in dieses Kabel getrieben; sie verband 5 Adern miteinander. Als das
entdeckt und die Stelle des Schadens lokalisiert wurde, war die Deckenheizung
bereits verputzt, befüllt und in Betrieb.      
Eine Reparatur der Leitung mit vertretbarem Aufwand und Risiko war nicht
mehr möglich. Aber auch ohne diesen unglücklichen Anlass kommt man
gelegentlich in die Situation, dass für eine gewünschte Anzahl von Schaltern
oder Tastern die Zahl der Adern nicht reicht.
[<img 
src="/assets/images/postEltako/\4LinesOo2\4LinesOo2_333.jpg" width="333"
height="168" title="Halbwellenansatz; click: groß" alt="Halbwellenansatz"
class="imgonright" />](/assets/images/postEltako/\4LinesOo2\4LinesOo2.jpg
"click: groß"){:target="_blank"}  

## Lösungsansatz

Bei Wechselspannung liegt es nahe, jeder Information (oder jedem
Verbraucher) eine Halbwelle auf der Leitung zuzuordnen. Das Bild rechts zeigt
dies für 4 Taster und Relais.

Nun zeigt es sich, dass moderne Kleinrelais vorteilhafterweise so geringe
bewegte Massen haben, dass sie bei einer solchen Halbwellenspeisung 50 mal
pro Sekunde klappern. Dies trifft auch auf Eltako-Stromstoßschalter und 
-Relais zu.   
Hinzu kommt, dass Relais für 230V~ bei einer solchen Gleichstromspeisung
Schaden nehmen würden, selbst wenn es für Stromstoßschalter i.A. nur 
kurzzeitig wäre. 
 
Hier sind also (2 oder 4) Vorwiderstände und 4 Siebkondensatoren (einer pro
Relais) erforderlich. Dies für 230V~-Relais direkt zu machen ist aufwändig
und voluminös. Es birgt zusätzliche Gefahren durch bei Unterbrechungen auf
bis zu 320V= aufgeladene Kondensatoren. Und bei der 
[vorliegenden Anwendung](allOut4eltakos.html "Komfortables Alle Lichter Aus mit Stromstoßschaltern")
auch gegebenen Ansteuerung derselben Eltakos mit Wechselspannung verbietet
sich das parallel Schalten eines Siebkondensators selbst mit einer
zusätzlichen Entkopplungsdiode. 

Mit Kleinspannung und einer zusätzlichen Ebene von über Transistoren
angesteuerte Relais umgeht man all diese Hindernisse.[<img 
src="/assets/images/postEltako/4LinesOo2/relayModCirc_333.jpg" width="333"
height="309" title="Relaismodul; click: groß" alt="Relaismodul"
class="imgonright" />](/assets/images/postEltako/4LinesOo2\relayModCirc.jpg
"click: groß"){:target="_blank"}

## Relaismodule

Es gibt vielfältige und preiswerte Angebote kompakter Relaismodule für
Kleinspannung (5V, 12V etc.) und Ansteuerung über Optokoppler. Die
übliche Schaltung für ein Relais zeigt das Diagramm rechts. Die Module gibt 
es mit einem oder mehreren -- teilweise bis zu 12 oder 16 -- Relais. Für
unseren Fall wurde ein 5V-Modul mit vier Relais 1*Um eingesetzt
-- Preis 7€.
 
Der gemeinsame Nachteil bei allen gefundenen Angeboten ist der gemeinsame 
Minus-Anschluss -- im Diagram Gnd<sub>anst</sub> genannt -- der Ansteuerung
über die Optokoppler. Mit diesem Designfehler geht die Möglichkeit der
auch untereinander potentialgetrennten Ansteuerung und mit unterschiedlicher
Polarität verloren. 

Letzteres wird hier gebraucht. Zwei Trennstellen und ein paar Brücken
führen zu der gewünschten Verschaltung der Optokoppler-Ansteuerung. Die
vier Anzeige-<abbr title="Leuchtdiode">LED</abbr>s des Relaismoduls 
ersetzen die vier Eingangsdioden rechts
im ersten Diagram. Mit jeweils einem kleinen
<abbr title="Elektrolytkondensator">Elko</abbr> 10µF,16V.Minus an Kathode
der Leuchtdiode des Optokopplers (angedeutet als m) und Plus an der Kathode
der Anzeige-LED (angedeutet als p) gibt es kein 50Hz-Klappern.

Im unteren linken Bild sind die Modifikationen Zusatz-Elkos und gemeinsamer
Vorwiderstand erkennbar. Das rechte Bild zeigt die Integration im
Schaltschrank: Mit den Arbeitskontakten
(<abbr title="normally open">NO</abbr>) werden die betreffenden Eltakos auf
der Hutschiene darüber ganz normal mit 230V~ angesteuert.   
  &nbsp;  

[<img 
src="/assets/images/postEltako/4LinesOo2/relayMod_359.jpg" width="359"
height="482" title="Relaismodul modifiziert; click: groß" alt="Relaismodul"
class="imgonleftt" />](/assets/images/postEltako/4LinesOo2\relayMod.jpg
"click: groß"){:target="_blank"}
[<img 
src="/assets/images/postEltako/4LinesOo2/relayModInt_333.jpg" width="333"
height="482" title="Relaismodul eingebaut; click: groß" alt="Relaismodul"
class="imgonright" />](/assets/images/postEltako/4LinesOo2\relayModInt.jpg
"click: groß"){:target="_blank"}
 