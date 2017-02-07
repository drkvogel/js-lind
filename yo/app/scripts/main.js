console.log('Ready...');

var stage = "start", nrand;

//  subroutine simplerand2(seed,iform,nrand,propx,nranda,nrandb,
//      fact1_1a,fact1_1b,fact1_2a,fact1_2b,fact2_1a,fact2_1b,      factor 1, strata 1/2, treatment a/b
//      fact2_2a,fact2_2b,fact2_3a,fact2_3b,fact3_1a,fact3_1b,
//      fact3_2a,fact3_2b,fact3_3a,fact3_3b,fact3_4a,fact3_4b,
//      factx_1a,factx_1b,factx_2a,factx_2b,
//      fact1_1an,fact1_1bn,fact1_2an,fact1_2bn,fact2_1an,fact2_1bn,
//      fact2_2an,fact2_2bn,fact2_3an,fact2_3bn,fact3_1an,fact3_1bn,
//      fact3_2an,fact3_2bn,fact3_3an,fact3_3bn,fact3_4an,fact3_4bn,
//      factx_1an,factx_1bn,factx_2an,factx_2bn)

// FORTRAN version used a 2d array of which which treatments were randomised into which factors
// use a JS object instead
/*
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
        No (95% probability) */
var factors = { // each strata for each factor has a tuple for a count of patients randomised to treatment A or B
    fact1duration: {
        s1longterm: [0, 0],
        s2recent: [0, 0]
    },
    fact2severity: {
        s1mild: [0, 0],
        s2moderate: [0, 0],
        s3severe: [0, 0]
    },
    fact3age: {
        s1u15: [0, 0],
        s2gt15lt35: [0, 0],
        s3ge35lt65: [0, 0],
        s4ge65: [0, 0]
    },
    fact4anxious: {
        s1yes: [0, 0],
        s2no: [0, 0]
    }
};

var nranda, nrandb;
var errorNrandRec = "<p><font color=\"red\">*** Number of patients must be between 0 and 10000 ***</font></p>\n";

// gets NRAND random numbers between 0.0 & 1.0 for each of the 4 factor groups FACT1, FACT2, FACT3 & FACTX,
// to determine the distributions between 2 theoretical treatment groups, treatment A & treatment B
// Factor 1 : Duration of health problem    : 2 categories - long-term; recent
// Factor 2 : Severity of Health problem    : 3 categories - mild; moderate; severe
// Factor 3 : Age                           : 4 categories - under 15, 15-34, 35-64, 65+
// Factor X : was a name factor with a percentage chosen by the user, now defaults to "Very anxious" (and what percentage?)
// e.g. FACT3(2,1) is the number of patients for factor 2 (age), category 2 (15-34), on treatment A
// possible gotchas: rand seed, 16-bit floating point rounding errors

// handle enter key on input
$(function () {
    $("#nrandrec").keypress(function (e) {
        if (e.keyCode == 13) { // enter
            simplerand();
        }
    });
});

function makeBigger() {
    var next = nrand * 10;
    if (next > 100000) {
        alert('Number of patients must be between 0 and 100,000');
    } else {
        nrand = next;
        alert('Make bigger! nrand is now: ' + nrand);
    }
}


