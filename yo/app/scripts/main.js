console.log('Ready...');
var MAXSTARTRAND = 10000, MAXENDRAND = 100000;
var PAUSE = 500;
var nrand = 0;
var currentPage = '#intro';

// handle enter key on input
$(function () {
    if (currentPage !== "#intro") return;
    $("#nrandrec").keypress(function (e) {
        if (e.keyCode == 13) {  // enter
            doRand();
        }
    });
});


function showPage(id) {
    $(currentPage).hide();
    currentPage = id;
    $(id).show();
}

// 10 times bigger values are hidden using "visibility: hidden" which preserves the onscreen space for an element
// as opposed to "display: none" which causes the element not to be present at all, which could break the layout
// jQuery hide() and show() change "display", but there is no equivalent for "visibility", so here is a jQuery plugin:
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
function show5() { $(".age").visible(); setTimeout(show6, PAUSE); }
function show4() { $(".sev").visible(); setTimeout(show5, PAUSE); }
function show3() { $(".duration").visible(); setTimeout(show4, PAUSE); }
function show2() { $(".heading").visible(); setTimeout(show3, PAUSE); }
function show1a() { $("#summaryNext").visible(); setTimeout(show2, PAUSE); }
function show1() { setTimeout(show1a, PAUSE); }

function hideNext() {
    $(".hideable").invisible();
}

function showIntro() {
    showPage('#intro');
}

function doRand() {                 // get a starting number of patients and randomise
    var enteredNumber = parseInt($('#nrandrec').val(), 10);
    console.log('simplerand(): got the number: ' + enteredNumber);
    if (isNaN(enteredNumber) || enteredNumber < 0 || enteredNumber > MAXSTARTRAND) {
        alert('Please enter a number between 0 and ' + MAXSTARTRAND); // alert('Doh!');
        return;
    } else {
        nrand = enteredNumber;
        var base = new Factors();
        base.randomise(nrand);
        fillBase(base);
        hideNext();                 // make sure "10 times bigger" values are hidden to begin with
        showPage('#results');
    }
}

function makeBigger(nrand) {        // multiply number of patients by 10 and randomise again
    var nrandNext = window.nrand * 10;
    if (nrandNext > MAXENDRAND) {
        alert('Number of patients must be between 0 and ' + MAXENDRAND);
    } else {
        window.nrand = nrandNext;   // global vars bad
        console.log('makeBigger(): nrand is now: ' + window.nrand);
        var factors = new Factors();
        factors.randomise(window.nrand);
        hideNext();
        fillNext(factors);
        show1();
    }
}

// FORTRAN version used a 2d array of which which treatments were randomised into which factors - use a JS function object instead
function Factors() {    // each strata for each factor has a tuple for a count of patients randomised to treatment A or B
    this.nrand = 0;
    this.nranda = 0;
    this.nrandb = 0;
    this.f1 = {         // duration
        s1: [0, 0],
        s2: [0, 0]
    };
    this.f2 =  {        // severity
        s1: [0, 0],
        s2: [0, 0],
        s3: [0, 0]
    };
    this.f3 = {         // age
        s1: [0, 0],
        s2: [0, 0],
        s3: [0, 0],
        s4: [0, 0]
    };
    this.f4 = {         // anxious
        s1: [0, 0],
        s2: [0, 0]
    };
};

// gets NRAND random numbers between 0.0 & 1.0 for each of the 4 factor groups FACT1, FACT2, FACT3 & FACTX,
// to determine the distributions between 2 theoretical treatment groups, treatment A & treatment B
// Factor 1 : Duration of health problem    : 2 categories - long-term; recent
// Factor 2 : Severity of Health problem    : 3 categories - mild; moderate; severe
// Factor 3 : Age                           : 4 categories - under 15, 15-34, 35-64, 65+
// Factor X : was a name factor with a percentage chosen by the user, now defaults to "Very anxious" (and what percentage?)
// e.g. FACT3(2,1) is the number of patients for factor 2 (age), category 2 (15-34), on treatment A
// possible gotchas: rand seed, 16-bit floating point rounding errors
Factors.prototype.randomise = function(nrand) {
    this.nrand = nrand;
    for (var i=0; i < nrand; i++) {         // do i=1,nrand
        var treatment;                      // treatment dimension?
        var randno = Math.random();         // flip a coin
        if (randno < 0.5) {                 // treatment A
            treatment = 0;                  // is an index into an array, remember, so 0-indexed
            this.nranda += 1;
        } else {                            // treatment B
            treatment = 1;
            this.nrandb += 1;
        }

        // simulate patient factors using random numbers instead of real data
        // factor 1 (duration of health problem): 0.7 long-term; 0.3 recent
        randno = Math.random();
        if (randno < 0.3) {
            this.f1.s1[treatment]++;
        } else {
            this.f1.s2[treatment]++;
        }

        // factor 2 (severity of health problem) 0.3: mild; 0.45 moderate; 0.25: severe
        randno = Math.random();
        if (randno < 0.3) {
            this.f2.s1[treatment]++;
        } else if ((randno > 0.3) && (randno < 0.75)) {
            this.f2.s2[treatment]++;
        } else {
            this.f2.s3[treatment]++;
        }

        // factor 3 (age) 0.2= under 15; 0.25= 14-34 yrs; 0.25= 35-64 yrs; 0.3= 65 & older
        randno = Math.random();
        if (randno < 0.2) {
            this.f3.s1[treatment]++;
        } else if ((randno > 0.2) && (randno < 0.45)) {
            this.f3.s2[treatment]++;
        } else if ((randno > 0.45) && (randno < 0.7)) {
            this.f3.s3[treatment]++;
        } else {
            this.f3.s4[treatment]++;
        }

        // factor X (in earlier versions, was a factor chosen by the user - now defaults to "Very anxious") (default 5%?)
        randno = Math.random();
        if (randno < 0.05) {                // yes, default 5%
            this.f4.s1[treatment]++;
        } else {
            this.f4.s2[treatment]++;
        }
    }
}

