---
layout: weAutPost
title: Web hyphenation
bigTitle: Hyphenation for Jekyll
permalink: /:title.html
categories: Jekyll html markdown hyphention
lang: en
dePage: webHyphenation_de.html
copyrightYear: 2021
revision: 3
reviDate: 2021-07-31
date:   2021-07-16
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare:
---
As became clear from from the posts [Jekyll Tricks](/twoJekyllTricks.html) and
[Dispose of Typo3](/leaveTypo3.html "Out of Typo3") I 
am a strong proponent of static web sites generated with tools.    

I've used static site generation for over twelve years with 
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework")
based <!--more-->tools. 2019 I switched my web sites as well as those I'm in 
charge of to Jekyll / Liquid.

## Hyphenation

A generous dose of conditional or soft hyphens (<code>"&amp;shy;"</code>)
on the site's texts can greatly enhance the appearance especially with
variable sizes and menus. On the other hand, putting the "&amp;shy;s" in
by hand is troublesome and the spoils the readability for the 
developer or author. Some tool support or automatism would be welcome.  

But alas, for many tools and editors, hyphenation is no bright story
even when the language is mere English -- and Jekyll is no exception here.   
This post presents a tool able to add conditional ("soft" &amp;shy;) 
breaks to the (markdown) texts and (html) layouts or to remove them for sake 
of source readability.  

