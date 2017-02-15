console.log('Ready...');

var stage = "start", nrand = 0; //, nranda = 0, nrandb = 0, nrandNext = 0, treatANext = 0, treatBNext = 0;

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
    $("#summaryNext").hide();       // remove from layout as well
}

function begin() {                  // Takes in nrand, iform & propx?
    if (stage === "start") {
        var enteredNumber = parseInt($('#nrandrec').val(), 10);
        console.log('simplerand(): got the number: ' + enteredNumber);
        if (isNaN(enteredNumber) || enteredNumber < 0 || enteredNumber > 10000) {
            alert('Please enter a number between 0 and 10,000'); // alert('Doh!');
            return;
        } else {
            nrand = enteredNumber;
            var base = new Factors();
            base.randomise(nrand);
            fillBase(base);
            hideNext();             // make sure "10 times bigger" values are hidden to begin with
            $('#intro').hide();     // intro "page"
            $('#results').show();   // results "page"
        }
    }
}

function makeBigger(nrand) {
    hideNext();
    console.log('makeBigger(): nrand is: ' + window.nrand); // global vars bad
    var nrandNext = window.nrand * 10;
    if (nrandNext > 100000) {
        alert('Number of patients must be between 0 and 100,000');
    } else {
        window.nrand = nrandNext;
        console.log('makeBigger(): nrand is now: ' + nrand);
        var factors = new Factors();
        factors.randomise(nrandNext);
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

