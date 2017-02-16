
# JS Lind

JavaScript version of randomisation demo for the James Lind Library website - http://www.jameslindlibrary.org/

Originally commissioned by Sir Iain Chalmers and created by Jim Halsey and Chris Bird at CTSU, Oxford

    * Assign to "Duration of health problem:"
        Long term (30% probability)
        More recent (70% probability)
    * Assign to "Severity of health problem:"
        Mild  (30% probability)
        Moderate  (45% probability)
        Severe  (25% probability)
    * Assign to "Age, in years"
        Under 15 (20% probability)
        15-34  (25% probability)
        35-64  (25% probability)
        65 & older  (30% probability)
    * Assign to "Condition: Very anxious?"
        Yes (5% probability)
        No (95% probability)

## do

make style consistent with site, e.g. 
http://www.jameslindlibrary.org/essays/2-2-the-need-to-compare-like-with-like-in-treatment-comparisons/

## defer

could turn function Factors() into var factors = new Array() and make multi-dim - then factor out function fillBase(factors) function fillNext(factors)

global vars bad, wrap in IIFE? http://stackoverflow.com/questions/2613310/ive-heard-global-variables-are-bad-what-alternative-solution-should-i-use

use TypeScript?

use WebPack?

## done

percentages not shown

"back to beginning" doesn't work

after "Number of patients must be between 0 and 100,000" out-of-range alert, "next" values disappear