---
layout: weAutPost
title: Sampling stack usage on ATmegas with GCC software
bigTitle: sampling stach usage
date:   2014-03-18
categories: GCC embedded development AVR ATmega stackpointer
lang: en
copyrightYear: 2014
revision: 12
reviDate: 2019-04-18
itemtype: "http://schema.org/BlogPosting"
isPost: true
commentIssueId: 4
---

Embedded systems using AVR ATmega controllers are usually (best) implemented
in pure C with a (WIN-avr) GCC toolchain. With AVRs RAM is often the tightest
resource and sometimes developers fear the stack might collide with the
variables.

Analysing tools calculating the minimal stackpointer on assumed call 
hierarchy and local variable definitions are a bit hard to find and to use in
a non quite standard C-toolchain (using e.g. AVR-GCC inline ASM). And they 
tend to quite pessimistic outcomes.

Alternatively one might sample the stackpointer, i.e. its minimal value,  in
the life system &mdash; at least while in the lab &mdash; and display the 
result on command. Here's a recipe:

### The sampling "tool"
{% highlight c %}
#define NO_SPMIN_SAMPLE 0 //!< To inhibit sampling set 1

/** Sample the stack pointer and update its minimal value
 *
 *  The \ref minStckP "minimal stackpointer" will be updated at the point
 *  of calling this macro, if \ref NO_SPMIN_SAMPLE is undefined or 0.
 *  \param nonc number of nested function calls within the embedding function 
 *              The value should be in the range 0..3. 
 *              If the call hierarchy goes deeper or the functions called
 *              use local variables those functions should be sampled instead.
 */
#if NO_SPMIN_SAMPLE
# define SAMPLE_MIN_SP(nonc) do { } while(0)
#else
# ifdef __AVR_3_BYTE_PC_
#  define SAMPLE_MIN_SP(nonc) do { \
   uint16_t sampSP = SP - (3 * (nonc)); \
   if (sampSP < minStckP) minStckP = sampSP; \
   } while(0)
# else
#  define SAMPLE_MIN_SP(nonc) do { \
   uint16_t sampSP = SP - (2 * (nonc)); \
   if (sampSP < minStckP) minStckP = sampSP; \
   } while(0)
# endif
#endif

/** Minimal stack pointer value sampled
 *
 *  System and application software might sample the stackpointer at due
 *  points and set this variable accordingly. A value of 0xFFFF means
 *  no (new) samples taken as yet.
 */
extern uint16_t minStckP;
{% endhighlight %}

### The sampling set-up
What remains is to scatter SAMPLE_MIN_SP(1) in the bodies of some few 
functions. Choose 
- (a) those deepest in the call hierarchy and 
- (b) those defining lots of local variable space (e.g. buffers)
      if not yet covered by one of the (a). 


### Display the results
To display the result do something like:
{% highlight c %}
   stdPutS_P(sysRunMeldS);
   //           0123456789x123456789 v
   char tt[] = "...  <= SP <= ...  \n";
   fourHexs(&tt[0],(uint16_t)(&_end));  
   fourHexs(&tt[14], (uint16_t)&__stack);
   stdPutS(tt); // display the range: end vars ... end RAM
#if ! NO_SPMIN_SAMPLE
   if (minStckP != 0xFFFF) {
     stdPutS_P(sysRunMldSP);
     char tt[] = "....  \n";
     fourHexs(&tt[0], minStckP);
     stdPutS(tt); // display the sampled mimimal SP
     minStckP = 0xFFFF; // reset samples
   }
#endif
{% endhighlight %}
In this [weAutSys](https://weinert-automation.de/entw_sw.html) excerpt the 
RAM address range available for stack and the 
sampled minimal stackpointer is displayed to a human operator, who gave the
 "runInfo" command on a serial terminal or a Telnet session.
 
If the minimal stackpointer fits in the range displayed one line above all
is well &mdash; as, hopefully, no one uses heap (malloc) on an embedded 
system.