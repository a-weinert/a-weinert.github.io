---
layout: weAutPost
title: Zeitsynchronisation mit NTP & DCF77
bigTitle: Gleiche Zeit für alle
headline: Zeitsynchronisation im lokalen Netz
permalink: /:title.html
date:   2020-11-28
categories: Raspberry Pi verteilt Zeit Uhr NTP DCF77
lang: de
enPage: timeSyncLocNet.html
copyrightYear: 2021
revision: 1
reviDate: 2021-01-07
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---

In einem [LAN](/timeSyncLocNet.html "Local Area Network") sollten alle
Maschinen die selbe Zeit haben -- egal ob Server, PC oder kleiner Controller,
wie z.B. ein Pi für Echt&shy;zeit&shy;steuerung, wie in 
["Raspberry for remote services"](https://a-weinert.de/pub/raspberry4remoteServices.pdf "technical report (.pdf)")
(siehe<!--more--> auch 
   [Publikationen](http://a-weinert.de/publication.html "von A. Weinert"))
beschrieben.  
Der Hintergrund: Sie wollen
 - vergleichbare Zeiten von Dateien and
 - Log-Dateieinträgen, die über mehrere Systeme hinweg eine korrekt
   sortierbare Reihenfolge ergeben. &nbsp; Sie haben
 - verteilte Steuerungen mit zeitlich koordinierten Aktionen.
 
Diese zeitabhängigen Aktionen und Eigenschaften versagen, wenn die interne 
Zeit dieser Systeme zu weit voneinander abweichen. Folglich haben wie eine
(harte oder weiche) diesbezügliche Echt&shy;zeit&shy;anforderung. Und
"Echt&shy;zeit" sagt auch hier nichts über absolute Zahlen. Die noch
tolerierbare Abweichung
zwischen zwei dieser Systeme kann zwischen 50ns and 20s liegen -- je nachdem.
Falls aber ein System nach dem Neustart/Einschalten weder Datum noch Stunde
kennt ist jede Hoffnung vergebens.

## NTP-Server

Der bewährte Weg zu gleicher Zeit ist, alle diese System den gleichen
[NTP](#ntp-server "Net time protocol")-Server oder den gleichen sortierten
Satz von Servern nutzen zu lassen. Zumindest einer muss für alle diese 
Rechner via [(W)LAN](#ntp-server "(Wireless) Local Area Network")
erreichbar sein.   
Ein guter Ansatz sind ein oder zwei eigene NTP-Servers in diesem internen
(W)LAN, welche ihrerseits eine oder mehrere externe Zeitquellen nutzen.
Gründe für einen gemeinsamen internen NTP-server sind die wahrscheinlich
intern stabilere Übertragungszeit und Erreichbarkeit für alle. Nicht alle
internen Computer und Steuerungen dürfen ja ins Internet.

Die interne Rolle NTP-Server bekommen oft die Domain Controller (DC), mit 
üblicherweise internen IP-Adressen von p.r.v.1 bis p.v.r.4. In Privathäusern
und kleinen Firmen werden die DC-Rollen 
[DNS](#ntp-server "Domain name system") (und 
[DHCP](#ntp-server "Dynamic host configuration protocol")) oft vom Router 
des Internet-Providers oder dem privaten Router übernommen. In 
Deutschland word dies oft eine 
[fritz.box](#ntp-server "fritz.box = Netzname; FRITZ!Box = Produkt") sein,
mit standardmäßig IP 192.168.178.1. Der folgende Auszug aus
/etc/ntp.conf setzt fritz.box als alleinigen Zeitserver ein:

```
# I need to talk to one NTP server or two (or three).
server 192.168.178.1
# 192.168.178.1 is fritz.box (the FRITZ!Box)
# pool.ntp.org maps to ~1000 low-stratum NTP servers.
#pool 0.debian.pool.ntp.org iburst
```

Beachten Sie, dass alle pool-Einträge auskommentiert wurden, damit der 
client nicht von der fritz.box weggelockt wird. Sie könnten sonst die
anderen Angebote vorziehen. Eine fritz.box, die dutzente Telefone 100 aktive
(W)LAN clients, USB-Laufwerke und manches mehr zu handhaben versucht, ist da 
wohl unattraktiver als ein ausgewachsener NTP-Server im Internet. Wenn
Sie extra Quellen oder pools wollen nutzen Sie indirekt die Zeitquelle der
fritz.box: ``` ntp1.t-online.de; 2.europe.pool.ntp.org ```.

Die Verfügbarkeit und Nutzung der eines NTP-Servers testet man z.B. mit:
```
ntpstat  # Linux
w32tm /stripchart /computer:192.168.178.1 /dataonly /samples:5 &REM Windows
```
## NTP mit fritz.box und Raspberry Pi

Mit einer FRITZ!Box 7490 mit FRITZ!OS 7.21 hatten wir einen Ausfall ihres 
NTP-Servers für alle clients (diagnostiziert mit by w32tm, ntpstat etc.),
wobei die NTP-Serverkonfiguration intakt war und die gesamte 
(W)LAN-Kommunikation OK war. Schließlich half es
(in Netzwerk -> Netzwerkeinstellungen) den Haken für die NTP-Serverrolle zu
entfernen, OK drücken, bis 20 zählen und neu Setzen. Das Rücksetzen der 
FRITZ!Box mit Netz Aus hätte wohl das selbe bewirkt war aber mitten an 
einem Arbeitstag unzumutbar.

Wenn man NTP-Problemen nachgehen muss, ist das Vorhandensein von Linux- und
Windows-Systemen im Netz schon Mühsal genug. Dann aber gerade auf den
neuesten Raspians (nun teilweise Raspberry Pi OS genannt) die 
Standard-NTP-Linux-Werkzeuge und Vorgehensweisen nicht mehr zu haben,
ist schon eine überraschende Dreistigkeit.

Natürlich wollten wir die Standardwerkzeuge mit ihrem Schatz an
Dokumentation und Erfahrung zurück:
```
sudo service systemd-timesyncd stop
sudo systemctl disable systemd-timesyncd --now
sudo apt-get install ntp ntp-doc
sudo nano  /etc/ntp.conf # see changes above
sudo apt-get install ntpstat
sudo apt-get install openntpd
sudo apt-get install ntpctl
sudo timedatectl set-ntp True
sudo systemctl restart ntp # it might take 3 min until sync
sudo ntpdate -u fritz.box  # force setting time on a very async client 
```
Das stellt die Einheitlichkeit der unserer Linuxe bezüglich NTP wieder her.
  

## NTP-Ausfall

Wenn NTP in einem lokal Bereich ausfällt, beginnt das weg driften der clients
von der offiziellen Zeit und voneinander. Ein client mit einem Neustart in
dieser Situation hat dann evtl. sogar eine total blödsinnige Zeit. Nun 
einige Linuxe und Rasbians garantieren mit einer
Datei ```/etc/fake-hwclock.data``` wenigstens eine monotone Zeit 
über Runterfahren und Wiederanlauf hinweg aber natürlich keine Korrektheit.

Um in der Gegenwart von NTP-Ausfällen Korrektheit zu erreichen oder aufrecht
zu erhalten braucht man eine redundante Zeitquelle.

## Echtzeituhren

Hierfür werden oft sogenannte "Echtzeituhren" eingesetzt. Es sind 
batteriebetriebene Quarzuhren ohne Zeiger oder Anzeige aber mit einer
Schnittstelle zum Prozessor zum Auslesen und Stellen. Sobald das NTP-basierte
Stellen ausfällt, driften sie wie jede andere unsynchronisierte Uhr, und wenn
ihre Batterie schwach wird, driften sie schneller oder fallen gar aus,

Wenn Ihre Hardware vom Grund-Design her so eine "Echtzeituhr" hat, und 
diese vom Betriebssystem ohne zusätzliche Konfiguration korrekt gehandhabt
wird, so mag man dergleichen nutzen. Bei Standard-PCs ist das meist so.

Aber zögern Sie, so was nur bedingt nützliches einem Embedded-Controller
nachträglich hinzuzufügen. Es kann von vornherein oder nach updates
schwierig zum Laufen zu bringen sein. Und ein Batteriewechsel kann an manchem
Einbauort eines Controllers ein Albtraum sein.    
Eine gute Alternative kann das Nutzen des **DCF77-Signals** mit einem 
preiswerten **DCF77-Empfänger** sein. Gegebenenfalls können sich auch mehrere
clients ein Empfangsmodul teilen.

## DCF77-Signal

Die offizielle, gesetzliche Deutsche Zeit wird von der
[PTB](#dcf77-signal "Physikalisch-Technische Bundesanstalt, Braunschweig")
mit weltweit synchronisierten Atomuhren dargestellt und über den
Langwellensender 
[DCF77](#dcf77-signal
 "the callsign of the long wave time transmitter in Mainflingen")
in der Nähe von Aschaffenburg/Main verbreitet. Er kann in weiten Teilen 
Europas empfangen werden. Sein 77,5 kHz-Träger ist sowohl amplituden-
([AM](#dcf77-signal "amplitude modulation")) als auch phasenmoduliert
([PM](#dcf77-signal "phase modulation")).

Am Beginn der meisten Sekunden wird die Amplitude für 100 ms (false) oder
für 200 ms (true) auf 15% reduziert. Von etwa 3ms vor Sekundenbeginn
bis genau 200 ms danach ist die Phase 0°. Sonst wird sie so &plusmn;13°
moduliert, dass die Verschiebung insgesamt Null ist.

Die PM ist wesentlich weniger anfällig gegenüber
[EMI](#dcf77-signal "elektromagnetischen  Interferenzen") und der 
Sekundentick kann exakter erfasst werden (etwa 2µs verglichen
mit 200µs bei AM). Eine Störquelle bei PM ist die ungewollte zusätzliche
Modulation durch eine im Sturm bewegte (große) Sendeantenne. (Solche 
und andere Störungen werden vermutlich über das "Rufbit" 15 gemeldet.)    
Die Technik eines PM-Empfängers und die Dekodierung ist komplizierter 
und deutlich teurer. Wir werden uns, wie viele, trotz aller PM-Vorzüge auf
mit AM-Empfängern zufriedengeben.

Das AM-Signal liefert einen Start-Tick für alle Sekunden außer der letzten
einer Minute (59, 60, 61). Diese Pulse ergeben einen langsamen 
(1 bit /s) Datenstrom. Die Kodierung der 59 Telegramm-Bits liefert alle 
Zeit- und Datumsinformation einschließlich
[MEZ (CET)](#dcf77-signal "Mitteleuropäische Zeit, UTC + 1h") /
[MESZ (CEST)](#dcf77-signal "Mitteleuropäische Sommerzeit, UTC + 2h"). Also
bekommen wir auch die Weltzeit 
[UTC](#dcf77-signal "Coordinated Universal Time").

Mithin bekommt unser Controller/Computer mit einem DCF77-Empfänger eine 
Minute nach dem Einschalten Standardzeit.
 
Jeder NTP-Server in Europe mit etwas Verstand wird letztlich die Atomuhren
der PTB (und somit DCF77) nutzen. Ein System das seine Zeit mit DCF77 
synchronisiert, ist somit NTP-konform. Ein Umschalten auf NTP wird so 
keine Sprünge oder lange Anpassungszeiten verursachen.
   
Die gute Übereinstimmung zwischen DCF77 und NTP fehlt in der letzten Stunde
vor einer Schaltsekunde *), falls der betreffende Server wie viele das
sogenannte "leap second smearing" machen (eine Idee 2011 von Google).
Diese NTP-Server liefern dann 1000 s lang die falsche Zeit. Da DCF77 in der
letzten Stunde vorher der Schaltsekunde (xx:59:60) diese ankündigt, ist
man informiert, ohne das 
[IERS bulletin C](https://www.iers.org/SharedDocs/News/EN/BulletinC.html
"Earth Rotation Services") lesen zu müssen.[<img 
src="/assets/images/DCF77rec_0469.jpg" width="310" height="431" 
title="DCF77-Empfänger, Canaduino module, full size (click)"
 alt="DCF77-Empfänger, Canaduino module, full size  "class="imgonright" />](/assets/images/DCF77rec_0469.jpg "image full size")  
<small>______________    
Anm. *): Möge der Brexit die Macht der Britischen Admiralität soweit
mindern, dass der Rest der Welt die Schaltsekunden loswerden kann.</small>


## DCF77-Empfänger

Wir betrachten nur
[AM](#dcf77-empfänger "Amplitudenmodulation")-Empfängermodule. Man bekommt
sie für unter 10€ und bessere ab 14€. Mit den Kosten für ein kleines
Gehäuse aus Kunststoff (!) 5 m Kabel -- für eine freie gute Platzierung der 
or Ferritantenne -- bekommt man eine direkt an beispielsweise einen 
Raspberry Pi anschließbaren Empfänger für unter 30€.

Eigenschaften:    
 &nbsp; o &nbsp; braucht (nur) einen beliebigen digitalen Eingang des 
   Controllers    
 &nbsp; - &nbsp;&nbsp; üblicherweise keine DCF77-Unterstützung des OS    
 &nbsp; - &nbsp;&nbsp; eigene DCF77-Software / -Anwendung benötigt application needed (not rocket 
   (durchaus machbar)
 &nbsp; + &nbsp; es braucht keine Batterie
 &nbsp; + &nbsp; das Modul kann mit dem Controller zusammengebaut*) und   
 &nbsp; + &nbsp; von ihm (einem Raspberry Pi z.B.) versorgt werden    
 &nbsp; + &nbsp; das Modul kann ebenso mehrere Meter vom Controller entfernt
   platziert werden
 &nbsp; + &nbsp; das Signal eines Empfängers kann auch an mehrere**)
  Controller verteilt werden.

AM-Empfängermodule unter 10€ gibt es bei Pollin und einigen anderen. Sie
wurden mit Erfolg eingesetzt. Man teste sie vorher mit einem Oszilloskop
oder einem Program wie testOnPi. Der log-Auszug
```
test      µs stamp  pulse µs  sec res period µs    stamp  -  corr decode
DCF77 2.630.290.551   110060   7: F.M 2020225  15:43:06.133 -.188   |o|
DCF77 2.631.001.112   187210   0: T#b  710561  15:43:08.231 -. 13 minErr
DCF77 2.631.281.253    12020   1: s#b  280141  15:43:08.766 -.188   | |
DCF77 2.631.891.315   187991   2: T#b  610062  15:43:09.222 -. 40   |-|
DCF77 2.632.275.296    39190   3: F#b  383981  15:43:09.683 -.177   |o|
DCF77 2.632.771.357   176720   4: T#b  496061  15:43:10.205 -. 35   |-|
DCF77 2.632.815.177    34270   5: F#b   43820  15:43:10.558 -.  7   |o|
DCF77 2.632.860.417     6660   6: s#b   45240  15:43:10.575 -. 29   | |
DCF77 2.632.996.258    28510   7: s#b  135841  15:43:10.642 -. 18   | |
DCF77 2.633.033.588   130580   8: u#e 2120225  15:43:10.767 -. 17   | |
```
zeigt fehlerhafte (erroneous e) und undefinierte (u) Resultate sowie 
kurze / spitze (b s) Modulations-Pulse und Perioden. Dies passiert unter
sehr schlechten Empfangsbedingungen (falsch ausgerichtete Antenne oder
starke Störungen) oder mit schlechten EMpfänger-Modulen.      
Derartige Module bestehen aus einem AM-Empfangs-Chip (MAS6180 z.B.), einem 
Filter-Quarz und sonst praktisch nichts. Der Ausgangs-Pin ist sehr
störempfindlich -- quasi ein Eingang. Manche Module gehen beim Anschließen
eines abgeschirmten Kabels kaputt (was die Freude am Schnäppchen beendet).
Diese "MAS6180 plus Nichts"-Module brauchen immer eine zusätzliche
<abbr title="open collector">OC</abbr>-Ausgangsstufe und Filter für die 
Versorgungsspannung. Ohne diese Maßnahmen sieht man selten 2 Minuten
fehlerfreien Empfang.       
<small>______________    
Anm. *): Es ist klüger Empfangsmodul mit der Ferritantenne in ein extra 
Gehäuse zu tun und diese mit einem dreipoligen (möglichst abgeschirmten)
Kabel zum Controller zu versehen.   
Anm. **): Here a decoupling by multiple NPN open collector output stages 
would be necessary and probably extra considerations on the receiver's 
supply.</small>

Letztlich gibt man besser 12..16 € (oder mehr) für ein Modul aus, das von 
Haus aus all dies mitbringt, wie z.B das CANADUINO DCF77 receiver kit,
[siehe Abbildung](/assets/images/DCF77rec_0469.jpg "Canaduino kit aufgebaut").
Es kommt mit allem notwendigen Extras zum AMEmpfangs-Chip: Ausgangsstufen, 
Stromversorgung, und sogar LEDs zum optionalen Beobachten von Operation
und Zustand. Trotzdem empfehlen wir auch hier (trotz der 
push/pull-Ausgangsstufen) einen zusätzlichen OC-Ausgang, da dieser eine
unabhängige Wahl und Schaltung der Versorgung (mehr als die 3,3V vom Pi) 
von Empfänger (mehr als die 3,3V vom Pi) und Controller erlaubt.    
Der Canaduino-Empfänger Log-Auszug wurde mit ```testOnPi  --DCF77```
offensichtlich am Montag, 04.01., um 15:08 erstellt.

```
test      µs stamp  pulse µs  sec res period µs    stamp  -  corr decode
DCF77 0.522.295.426   183491 127: T.M 2001026  15:07:58.226 -. 83 mSrch
DCF77 0.523.295.068    82340   0: F.S  999642  15:08:00.126 -.182 minute
DCF77 0.524.293.681   182271   1: T.S  998613  15:08:01.225 -.185   |-|
DCF77 0.525.294.905   183870   2: T.S 1001224  15:08:02.226 -.183   |-|

:
DCF77 0.537.294.503   182981  14: T.S  998632  15:08:14.228 -. 84   |-|
DCF77 0.538.297.096    83881  15: F.S 1002593  15:08:15.126 -. 81 antOK
DCF77 0.539.296.099    80450  16: F.S  999003  15:08:16.126 -. 83 dlsKp
DCF77 0.540.295.321    83350  17: F.S  999222  15:08:17.127 -.181
DCF77 0.541.295.404   181171  18: T.S 1000083  15:08:18.224 -. 83 MEZ
DCF77 0.542.293.516    82270  19: F.S  998112  15:08:19.126 -.184 noLpS
DCF77 0.543.292.039   183611  20: T.S  998523  15:08:20.225 -.186 time:
:
DCF77 0.550.293.047    84330  27: F.S  999623  15:08:27.126 -. 87 hh:09
DCF77 0.551.294.209    85870  28: F.S 1001162  15:08:28.127 -.183 __:__
:
DCF77 0.557.292.804    84420  34: F.S  998672  15:08:34.127 -.185 15:mm
DCF77 0.558.291.607   184541  35: T.S  998803  15:08:35.226 -. 89 __:__
:
DCF77 0.564.292.682    84070  41: F.S  998203  15:08:41.126 -.187 04.mm.
DCF77 0.565.294.654   186470  42: T.S 1001972  15:08:42.228 -. 84
DCF77 0.566.293.897    83701  43: F.S  999243  15:08:43.127 -. 84
DCF77 0.567.289.019    84670  44: F.S  995122  15:08:44.126 -.189 Day:Mo
:
DCF77 0.572.290.832    88390  49: F.S 1000882  15:08:49.127 -.186 dd.01.
DCF77 0.573.291.855   185871  50: T.S 1001023  15:08:50.225 -. 86
:   
DCF77 0.580.290.432    84920  57: F.S  997312  15:08:57.127 -.189 .2O21
DCF77 0.582.291.829   187961  58: T.M 2001397  15:08:58.227 -. 86 ______
DCF77 0.583.290.190    86009   0: F.S  998361  15:09:00.126 -. 90 minute
DCF77 0.584.292.262    89550   1: F.S 1002072  15:09:01.128 -.188   |o|
DCF77 0.585.293.105   188381   2: T.S 1000843  15:09:02.229 -.185   |-|
```

Der Auszug zeigt keine Fehler beim Canaduino-Modul und gutes timing. Logs
über drei Tage zeigten drei Fehler pro Stunde mit Zeitkriterien, bei denen
billiger Module weitgehend versagten. Drei Fehler pro Stunde sind ohne
weiteres tolerierbar. 20 oder gar mehr als 100 -- mit anderen Modulen 
durchaus beobachtet -- gefährden die Verfügbarkeit der Zeitinformation.

Gerechterweise sei gesagt said: Man kann "MAS6180 plus Nichts"-Modulen
mit zusätzlicher Beschaltung, sorgfältigster Antennenausrichtung und 
sehr weichen Zeitkriterien (so dass der Unterschied von true und false
verschwimmt) schon verwenden. Man könnte sogar versuchen Spikes innerhalb
einer Sekunde mit gemäßigt intelligenten Algorithmen auszufiltern.   
Aber ist es das wert?<img 
src="/assets/images/klinke34DCF77.jpg" width="259" height="228" 
title="3 or 4 pin jack connector"  alt="3 or 4 pin jack connector"
class="imgonright" />

Nimm einfach ein gutes Modul und genieße die Ergebnisse.

## Modulanschluss am µC 

Wenn man mehrere Empfangs-Module *) und/oder Dekodierer (wie hier Pis)
hat, empfehle ich einen dreipoligen oder gar vierpoligen 3,5mm Klinkenstecker
-- männlich und Kabel am Empfänger, weiblich beim Pi. Die (eine)
vernünftige Belegung ist:   
 &nbsp; 1 &nbsp; &nbsp; &nbsp; Ub +    
 &nbsp; 2 &nbsp; &nbsp; &nbsp; DCF77-Signal     
 &nbsp; 3 / - &nbsp; AM "receiver Off" Eingang**)    
 &nbsp; 4 / 3 &nbsp; Ground, -, Masse
 
Es gibt kommerziell komplette AM-Empfangsgeräte mit (natürlich*)) 
kompatiblen dreipoligen 3.5mm Klinkensteckern, unter Namen wie "Aktivantenne"
oder "Filterantenne". Für immer noch vernünftige Preise sind Sie damit vom
Bohren und Löten erlöst. Andererseits sind diese in den meisten Fällen
kritischer Bedingungen (Störungen) den hausgemachten Canaduino-Geräten 
unterlegen.      
<small>______________    
Anm. *): Beim Stecken und Ziehen werden bei dieser Belegung keine 
Signal-Pins gefährdet. Auch unter Spannung ist das praktisch sicher. Bei
jeder anderen Permutation ist es das nicht.     
Anm. **): Dies ist i.A. der PDN (power down) Pin des 
 MAS6180C AM-Empfänger-IC. Plus oder offen bedeutet Aus/keine Operation.
 Gewöhnlich schließt man diesen Eingang einfach an Masse an. Mit dem 
 vierpoligen Klinkenstecker in der dreipoligen Buchse passiert das 
 von selbst.  
<hr />

## DCF77-Implementierung mit dem Pi

Soweit betrachteten wir den Vorzug von DCF77 gegenüber batteriebetriebenen 
sogenannten "Echtzeituhren" als redundante Zeitquelle für einen "Zoo" von
Controllern -- in unseren Projekten vielfach Pis.

Über Algorithmen und Tricks für die DCF77-Dekodierung in C berichte ich 
vielleicht in einem getrennten Beitrag (post).