function simplerand() { // Takes in nrand, iform & propx?
    alert('simplerand(): got the number: ' + enteredNumber);
    if (stage === "start") {
        var enteredNumber = parseInt($('#nrandrec').val(), 10);
        if (isNaN(enteredNumber) || enteredNumber < 1 || enteredNumber > 100000) {
            alert('Please enter a number between 1 and 100,000'); // alert('Doh!');
            return;
        } else {
            nrand = enteredNumber;
            $('#intro').hide();
            $('#results').show();
        }
    }
    console.log(factors); //alert(factors); // doesn't print whole object
    //var i, nrand, iform, seed, nranda, nrandb, treatment, propx;
    // fact1_1a,fact1_1b,fact1_2a,fact1_2b,fact2_1a, fact2_1b,fact2_2a,fact2_2b,fact2_3a,fact2_3b, fact3_1a,fact3_1b,fact3_2a,fact3_2b,fact3_3a, fact3_3b,fact3_4a,fact3_4b,factx_1a,factx_1b, factx_2a,factx_2b,fact1_1an,fact1_1bn,fact1_2an, fact1_2bn,fact2_1an,fact2_1bn,fact2_2an,fact2_2bn, fact2_3an,fact2_3bn,fact3_1an,fact3_1bn, fact3_2an,fact3_2bn,fact3_3an,fact3_3bn,fact3_4an, fact3_4bn,factx_1an,factx_1bn,factx_2an,factx_2bn
    // real ntoss, randno, propxpc

    // what's this? declaring and initialising 2D arrays
    // integer fact1(2,2)/4*0/,fact2(3,2)/6*0/,fact3(4,2)/8*0/, factx(2,2)/4*0/ // declaring array dimensions
    // fact1(1,1)=0 fact1(1,2)=0 fact1(2,1)=0 fact1(2,2)=0 fact2(1,1)=0 fact2(1,2)=0 fact2(2,1)=0 fact2(2,2)=0 fact2(3,1)=0 fact2(3,2)=0 fact3(1,1)=0 fact3(1,2)=0 fact3(2,1)=0 fact3(2,2)=0 fact3(3,1)=0 fact3(3,2)=0 fact3(4,1)=0 fact3(4,2)=0 factx(1,1)=0 factx(1,2)=0 factx(2,1)=0 factx(2,2)=0
    // in JS there are technically no multidimensional arrays, but you can have an array of arrays
    // fact1[][] etc

    // Fortran version has individual variables for each element in each array in order to pass back to C program
    // initialise vars fact1_1a=0 fact1_1b=0 fact1_2a=0 fact1_2b=0 fact2_1a=0 fact2_1b=0 fact2_2a=0 fact2_2b=0 fact2_3a=0 fact2_3b=0 fact3_1a=0 fact3_1b=0 fact3_2a=0 fact3_2b=0 fact3_3a=0 fact3_3b=0 fact3_4a=0 fact3_4b=0 factx_1a=0 factx_1b=0 factx_2a=0 factx_2b=0 fact1_1an=0 fact1_1bn=0 fact1_2an=0 fact1_2bn=0 fact2_1an=0 fact2_1bn=0 fact2_2an=0 fact2_2bn=0 fact2_3an=0 fact2_3bn=0 fact3_1an=0 fact3_1bn=0 fact3_2an=0 fact3_2bn=0 fact3_3an=0 fact3_3bn=0 fact3_4an=0 fact3_4bn=0 factx_1an=0 factx_1bn=0 factx_2an=0 factx_2bn=0
    // nranda=0 nrandb=0
    var trtdim; // treatment dimension?
    for (var i=1; i < nrand; i++) { // do i=1,nrand
        var randno = Math.random(); // flip a coin
        if (randno < 0.5) {     // treatment A
            treatment = 0;
            nranda++;// = nranda+1
        } else {                // treatment B
            treatment = 1;
            nrandb++; //=nrandb+1
        }

        // simulate patient factors using random numbers instead of real data

        // factor 1 (duration of health problem): 0.7 long-term; 0.3 recent
        randno = Math.random();
        if (randno < 0.3) {
            factors.fact1duration.s1longterm[treatment]++; //fact1(1,treatment)=fact1(1,treatment)+1
        } else {
            factors.fact1duration.s2recent[treatment]++; //fact1(2,treatment)=fact1(2,treatment)+1
        }

        // factor 2 (severity of health problem) 0.3: mild; 0.45 moderate; 0.25: severe
        randno = Math.random();
        if (randno < 0.3) {
            factors.fact2severity.s1mild[treatment]++; //fact2(1,treatment)=fact2(1,treatment)+1
        } else if ((randno > 0.3) && (randno < 0.75)) {
            factors.fact2severity.s2moderate[treatment]++; //fact2(2,treatment)=fact2(2,treatment)+1
        } else {
            factors.fact2severity.s3severe[treatment]++; //fact2(3,treatment)=fact2(3,treatment)+1
        }

        // factor 3 (age) 0.2= under 15; 0.25= 14-34 yrs; 0.25= 35-64 yrs; 0.3= 65 & older
        randno = Math.random();
        if (randno < 0.2) {
            factors.fact3age.s1u15[treatment]++; // fact3(1,treatment)=fact3(1,treatment)+1
        } else if ((randno > 0.2) && (randno < 0.45)) {
            factors.fact3age.s2gt15lt35[treatment]++; //fact3(2,treatment)=fact3(2,treatment)+1
        } else if ((randno > 0.45) && (randno < 0.7)) {
            factors.fact3age.s3ge35lt65[treatment]++; //fact3(3,treatment)=fact3(3,treatment)+1
        } else {
            factors.fact3age.s4ge65[treatment]++; //fact3(4,treatment)=fact3(4,treatment)+1
        }

        // factor X (was a factor chosen by the user, now defaults to "Very anxious") (default 5%?)
        randno = Math.random();
        if (randno < 0.05) { // yes, default 5%
            factors.fact4anxious.s1yes[treatment]++; //factx(1,treatment)=factx(1,treatment)+1
        } else {
            factors.fact4anxious.s2no[treatment]++; //ffactx(2,treatment)=factx(2,treatment)+1
        }

        // with variable factor, maybe not needed
        // propxpc=propx/100.0 //??
        //if (iform === 1) {
        // ... (as above)
        // } else {
        //     if (randno < propxpc) {
        //         //factx(1,treatment)=factx(1,treatment)+1
        //     } else {
        //         factx(2,treatment)=factx(2,treatment)+1
        //     }
        // }

        // now convert to percentages?


    } // end do
}

// Fortran: "convert to percentages and assign array values to variables to be passed back to main program"
// NINT(A) rounds its argument to the nearest whole number. 0.5 rounds up to 1 by convention? Nothing in GNU docs...
// In JS: Math.round(2.5); // 3
// JavaScript Numbers are Always 64-bit Floating Point (so don't have to convert e.g. nranda to real)
// make a function to do all this...
function toPercent(nrandx, factor, percentage) {
    percentage = Math.round(100 * factor / nrandx);
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

function show1() { setTimeout(show2, 1000); }
function show2() { $("#heading").show(); setTimeout(show3, 1000); }
function show3() { $("#duration").show(); setTimeout(show4, 1000); }
function show4() { $("#sev").show(); setTimeout(show5, 1000); }
function show5() { $("#age").show(); setTimeout(show6, 1000); }
function show6() { $("#cond").show(); }
