---
layout: weAutPost
title: DCF77 mit dem Pi dekodieren
bigTitle: DCF77 mit Raspberry
headline: Dekodieren der DCF77 AM-Signale mit einem Pi
permalink: /:title.html
date:   2021-03-08
categories: Raspberry Pi DCF77 decoder pigpoid
lang: de
enPage: dcf77decOnPi.html
copyrightYear: 2021
revision: 1
reviDate: 2021-01-24
itemtype: "http://schema.org/BlogPosting"
isPost: true
published: true
commentIssueId: 9
commentShare: timeSyncLocNet_de.html
---
Im [Beitrag "Zeitsynchronisation im lokalen Netz"](/timeSyncLocNet_de.html)
beschrieb ich die Nutzung von
<abbr title="Rufzeichen des Langwellensenders in Mainflingen">DCF77</abbr>-Empfängern
als Quelle der (Atom-)  Standardzeit der 
<abbr title="Physikalisch-Technischen Bundesanstalt, Braunschweig">PTB</abbr>.
Die Wahl von <abbr title="Amplitudenmodulation">AM</abbr>-Empfängermodulen
wurde ebenso behandelt wie ihr Anschluss an einen  µ-Controller wie den
Raspberry Pi.

Hier nun geht es um die Dekodierung des AM-Signals mit C-Software auf einem  Pi. 

## Die Natur des AM-Signals

Zu Beginn einer jeden Sekunde einer Minute mit Ausnahme der letzten wird die
Amplitude für 100 oder 200 ms auf 15% abgesenkt. Für den Rest der einen bzw.
zwei Sekunden wird die volle Amplitude (100%) gesendet.

Der Digitalausgang von AM-Empfängermodulen ist üblicherweise[<img 
src="/assets/images/goodDCF77sig_0466sm.jpg" width="426" height="248" 
title="ein gutes DCF77 signal; click: groß"  alt="gutes DCF77 signal"
class="imgonright" />](/assets/images/goodDCF77sig_0466.jpg "click: groß")    
  &nbsp; &bull; &nbsp; HI (1, true)&nbsp; 
      für die Zeit mit 15% Amplitude &nbsp; und   
  &nbsp; &bull; &nbsp; LO (0, false) für den Rest der Modulationsperiode von
      1 bzw. 2s.    
Aber es gibt es auch umgekehrt -- was die Software mit einer Option,
à la  -&nbsp;-&nbsp;invert&nbsp; handhaben sollte.

Für die Modulationsdauer gilt    
  &nbsp; &bull; &nbsp; 200ms bedeutet true &nbsp; und     
  &nbsp; &bull; &nbsp; 100ms bedeutet false.

Es gilt also, folgende Informationen zu erlangen und zu 
dekodieren   
  &nbsp; a) &nbsp; ein 58-Bit-**Telegram** in jeder Minute &nbsp; und  
  &nbsp; b) &nbsp; die **Startzeiten** der Modulationsperioden.
  
a): Das Telegramm beginnt mit 14  Bit kommerzieller Geheiminformation. Die 
übrigen relevanten 44 Bits enthalten alle Zeit- und Datumsinformationen.
Der Kode ist sehr einfach und gut publiziert.

b): Die Zeit sollte so exakt wie möglich erfasst werden -- am besten als ein
µs-Zeitstempel mit 20..50µs Genauigkeit. Mit einem solchen Zeitstempel und
der zugehörigen Zeit können wir die Systemzeit setzen bzw. korrigieren oder
Zeit&shy;signale bzw. -antworten generieren -- also DCF77 als 
redundante oder auch
einzige Zeit&shy;quelle nutzen.

So kommt es letztendlich auf das genaue Erfassen der **Startzeiten** an.

## Erfassen (sampling) des AM-Signals

