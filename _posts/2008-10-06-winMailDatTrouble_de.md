---
layout: weAutPost
title: winmail.dat – Ärger
bigTitle: winmail.dat ?
date:   2008-10-06
categories: Windows winmail.dat
lang: de
copyrightYear: 2008
revision: 13
reviDate: 2019-04-22
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare: windowsRejectsExe_de.html
---

### Das Phänomen

Ein mail-Anhang winmail.dat kommt ohne Wissen der Absender gelegentlich 
zustande, wenn Microsoft-Office-Dokumente (direkt oder indirekt) mit Microsoft-Outlook versendet werden. Dieser Anhang ist für alle anderen 
mail-Clients unlesbar und nicht bearbeitbar. Dies gilt ebenso für alle 
anderen Anwendungen, auch unter Windows, und für andere Plattformen meist
sowieso.

Der (Hinter-) Grund ist, dass diese Dateien einem proprietären Microsoft-Archiv-Standard (TNEF) folgen. Diese enthalten u.U. auch weitere Informationen, welche der Author meist gar nicht weitergeben will.

### Abhilfe 
Eine Abhilfe bietet der Aufruf
```powershell
fentun.exe  w:o\immer\sie\ist\winmail.dat
```
per Kommando-Zeile oder per drag&drop. Es öffnet sich eine graphische Anwendung, die nach der Ablage des eigentlich beabsichtigten Anhangs fragt. Die Datei
```powershell
24.07.1999    14:48    224.256    FENTUN.EXE
```
muss man sich runterladen und in ein PATH-Verzeichnis tun.

Wer also mal wieder eine  winmail.dat  bekommt, sollte gar nicht erst den Absender behelligen, der die Untat sowieso meist mit scheinbar reinem Gewissen abstreiten wird.
