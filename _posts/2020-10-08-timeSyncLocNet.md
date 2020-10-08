---
layout: weAutPost
title: Time synchronisation in local nets
bigTitle: All same time
permalink: /:title.html
date:   2020-10-08
categories: Raspberry Pi distributed NTP DCF77
lang: en
dePage:
copyrightYear: 2020
revision: 2
reviDate: 2020-10-08
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---

In a common network one should have the same time on all machines -- be them 
servers, workstations or small controllers, like Pis for real
time control as described, e.g. in [this](https://a-weinert.de/pub/raspberry4remoteServices.pdf "Raspberry for remote services") in<!--more--> 
   [publication](https://a-weinert.de/pub/ "by A. Weinert").   
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
50ns and 2min -- it depends. Anyway, if after a system after reboot does not 
know hour nor date abandon all hope.

## NTP server

The proven way to synchronous system times is having all systems use the 
same [NTP](#ntp-server "Net time protocol")  server or the same ordered
set of servers.
Such NTP server must
be in site i.e. in the local (W)LAN. It may get its 
time from an external server.

Reasons for a common (first) NTP server being internal are (probably) more
stable transmission times and reachability for all. Not all computers or
embedded systems should have access to outside servers.

The NTP server role is usually given to domain controllers usually having
the internal IP p.r.v.1 to p.v.r.4.   
In private homes or small companies 
[DNS](#ntp-server "Domain name system")  (and 
[DHCP](#ntp-server "Dynymic host configuration protocol")) roles
are often given the provider's or private router. In Germany this will
often be a fritz.box, IP 192.168.178.1.

## NTP failure

If NTP fails in our local site drift will start. A system affected rebooting
would start with gaga time. To avoid this total de-synchronisation when NTP
servers or the connections to them fail a redundant time source 
is necessary.

## Real time clocks

Therefore often so called "real time clocks" are used. They are battery 
powered quartz clocks holding date also  without hands but with an interface
to the processor/controller to be read and set. As long as the setting by
NTP fails they drift as every over non-synchronised clocked and if the
battery gets low they drift faster or fail totally.

If by design such "real time clock" is incorporated in the hardware and
known to the [OS](#real-time-clocks "Operating System")
without any configuration (as is with standard PCs) use it.    
But think twice before fitting such thing to an (embedded) controller
serially without. One might get troubles to get/keep the thing working
from beginning or after updates. And checking/replacing a battery in some
places where those little systems have to dwell might be a nightmare.

## DCF77 receiver

A [DCF77](#dcf77-receiver
 "the callsign of the long wave time transmitter in Mainflingen, D")
 receiver is usable in large parts of central Europe. Its AM signal
gives an exact second clock, and these pulses yield a low frequency 
(1 bit /s) data stream. This gives the exact CET/CEST date and time 
information as well as DST on or off and leap seconds announcement.  Hence
within a minute after start of receiving or reboot one has the atomic
standard time. Properties:    
 &nbsp; o &nbsp; needs one digital port of the controller    
 &nbsp; - &nbsp; usually no OS support
 &nbsp; - &nbsp; own DCF77 software / (sudo) application needed (not  rocket 
 science)        
 &nbsp; + &nbsp; no battery needed
 &nbsp; + &nbsp; cheap but reliable DCF77 
  [AM](#dcf77-receiver "amplitude modulation") receiver modules available   
 &nbsp; - &nbsp; those (cheap) modules only demodulate the AM
   and not DCF77's 
  [PM](#dcf77-receiver "phase modulation") modulation
   (less subject to EMI).
 &nbsp; + &nbsp; the module might be assembled together and supplied
   from the controller (a Raspberry Pi e.g.)    
 &nbsp; + &nbsp; the module might as well be put several meters away from
   the controller.    
 &nbsp; + &nbsp; the slow (1 bit/s) signal from one receiver might easily
   be distributed to many controllers.    
And the biggest +:
Any NTP server in Europe with any sense will in the end PTB's atomic
clocks and hence DCF77 time. A systems with time set by DCF will be in quite
good sync with a NTP used later, i.e. will never have make big jumps to
correct time.

The good accordance of DCF77 and NTP does not hold on an hour or even a day
before a leap second if the NTP server uses the so called leap second
smearing (as most do) meaning intentionally delivering wrong time. As DCF77 
delivers an announcement in the last hour before leap second xx:59:60 one
knows it without having read
[IERS bulletin C](https://www.iers.org/SharedDocs/News/EN/BulletinC.html
"Earth Rotation Services").

Sofar we shared we shared the considerations for choosing DCF77 instead 
of battery powered "real time clocks" as second time source for our 
embedded/distributed controller projects mostly with Raspberry Pis.

## DCF77 implementation with a Pi

Connecting a DCF77 receiver module to a Raspberry Pi and implementing the
decoding in C will be reported on later -- here or in a separate publication.


