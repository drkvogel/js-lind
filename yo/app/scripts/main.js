console.log('Ready...');

// gets NRAND random numbers between 0.0 & 1.0 for each of the 4 factor groups FACT1, FACT2, FACT3 & FACTX,
// to determine the distributions between 2 theoretical treatment groups, treatment A & treatment B
// Factor 1 : Duration of health problem    : 2 categories - long-term; recent
// Factor 2 : Severity of Health problem    : 3 categories - mild; moderate; severe
// Factor 3 : Age                           : 4 categories - under 15, 15-34, 35-64, 65+
// Factor X : was a name factor with a percentage chosen by the user, now defaults to "Very anxious" (and what percentage?)
// e.g. FACT3(2,1) is the number of patients for factor 2 (age), category 2 (15-34), on treatment A
// possible gotchas: rand seed, 16-bit floating point rounding errors

var stage = "start", nrand = 0, nranda = 0, nrandb = 0, nrandNext = 0, treatANext = 0, treatBNext = 0;

// handle enter key on input
$(function () {
    $("#nrandrec").keypress(function (e) {
        if (e.keyCode == 13) { // enter
            begin();
        }
    });
});

// function currentPage() {
//     return pages[current]; //console.log('currentPage[' + current + ']:' + obj(pages[current]));
// }
var currentPage = '#intro';

function showPage(id) {
    $(currentPage).hide();
    currentPage = id;
    $(id).show();
}