Drei Wege sind denkbar   
  &nbsp; A) &nbsp; Eingabe des Empfängersignals im 1ms-Zyklus,    
  &nbsp; B) &nbsp; eine Interrupt-Prozedur für beide Signalflanken oder    
  &nbsp; C) &nbsp; das Ausnutzen der Fähigkeiten von pigpiod.
  
Mit einem Laufzeitsystem oder Framework mit SPS-artigen Zyklen, wie in
[Raspberry for remote services](https://a-weinert.de/pub/raspberry4remoteServices.pdf
"Raspberry for remote services (.pdf, download)")
(see [publications](https://a-weinert.de/publication_en.html)) 
beschrieben und in allen unseren µC-Steuerungsprojekten eingesetzt, ist der
Ansatz A) möglich. Andererseits möchten wir letztlich DCF77 als Ersatz von
oder Redundanz zu NTP einsetzen. Hier muss die Genauigkeit und ggf. die 
Synchronität um mindestens eine Größenordnung besser sein als der jeweils
schnellste Zyklus. Diesen zur Zeit&shy;er&shy;fassung einzu&shy;setzen 
verbietet sich im
Allgemeinen. (Für eine DCF77-Uhr für Menschen würde es genügen.)

Eine Sequenz von zeitgestempelten Ereignissen für die spätere Auswertung
in einem eigenen thread aufzuzeichnen ist per se ein guter Ansatz. Und ein
Interrupt-Handler (B) könnte dies. Die Raspberry-Prozessoren haben ein
Interrupt-System, das Flanken-Interrupts für jeden
<abbr title="general purpose input/output">GPIO</abbr> bietet. Die
Handhabung aber ist nicht einfach und die enthaltende (organisierende) 
Anwendung braucht sudo-Privilegien.

Ein eingängliche, verständliche  C-Lösung mit Pi-GPIO-Interrupts ist kaum
zu finden. Einige Bibliotheken oder Frameworks verwenden einen schnellen
Abtast-thread + interthread/interprocess-Kommunikation -- und nennen
das Ganze "interrupt".    
Nun, der Ansatz ist OK. Es ist ein bisschen A) "in schneller" und  das, was C)
perfekt und nahtlos unterstützt. Es als Interrupt zu verkaufen, ist jedoch 
Etikettenschwindel.

Ich bin ein großer Fan der pigpiod library von Joan N.N. Siehe die 
betreffenden Kapitel und die Literaturliste in der oben erwähnten
[Publikation](https://a-weinert.de/pub/raspberry4remoteServices.pdf
"Raspberry for remote services (.pdf, download"). Wenig überraschend nutze
ich auch hier die Fähigkeiten einer Bibliothek, die ich eh auf jedem Pi
einsetze.


## Erfassen der Modulationsflanken mit pigpiod

pigpiod ist wie gesagt unser bevorzugter Ansatz für IO mit dem Raspberry
und auch der einzige den wir hier für echte Steuerungsanwendungen nutzen.
pigpiod definiert einen Server oder daemon, der alles initialisiert und (nur)
die verwendeten GPIOs mit all ihren möglichen Funktionen steuert. Dieser 
Server muss mit sudo gestartet werden und kann dann unbegrenzt laufen. Auf
allen Raspberry Pis, wo wir dies installierten, erledigen wir den Start 
ab Einschalten mit einem (sudo) crontab-Eintrag:   
```bash
@reboot  /usr/local/bin/pigpiod  -s 10
```
Die Option ```-s 10``` lässt pigpiod in einem 10µs-Zyklus, statt
default 5µs, laufen. Für alle unsere bisherigen Anwendungen waren
20µs Verzögerung bzw. Genauigkeit von Signalen und Zeitstempeln ausreichend.
(Die schnellste Einstellung wäre 1µs.)

