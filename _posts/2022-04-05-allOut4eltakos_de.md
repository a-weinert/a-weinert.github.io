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
Der Artikel beschreibt eine Lösung für "Alle-Lichter-Aus-"Schalter (und
natürlich auch "Wieder-An" für größere Räum&shy;lich&shy;kei&shy;ten. Die Be&shy;son&shy;der&shy;heit
liegt darin, dass Der "Alles-Aus-"Zustand durch Be&shy;tä&shy;ti&shy;gung
**jedes**<!--more--> Lichtschalters beendet wird. Dies wird mit minimalem 
Zu&shy;satz&shy;auf&shy;wand zum kon&shy;ven&shy;tio&shy;nel&shy;len Ansatz erreicht.

 
## Schalten mit Tastern und Strom&shy;stoß&shy;re&shy;lais

Wenn mehrere Schalter für Licht&shy;strom&shy;kreise gefordert sind, ist der Einsatz
von Tastern und Strom&shy;stoß&shy;re&shy;lais -- vulgo Eltakos -- häufig [<img 
src="/assets/images/postEltako/eltako1-sm.jpg" width="327" height="189" 
title="Licht mit Strom&shy;stoß&shy;re&shy;lais; click: groß" alt="Licht mit Eltako"
class="imgonright" />](/assets/images/postEltako/eltako1.jpg "click: groß"){:target="_blank"}
die unaufwändigere Lösung im Vergleich zu Wech&shy;sel- oder gar Kreuzschaltungen.

Außerdem kann der (elektromechanische) Eltako ohne weitere Mo&shy;di&shy;fi&shy;ka&shy;tio&shy;nen 
durch einen (elektronischen) Dimmer ersetzt wer&shy;den. Dieser ist dann auch
von mehreren Stellen aus bedienbar. [<img 
src="/assets/images/postEltako/eltako2-sm.jpg" width="327" height="168" 
title="Licht mit Strom&shy;stoß&shy;re&shy;lais; click: groß"  alt="Licht mit Eltako"
class="imgonleft" />](/assets/images/postEltako/eltako2.jpg "click: groß"){:target="_blank"}
Dies&nbsp;ist mit Standard-Dimmern i.a. 
nicht reali&shy;sier&shy;bar. 

Anstelle von gegen L schaltenden Tastern der ersten Schaltung (rechts) kann
man auch gegen N schaltende Taster (2. Schaltung, links) ein&shy;set&shy;zen.
Dieser Ansatz spart i.A. Aufwand bei Verdrahtung und Verkabelung und man
gewinnt Flexibilität. Dies gilt ins&shy;be&shy;son&shy;dere bei ausgedehnten Räum&shy;lich&shy;kei&shy;ten
mit zahlreichen Schaltstellen und Lichtkreisen -- vor allem, wenn diese auch 
noch zu unter&shy;schied&shy;lichen Strom&shy;kreisen / Siche&shy;rungs&shy;aut&shy;oma&shy;ten / Phasen
gehören.    
Hinweis: In dem Falle müssen dann aber alle be&shy;tref&shy;fen&shy;den Licht&shy;strom&shy;kreise am
selben (oder an keinem) 
<abbr title="Fehlerstrom, engl. RC(D)">FI</abbr>-Schutzschalter
hängen.<br clear="left" />

## Zusätzliche Forderung "Alles-Aus"-Tasten

Insbesondere bei großen Räum&shy;lich&shy;kei&shy;ten wer&shy;den manchmal und dann i.A.
an den Ausgangstüren zusätzliche Taster gefordert, die alle Lichter
ausschalten. Über einen zusätzlichen Eltako ist das ein&shy;fach zu
realisieren. Dieses "Alles Aus"-Stromstoßrelais unterbricht alle
Licht&shy;strom&shy;kreise (das L zu den Eltakos vgl. oben) entweder selbst 
oder über ein zusätzliches "Ausschalt"-Relais mit einer passenden 
Anzahl von (Ruhe- oder Wechsel-) Kontakten mit hinreichender Be&shy;last&shy;bar&shy;keit.
   
Erneutes Drücken einer "Alles-Aus"-Taste beendet den Zustand "Alles-Aus".
Es sind also auch "Wieder-An"-Tasten.

## Weitere Forderung "Wieder An" mit jeder Taste 

Die ein&shy;fache "Alles-Aus"-Lösung hat folgende Konsequenz:   
Falls jemand beim Verlassen die "Alles-Aus"-Taste betätigt, kann eine 
unbemerkte Person im Dunkeln zurückbleiben. Diese müsste dann eine solche
Taste oder wenigstens einen Ausgang finden. Unter die&shy;sem Aspekt kam in 
einem Pro&shy;jekt die Forderung auf, dass **jede** "normale" Taste von
**jedem** Lichtkreis den Zustand "Alles Aus" zurücksetzt. Den nächstgelegenen
oder zuletzt selbst betätigten Lichtschalter bzw. irgendeinen findet man
bei schlechten Sichtverhältnissen ja leichter und mit weniger Gefahr. Ein
solches Funktionsmerkmal (feature) kann also einen Sicherheitsgewinn
bedeuten.

Das feature bringt aber auch ein&shy;fach Komfort und vermeidet zusätzlichen
Erklärungsbedarf gegenüber Besuchern: "Wenn Du
einen Lichtschalter betätigst und Nichts passiert, musst Du zu einem 
dieser Schalter gehen und ..."

Also "Wieder An" mit jeder Taste? Bei einem gegebenen Ansatz mit Relais
ist man geneigt, dies (ohne 
<abbr title="speicherprogrammierbare Steuerung">SPS</abbr> oder
<abbr title="Mikro-Controller">µC</abbr>-Einsatz) als
undurchführbar abzulehnen. Es gibt aber eine überraschend ein&shy;fache Lösung.

## Komfortables "Wieder An" -- die Lösung mit Relais

Sie benötigt lediglich ein zusätzliches Relais so&shy;wie die doppelte Anzahl an
(Wechsel-) Kontakten beim Ausschaltrelais. Wenn alle Eltakos [<img 
src="/assets/images/postEltako/allOffLogic-sm.jpg" width="532"
height="252" title="Relaislogik komfortables Alles Aus; click: groß"
alt="Alles aus mit Komfort"
class="imgonright" />](/assets/images/postEltako/allOffLogic.jpg
"click: groß"){:target="_blank"}
in einer Verteilung untergebracht sind -- was bei der hier ins
Auge gefassten Größe der Anlage die Regel sein wird -- fällt praktisch
kein erhöhter Verdrahtungsaufwand an.  
Hinweis: Klicken Sie auf das Bild für eine große Variante in einem an&shy;de&shy;ren
Fenster  oder "Tab".

Das Betätigen einer Alles-Aus-Taste ("All off" im Strom&shy;lauf&shy;plan) ändert den
Zustand eine eines Eltakos ("all off latch"), der im Zustand "gesetzt" 
das Alles-Aus-Relais (all off relay) einschaltet. Dies unterbricht mit einem 
Wechselkontakt (erster von rechts) die L-Versorgung der Kontakte der
be&shy;tref&shy;fen&shy;den "Licht-Eltakos". Mit der 
<abbr title="normally open; Arbeitskontakt">NO</abbr>-Seite
dieses Kontakts kann man ein Nachtlicht / Orientierungslicht versorgen.  
Für die ein&shy;fache "Alles-Aus"-Funktion wäre das schon Alles.

Der zweite Wechselkontakt schaltet die L-Versorgung der Spulen der
be&shy;tref&shy;fen&shy;den "Licht-Eltakos" vom "Kontakt-L" auf eine Leitung (button pushed
when all out) zu dem einem Extra-Relais ("on again sense relay" im Stromlauf)
um.    
Hinweis: Die Trennung der L-Versorgung der Spulen erfolgt bewusst über zwei
hintereinander geschaltete Kontakte, da die Umschaltung auf die selbe Leitung
/ dasselbe Relais auch für andere Lichtgruppen (im Stromlauf links angedeutet)
erfolgt, die zu an&shy;de&shy;ren Siche&shy;rungs&shy;aut&shy;oma&shy;ten und ggf. auch Phasen gehören.

Bei Be&shy;tä&shy;ti&shy;gung eines beliebigen Licht-Tasters wird nun das Extra-Relais 
("on again sense relay") betätigt, welches mit seinem Arbeitskontakt den
Alles-Aus-Eltako ("all off latch") betägtigt -- und in die&shy;sem Zustand
zurücksetzt. Damit fällt das Alles-Aus-Relais (all off relay) ab und als
unmittelbare Folge auch das "sense relay".

Der potentiell kritische Teil dieses Ansatzes ist, dass beim geschilderten
"Wieder-Alles-An"-Vorgang das sog. "sense"-Relais (Eltako R12-100) und ein
Strom&shy;stoß&shy;re&shy;lais (Eltako S12-100) hintereinander geschaltet an 230 V~
liegen. Beide ha&shy;ben eine Nennspulenspannung von 230V, die sie nicht wirklich
benötigen -- die halbe Spannung (115 V) genügt aber nicht.  
Es funktioniert trotzdem zu&shy;ver&shy;läs&shy;sig, da der S12-110 bei Nennspannung 
den doppelten Strom (ca. 25mA) zieht und somit bei der Rei&shy;hen&shy;schal&shy;tung
nur 1/3 der Spannung bekommt (und sich so nicht bewegt).
   
Die Befürchtung, dass elek&shy;tro&shy;nische Relais und Dimmer mit potentialfreier
sog. Universal-Steuerspannung 8..230 V hier nicht funktionieren würden,
erwies sich als unbegründet. Die ha&shy;ben eine Ein&shy;schalt&shy;strom&shy;spitze
von deutlich über 30mA und das "sense"-Relais in Reihe zieht zu&shy;ver&shy;läs&shy;sig an. Die oben
genannte problem&shy;lose Aus&shy;tausch&shy;bar&shy;keit ohne Fun&shy;ktions&shy;ver&shy;lust von
(elektro&shy;mechani&shy;schem) Eltako und (elektronischem) bleibt
gegeben.<br clear="right" />
 
## Der Aufbau in einem Schaltschrank
 
[<img 
src="/assets/images/postEltako/schaltSchrGes-sm.jpg" width="285"
height="429" title="Im Schaltschrank; click: groß"
alt="Aufbau gesamt"
class="imgonleft" />](/assets/images/postEltako/schaltSchrGes.jpg
"click: groß"){:target="_blank"} 
Im realisierten Pro&shy;jekt "wohnt" das Ganze gut passend und handhabbar in
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
 - 5 Eltakos für Licht&shy;strom&shy;kreise Raum A    
 - Das oben sogenannte "sense"-Relais
 - Der "Alles-Aus"-Eltako (all out latch)
 - 5 Stromstoßschalter *) für Licht&shy;strom&shy;kreise Raum B
 
 _________ &nbsp;    
 Anm. *): Zumindest der weiße "Nicht-Eltako" wird gegen einen "blauen" 
 Dimmer getauscht wer&shy;den.
 