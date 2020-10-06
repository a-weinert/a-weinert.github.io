---
layout: weAutPost
title: Make Subversion keep mTime
bigTitle: first character range filter
date:   2013-07-05
categories: SVN subversion time 
lang: en
copyrightYear: 2013
revision: 15
reviDate: 2020-10-06
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
---

Subversion (SVN) is a good versioning system and in many fields still _the_
standard.  
Nevertheless, it has one big deficiency:<!--more-->
 - SVN destroys the file modification meta info (mTime for short). 
 
Since some years the frustrating discussion thereon is still ongoing. In 
the meantime you can have some SVN clients taking the commit time instead
of the check out time as the file’s mTime. But that’s still neither the time 
„the photo was taken“ nor the time of last editing. For many people this is the second or even the most important sort criteria for files and a versioning 
system not keeping it intact is just a nuisance.

So SVN has no own remedy yet. All discussions seem to go to one end: 
 - one will have to put the respective last mTime as a file property 
   under SVN control.
 - That property then has to be set before any commit or update. 
 - And it has to be used for mTime repair after any update or check out
   &mdash; and after commits also (!).<br />
   &nbsp;

2012 I made the acquaintance of awk/gawk on Windows for the 
purpose of linking Atmel bootloader items to the application. This was,
of course, unrelated to the big SVN problem. Nevertheless, that tool &mdash;
as well very flexible as very fragile &mdash; leads the way to the 
mTime rescue. You’ll get that tool (and all the Linux lot as well) when 
installing WinAVR (e.g.). And you must have 
[Frame4J](https://frame4j.de/index_en.html "Java framework") installed for 
the following. All will run analogously on Linux, too.

To set/update the property mtime of each file be in (cd to) the root of your
local working copy, make the script saveTheDate.bat and run it there:
```powershell
  java FS -relateToDir -omitDirs .svn;build -antTime | grep "m " |  \
    gawk '{print "svn propset mtime \"" $1 " " $2 " " $3 "\" " $5 }' \
      > saveTheDate.bat
  call saveTheDate.bat
```  

saveTheDate.bat will look like:
```powershell
  svn propset mtime "11/21/2012 01:49:11 pm " de\frame4j\util\TimeRO.java
  svn propset mtime "11/21/2012 01:49:11 pm " de\frame4j\util\TimeST.java
  svn propset mtime "01/27/2009 01:18:36 pm " factory\tomcat-coyote.jar
  svn propset mtime "07/04/2013 03:45:27 pm " translateIt.bat
  svn propset mtime "11/21/2012 01:49:12 pm " UCopy.java
  svn propset mtime "11/22/2012 01:36:09 pm " de\frame4j\UCopy.java
  svn propset ..... and so on 
```
containing as many lines as you have files outside the build and 
.svn directories.

Note the American style date and 12h time format (by -antTime option), which
is outright ugly. The values are portable GMT. Anyway the touch tool will
just understand that horridness.<br /> 
Note also the trailing blank as an easy and pragmatic way to fight a gawk-bug. 
And note the grep „m “ filter’s only purpose is filtering out empty lines,
that gawk won’t ignore gracefully.

### Now the other way round
To use each file’s property mtime of SVN to reapair the file modification 
date be in (cd to) the root of your local working copy, make the script 
rescueTheDate.bat and run it there:
```powershell
  svn propget mtime -R | gawk '{print "touch -m --date=\"" $3 " " $4 " " $5 "\" " $1 }' > rescueTheDate.bat
  call rescueTheDate.bat
```
rescueTheDate.bat will look like:
```powershell
  touch -m --date="01/23/2010 01:17:12 pm" factory\junit.jar
  touch -m --date="11/21/2012 01:49:11 pm" de\frame4j\util\TimeRO.java
  touch -m --date="11/21/2012 01:49:11 pm" SendMail.java
  touch -m --date="02/01/2013 11:46:21 am" factory\4win64\readme.txt
  touch -m --date="11/21/2012 01:49:12 pm" TimeHelper.java
  touch -m --date="11/21/2012 01:49:12 pm" de\frame4j\io\ByteCharSeq.java
  touch -m --date="01/23/2010 01:17:12 pm" factory\4windows\bsDoesItNative.dll 
```
containing as many lines as you have files with the mtime property.

Of course one has to remember to run those scripts right before respectively
after the respective SVN actions (commit checkout update). This can 
be automated.

### Addendum
In between the schema — put in scripts as proposed — works quite well since
years. And en lieu de WinAVR you may have WinRaspi or Rails etc. pp. 
installed to have both the blessings of Linux tools and Windows' omipresence.
Just have one of them on the path: 
PATH=C:\bat;C:\util;C:\util\jdk\bin;C:\Windows\sy....;C:\util\WinAVR\utils\bin;...
