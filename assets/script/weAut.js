// functions for weinert-automation.de
// R. $Revision: 19 $ ($Date: 2018-09-30 12:37:36 +0200 (So, 30 Sep 2018) $) 
// Copyright (c) 2016 Albrecht Weinert, Bochum < a-weinert.de >

if (top != self) top.location = self.location;

var hoverTime = 99999999;
var acryl = 1;

var slideUp = +1;
var slideTime = 8000; // 8s; set to 2s after first auto next
var noOfSlides = 0;
var slideIndex = - slideUp;
if (typeof startSlide !== 'undefined' && startSlide !== null) {
  slideIndex += startSlide;
}  
var theSlides;

window.onload = function(){
   
   theSlidesDiv = document.getElementById("slider");
   if (theSlidesDiv) {
      theSlides = theSlidesDiv.getElementsByTagName("li");
      if (theSlides) noOfSlides = theSlides.length;
      for (i = 1; i < noOfSlides; i++) theSlides[i].style.display = "none"; 
   }
   
   var patt = window.location.href.split('#')[0];
   var toggleLogo = document.getElementById("lay4");
   if (toggleLogo) {
      toggleLogo.onmouseover = function(){
         if (acryl == 1) {
            toggleLogo.style.backgroundImage = "url('/assets/icons_logos/weaut_logo_120.png')";
            acryl = 0;
         } else {
            toggleLogo.style.backgroundImage = "url('/assets/icons_logos/weaut_logo_acr120t.png')";
            acryl = 1;
         }
      }; // mouseover
   } // have toggleLogo

   topNav = document.getElementById("topnavbar");
   if (topNav) {
      anchors = topNav.getElementsByTagName("a");
      for (len = anchors.length, i=0; i<len; ++i) {
         var phr = anchors[i].href;
         if (phr == patt) { 
            parent = anchors[i].parentElement;
            setClassInElem("linkSelf", parent);
         } // phr == xd
      } // over anchors
      lis = topNav.getElementsByTagName("li");
      //   alert("li in topnav " + lis.length);  // OK 31
      for (len = lis.length, i=0; i<len; ++i){
         hasUL = 0;
         theA = null;
         children = lis[i].children;

         for (cLen = children.length, j=0; j<cLen; ++j) {
            // alert( i + " " + j + " / " + children.length + " " + children[j].tagName );
            if (children[j].tagName === "A") theA = children[j];
            else if (children[j].tagName === "UL") hasUL = 1;  
         }
         if (hasUL && theA) { // li has ul and a
            // alert("has sub " + theA.innerHTML);
            setClassInElem("has-sub", theA);
            theA.onclick = "return yesLink();";
            lis[i].onmouseover = function(){
               hoverTime = new Date().getTime(); // store time of hover event
               //   alert("hoverTime " + hoverTime );
            };
         } // li has ul
      } // over lis
   } // have #topnavbar

   jsWarn = document.getElementById("jswarn");
   setClassInElem("jswarn", jsWarn);
   if (noOfSlides > 1)  slideTick();
   myPageStart(); // call page local JS that could use Liquid

}; // onload


var slideOmit = false;
function slideTick(){
   if (slideOmit) {
      slideOmit = false;
   } else carousel();
   setTimeout(slideTick, slideTime); // re-trigger 
   slideTime = 2468; // next time 2 seconds
}

function carousel(){
   if (noOfSlides <= 1) return;
   slideIndex += slideUp;
   if (slideIndex < 0) { slideIndex = noOfSlides -1;
   } else if (slideIndex >= noOfSlides ) slideIndex = 0;

   for (i = 0; i < noOfSlides; i++) {
      if (i != slideIndex) { theSlides[i].style.display = "none"; 
      } else theSlides[i].style.display = "block"; 
   }
} // carousel() 

// inc 0+: set forward, -:set backward
// .. -4: start slide; -3..-1: one back; 0: stay;
// +1..3: one forward; +4.. : end slide
function nextSlide(inc){
   if (noOfSlides <= 1) return;
   slideOmit = true; // inhibit next time trigger
   slideUp = inc >= 0 ? +1 : -1;
   slideTime = 11000; // keep next slide for longer
   if (inc == 0) slideIndex += slideUp;
   else if (inc < -3) slideIndex = 888; // force start 0
   else if (inc > +3) slideIndex = -888; // force end
   carousel();
} // nextSlide(inc)

// used to block click on dropdown menus for 50ms
// inhibits hover = click on touch screens
// use by: onclick = "return yesLink();"  plus set hoverTime in parent element
function  yesLink(){
   elapsed = new Date().getTime() - hoverTime;
   //  alert("hoverTime " + hoverTime + " click " + elapsed);
   // only allow click if at least 50ms has elapsed since hover
   return elapsed > 50;
};

function setClassInElem(leClass, leElem){
   if (leElem == null || leClass == null || leClass === '') return;
   if (leElem instanceof HTMLElement) {
      if (leElem.classList) {
         leElem.classList.add(leClass);
      } else {
         if (leElem.className) {
         leElem.className += " " + leClass; 
         } else leElem.className = leClass; 
      }
   }
} // setClassInElem(leClass, leElem)
   

//-------------from fbtMec.js
// use by: <a onclick="useMail(this.innerHTML);" href="#">mail address</a>
function useMail(s){
 s = s.replace(/\s+/g, ''); // .replace(/\[dot\]/g,".")
 this.location.href =  "mailto://" + s + "?subject=link from fbt-mechatronik.de" + iAM;
} // useMail
