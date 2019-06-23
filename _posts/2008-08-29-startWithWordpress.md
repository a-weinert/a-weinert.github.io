---
layout: weAutPost
title: Start with Wordpress
bigTitle: wordpress blog start
date:   2008-08-29
categories: Wordpress setup theme
lang: en
dePage: ./startWithWordpress_de.html
copyrightYear: 2008
revision: 13
reviDate: 2019-04-22
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
commentShare: ./startWithWordpress_de.html
---

Until April 2019 this Blog was hosted at 1&1 and used WordPress there. Please
find here some remarks on usage and experiences.

### The Software
This Blog was running since 2008 starting with WordPress’s German version 
2.6.0 and using a TerraFirma theme (see image below) then re-designed to a practically new theme . In August 2009 it was updated to 2.8.4 „by hand“ 
without any problems.

In January 2013 we switched over to a (new) MySQL5.0 as the old 4.0 one (in 
contract 1&1 business 5) was no more connectable by PHP. Experiments to 
migrate the whole thing (including users, passwords, permalinks, design and 
all) to another (1&1 virtual) server and WordPress 3.5 run technically OK but
in the end un-satisfactory — put mildly. So in February 2013 it was updated
by hand and in (the old) place to 3.5.1 and in July 2013 to 3.5.2.

The whole WordPress software is a great cluster of PHP plus a good load of 
JavaScript for the client side editors among others.

Basically a Blog is a web service like all many others — Wikis, shops, Web GUIs for automation (process control) systems and else. For Java people or a Java Web service lady the question arises, why not use a Blog implemented as J2EE-Webservice.

The answer is: You have no choice most of the times — and for two reasons. 
- Most providers, like 1&1 used here,  do not offer J2EE up to the middle or even higher contract categories, whereas its hard to find something just above the cheapest entry offers without PHP or MySQL. 
- Additionally, the learning curve or the small project entry level is an order of magnitude lower for PHP compared to J2EE, leading to a wide popularity. 

An when a PHP project has grown into problems, not known to J2EE approaches, changing horses seems infeasible or too bloody. So you’ll find for Blogs, Wikis etc. myriads of PHP approaches, while you have to search Java solutions — at least free ones — like the needle in the haystack.

### Host and Installation
Like the web sites a-weinert.de, etc. this Blog is hosted at 1&1. The contract — here Business 5.0 — offers sufficient PHP and MySQL resources (but as already discussed, no J2EE container, like e.g. Tomcat) .

For most of its hosting contracts down to the entry level, 1&1 offers a Blog, that seems itself be WordPress based. This „home made“ Blog can be activated by quite a few mouse clicks. Thus the web-master may avoid installing WordPress, handling updates, themes plug-ins etc. or — worst of all — learning some PHP.

So why anyone should want to install WordPress or another Blog software in the own 1&1 web space? 1&1’s description of its Blog — quite openly by the way — shows that the simple entry is paid by quite a bundle of limitations. Who can’t accept those limits shall not use the offered pre-installed standard Blog. Just taking it without consideration and then whinge in (other) Blogs and mailing lists is a frequent habit — but neither clever nor fair.

![terraFirma theme](/assets/images/oldStartTheme.jpg "original look (TerraFirma), before the thorough modification"){: .imgonright}
Before installing WordPress you must activate the MySQL database, if not yet done. The access data to your 1&1 DB are required in the process. Installing WordPress and here the TerraFirma theme is done by just uploading. Just follow WordPress‘ 5 minutes installation.<br />
Well, it usually takes a bit longer, until everything runs and looks to your wishes. The quite stupendous update from 2.6.0 to 2.8.4 and later to 3.5.1/2 is best done by hand. It is basically the deleting of all not individualised files (directories wp-admin and wp-includes) and uploading all others from the new WordPress version.

### On the theme

A theme, in the sense of WordPress, is the GUI or design, that may easily be exchanged, at least in theory. This Blog used TerraFirma from the beginning with some modifications until end 2012.

The post-treatment of the WordPress update mentioned motivated an extensive alteration of the used theme. In the end (since 2013) an own theme consistent with the website was created. Using suitable tools (SVN, Eclipse) a home-made theme etc. is not too complicated. The implications
for updates are the same as those of plug-ins. A key issue for desing consistency with other web-sites is one common CSS.