All needed is an actual (implementation version >= 1.21.06)
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework") best as
installed extension on a Java8 and an hyphenation definition file in the 
form of
[this example](https://weinert-automation.de/software/jekyll/hyphDef_de.txt),
appropriate for your texts' topic and language.

For all that follows you need the tool 
[de.frame4j.FuR](https://weinert-automation.de/java/docs/frame4j/de/frame4j/FuR.html).   
If you can start it to see the online help e.g. by one of the following 
commands you got it perfectly.

```bash
java de.frame4j.FuR -help -de # show help in German (de)
java FuR -help -de # show help with comfort starter in English

```

## Definition file

The excerpt of the hyphenation definition file example mentioned above
shows the "one word per line with the hyphenation wanted" grammar:

```markdown
---
# Definitions for [de-]hyphenation by de.frame4j.FuR

# A collection for German language for markdown texts and 
# Jekyll web layouts. This file's encoding is UTF-8.
# Copyright  2021  Albrecht Weinert     a-weinert.de
# $Revision: 58 $ # $Date: 2021-07-08 $)
---
Aus&shy;bil&shy;dungs&shy;tag
Aus&shy;dauer
aus&shy;ge&shy;nom&shy;men
Be&shy;rufs&shy;wahl&shy;messe
Blu&shy;men&shy;ge&shy;stecke
dem&shy;sel&shy;ben
elek&shy;tro&shy;ni&shy;sches
Ent&shy;scheidungen
ent&shy;wor&shy;fen
er&shy;hielt
Er&shy;zie&shy;hungs&shy;be&shy;rech&shy;tigte
...   and so on and so forth
```

For better readability -- and for giving the file to a linguist for 
checking / correcting -- use the tool FuR to replace 
<code>&amp;shy;</code> by <code>-</code>.

```bash
D:\eclips...>java FuR hyphDef_de.txt -omitFrntM  "&shy;" "-"
  D:\eclipse18-09WS\web-hansibo\factory\hyphDef_de.txt
  157 occurrences of search texts
```

The first parameter names the (only one in this case) file to work on, the
option <code>-omitFrntM</code> says "Don't touch a front matter" and the 
second and third parameter define the pattern to find and its replacement.
The result is

```markdown
---
# Definitions for [de-]hyphenation by de.frame4j.FuR

# A collection for German language for markdown texts and 
# Jekyll web layouts. This file's encoding is UTF-8.
# Copyright  2021  Albrecht Weinert     a-weinert.de
# $Revision: 58 $ # $Date: 2021-07-08 $)
---
Aus-bil-dungs-tag
Aus-dauer
aus-ge-nom-men
Be-rufs-wahl-messe
Blu-men-ge-stecke
dem-sel-ben
elek-tro-ni-sches
Ent-scheidungen
ent-wor-fen
er-hielt
Er-zie-hungs-be-rech-tigte
...   and so on and so forth
```

After having done the copy editing in this form do not forget to restore 
the form usable for [de-] hyphenation by 

```bash
D:\eclips...>java FuR hyphDef_de.txt -omitFrntM  "-" "&shy;"
  D:\eclipse18-09WS\web-hansibo\factory\hyphDef_de.txt
  157 occurrences of search texts
```

Except for the interchange of search pattern and replacement it is the same
as for the other way round. But here the option <code>-omitFrntM</code> is
crucial lest to spoil the file's starting comment.


## Hyphenate Jekyll's markdown

To hyphenate a Jekyll generated web site best go to respective sources
root by   
 &nbsp; &nbsp;<code>  cd /D D:\eclipse18-09WS\web-hansibo\hansiboDE </code>
 &nbsp; &nbsp; , e.g.
   
For an realistic examples sake I assume we want to add hyphenation to
all texts (extension .md for markdown) as well as to all Liquid templates
(extension .html or .htm as not to confuse them with "real" pure HTML). 
We want do do this recursively in all sub directories excluding
<code>.jekyll-cache</code>, <code>_data</code> and <code>_site</code>.

### Step 0: Remove all &amp;shy;s

Before inserting &amp;shy;s according to your favourite hyphenation
definition file you might remove all &amp;shy;s randomly inserted by hand.
At the root of the site's Jekyll sources    
 &nbsp; &nbsp;<code> java FuR -r .md;.html;.htm -filUTF8 -OmitDirs _site;.jekyll-cache;_data -omitFrntM </code>&amp;shy<code>;" -v</code>  
would do the trick.   
<code>FuR: </code> The top most liked / used applications in
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework") have a 
starter application in the unnamed package. <code>FuR</code> just delegates
to
[de.frame4j.FuR](https://weinert-automation.de/java/docs/frame4j/de/frame4j/FuR.html).    
<code>-r .md;.html;.htm -filUTF8 : </code> Recursively (from the 
current directory) visit all files of the given three extensions and assume
their encoding be UTF-8.   
<code>-OmitDirs _site;.jekyll-cache;_data : </code> While visiting the 
sub-directory tree (starting from . ) omit directories + their children
with the three names given.
<code>-omitFrntM : </code> In the (text) files visited omit a front matter in
the process of searching patterns and replacing their occurrences.    
<code>"&amp;shy;" </code> (and no further parameter): Search the 
pattern <code>&amp;shy;</code> and replace it by nothing.
<code>-v : </code> verbose output (optional). That option list all files
visited with the number of finds (and replaces).

### Step 1: Hyphenate by definition file

Using the same file and directory criteria as in the "Step 0" example
and being in the same directory the command is:    
 &nbsp; &nbsp;<code> java FuR -r .md;.html;.htm -filUTF8 -OmitDirs _site;.jekyll-cache;_data -omitFrntM -hyphen ..\factory\hyphDef_de.txt</code>

<code>-hyphen ..\factory\hyphDef_de.txt </code> hyphenate all files in
question by the definitions found in the file (<code>hyphDef_de.txt</code)
named after the option.   
all other options and parameters: As explained for "Step 0".

Technically for every line in the hyphenation file FuR generates a 
search pattern (without the <code>&amp;shy;</code>s) and a replacement (with
them). Then in a wide sense the same procedures are taken as when defining
multiple search and replace definitions in an extra .properties file -- which 
over the years was FuR's primary work on servers.

Note 1: At present (19.07.2021)
up to 1024 search and replace definitions are generated from the hyphenation
definition file (may be risen in future).   
Note 2: Those past and present n patterns * m files task with those numbers
in order of 100s and 1000s  would not go well with Java's standard String
search. As other 
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework") tools
[de.frame4j.FuR](https://weinert-automation.de/java/docs/frame4j/de/frame4j/FuR.html)
uses 
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework")'s
implementation of the Rabin-Karp algorithms. Rabin-Karp brings the search 
from O(t*s) (naive String.indexOf() and consorts) to less than O(t), where
t is the length of the text and s is length of the substring to spot.
Note 3: Step 1 is the main step -- the one where all this was done for. We
generate and (ftp) deploy web sites by Jekyll on the SVN (subversion) server
in a post commit hook. And we very well may put <code>FuR -hyphen ...</code>
there.

### Step 2: De-Hyphenate by definition file

With a command very similar to the one in "Step 1" FuR can remove (only)
the hyphenations applied:    
 &nbsp; &nbsp;<code> java FuR -r .md;.html;.htm -filUTF8 -OmitDirs _site;.jekyll-cache;_data -omitFrntM -dehyphen ..\factory\hyphDef_de.txt</code>

<code>-dehyphen ..\factory\hyphDef_de.txt </code> de-hyphenate all files in
question by the definitions found in the file (<code>hyphDef_de.txt</code>)
named after the option. The procedure is the same as explained ion "Step 1"
except for the reversal of the find pattern and the replacement.      
all other options and parameters: As explained for "Step 0".


Applying "Step 1" to a set of "hyphen-less" (by "Step 0", e.g.) files and 
then applying "Step 2" should bring the set of files respectively texts 
back in the previous state -- or in other word one operation is the inverse
of the other.  
Note 4: Be aware of shadowing effects especially with compound words like
(German) runter, gekommen und runtergekommen that would be defined as e.g.
```markdown
run&shy;ter&shy;ge&shy;kom&shy;en
run&shy;ter
ge&shy;kom&shy;en
kom&shy;en
```
If you change the order here by, e.g., setting <code>"kom&amp;shy;men"</code>
(kommen) before the others, this would inhibit the extra hyphenations 
of gekommen and runtergekommen.    
Note 5: As
[de.frame4j.FuR](https://weinert-automation.de/java/docs/frame4j/de/frame4j/FuR.html)
reverses the order of find and replace on <code>-dehyphen</code> to the one
used for <code>-hyphen</code> the "inverse operation" property should hold.
Note 6: When writing or editing a hyphenation definition file always have 
<code>-hyphen</code> in mind. Rule of thump: compounds and longer words 
one gets by adding to shorter ones first.
  
Mathematical question to the learned readers:   
Would just length on the non hyphenated word be the right sorting criterion?

Well, as I think the the answer is Yes. Hence, since 31.07.2021 (resp.
Implementation-Version 1.21.07) FuR will sort the hyphenation definitions
accordingly before use.   
Note 7: If you use this
[Frame4](https://frame4j.de/index_en.html "a Java (8) framework")
 version or a newer one (and don't switch off this
sorting) you may ignore Note 4 and 6.

Happy automatic hyphenation.
