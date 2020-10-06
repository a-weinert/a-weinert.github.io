---
layout: weAutPost
title: Scann QR code with Pi
bigTitle: Pi for Bar &amp; QR
permalink: /:title.html
date:   2020-10-05
categories: Raspberry Pi bar code QR USB keyboard
lang: en
dePage:
copyrightYear: 2020
revision: 2
reviDate: 2020-10-06
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---

One of our realtime process control project with Raspberry Pi and C shall be 
enhanced with a QR and bar code scanner for access and booking. The ID cards 
in question would contain only numbers. In hindsight, regarding the scanner 
chosen, this is sheer luck.

## Choosing the approach

For "seeing" an object carrying a bar or QR code and decoding it on a PI one
can
 1. fit one of the many Pi camera types to the Pi and use software to
    recognise and interpret the code
 2. use a stationary scanner doing all that connected via USB to the Pi

The fist approach was abandoned soon for a number of reasons:
 - Distance and resolution would require the "expensive" (80..100€)
   and relatively bulky Pi camera type with extra objective. For that no
   acceptable casing and stand solution was found.
 - For whatever reasons, software and libraries for bar code recognition,
   proven and easy to use, seem to be all in Python and none in C. This we
   could not do as the process control software and library and hence the
   rest of the incorporating project is in C; see 
   [this](https://a-weinert.de/pub/raspberry4remoteServices.pdf
   "Raspberry for remote services") in 
   [publication](https://a-weinert.de/pub/ "by A. Weinert")
 - Placing, testing and focusing the camera is hardly done in an OS with no
   graphics, i.e. in a "lite" Raspbian aka PiOS.
 - As outlined in the above mentioned 
   [publication](https://a-weinert.de/pub/ "by A. Weinert") a none lite 
   Raspbian is the death to all our real time requirements.
   
Hence we choose the second approach. <img 
src="/assets/images/QRscanner_s414.jpg" width="232" height="210" 
title="The scanner" alt="scanner" class="imgonright" />

## The scanner

We ordered an *Alacrity Handsfree 2D 1D Wired Barcode Scanner*. Its a black box
with a viewing window standing solidly on the table. It is connected to and
supplied
by the Pi via USB 2. For 110€ you have no fiddling with camera stands, 
objectives or stubborn flat cables.   
The manual is not worth the name. Its more or less a collection of special 
bar codes to change settings. Once you've lost, you never get back: No
download by supplier nor manufacturer.   
On the other hand this box detects almost every code found in our household
in all positions, in many colours and art designs as well as on surfaces, 
like cotton, paper, plastic, handy screens etc. And in most cases the loud 
"victory beep" came very quickly. 

So all seemed well -- and is, but more by luck than understanding.

## The interface

The scanner purchased acts as an USB PC keyboard with US key layout in the 
factory configuration.   
Pi's raw interface to an USB keyboard is /dev/hidraw0. Enable it for a normal
program by: 
```
sudo chmod a+=rw /dev/hidraw0 
```
This will be lost when disconnected. Hence, 
```
@reboot  chmod a+=rw /dev/hidraw0
```
will only work when the connection is fixed.   
On the opened raw keyboard interface
 ``/dev/hidraw0`` 
every read yields
8 bytes (all else is a fundamental error). These eight bytes are:      
 &nbsp; &nbsp; `` [0] shift bits, [1] error code, [2] 1st key pressed ... [5] 4th key pressed``
   
As a QR code scanner in the guise of a keyboard will never press two or more
keys at once and never will simulate an error 6 of those 8 bits will always 
be 0.  This example shows the input for "AaB10":
``` 
     2,    0,   4=A,   0,   0,   0,   0,   0
     2,    0,   4=a,   0,   0,   0,   0,   0
     2,    0,   5=B,   0,   0,   0,   0,   0
     0,    0,   0=,    0,   0,   0,   0,   0
     0,    0,  30=1,   0,   0,   0,   0,   0
     0,    0,  39=0,   0,   0,   0,   0,   0   
 ```
The 2, by the way means "left shift". This scanner, politely, only
"presses" the left shift button. 
And "nothings" (shifted or not) can be interspersed at any
place in any number. The purpose of those can only be speculated on.

Anyway, by providing two (a shifted and a non shifted) key
number to key value lookup tables, you easily get the
bar/QR code's text. Just know the US American keyboard layout or explore its
implementation by the Alacrity scanner.

## The char set of the most ignoring people

As being German based and in a German project we, of course, would like to
read the names correctly, should they appear one day on the ID cards with
numbers mentioned above.   
"Käte Nüßlein" should be "Käte Nüßlein" not "Kte Nlein" or
something totally gaga. Well, our the Alacrity Handsfree 2D 1D scanner can
be set to "German" by a special bar code; this setting won't get lost at
power down.

Now we are faced with a solvable and a unsolvable problem.
The solvable first:

In its stone age tradition a C char can't handle anything but US ASCII in a
portable manner. Hard core C programmers (in the past) considered a 
char's bit 7 as a no cost boolean.

To handle the above to text translation you have to provide three 
translation tables (a shifted and a non shifted and a
AltGr=right Alt one) and you have to use wchar_t (wide char) for those
look up tables. And you should know the German keyboard or explore it.   
The most important information: z and y are now in the right
place, correcting the mistake renaming the perfume 
"Oil of Olay" to "Oil of Olaz" in Germany.

With all those toils we don't loose characters (many of them
changing places on the keyboard respectively look up tables).   
We just got three [sic!] characters extra: ``² ³ °  `` 
We do not get: ``ä ö ü Ä Ö Ü ß § € µ``   
It turns out the (probably) Chinese firmware writers do not
have even the vaguest notion of a German keyboard.

So recognising German text in QR codes is the unsolvable problem.
So we switch back to factory setting and to the char set of
the most ignoring people: US-ASCII. 

As long as this restriction is not clearly communicated by the vendors, we
feel us within our rights to return the thing as soon as the detection of
the flaw. Imagine a German keyboard without Umlauts!  
On the other hand -- within its limitations for our current project task --
the little thing works reliably and fast and our C software is no
thread to the other real time programs running on the same Pi.
