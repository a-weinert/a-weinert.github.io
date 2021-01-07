---
layout: weAutPost
title: Sync time by NTP & DCF77
bigTitle: Same time for all
headline: Time synchronisation in local nets
permalink: /:title.html
date:   2020-11-28
categories: Raspberry Pi distributed time clock NTP DCF77
lang: en
dePage: timeSyncLocNet_de.html
copyrightYear: 2020
revision: 6
reviDate: 2021-01-07
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---

In a [LAN](/timeSyncLocNet.html "Local Area Network") 
one should have the same time on all machines -- be them servers,
workstations or small controllers, like Pis for real time control as
described, e.g., in 
["Raspberry for remote services"](https://a-weinert.de/pub/raspberry4remoteServices.pdf "technical report (.pdf)")
(see<!--more--> also 
   [publications](http://a-weinert.de/publication_en.html "by A. Weinert")).   
The rationale: You want
 - comparable file dates and
 - log file entries that can be put in order over several
   systems. &nbsp; You have
 - distributed controller with co-ordinated timed actions.
 
These time dependent features would fail if internal time of the 
systems differs too much. Hence, we have a hard or soft real time 
requirement on the synchronisation of those system times. And 
"real time" does nothing say on absolute values. The maximum tolerable 
system time difference of two of your systems might be something between
50ns and 20s -- it depends. Anyway, if a system after reboot doesn't 
know hour nor date abandon all hope.

## NTP server

The proven way to synchronous times is having all systems use the 
same [NTP](#ntp-server "Net time protocol") server or the same ordered
set of servers. At least one of them must be reachable for all controllers 
via 
[(W)LAN](#ntp-server "(Wireless) Local Area Network").   
A good approach is having one or two NTP servers on the internal (W)LAN, 
getting its own time by one or more external time sources. Reasons for 
a common internal NTP server are probably more
stable transmission times and reachability for all. Not all computers or
embedded systems should have access to outside servers.

The NTP server role is often given to domain controllers usually having
the internal IP p.r.v.1 to p.v.r.4.   
In private homes or small companies 
[DNS](#ntp-server "Domain name system") (and 
[DHCP](#ntp-server "Dynamic host configuration protocol")) roles
are often given the provider's or your own private router. In Germany this
will often be a
[fritz.box](#ntp-server "fritz.box is the name; FRITZ!Box is the product"),
IP 192.168.178.1 by default. The following excerpt of
/etc/ntp.conf sets the fritz.box as sole time server:

```
# I need to talk to one NTP server or two (or three).
server 192.168.178.1
# 192.168.178.1 is fritz.box (the FRITZ!Box)
# pool.ntp.org maps to ~1000 low-stratum NTP servers.
#pool 0.debian.pool.ntp.org iburst
```

Note all pool entries being commented out, lest distract the client from
the fritz.box. NTP clients may prefer other offers. A fritz.box handling
dozens of telephones and some 100 active (W)LAN clients, USB drives and 
sometimes more is often less attractive than a full grown NTP server in the
Internet. If you really want an extra server or pool use fritz.box' time
source: ``` ntp1.t-online.de; 2.europe.pool.ntp.org ``` e.g.

The availability / usage of an NTP server may be checked by
e.g.:
```
ntpstat  # Linux
w32tm /stripchart /computer:192.168.178.1 /dataonly /samples:5 &REM Windows
```
## NTP with fritz.box and Raspberry Pi

On a FRITZ.Box 7490 with FRITZ!OS 7.21 we experienced a failure of its NTP
server function for all clients (diagnosed by w32tm, ntpstat etc.) while the 
box's NTP server configuration entries were still intact and all (W)LAN 
communication was OK. In the end (at Netzwerk -> Netzwerkeinstellungen)
un-ticking the NTP server role, pressing OK, counting to 20, ticking it ON
with OK re-animated the function. Reseting the FRITZ!Box
by power down and up probably would have the same effect, but this we
could not do on a busy working day.

When tracking NTP problems the toil of having Windows and Linux in the net
is enough. Not finding the standard NTP tools and services on just the
most modern Raspians (some called Raspberry Pi OS now) came as a 
surprising extra impertinence.

Well, we wanted the old NTP functions with the rich source of documentation
and experiences back.
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
This restores the uniform world of Linux' NTP.
  

## NTP failure

If NTP fails in a local site the drift of the clients away from official time
and from each other will start. A client rebooting in such situation may 
even start with totally gaga time. Well, on some Linuxes and Rasbians a trick
with the file ```/etc/fake-hwclock.data``` guarantees a monotonic 
time over shutdown/reboot but, of course, no correctness.

To avoid such incorrectness on NTP service failure a redundant
time source is necessary.

## Real time clocks

Therefore often so called "real time clocks" are used. They are battery 
powered quartz clocks without hands or display but with an interface
to the processor/controller to be read and set. As long as the setting by
NTP fails they drift as every other non-synchronised clock and if the
battery gets low they drift faster or fail totally.

If by design such "real time clock" is incorporated in the hardware and
known to the [OS](#real-time-clocks "Operating System")
without any configuration (as with standard PCs) use it.
   
But think twice before adding such thing to, e.g., an embedded controller.
One might get troubles to get/keep the thing working from beginning or 
after updates. And checking/replacing a battery in some places where
those little systems have to dwell might be a nightmare.    
A good alternative might be using the **DCF77 signal** with an inexpensive 
**DCF77 receiver**. A receiver module could even be shared by some clients.


## DCF77 signal

The German official/legal atomic time provided by the 
[PTB](#dcf77-signal "Physikalisch-Technische Bundesanstalt, Braunschweig")
is distributed by the long wave transmitter
[DCF77](#dcf77-signal
 "the callsign of the long wave time transmitter in Mainflingen")
near Aschaffenburg/Main. It can be received in large parts of Europe. Its
77,5 kHz carrier is both amplitude 
([AM](#dcf77-signal "amplitude modulation")) and phase
([PM](#dcf77-signal "phase modulation")) modulated.

At the begin of (most) seconds the amplitude is reduced to 15% for 100 ms
(false) or 200 ms (true). From about 3ms before the begin of a second to 
exactly 200 ms after the second's begin the phase is 0° and then 
modulated &plusmn;13° in a way that the net phase shift is zero.   

The PM is much less prone to 
[EMI](#dcf77-signal "electro-magnetic interference") and the time tick
can be detected more exactly (about 2µs vs. 200µs with AM). A source of 
PM disturbance is an extra modulation by a storm moving the large long wave
transmitter antenna (probably reported, Bit 15).   
The technique of an PM receiver and the decoding of the telegram bits is
more complicated and quite expensive. Hence, notwithstanding PM's
advantages, we will use AM receivers.

The AM signal gives a second start tick for all but the last seconds 
of a minute. These pulses yield a low frequency (1 bit /s) data stream. 
The coding in the 59 telegram bits carries all time and date information,
including [CET (MEZ)](#dcf77-signal "Central European Time, UTC + 1h") /
[CEST (MESZ)](#dcf77-signal "CE summer Time, UTC + 2h"). Thus we 
also get world time [UTC](#dcf77-signal "Coordinated Universal Time").

Hence when adding a DCF77 receiver to a controller/computer within a 
minute after start of receiving or reboot one has the standard time.
 
Any NTP server in Europe with any sense will in the end use PTB's atomic
clocks and hence DCF77 time. A system with time set by DCF will be in quite
good sync with a NTP used later and will not have make big jumps (or long
adjustment times) to correct time.   
The good accordance of DCF77 and NTP does not hold on an hour before a leap
second *) if the NTP server uses the so called leap second
smearing (a 2011 Google idea) as many do. This means, intentionally (!), NTP servers then deliver
the wrong time. As DCF77 delivers an announcement in the last hour before a
leap second (xx:59:60) one will be informed about this shameful NTP clock
quality without having to read
[IERS bulletin C](https://www.iers.org/SharedDocs/News/EN/BulletinC.html
"Earth Rotation Services").[<img 
src="/assets/images/DCF77rec_0469.jpg" width="310" height="431" 
title="DCF77 receiver, Canaduino module, full size (click)"
 alt="DCF77 receiver, Canaduino module, full size " class="imgonright" />](/assets/images/DCF77rec_0469.jpg
"image full size")  
<small>______________    
Note *): Might the Brexit reduce the power of the British admiralty so,
that the rest of the world can get rid of leap seconds.</small>


## DCF77 receiver

As said for technical and financial reasons we will use 
[AM](#dcf77-receiver "amplitude modulation") receiver modules. You get ones
for below 10€ and better quality ones for ~14€. Adding the cost for a small
plastic (!) casing 5m cable -- for the freedom to find a good place for the 
ferrite antenna -- etc. you can have a DCF77 receiver directly connectable
to a Raspberry Pi or another controller for less than 30€.

Properties:    
 &nbsp; o &nbsp; needs one digital port of the controller    
 &nbsp; - &nbsp;&nbsp; usually no OS support    
 &nbsp; - &nbsp;&nbsp; own DCF77 software / application needed (not rocket 
 science)        
 &nbsp; + &nbsp; no battery needed     
 &nbsp; + &nbsp; the module might be assembled together with *) and   
 &nbsp; + &nbsp; be supplied from the controller (a Raspberry Pi e.g.)    
 &nbsp; + &nbsp; the module might as well be put several meters away from
   the controller.    
 &nbsp; + &nbsp; the signal from one receiver be distributed
    to multiple **) controllers.

There are AM receiver modules below 10€ from Pollin and other vendors. The
have been used with success. To test them before use an oscilloscope or a 
programme, like testOnPi. The log excerpt
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
shows delivering erroneous (e) and undefined (u) results 
as well as short / spiky (b s) modulation pulses and periods. This happens
with very bad receiving conditions (misdirected antenna or strong EMI) or
with low grade receiver modules.      
Those cheap module's circuit consists of an AM receiver chip (MAS6180 e.g.),
a filter quartz and almost nothing else. The out pin is very sensitive to EMI
seemingly acting as input. Some modules got broken (ending the joy on 
the bargain) when connected a shielded cable (probe) was connected to an 
output. Those "MAS6180 only" modules do always need an extra 
<abbr title="open collector">OC</abbr> output stage and supply
filters. Without you hardly get two minutes of fault free pulses.       
<small>______________    
Note *): It's wiser to put the receiver module and its ferrite
antenna in an extra casing connected by a thin three wire (best shielded)
cable to the Pi or whatever controller.         
Note **): Here a decoupling by multiple NPN open collector output stages 
would be necessary and probably extra considerations on the receiver's 
supply.</small>

In the end it is better to spend 12..16€ for a module which comes with 
all that, like e.g. the CANADUINO DCF77 receiver kit,
[see image](/assets/images/DCF77rec_0469.jpg "Canaduino kit assembled"). It
comes with all necessary extras to the AM receiver chip: output stages, 
power supply circuitry and even extra LEDs to optionally watch the 
operation. Nevertheless, we always recommend an extra OC output stage as it
allows an independent power supply for the receiver (more than 3.3V and not
from the PI) and the Pi.            
The log Canaduino receiver excerpt was taken
with ```testOnPi  --DCF77``` obviously on Mo, 2021-01-04, 15:08.

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

The excerpt shows no errors for the Canaduino module and good timing values. Logging over days gave 3 errors per
hour with time criteria where most cheap modules would have failed
completely. Three errors per hour can easily be ignored and bypassed. 20 
to more than 100 --
as have been observed with cheap modules -- threaten the availability of the 
time information. 

Rightfully it has to said: It is possible to use the cheap "MAS6180 only"
modules with extra circuitry, meticulous antenna positioning and very "soft"
timing criteria. One can even filter out one extra modulation spike
within a second by a mildly clever algorithm.   
But is that worthwhile?<img 
src="/assets/images/klinke34DCF77.jpg" width="259" height="228" 
title="3 or 4 pin jack connector"  alt="3 or 4 pin jack connector"
class="imgonright" />

Just take a good module and enjoy the results.

## Plugging the module to the µC 

When having multiple receiving modules *) and/or some decoding devices
(like in our case Pis) I recommend a three pin
or even quadripolar 3.5mm jack connection -- male and cable at the receiver,
female to the Pi. The (one) reasonable *) assignment is:    
 &nbsp; 1 &nbsp; &nbsp; &nbsp; Ub +    
 &nbsp; 2 &nbsp; &nbsp; &nbsp; DCF77 signal     
 &nbsp; 3 / - &nbsp; AM receiver Off input **)    
 &nbsp; 4 / 3 &nbsp; Ground
 
There are complete AM receiver module with (of course *)) compatible 3.5mm
jacks commercially available under names like "Aktivantenne" or
"Filterantenne". For still reasonable prices you are relieved from drilling
and soldering. On the other hand, in most cases of critical (jamming)
conditions they were outperformed by the homemade Canaduino based devices.    
<small>______________    
Note *): On plugging in and out this assignment won't endanger signal pins.  
Plugging with power on is practically safe. With any other permutation it is
not.     
Note **): This is usually the PDN (power down) pin of the MAS6180C AM
 receiver IC. Hi or open means Off/ no operation. Usually (and with the 
 three pin connection) it would be tight to ground.    
 This will be done automatically when the receivers quadripolar male 
 jack is put in three pin female plug on the µC side.  
<hr />

## DCF77 implementation with a Pi

So far we shared the considerations for choosing DCF77 instead 
of battery powered "real time clocks" as an extra redundant time source for
our embedded/distributed controller projects mostly with Raspberry Pis.

Algorithms and tricks for implementing the DCF77 decoding in C may be
reported on later in a separate publication/post.