// Fortran: "convert to percentages and assign array values to variables to be passed back to main program"
// NINT(A) rounds its argument to the nearest whole number. 0.5 rounds up to 1 by convention? Nothing in GNU docs...
// In JS: Math.round(2.5); // 3
// JavaScript Numbers are Always 64-bit Floating Point (so don't have to convert e.g. nranda to real)
// make a function to do all this...
function toPercent(nrandx, patients) {
    return Math.round(100 * patients / nrandx);
}

function fillBase(factors) {
    $('#nrand').html(factors.nrand);
    $('#treatA').html(factors.nranda);
    $('#treatB').html(factors.nrandb);
    $('#totalA').html(factors.nranda);
    $('#totalB').html(factors.nrandb);

    // could have constructed the jQuery selector from the variable name somehow, but...
    $('#f1s1t0').html(factors.f1.s1[0]);
    $('#f1s1t0pc').html(toPercent(factors.nranda, factors.f1.s1[0]));
    $('#f1s1t1').html(factors.f1.s1[1]);
    $('#f1s1t1pc').html(toPercent(factors.nrandb, factors.f1.s1[1]));
    $('#f1s2t0').html(factors.f1.s2[0]);
    $('#f1s2t0pc').html(toPercent(factors.nranda, factors.f1.s2[0]));
    $('#f1s2t1').html(factors.f1.s2[1]);
    $('#f1s2t1pc').html(toPercent(factors.nrandb, factors.f1.s2[1]));
    $('#f2s1t0').html(factors.f2.s1[0]);
    $('#f2s1t0pc').html(toPercent(factors.nranda, factors.f2.s1[0]));
    $('#f2s1t1').html(factors.f2.s1[1]);
    $('#f2s1t1pc').html(toPercent(factors.nrandb, factors.f2.s1[1]));
    $('#f2s2t0').html(factors.f2.s2[0]);
    $('#f2s2t0pc').html(toPercent(factors.nranda, factors.f2.s2[0]));
    $('#f2s2t1').html(factors.f2.s2[1]);
    $('#f2s2t1pc').html(toPercent(factors.nrandb, factors.f2.s2[1]));
    $('#f2s3t0').html(factors.f2.s3[0]);
    $('#f2s3t0pc').html(toPercent(factors.nranda, factors.f2.s3[0]));
    $('#f2s3t1').html(factors.f2.s3[1]);
    $('#f2s3t1pc').html(toPercent(factors.nrandb, factors.f2.s3[1]));
    $('#f3s1t0').html(factors.f3.s1[0]);
    $('#f3s1t0pc').html(toPercent(factors.nranda, factors.f3.s1[0]));
    $('#f3s1t1').html(factors.f3.s1[1]);
    $('#f3s1t1pc').html(toPercent(factors.nrandb, factors.f3.s1[1]));
    $('#f3s2t0').html(factors.f3.s2[0]);
    $('#f3s2t0pc').html(toPercent(factors.nranda, factors.f3.s2[0]));
    $('#f3s2t1').html(factors.f3.s2[1]);
    $('#f3s2t1pc').html(toPercent(factors.nrandb, factors.f3.s2[1]));
    $('#f3s3t0').html(factors.f3.s3[0]);
    $('#f3s3t0pc').html(toPercent(factors.nranda, factors.f3.s3[0]));
    $('#f3s3t1').html(factors.f3.s3[1]);
    $('#f3s3t1pc').html(toPercent(factors.nrandb, factors.f3.s3[1]));
    $('#f3s4t0').html(factors.f3.s4[0]);
    $('#f3s4t0pc').html(toPercent(factors.nranda, factors.f3.s4[0]));
    $('#f3s4t1').html(factors.f3.s4[1]);
    $('#f3s4t1pc').html(toPercent(factors.nrandb, factors.f3.s4[1]));
    $('#f4s1t0').html(factors.f4.s1[0]);
    $('#f4s1t0pc').html(toPercent(factors.nranda, factors.f4.s1[0]));
    $('#f4s1t1').html(factors.f4.s1[1]);
    $('#f4s1t1pc').html(toPercent(factors.nrandb, factors.f4.s1[1]));
    $('#f4s2t0').html(factors.f4.s2[0]);
    $('#f4s2t0pc').html(toPercent(factors.nranda, factors.f4.s2[0]));
    $('#f4s2t1').html(factors.f4.s2[1]);
    $('#f4s2t1pc').html(toPercent(factors.nrandb, factors.f4.s2[1]));
}

