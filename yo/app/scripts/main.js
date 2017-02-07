console.log('Ready...');




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

/* simplerand2_f.f from jameslind.git

      subroutine simplerand2(seed,iform,nrand,propx,nranda,nrandb, 
     *  fact1_1a,fact1_1b,fact1_2a,fact1_2b,fact2_1a,fact2_1b,
     *  fact2_2a,fact2_2b,fact2_3a,fact2_3b,fact3_1a,fact3_1b,
     *  fact3_2a,fact3_2b,fact3_3a,fact3_3b,fact3_4a,fact3_4b,  
     *  factx_1a,factx_1b,factx_2a,factx_2b,
     *  fact1_1an,fact1_1bn,fact1_2an,fact1_2bn,fact2_1an,fact2_1bn,
     *  fact2_2an,fact2_2bn,fact2_3an,fact2_3bn,fact3_1an,fact3_1bn,
     *  fact3_2an,fact3_2bn,fact3_3an,fact3_3bn,fact3_4an,fact3_4bn,  
     *  factx_1an,factx_1bn,factx_2an,factx_2bn)

c     Takes in nrand, iform & propx
c     gets NRAND randon numbers between 0.0 & 1.0 for each of the 4 factor groups
c     FACT1, FACT2, FACT3 & FACTX, to determine the distributions between 2 theoretical 
c     treatment groups, treatment A & treatment B
c
c     Factor 1 : Duration of health problem : 2 categories - long-term; recent
c     Factor 2 : Severity of Health problem : 3 categories - mild; moderate; severe
c     Factor 3 : Age                   : 4 categories - under 15, 15-34, 35-64, 65+

c     Factor X : Chosen by user - if CLABEL blank then there is no factor - passes back zeros
c
c     For eg, FACT3(2,1) is the number of patients for factor 2 (age), category 2 (15-34),
c                        on treatment A
c
c     Web version : Passes back 22 values...
c
c     Author : Jim Halsey, March 2004
c
      implicit none

      integer i, nrand, iform, seed
      integer nranda, nrandb, trtdim, propx,
     *  fact1_1a,fact1_1b,fact1_2a,fact1_2b,fact2_1a,
     *  fact2_1b,fact2_2a,fact2_2b,fact2_3a,fact2_3b,
     *  fact3_1a,fact3_1b,fact3_2a,fact3_2b,fact3_3a,
     *  fact3_3b,fact3_4a,fact3_4b,factx_1a,factx_1b,
     *  factx_2a,factx_2b,fact1_1an,fact1_1bn,fact1_2an,
     *  fact1_2bn,fact2_1an,fact2_1bn,fact2_2an,fact2_2bn,
     *  fact2_3an,fact2_3bn,fact3_1an,fact3_1bn,
     *  fact3_2an,fact3_2bn,fact3_3an,fact3_3bn,fact3_4an,
     *  fact3_4bn,factx_1an,factx_1bn,factx_2an,factx_2bn


      integer  fact1(2,2)/4*0/,fact2(3,2)/6*0/,fact3(4,2)/8*0/,
     *         factx(2,2)/4*0/
      real ntoss, randno, propxpc

      fact1(1,1)=0
      fact1(1,2)=0
      fact1(2,1)=0
      fact1(2,2)=0

      fact2(1,1)=0
      fact2(1,2)=0
      fact2(2,1)=0
      fact2(2,2)=0
      fact2(3,1)=0
      fact2(3,2)=0

      fact3(1,1)=0
      fact3(1,2)=0
      fact3(2,1)=0
      fact3(2,2)=0
      fact3(3,1)=0
      fact3(3,2)=0
      fact3(4,1)=0
      fact3(4,2)=0

      factx(1,1)=0
      factx(1,2)=0
      factx(2,1)=0
      factx(2,2)=0


c initialise vars
      fact1_1a=0
      fact1_1b=0
      fact1_2a=0
      fact1_2b=0
      fact2_1a=0
      fact2_1b=0
      fact2_2a=0
      fact2_2b=0
      fact2_3a=0
      fact2_3b=0
      fact3_1a=0
      fact3_1b=0
      fact3_2a=0
      fact3_2b=0
      fact3_3a=0
      fact3_3b=0
      fact3_4a=0
      fact3_4b=0
      factx_1a=0
      factx_1b=0
      factx_2a=0
      factx_2b=0
      fact1_1an=0
      fact1_1bn=0
      fact1_2an=0
      fact1_2bn=0
      fact2_1an=0
      fact2_1bn=0
      fact2_2an=0
      fact2_2bn=0
      fact2_3an=0
      fact2_3bn=0
      fact3_1an=0
      fact3_1bn=0
      fact3_2an=0
      fact3_2bn=0
      fact3_3an=0
      fact3_3bn=0
      fact3_4an=0
      fact3_4bn=0
      factx_1an=0
      factx_1bn=0
      factx_2an=0
      factx_2bn=0

      nranda=0
      nrandb=0 

c     integer date_time(8)
c     character clock(3)*12
c
c     call date_and_time(clock(1),clock(2),clock(3),date_time)
c     call seed(date_time(8))

      call SRand(seed)
      
      fact1_1a = 0
      
c      nrand=0
c      fact1_1a=0
      
      do i=1,nrand
c      do i=1,int(nrand)

c       call random(randno)
        randno=Rand()
      
        if(randno.lt.0.5)then
            trtdim=1
            nranda=nranda+1
        else
            trtdim=2
            nrandb=nrandb+1
        endif

c factor 1 (duration of health problem) 0.7=long-term; 0.3=recent

c       call random(randno)
        randno=Rand()
      
        if(randno.lt.0.3)then
            fact1(1,trtdim)=fact1(1,trtdim)+1
        else 
            fact1(2,trtdim)=fact1(2,trtdim)+1
        endif

c     factor 2 (severity of health problem) 0.3: mild; 0.45 moderate; 0.25: severe

c       call random(randno)
        randno=Rand()
        if(randno.lt.0.3)then
            fact2(1,trtdim)=fact2(1,trtdim)+1
        else if((randno.ge.0.3).and.(randno.lt.0.75))then
            fact2(2,trtdim)=fact2(2,trtdim)+1
        else 
            fact2(3,trtdim)=fact2(3,trtdim)+1
        endif

c factor 3 (age) 0.2= under 15; 0.25= 14-34 yrs; 0.25= 35-64 yrs; 0.3= 65 & older

c       call random(randno)
        randno=Rand()
      
        if(randno.lt.0.2)then
            fact3(1,trtdim)=fact3(1,trtdim)+1
        else if((randno.ge.0.2).and.(randno.lt.0.45))then
            fact3(2,trtdim)=fact3(2,trtdim)+1
        else if((randno.ge.0.45).and.(randno.lt.0.7))then
            fact3(3,trtdim)=fact3(3,trtdim)+1
        else
            fact3(4,trtdim)=fact3(4,trtdim)+1
        endif

c     factor X (a factor chosen by the user)

        propxpc=propx/100.0

c       call random(randno)
        randno=Rand()       
        if(iform.eq.1)then
          if(randno.lt.0.05)then
              factx(1,trtdim)=factx(1,trtdim)+1
          else 
              factx(2,trtdim)=factx(2,trtdim)+1
          endif
        else
	      if(randno.lt.propxpc)then
              factx(1,trtdim)=factx(1,trtdim)+1
          else 
              factx(2,trtdim)=factx(2,trtdim)+1
          endif
        endif
      end do

c convert to %s & assign array values to variables to be passed back top main program


      if(nranda.eq.0)then
        fact1_1a=0
      else	
      	fact1_1a=nint(100.0*fact1(1,1)/real(nranda))
      endif
      fact1_1an=fact1(1,1)

      if(nrandb.eq.0)then
        fact1_1b=0
      else	
     	fact1_1b=nint(100.0*fact1(1,2)/real(nrandb))
      endif
      fact1_1bn=fact1(1,2)      
      
      if(nranda.eq.0)then
        fact1_2a=0
      else	
        fact1_2a=nint(100.0*fact1(2,1)/real(nranda))
      endif
      fact1_2an=fact1(2,1)
      
      if(nrandb.eq.0)then
        fact1_2b=0
      else	
        fact1_2b=nint(100.0*fact1(2,2)/real(nrandb))
      endif
      fact1_2bn=fact1(2,2)
      
      if(nranda.eq.0)then
        fact2_1a=0
      else	
        fact2_1a=nint(100.0*fact2(1,1)/real(nranda))
      endif
      fact2_1an=fact2(1,1)
      
      if(nrandb.eq.0)then
        fact2_1b=0
      else	
        fact2_1b=nint(100.0*fact2(1,2)/real(nrandb))
      endif
      fact2_1bn=fact2(1,2)
      
      if(nranda.eq.0)then
        fact2_2a=0
      else	
        fact2_2a=nint(100.0*fact2(2,1)/real(nranda))
      endif
      fact2_2an=fact2(2,1) 

      if(nrandb.eq.0)then
        fact2_2b=0
      else	
        fact2_2b=nint(100.0*fact2(2,2)/real(nrandb))
      endif
      fact2_2bn=fact2(2,2)
      
      if(nranda.eq.0)then
        fact2_3a=0
      else	
        fact2_3a=nint(100.0*fact2(3,1)/real(nranda))
      endif
      fact2_3an=fact2(3,1)
      
      if(nrandb.eq.0)then
        fact2_3b=0
      else	
        fact2_3b=nint(100.0*fact2(3,2)/real(nrandb))
      endif
      fact2_3bn=fact2(3,2)
      
      if(nranda.eq.0)then
        fact3_1a=0
      else	
        fact3_1a=nint(100.0*fact3(1,1)/real(nranda))
      endif
      fact3_1an=fact3(1,1)	
	
      if(nrandb.eq.0)then
        fact3_1b=0
      else	
        fact3_1b=nint(100.0*fact3(1,2)/real(nrandb))
      endif
      fact3_1bn=fact3(1,2)	
	
      if(nranda.eq.0)then
        fact3_2a=0
      else	
        fact3_2a=nint(100.0*fact3(2,1)/real(nranda))
      endif
      fact3_2an=fact3(2,1)
      
      if(nrandb.eq.0)then
        fact3_2b=0
      else	
        fact3_2b=nint(100.0*fact3(2,2)/real(nrandb))
      endif
      fact3_2bn=fact3(2,2)
      
      if(nranda.eq.0)then
        fact3_3a=0
      else	
        fact3_3a=nint(100.0*fact3(3,1)/real(nranda))
      endif
      fact3_3an=fact3(3,1)
      
      if(nrandb.eq.0)then
        fact3_3b=0
      else	
        fact3_3b=nint(100.0*fact3(3,2)/real(nrandb))
      endif
      fact3_3bn=fact3(3,2)
      
      if(nranda.eq.0)then
        fact3_4a=0
      else	
        fact3_4a=nint(100.0*fact3(4,1)/real(nranda))
      endif
      fact3_4an=fact3(4,1)
      
      if(nrandb.eq.0)then
        fact3_4b=0
      else	
        fact3_4b=nint(100.0*fact3(4,2)/real(nrandb))
      endif
      fact3_4bn=fact3(4,2)
      	
      if(nranda.eq.0)then
        factx_1a=0
      else	
        factx_1a=nint(100.0*factx(1,1)/real(nranda))
      endif
      factx_1an=factx(1,1)

      if(nrandb.eq.0)then
        factx_1b=0
      else	
        factx_1b=nint(100.0*factx(1,2)/real(nrandb))
      endif
      factx_1bn=factx(1,2)
      
      if(nranda.eq.0)then
        factx_2a=0
      else	
        factx_2a=nint(100.0*factx(2,1)/real(nranda))
      endif
      factx_2an=factx(2,1)
      
      if(nrandb.eq.0)then
        factx_2b=0
      else	
        factx_2b=nint(100.0*factx(2,2)/real(nrandb))
      endif
      factx_2bn=factx(2,2)

c test

c      fact1_1a = propx
c      fact1_1b = nint(propxpc)
c      fact1_1a=0
c      fact1_1b=2
c      fact1_2a=3
c      fact1_2b=4
c      
c      fact2_1a=5
c      fact2_1b=6
c      fact2_2a=7
c      fact2_2b=8
c      fact2_3a=9
c      fact2_3b=10
      
c      nranda=222
c      nrandb=333
      
      return
      end
*/