Programme, die (process) IO machen, kommunizieren einfach mit dem 
daemon über   
  &nbsp; &bull; &nbsp; socket  (wie im Projekt 
  [GPIO mit Java](/raspiGPIOjava.html "Raspberry Pi Ein- und Ausgabe mit Java"),   
  &nbsp; &bull; &nbsp; pipe    (hier nie genutzt) oder     
  &nbsp; &bull; &nbsp;  mit einem Satz von C-Funktionen (die das socket
   interface nutzen).

Bei pigpiod kann man eine callback-Funktion für die Flanke(n) eines 
Eingangs-GPIO setzen:
```c
set_mode(thePi, dcfGpio, PI_INPUT);             // make dcfGpio input
if (dcfPUD <=PI_PUD_UP) // Raspberry Pi's pull up is sufficient for open
   set_pull_up_down(thePi, dcfGpio, dcfPUD);  // collector output stages
dcf77callbackID = callback(thePi,            // register dcf77receiveRec
   dcfGpio, EITHER_EDGE, &dcf77receiveRec); // as callback function
```
Das ist semantisch ganz nahe an Interrupts. Aber hierbei vermeiden wir
sämtliche Komplikationen (und Gefahren) von Interrupts und bekommen 
einen 32 Bit Zeistempel für jede Flanke mit 1µs Auflösung und
etwa 15µs Genauigkeit (mit ```-s 10```, s.o.) als Extra:
```c
/**  The actual respectively last modulation period data received. */
dcf77recPerData_t dfc77actRecPer;
   
/**  DCF77 receive recorder.
 *
 *  This is a pigpiod callback function for .... (in other file)
 */
void dcf77receiveRec(int pi, unsigned gpio, unsigned level, uint32_t tick){
  uint32_t const dif = tick - dfc77actRecPer.tic;
  dcf77lastLevel = dcfInvert ? !level : level; // handle AM receiver polarity
  if (dcf77lastLevel) { // in 15% modulation, i.e end of last period
    dfc77actRecPer.per = dif; // calculate duration
    dfc77ringBrecPer[dfc77ringBrecWInd] = dfc77actRecPer; // put in FiFo
    ++dfc77ringBrecWInd;  // signal FiFo write respectively period end
    dfc77actRecPer.tic = tick;  // start of new period
  } else {  // full (100%) signal 
    memcpy(dfc77actRecPer.sysClk, lastSysClk, 12); // log time for current
    memcpy(lastSysClk, stmp23 + 11, 12);  // log time text for next period
    dfc77actRecPer.cbTic = get_current_tick(pi);  // call back tick
    dfc77actRecPer.tim = dif;
    dfc77actRecPer.sysClk[12] = dfc77actRecPer.sysClk[13] = '\0';
  }
} // dcf77receiveRec(int, 2*unsigned, uint32_t)
```

Die gezeigte call back-Funktion erzeugt für jede Modulationsperiode eine
Aufzeichnung (record) dfc77actRecPer vom Typ dcf77recPerData_t und tut ihn
in einen 
<abbr title="first in first out, queue">FiFo</abbr> (ring buffer).   
Die Struktur (struct) sieht so aus (Auszug mit gekürzten Kommentaren):
```c
/** Data for one received DCF77 AM period. */
typedef struct {
/** The piogpiod time tick in µs. */
  uint32_t tic;
/** The system time as text hh:mm:ss.mmm at period start for logging convenience.
 *
 *  It is the time when the call back function for start of 15% AM is called.
 */
  char sysClk[14]; // text provided by rasProject_01 framework 
/** The system tick at second's start in µs.
 *
 *  It is the time of entering the call back function for 15% AM.
 *  By the pigpiod event to callback entry delay cbTic should be later than tic. By
 *  their difference an apparent system-DCF77 time difference has to be shortened. 
 */
  uint32_t cbTic;
/** The 15% modulation's duration in µs. */
  uint32_t tim; // 100ms: FALSE, 200ms: TRUE
/** The period's duration in µs. */
  uint32_t per; // 1s: second's end, 2s: minute's end
} dcf77recPerData_t;
```

Mit  
 &nbsp; &bull; &nbsp; der Startzeit .tic, idealerweise zu jeder "Atom-" Sekunde,   
 &nbsp; &bull; &nbsp; der Periode .per, idealerweise entweder 1s oder 2s,  und     
 &nbsp; &bull; &nbsp; der Modulationszeit .tim, idealerweise entweder 100ms oder 200ms,   
aufgezeichnet über eine Minute haben wir alles um die DCF77-Zeit zu
dekodieren und zu nutzen.

## Anmerkung zum Diskriminieren und Dekodieren

Mit der Kette von records  -- einer pro Modulationsperiode, gestört oder 
korrekt -- ist der erste Schritt die Werte .tim und .per. zu diskriminieren.    
Wir definieren hierzu eine Struktur für (uint32_t) Wertbereiche:
```c
/** Values for discrimination of duration. */
typedef struct {
/** Index.
 *  The lowest value in a chain (array or enum) shall get the index 0. */
  unsigned i;
/** Value.
 *  This is the upper bound value of the range. <br />
 *  The highest value in a chain (array or enum) is implied as the maximum
 *  possible / measurable value. */
  uint32_t v;
/** Name.
 *  This is a short (5 character max.) name of the discrimination range. */
  char n[6];
/** Charakter.
 *  This is a recognisable character for the discrimination range, unique
 *  for the complete chain. It may be used for (narrow) logs instead of .n */
  char c;
} durDiscrPointData_t;
```
Für die Modulationsperiode (.per) und die Modulationszeit (.tim) definieren 
wir damit jeweils fünf Bereiche, davon zwei gute und drei schlechte
(darunter, undefiniert dazwischen und darüber):
```c
/*  Discrimination values for the 15% modulation time. */
durDiscrPointData_t timDiscH[5] = {
    {0,  60000, "spike", 's'},  // 0 .. 59.9 ms modulation spike
    {1, 128999, "false", 'F'},  
    {2, 130000, "undef", 'u'},
    {3, 228000, "true",  'T'},
    {4, MXUI32, "error", 'e'}      };
/*  Discrimination values for the modulation period. */
durDiscrPointData_t perDiscH[5] = {
    {0,  960000, "below", 'b'},
    {1, 1040000, "secTk", 'S'}, // seconds tick
    {2, 1960000, "undef", 'u'},
    {3, 2040000, "minTk", 'M'}, // end minute tick (last two seconds)
    {4,  MXUI32, "error", 'e'}    };
```
Abhängig von den eingesetzten AM-Empfängern, ihrer Qualität, ggf.
zusätzlichen Filtern (nicht empfohlen) usw. können weitere Sätze mit 
anderen Grenzen bereitgestellt werden. Die Array-Länge ist aber
offensichtlich immer 5. Die ermöglicht eine optimale
Driskriminator-Funktion, die den zum Wert passenden Eintrag liefert:
```c
/*  Discriminating a value.
 *  @param table discrimination table of length 5. With other lengths the
 *               function will fail. Must not be null.
 *  @param value the number to be discriminated
 *  @return  the lowest table entry with value < table[i].v
 */
durDiscrPointData_t * disc5(durDiscrPointData_t table[], uint32_t const value){
  if (value < table[1].v) {
    if (value < table[0].v) return & table[0];
    return & table[1];
  }
  if (value < table[3].v) {
    if (value < table[2].v) return & table[2];
    return & table[3];
  }
  return & table[4]; // Note: table[4].v (MXUI32 above) is never used
} // disc5(durDiscrPointData_t const *, uint32_t const)
```
Nach der Diskrimierung von Modulationszeit (.tim) und -periode (.per)
gibt es vier mögliche gute Ergebnisse:   
  &nbsp; &bull; &nbsp; F.S &nbsp;false . Sekunden-Tick   
  &nbsp; &bull; &nbsp; T.S &nbsp;true&nbsp; . Sekunden-Tick   
  &nbsp; &bull; &nbsp; F.M &nbsp;false . Minuten-End-Tick  (2 s)      
  &nbsp; &bull; &nbsp; T.M &nbsp;false . Minuten-End-Tick (2 s)       
Alle anderen Kombinationen sind schlecht bzw. gestört. Ohne Störungen
haben wir eine Kette logischer Werte (true oder false), denen wir Indizes
bzw. Sekunden-Nummern von 0 bis 58 zuordnen und dekodieren können.
Und idealerweise würde jeder jeder Zeitstempel (.tic) einer 
Modulationsperiode eine "echte- Atom-" Sekunde markieren.

Aber leider sehen wir Ausfälle Störungen aller Arten, die auch schon mal
mehr als 59 Modulationsperioden pro Minute vortäuschen. Mit guten
Empfängern und geeigneten Antennenstandorten sind Störungen recht selten --
aber dennoch, sie passieren.

## Störungen mit pigpiod filtern

Die gewöhnliche Störung bei AM-Rundfunk sind kurze -- oft unter 1 ms --
Störungen entweder als Signalausfall oder Störsignale anderer Sender oder 
elektrischer/elektronischer Geräte. Im Fall von DCF77 täuschen letztere 
i.a. anstelle der 15% Modulation volles Signal vor. Neben kurzen Spikes 
kommen auch länger anhaltende Störungen (40 ms und mehr) vor.

Kurze Spikes bei binären Signalen können mit einfachen "de-bouncing"
Algorithmen ausgefiltert werden, die alle Signalwechsel unterhalb einer
minimalen Dauer ignorieren. Und, dankenswerterweise, bietet pigpiod genau
diese Fähigkeit für Eingänge, die man mit call back-Funktionen überwacht.
```c
   if (dcfGlitch > 30000) dcfGlitch = 0;
   set_glitch_filter(thePi, dcfGpio, dcfGlitch);
```
Mit dem Einsatz dieser glitch-Filter kommt der Aufruf der call back-Funktion
natürlich später, aber pigpiod setzt den Zeitstempel -- wie nicht
 anders zu erwarten -- immer noch korrekt.
  
Der Wert für den Spike- bzw. glitch-Filter kann zwischen  0 (kein Filter) 
und 30.000 µs gesetzt werden. Nach vielen Experimenten (über Wochen) halten 
wir ihn unter 10ms.   
 &nbsp; &nbsp; ``` dcf77onPi --glitch 9999 >> logs/dcf77test32cAnG.log & ```

Es zeigte sich, dass höhere Werte gelegentlich über viele Sekunden hinweg 
ausfiltern. Also könnte man fälschlicher zur Diagnose "Gar kein Empfang" 
oder "Empfänger Aus" kommen.

## Zusätzliches Filter für Modulationsstörungen

Der zusätzliche Nutzen von 30ms (das Maximum) Filterzeit verglichen mit
den bevorzugten 10 ms ist bei guten Empfängern marginal. Und außerdem könnte
beispielsweise die Verkürzung einer Modulationsperiode unter z.B. 400ms durch
einen Spike mit dem glitch-Filter von pigpiod sowieso nicht ausgefiltert 
erden. Genau so etwas kommt durchaus vor und führt dann meistens zu
zwei Perioden, wo eine sein sollte. Ohne Zusatzmaßnahmen ist dann alles 
Indizieren und Dekodieren für die betroffene Minute verloren.

Ein recht einfaches zusätzliches Filter (Software) hiergegen ist es, das 
erste Vorkommen von ?.b zurückzuhalten und diese (zu kurze) Periode
in korrekter Weise zur nächsten hinzu zu addieren. Hiermit können die
meisten solchen Fälle repariert werden. Der Log-Auszug (Fr, 29.01.2021 14:16) 
zeigt eine Minute, die man ansonsten in Sekunde 41 verloren hätte:
```c
###        .tic       .tim    sec dis    .per  system time  -cbck decode
DCF77 1.839.060.809   184080  36: T.S 1000492  14:17:35.138 -.185
DCF77 1.840.061.301    84361  37: F.S  998913  14:17:36.238 -. 85
DCF77 1.841.060.214    80060  38: F.S  998333  14:17:37.138 -. 80
DCF77 1.842.058.547   186510  39: T.S 1004452  14:17:38.133 -.187
DCF77 1.843.062.999    79390  40: F.S 1002533  14:17:39.238 -. 80
DCF77 1.844.065.532    28300  41: s#b   53930  14:17:40.135 ignor= // spiky |
DCF77 1.844.119.462   174560  41: T=S  994862  14:17:41.087 -. 29 29.mm. // v
DCF77 1.845.060.394   180051  42: T.S 1004343  14:17:41.232 -.180
DCF77 1.846.064.737    79360  43: F.S  996692  14:17:42.233 -. 79
DCF77 1.847.061.429   181361  44: T.S 1003933  14:17:43.136 -.181 Day:Fr
DCF77 1.848.065.362   175890  45: T.S  994952  14:17:44.235 -.176
DCF77 1.849.060.314    82120  46: F.S 1003043  14:17:45.234 -. 82
DCF77 1.850.063.357    74190  47: F.S  997652  14:17:46.134 -. 75
DCF77 1.851.061.009    82901  48: F.S 1002913  14:17:47.131 -. 83
DCF77 1.852.063.922    78590  49: F.S  997822  14:17:48.136 -. 79 dd.01.
```
Diese "gemäßigt intelligente" Filter rettet die meisten solcher Fälle
(welche mit guten Empfängern eh schon selten sind). Es kommt vor, dass dieser 
Algorithmus versagt, wo das Addieren der gestörten Periode zur vorangehenden
geholfen hätte. Nun wäre es möglich auch das noch zu implementieren. Aber
nach unseren Beobachtungen ist das weder der Mühe noch der verminderten 
Lesbarkeit des Programms wert.

## Schlussbemerkung

Das Empfangen und Dekodieren von DCF77 haben wir auf einem Pi mit
preiswerten AM-Empfängermodulen implementiert. Mit dem Empfangs-Tick und 
dem zugehörigen Paar "call back-Tick + call back-Systemzeit" haben wir die 
Werte zur Korrektur bzw. dem Setzen der Systemzeit beieinander. Somit haben
wir eine (redundante) Zeitquelle, die NTP ersetzen oder ergänzen kann. Damit
kann man auch verteilte Systeme in einem abgeschlossenen Netz synchronisieren
oder dort einen (zusätzlichen) NTP-Server bereitsetellen.

Der ungekürzten Kode findet sich im SVN-Repository
[weinert-automation.de/svn/](https://weinert-automation.de/svn/rasProject_01/ "guest:guest").

## Literatur

Weinert, Albrecht,  &nbsp;"[Zeitsynchronisation im lokalen Netz](/timeSyncLocNet_de.html)", 
 &nbsp;2021 [post](https://a-weinert.github.io/index.html "blog content") 

Weinert, Albrecht,  &nbsp;"[Raspberry for remote services](https://a-weinert.de/pub/raspberry4remoteServices.pdf "(.pdf, download)")", 
 &nbsp; 2018 &ndash; 2020 [publication](https://a-weinert.de/publication.html)
 
<abbr title="nomen nescio">N.N</abbr>, Joan, &nbsp;"[pigpio Daemon](http://abyz.me.uk/rpi/pigpio/pigpiod.html)"  &nbsp;2020 [documentation](http://abyz.me.uk/rpi/pigpio/)

<abbr title="Physikalisch-Technische Bundesanstalt">PTB</abbr> &nbsp;"[DCF77](https://www.ptb.de/cms/ptb/fachabteilungen/abt4/fb-44/ag-442/verbreitung-der-gesetzlichen-zeit/dcf77.html)" &nbsp;2004 German survey