// 10 times bigger values are hidden using "visibility: hidden" which preserves the onscreen space for an element
// as opposed to "display: none" which causes the element not to be present at all, which could break the layout
// jQuery hide() and show() change "display", but there is no equivalent for "visibility"
// so here is a jQuery plugin
(function($) { // set visibility with visible() or invisible()
    $.fn.invisible = function() { // fn is an alias to prototype
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));

function show6() { $(".cond").visible(); }
function show5() { $(".age").visible(); setTimeout(show6, 1000); }
function show4() { $(".sev").visible(); setTimeout(show5, 1000); }
function show3() { $(".duration").visible(); setTimeout(show4, 1000); }
function show2() { $(".heading").visible(); setTimeout(show3, 1000); }
function show1a() { $("#summaryNext").show(); $("#summaryNext").visible(); setTimeout(show2, 1000); }
function show1() { setTimeout(show1a, 1000); }

function hideNext() {
    $(".hideable").invisible();
    $("#summaryNext").hide(); // remove from layout as well
}

var base = new Factors();

function begin() { // Takes in nrand, iform & propx?
    if (stage === "start") {
        var enteredNumber = parseInt($('#nrandrec').val(), 10);
        console.log('simplerand(): got the number: ' + enteredNumber);
        if (isNaN(enteredNumber) || enteredNumber < 0 || enteredNumber > 10000) {
            alert('Please enter a number between 0 and 10,000'); // alert('Doh!');
            return;
        } else {
            nrand = enteredNumber;
            // var base = new Factors();
            console.log('base: ' + base);
            base.randomise(nrand);
            console.log('base: ' + base);
            //simplerand(nrand); // , base);
            fillBase(base); // (base);
            hideNext(); // make sure "10 times bigger" values are hidden to begin with
            $('#intro').hide();     // intro "page"
            $('#results').show();   // results "page"
            //show1();
            //displayResults();
        }
    }
}

function makeBigger() {
    hideNext();
    var next = nrand * 10;
    if (next > 100000) {
        alert('Number of patients must be between 0 and 100,000');
    } else {
        simplerand(next);
        fillNext();
        show1();
        console.log('makeBigger(): nrand is now: ' + next);
    }
}

//var Factors = function() { // each strata for each factor has a tuple for a count of patients randomised to treatment A or B
// var factors = { // each strata for each factor has a tuple for a count of patients randomised to treatment A or B
//     f1: { // duration
//         s1: [0, 0],
//         s2: [0, 0]
//     },
//     f2: { // severity
//         s1: [0, 0],
//         s2: [0, 0],
//         s3: [0, 0]
//     },
//     f3: { // age
//         s1: [0, 0],
//         s2: [0, 0],
//         s3: [0, 0],
//         s4: [0, 0]
//     },
//     f4: { // anxious
//         s1: [0, 0],
//         s2: [0, 0]
//     }
// };   

function Factors() { // each strata for each factor has a tuple for a count of patients randomised to treatment A or B
    this.f1 = { // duration
        s1: [0, 0],
        s2: [0, 0]
    };
    this.f2 =  { // severity
        s1: [0, 0],
        s2: [0, 0],
        s3: [0, 0]
    };
    this.f3 = { // age
        s1: [0, 0],
        s2: [0, 0],
        s3: [0, 0],
        s4: [0, 0]
    };
    this.f4 = { // anxious
        s1: [0, 0],
        s2: [0, 0]
    };
};

Factors.prototype.randomise = function(nrand) {
    for (var i=1; i < nrand; i++) {         // do i=1,nrand
        var treatment;                      // treatment dimension?
        var randno = Math.random();         // flip a coin
        if (randno < 0.5) {                 // treatment A
            treatment = 0;                  // is an index into an array, remember, so 0-indexed
            nranda += 1;
        } else {                            // treatment B
            treatment = 1;
            nrandb += 1;
        }

        // simulate patient factors using random numbers instead of real data
        // factor 1 (duration of health problem): 0.7 long-term; 0.3 recent
        randno = Math.random();
        if (randno < 0.3) {
            this.f1.s1[treatment]++;     //fact1(1,treatment)=fact1(1,treatment)+1
        } else {
            this.f1.s2[treatment]++;     //fact1(2,treatment)=fact1(2,treatment)+1
        }

        // factor 2 (severity of health problem) 0.3: mild; 0.45 moderate; 0.25: severe
        randno = Math.random();
        if (randno < 0.3) {
            this.f2.s1[treatment]++;     //fact2(1,treatment)=fact2(1,treatment)+1
        } else if ((randno > 0.3) && (randno < 0.75)) {
            this.f2.s2[treatment]++;     //fact2(2,treatment)=fact2(2,treatment)+1
        } else {
            this.f2.s3[treatment]++;     //fact2(3,treatment)=fact2(3,treatment)+1
        }

        // factor 3 (age) 0.2= under 15; 0.25= 14-34 yrs; 0.25= 35-64 yrs; 0.3= 65 & older
        randno = Math.random();
        if (randno < 0.2) {
            this.f3.s1[treatment]++;     // fact3(1,treatment)=fact3(1,treatment)+1
        } else if ((randno > 0.2) && (randno < 0.45)) {
            this.f3.s2[treatment]++;     //fact3(2,treatment)=fact3(2,treatment)+1
        } else if ((randno > 0.45) && (randno < 0.7)) {
            this.f3.s3[treatment]++;     //fact3(3,treatment)=fact3(3,treatment)+1
        } else {
            this.f3.s4[treatment]++;     //fact3(4,treatment)=fact3(4,treatment)+1
        }

        // factor X (was a factor chosen by the user, now defaults to "Very anxious") (default 5%?)
        randno = Math.random();
        if (randno < 0.05) {                // yes, default 5%
            this.f4.s1[treatment]++;     //factx(1,treatment)=factx(1,treatment)+1
        } else {
            this.f4.s2[treatment]++;     //ffactx(2,treatment)=factx(2,treatment)+1
        }
    } // end do    
}

//var factors = new Factors();

// clear factors?
// use new?

// function simplerand(nrand) { // , factors) {
//     // FORTRAN version used a 2d array of which which treatments were randomised into which factors - use a JS object instead

//     //var base = new Factors();
//     console.log(factors);
//     console.log('nrand: ' + nrand + ', nranda: ' + nranda);
//     for (var i=1; i < nrand; i++) {         // do i=1,nrand
//         var treatment;                      // treatment dimension?
//         var randno = Math.random();         // flip a coin
//         if (randno < 0.5) {                 // treatment A
//             treatment = 0;                  // is an index into an array, remember, so 0-indexed
//             window.nranda += 1;
//         } else {                            // treatment B
//             treatment = 1;
//             nrandb += 1;
//         }

//         // simulate patient factors using random numbers instead of real data

//         // factor 1 (duration of health problem): 0.7 long-term; 0.3 recent
//         randno = Math.random();
//         if (randno < 0.3) {
//             factors.f1.s1[treatment]++;     //fact1(1,treatment)=fact1(1,treatment)+1
//         } else {
//             factors.f1.s2[treatment]++;     //fact1(2,treatment)=fact1(2,treatment)+1
//         }

//         // factor 2 (severity of health problem) 0.3: mild; 0.45 moderate; 0.25: severe
//         randno = Math.random();
//         if (randno < 0.3) {
//             factors.f2.s1[treatment]++;     //fact2(1,treatment)=fact2(1,treatment)+1
//         } else if ((randno > 0.3) && (randno < 0.75)) {
//             factors.f2.s2[treatment]++;     //fact2(2,treatment)=fact2(2,treatment)+1
//         } else {
//             factors.f2.s3[treatment]++;     //fact2(3,treatment)=fact2(3,treatment)+1
//         }

//         // factor 3 (age) 0.2= under 15; 0.25= 14-34 yrs; 0.25= 35-64 yrs; 0.3= 65 & older
//         randno = Math.random();
//         if (randno < 0.2) {
//             factors.f3.s1[treatment]++;     // fact3(1,treatment)=fact3(1,treatment)+1
//         } else if ((randno > 0.2) && (randno < 0.45)) {
//             factors.f3.s2[treatment]++;     //fact3(2,treatment)=fact3(2,treatment)+1
//         } else if ((randno > 0.45) && (randno < 0.7)) {
//             factors.f3.s3[treatment]++;     //fact3(3,treatment)=fact3(3,treatment)+1
//         } else {
//             factors.f3.s4[treatment]++;     //fact3(4,treatment)=fact3(4,treatment)+1
//         }

//         // factor X (was a factor chosen by the user, now defaults to "Very anxious") (default 5%?)
//         randno = Math.random();
//         if (randno < 0.05) {                // yes, default 5%
//             factors.f4.s1[treatment]++;     //factx(1,treatment)=factx(1,treatment)+1
//         } else {
//             factors.f4.s2[treatment]++;     //ffactx(2,treatment)=factx(2,treatment)+1
//         }
//     } // end do
//     console.log(factors);
//     console.log('nrand: ' + nrand + ', nranda: ' + nranda);


//     // and display
//     fillBase();
// }

// Fortran: "convert to percentages and assign array values to variables to be passed back to main program"
// NINT(A) rounds its argument to the nearest whole number. 0.5 rounds up to 1 by convention? Nothing in GNU docs...
// In JS: Math.round(2.5); // 3
// JavaScript Numbers are Always 64-bit Floating Point (so don't have to convert e.g. nranda to real)
// make a function to do all this...
function toPercent(nrandx, factor, percentage) {
    percentage = Math.round(100 * factor / nrandx);
}

/*
factors.f1.s1[treatment]
factors.f1.s2[treatment]
factors.f2.s1[treatment]
factors.f2.s2[treatment]
factors.f2.s3[treatment]
factors.f3.s1[treatment]
factors.f3.s2[treatment]
factors.f3.s3[treatment]
factors.f3.s4[treatment]
factors.f4.s1[treatment]
factors.f4.s2[treatment]
*/

// var stage = "start", nrand, nranda, nrandb, nrandNext, treatANext, treatBNext;

var a = 0; // dev
function fillBase(factors) {
    $('#nrand').html(window.nrand);
    $('#treatA').html(window.nranda);
    $('#treatB').html(window.nrandb);
    $('#totalA').html(window.nranda);
    $('#totalB').html(window.nrandb);
    $('#f1s1t0').html(factors.f1.s1[0]); // (factors.f1.s1[0]);
    $('#f1s1t0pc').html(toPercent(factors.f1.s1[0]));
    $('#f1s1t1').html(factors.f1.s1[1]);
    $('#f1s1t1pc').html(toPercent(factors.f1.s1[1]));
    $('#f1s2t0').html(factors.f1.s2[0]);
    $('#f1s2t0pc').html(toPercent(factors.f1.s2[0]));
    $('#f1s2t1').html(factors.f1.s2[1]);
    $('#f1s2t1pc').html(toPercent(factors.f1.s2[1]));
    $('#f2s1t0').html(factors.f2.s1[0]);
    $('#f2s1t0pc').html(toPercent(factors.f2.s1[0]));
    $('#f2s1t1').html(factors.f2.s1[1]);
    $('#f2s1t1pc').html(toPercent(factors.f2.s1[1]));
    $('#f2s2t0').html(factors.f2.s2[0]);
    $('#f2s2t0pc').html(toPercent(factors.f2.s2[0]));
    $('#f2s2t1').html(factors.f2.s2[1]);
    $('#f2s2t1pc').html(toPercent(factors.f2.s2[1]));
    $('#f2s3t0').html(factors.f2.s3[0]);
    $('#f2s3t0pc').html(toPercent(factors.f2.s3[0]));
    $('#f2s3t1').html(factors.f2.s3[1]);
    $('#f2s3t1pc').html(toPercent(factors.f2.s3[1]));
    $('#f3s1t0').html(factors.f3.s1[0]);
    $('#f3s1t0pc').html(toPercent(factors.f3.s1[0]));
    $('#f3s1t1').html(factors.f3.s1[1]);
    $('#f3s1t1pc').html(toPercent(factors.f3.s1[1]));
    $('#f3s2t0').html(factors.f3.s2[0]);
    $('#f3s2t0pc').html(toPercent(factors.f3.s2[0]));
    $('#f3s2t1').html(factors.f3.s2[1]);
    $('#f3s2t1pc').html(toPercent(factors.f3.s2[1]));
    $('#f3s3t0').html(factors.f3.s3[0]);
    $('#f3s3t0pc').html(toPercent(factors.f3.s3[0]));
    $('#f3s3t1').html(factors.f3.s3[1]);
    $('#f3s3t1pc').html(toPercent(factors.f3.s3[1]));
    $('#f3s4t0').html(factors.f3.s4[0]);
    $('#f3s4t0pc').html(toPercent(factors.f3.s4[0]));
    $('#f3s4t1').html(factors.f3.s4[1]);
    $('#f3s4t1pc').html(toPercent(factors.f3.s4[1]));
    $('#f4s1t0').html(factors.f4.s1[0]);
    $('#f4s1t0pc').html(toPercent(factors.f4.s1[0]));
    $('#f4s1t1').html(factors.f4.s1[1]);
    $('#f4s1t1pc').html(toPercent(factors.f4.s1[1]));
    $('#f4s2t0').html(factors.f4.s2[0]);
    $('#f4s2t0pc').html(toPercent(factors.f4.s2[0]));
    $('#f4s2t1').html(factors.f4.s2[1]);
    $('#f4s2t1pc').html(toPercent(factors.f4.s2[1]));
}

function fillNext() {
    a *= 10;
    console.log("treatANext: " + treatANext);
    $('#nrandNext').html(nrandNext);
    $('#treatANext').html(treatANext);
    $('#treatBNext').html(treatBNext);
    $('#totalANext').html(treatANext);
    $('#totalBNext').html(treatBNext);

    $('#t1f1s1next').html(++a);
    $('#t1f1s1nextpc').html(toPercent());
    $('#t2f1s1next').html(++a);
    $('#t2f1s1nextpc').html(toPercent());
    $('#t1f1s2next').html(++a);
    $('#t1f1s2nextpc').html(toPercent());
    $('#t2f1s2next').html(++a);
    $('#t2f1s2nextpc').html(toPercent());
    $('#t1f2s1next').html(++a);
    $('#t1f2s1nextpc').html(toPercent());
    $('#t2f2s1next').html(++a);
    $('#t2f2s1nextpc').html(toPercent());
    $('#t1f2s2next').html(++a);
    $('#t1f2s2nextpc').html(toPercent());
    $('#t2f2s2next').html(++a);
    $('#t2f2s2nextpc').html(toPercent());
    $('#t1f2s3next').html(++a);
    $('#t1f2s3nextpc').html(toPercent());
    $('#t2f2s3next').html(++a);
    $('#t2f2s3nextpc').html(toPercent());
    $('#t1f3s1next').html(++a);
    $('#t1f3s1nextpc').html(toPercent());
    $('#t2f3s1next').html(++a);
    $('#t2f3s1nextpc').html(toPercent());
    $('#t1f3s2next').html(++a);
    $('#t1f3s2nextpc').html(toPercent());
    $('#t2f3s2next').html(++a);
    $('#t2f3s2nextpc').html(toPercent());
    $('#t1f3s3next').html(++a);
    $('#t1f3s3nextpc').html(toPercent());
    $('#t2f3s3next').html(++a);
    $('#t2f3s3nextpc').html(toPercent());
    $('#t1f3s4next').html(++a);
    $('#t1f3s4nextpc').html(toPercent());
    $('#t2f3s4next').html(++a);
    $('#t2f3s4nextpc').html(toPercent());
    $('#t1f4s1next').html(++a);
    $('#t1f4s1nextpc').html(toPercent());
    $('#t2f4s1next').html(++a);
    $('#t2f4s1nextpc').html(toPercent());
    $('#t1f4s2next').html(++a);
    $('#t1f4s2nextpc').html(toPercent());
    $('#t2f4s2next').html(++a);
    $('#t2f4s2nextpc').html(toPercent());
}

if (nranda === 0) {
    // fact1_1a=0
} else {
    // fact1_1a = nint(100.0*fact1(1,1)/real(nranda)) // 
    //fact1_1a = Math.round(100 * fact1(1,1) / nranda)    
}
//fact1_1an=fact1(1,1)

if (nrandb === 0) {
    // fact1_1b=0
} else {
    // fact1_1b=nint(100.0*fact1(1,2)/real(nrandb))
}
// fact1_1bn=fact1(1,2)      

if (nranda === 0) {
    // fact1_2a=0
} else {
    // fact1_2a=nint(100.0*fact1(2,1)/real(nranda))
}
//   fact1_2an=fact1(2,1)

if (nrandb === 0) {
    // fact1_2b=0
} else {
    // fact1_2b=nint(100.0*fact1(2,2)/real(nrandb))
}
//   fact1_2bn=fact1(2,2)

if (nranda === 0) {
    // fact2_1a=0
} else {
    // fact2_1a=nint(100.0*fact2(1,1)/real(nranda))
}
//   fact2_1an=fact2(1,1)

if (nrandb === 0) {
    // fact2_1b=0
} else {
    // fact2_1b=nint(100.0*fact2(1,2)/real(nrandb))
}
//   fact2_1bn=fact2(1,2)

//       if(nranda.eq.0)then
//         fact2_2a=0
//       else
//         fact2_2a=nint(100.0*fact2(2,1)/real(nranda))
//       endif
//       fact2_2an=fact2(2,1)

//       if(nrandb.eq.0)then
//         fact2_2b=0
//       else
//         fact2_2b=nint(100.0*fact2(2,2)/real(nrandb))
//       endif
//       fact2_2bn=fact2(2,2)

//       if(nranda.eq.0)then
//         fact2_3a=0
//       else
//         fact2_3a=nint(100.0*fact2(3,1)/real(nranda))
//       endif
//       fact2_3an=fact2(3,1)

//       if(nrandb.eq.0)then
//         fact2_3b=0
//       else
//         fact2_3b=nint(100.0*fact2(3,2)/real(nrandb))
//       endif
//       fact2_3bn=fact2(3,2)

//       if(nranda.eq.0)then
//         fact3_1a=0
//       else
//         fact3_1a=nint(100.0*fact3(1,1)/real(nranda))
//       endif
//       fact3_1an=fact3(1,1)

//       if(nrandb.eq.0)then
//         fact3_1b=0
//       else
//         fact3_1b=nint(100.0*fact3(1,2)/real(nrandb))
//       endif
//       fact3_1bn=fact3(1,2)

//       if(nranda.eq.0)then
//         fact3_2a=0
//       else
//         fact3_2a=nint(100.0*fact3(2,1)/real(nranda))
//       endif
//       fact3_2an=fact3(2,1)

//       if(nrandb.eq.0)then
//         fact3_2b=0
//       else
//         fact3_2b=nint(100.0*fact3(2,2)/real(nrandb))
//       endif
//       fact3_2bn=fact3(2,2)

//       if(nranda.eq.0)then
//         fact3_3a=0
//       else
//         fact3_3a=nint(100.0*fact3(3,1)/real(nranda))
//       endif
//       fact3_3an=fact3(3,1)

//       if(nrandb.eq.0)then
//         fact3_3b=0
//       else
//         fact3_3b=nint(100.0*fact3(3,2)/real(nrandb))
//       endif
//       fact3_3bn=fact3(3,2)

//       if(nranda.eq.0)then
//         fact3_4a=0
//       else
//         fact3_4a=nint(100.0*fact3(4,1)/real(nranda))
//       endif
//       fact3_4an=fact3(4,1)

//       if(nrandb.eq.0)then
//         fact3_4b=0
//       else
//         fact3_4b=nint(100.0*fact3(4,2)/real(nrandb))
//       endif
//       fact3_4bn=fact3(4,2)

//       if(nranda.eq.0)then
//         factx_1a=0
//       else
//         factx_1a=nint(100.0*factx(1,1)/real(nranda))
//       endif
//       factx_1an=factx(1,1)

//       if(nrandb.eq.0)then
//         factx_1b=0
//       else
//         factx_1b=nint(100.0*factx(1,2)/real(nrandb))
//       endif
//       factx_1bn=factx(1,2)

//       if(nranda.eq.0)then
//         factx_2a=0
//       else
//         factx_2a=nint(100.0*factx(2,1)/real(nranda))
//       endif
//       factx_2an=factx(2,1)

//       if(nrandb.eq.0)then
//         factx_2b=0
//       else
//         factx_2b=nint(100.0*factx(2,2)/real(nrandb))
//       endif
//       factx_2bn=factx(2,2)

// c test
// c      fact1_1a = propx
// c      fact1_1b = nint(propxpc)
// c      fact1_1a=0
// c      fact1_1b=2
// c      fact1_2a=3
// c      fact1_2b=4
// c      fact2_1a=5
// c      fact2_1b=6
// c      fact2_2a=7
// c      fact2_2b=8
// c      fact2_3a=9
// c      fact2_3b=10
// c      nranda=222
// c      nrandb=333

/* from C:\Users\cbird\Projects\js-lind\dev\Randomisation results.html
function Show(ename) {
	if(document.all) {
		for(var i = 0; i < document.all.length; ++i) {
			if(document.all[i].name == ename) {
				document.all[i].style.visibility ='visible';
			}
		}
	} else {
		var objs = document.getElementsByName(ename);
	   	for(var i = 0; i < objs.length; ++i) {
			objs[i].style.visibility ='visible';
		}
	}
}
function Show1() { setTimeout("Show2()", 1000); }
function Show2() { Show("heading"); setTimeout("Show3()", 1000); }
function Show3() { Show("duration"); setTimeout("Show4()", 1000); }
function Show4() { Show("sev"); setTimeout("Show5()", 1000); }
function Show5() { Show("age"); setTimeout("Show6()", 1000); }
function Show6() { Show("cond"); }
*/

// function show(id) {
//     $(id).show();
// 	// if(document.all) {
// 	// 	for(var i = 0; i < document.all.length; ++i) {
// 	// 		if(document.all[i].name == ename) {
// 	// 			document.all[i].style.visibility ='visible';
// 	// 		}
// 	// 	}
// 	// } else {
// 	// 	var objs = document.getElementsByName(ename);
// 	//    	for(var i = 0; i < objs.length; ++i) {
// 	// 		objs[i].style.visibility ='visible';
// 	// 	}
// 	// }
// }

