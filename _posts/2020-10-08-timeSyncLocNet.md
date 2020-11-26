---
layout: weAutPost
title: Time synchronisation in local nets
bigTitle: All same time
permalink: /:title.html
date:   2020-10-08
categories: Raspberry Pi distributed time clock NTP DCF77
lang: en
dePage:
copyrightYear: 2020
revision: 2
reviDate: 2020-10-26
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---

In a common network one should have the same time on all machines -- be them 
servers, workstations or small controllers, like Pis for real
time control as described, e.g. in 
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
requirement on the synchronisation of those system times. And as ever,
"real time" does nothing say on absolute values. The maximum tolerable 
system time difference of two of your systems might be something between
50ns and 2min -- it depends. Anyway, if a system after reboot doesn't 
know hour nor date abandon all hope.

## NTP server

The proven way to synchronous system times is having all systems use the 
same [NTP](#ntp-server "Net time protocol") server or the same ordered
set of servers. At least one of them must be reachable for all controllers 
vie (W)LAN.   
A good approach is having one or two NTP servers on the internal (W)LAN, 
getting it's own time by one or more external time sources. Reasons for 
a common internal NTP server are probably more
stable transmission times and reachability for all. Not all computers or
embedded systems should have access to outside servers.

The NTP server role is often given to domain controllers usually having
the internal IP p.r.v.1 to p.v.r.4.   
In private homes or small companies 
[DNS](#ntp-server "Domain name system")  (and 
[DHCP](#ntp-server "Dynamic host configuration protocol")) roles
are often given the provider's or private router. In Germany this will
often be a
[fritz.box](#ntp-server "fritz.box is the name; FRITZ!Box is the product"),
IP 192.168.178.1. The following excerpt of
/etc/ntp.conf sets the fritz.box as sole time server:

```
# You do need to talk to an NTP server or two (or three).
server 192.168.178.1
# 192.168.178.1 is fritz.box (the FRITZ!Box)
# pool.ntp.org maps to about 1000 low-stratum NTP servers.
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
could not do on a working day.

When tracking NTP problems the toil of having Windows and Linux in the net
is sufficient. Not finding the standard NTP tools and services on just the
most modern Raspians came as a surprising extra impertinence.

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
sudo systemctl restart ntp
sudo systemctl restart ntp # it might take 3 min until sync
sudo ntpdate -u fritz.box  # force setting time on a very async client 
```
This restores the uniform world of Linux NTP.
  

## NTP failure

If NTP fails in a local site the drift of the clients away from official time
abd from each other will start. A client rebooting in such situation may 
even start with totally gaga time. Well, on some Linuxes and Rasbians a trick
with the file ```/etc/fake-hwclock.data``` guarantees a monotonic 
time over shutdown/reboot but, of course, no correctness.

To avoid such incorrectness on NTP service failure a redundant
time source is necessary.

## Real time clocks

Therefore often so called "real time clocks" are used. They are battery 
powered quartz clocks without hands or display but with an interface
to the processor/controller to be read and set. As long as the setting by
NTP fails they drift as every over non-synchronised clock and if the
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
near Frankfurt/Main. It can be received  in large parts of Europe. Its
77,5 kHz carrier is both amplitude 
([AM](#dcf77-signal "amplitude modulation")) and phase
([PM](#dcf77-signal "phase modulation")) modulated.

At the begin of (most) seconds the amplitude is reduced to 25% for 100 ms
(false) or 200 ms (true. From about 3ms before the begin of each second to 
exact 200 ms after the second's begin the phase
is 0° and then modulated +/- 13° in a way that the net phase shift is zero.   

The PM is much less prone to 
[EMI](#dcf77-signal "electro-magnetic interference") and the second's tick
can be detected more exactly. A source of PM disturbance is an extra PM by 
a storm moving the large long wave transmitter antenna (which would 
be reported).  
The technique of an PM receiver and the decoding of the telegram bits is
more complicated and quite expensive. Hence, notwithstanding PM's
advantages, we will use AM receivers.

The coding in the 59 telegram bits carries all time and date information,
including [CET (MEZ)](#dcf77-signal "Central European Time, UTC + 1h") /
[CEST (MESZ)](#dcf77-signal "CE summer Time, UTC + 2h"). Hence, we 
also get world time [UTC](#dcf77-signal "Coordinated Universal Time").

## DCF77 receiver

An [AM](#dcf77-receiver "amplitude modulation") receiver's signal
gives an exact second tick for all but the last seconds of a minute.
These pulses yield a low frequency (1 bit /s) data stream. This gives the
CET/CEST date and time information as well as DST on or off and leap
seconds announcement. 

Hence when adding a DCF77 receiver to a controller/computer within a 
minute after start of receiving or reboot one has the atomic standard time.  
Properties:    
 &nbsp; o &nbsp; needs one digital port of the controller    
 &nbsp; - &nbsp;&nbsp; usually no OS support    
 &nbsp; - &nbsp;&nbsp; own DCF77 software / application needed (not rocket 
 science)        
 &nbsp; + &nbsp; no battery needed     
 &nbsp; + &nbsp; cheap but reliable DCF77 
  [AM](#dcf77-receiver "amplitude modulation") receiver modules available   
 &nbsp; - &nbsp;&nbsp; more subject  subject to EMI then PM receivers      
 &nbsp; + &nbsp; the module might be assembled together *) and supplied
   from the controller (a Raspberry Pi e.g.)    
 &nbsp; + &nbsp; the module might as well be put several meters away from
   the controller.    
 &nbsp; + &nbsp; the slow (1 bit/s) signal from one receiver might easily
   be distributed to many controllers.    
And the biggest +:
Any NTP server in Europe with any sense will in the end use PTB's atomic
clocks and hence DCF77 time. A system with time set by DCF will be in quite
good sync with a NTP used later and will not have make big jumps (or long
adjustment times) to correct time.

The good accordance of DCF77 and NTP does not hold on an hour before a leap
second **) if the NTP server uses the so called leap second
smearing as most do. This means NTP servers intentionally deliver the
wrong time. As DCF77 delivers an announcement in the last hour before a leap
second xx:59:60 one will know it without having read
[IERS bulletin C](https://www.iers.org/SharedDocs/News/EN/BulletinC.html
"Earth Rotation Services").   
_____    
<sup>Note *): It might be wise to put the receiver module and its ferrite
antenna in an extra casing connected by a thin three wire (best shielded)
cable to the Pi or whatever controller.   
Note **): Might the Brexit reduce the power of the British admirality so,
that the rest of the world can get rid of leap seconds.</sup>


Sofar we shared the considerations for choosing DCF77 instead 
of battery powered "real time clocks" as an extra redundant time source for
our embedded/distributed controller projects mostly with Raspberry Pis.

## DCF77 implementation with a Pi

Connecting a DCF77 receiver module to a Raspberry Pi and implementing the
decoding in C will be reported on later a separate publication/post.