// or could merge these ^ v funcs by just adding/inserting "next" into ids if a flag is set

function fillNext(factors) {
    $('#nrandNext').html(factors.nrand);
    $('#treatANext').html(factors.nranda);
    $('#treatBNext').html(factors.nrandb);
    $('#totalANext').html(factors.nranda);
    $('#totalBNext').html(factors.nrandb);

    $('#f1s1t0next').html(factors.f1.s1[0]);
    $('#f1s1t0nextpc').html(toPercent(factors.nranda, factors.f1.s1[0]));
    $('#f1s1t1next').html(factors.f1.s1[1]);
    $('#f1s1t1nextpc').html(toPercent(factors.nrandb, factors.f1.s1[1]));
    $('#f1s2t0next').html(factors.f1.s2[0]);
    $('#f1s2t0nextpc').html(toPercent(factors.nranda, factors.f1.s2[0]));
    $('#f1s2t1next').html(factors.f1.s2[1]);
    $('#f1s2t1nextpc').html(toPercent(factors.nrandb, factors.f1.s2[1]));
    $('#f2s1t0next').html(factors.f2.s1[0]);
    $('#f2s1t0nextpc').html(toPercent(factors.nranda, factors.f2.s1[0]));
    $('#f2s1t1next').html(factors.f2.s1[1]);
    $('#f2s1t1nextpc').html(toPercent(factors.nrandb, factors.f2.s1[1]));
    $('#f2s2t0next').html(factors.f2.s2[0]);
    $('#f2s2t0nextpc').html(toPercent(factors.nranda, factors.f2.s2[0]));
    $('#f2s2t1next').html(factors.f2.s2[1]);
    $('#f2s2t1nextpc').html(toPercent(factors.nrandb, factors.f2.s2[1]));
    $('#f2s3t0next').html(factors.f2.s3[0]);
    $('#f2s3t0nextpc').html(toPercent(factors.nranda, factors.f2.s3[0]));
    $('#f2s3t1next').html(factors.f2.s3[1]);
    $('#f2s3t1nextpc').html(toPercent(factors.nrandb, factors.f2.s3[1]));
    $('#f3s1t0next').html(factors.f3.s1[0]);
    $('#f3s1t0nextpc').html(toPercent(factors.nranda, factors.f3.s1[0]));
    $('#f3s1t1next').html(factors.f3.s1[1]);
    $('#f3s1t1nextpc').html(toPercent(factors.nrandb, factors.f3.s1[1]));
    $('#f3s2t0next').html(factors.f3.s2[0]);
    $('#f3s2t0nextpc').html(toPercent(factors.nranda, factors.f3.s2[0]));
    $('#f3s2t1next').html(factors.f3.s2[1]);
    $('#f3s2t1nextpc').html(toPercent(factors.nrandb, factors.f3.s2[1]));
    $('#f3s3t0next').html(factors.f3.s3[0]);
    $('#f3s3t0nextpc').html(toPercent(factors.nranda, factors.f3.s3[0]));
    $('#f3s3t1next').html(factors.f3.s3[1]);
    $('#f3s3t1nextpc').html(toPercent(factors.nrandb, factors.f3.s3[1]));
    $('#f3s4t0next').html(factors.f3.s4[0]);
    $('#f3s4t0nextpc').html(toPercent(factors.nranda, factors.f3.s4[0]));
    $('#f3s4t1next').html(factors.f3.s4[1]);
    $('#f3s4t1nextpc').html(toPercent(factors.nrandb, factors.f3.s4[1]));
    $('#f4s1t0next').html(factors.f4.s1[0]);
    $('#f4s1t0nextpc').html(toPercent(factors.nranda, factors.f4.s1[0]));
    $('#f4s1t1next').html(factors.f4.s1[1]);
    $('#f4s1t1nextpc').html(toPercent(factors.nrandb, factors.f4.s1[1]));
    $('#f4s2t0next').html(factors.f4.s2[0]);
    $('#f4s2t0nextpc').html(toPercent(factors.nranda, factors.f4.s2[0]));
    $('#f4s2t1next').html(factors.f4.s2[1]);
    $('#f4s2t1nextpc').html(toPercent(factors.nrandb, factors.f4.s2[1]));
}
