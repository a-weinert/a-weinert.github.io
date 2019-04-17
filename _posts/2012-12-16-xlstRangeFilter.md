---
layout: weAutPost
title: A first character range filter with XSLT 1.0
bigTitle: first character range filter
date:   2012-12-16
categories: XML XLST range filter
lang: en
copyrightYear: 2012
revision: 13
reviDate: 2019-04-17
itemtype: "http://schema.org/BlogPosting"
isPost: true
---

This is a tip about implementing a first character range filter with pure 
XSLT 1.0.

Though being a bit out of the main hype, XML data files and transforming 
style sheets are still attractive to separate data and rendering. So this
might be helpful for regular users of XML and XSL.

- The problem

The transformers and and their description, existing in version XSLT 2.0, are
quite power­ful, as soon as being accustomed to xls‘ scatterbrained syntax.
XSLT 1.0 is, of course, in no way better and much less expressive and 
less powerful.

- Still using XSLT 1.0 for good reasons

But there are cases, where one has to stick to XSLT 1.0 without any 
extensions. This would be mainly due to some server’s, framework’s or
PHP installation’s and client’s limitations. There,  one often has little to
no influence. Using XSLT 2.0 or any extensions not covered by the standard
and then hitting one of the above said limited environments in deployment or
at customer sites is a way to to get into deep doo-doo.

In other words it may sometimes still be clever to stick to pure XSLT 1.0
against all advice and mockery.

- XSLT 1.0’s abashing facilities for string / character operations

One of the worst limitations of XSLT 1.0 is the almost total absence of 
decent string and character functions and operators. At one hand it is 
possible to sort using a string attribute (or value) as key. On the other h...<br />
... Read all at [XSLT1.0RangeFilter.pdf](https://a-weinert.de/pub/XSLT1.0RangeFilter.pdf "full paper") (on
[a-weinert.de/p...](https://a-weinert.de/publication_en.html/ "some of Albrecht's publications") 
/ [pub/](https://a-weinert.de/pub/ "publications download")).