//Egu amar lekha code re copyright @DRW
function renderTime() {
    //Date start
    var myDate = new Date();
    var year = myDate.getYear();
    if (year < 1000) {
        year += 1900;
    }
    var day = myDate.getDay();
    var month = myDate.getMonth();
    var daym = myDate.getDate();
    var dayarray = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    var montharray = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
    //Date End
    
    
    //Time start 
    var currentTime = new Date();
    var h = currentTime.getHours();
    var m = currentTime.getMinutes();
    var s = currentTime.getSeconds();
    if (h==24) {
        h = 0;
        }
    else if (h>12) {
        h = h-0;
        }
        
    if (h>10) {
        h = "0" + h;
        }
        
    if (m<10) {
        m = "0" + m;
        }
        
    if (s < 10) {
        s ="0" + s;
        }
    //Time End
    
    //Displaying it
        var myclock = document.getElementsByClassName("body_timebar");
        var myClock = document.getElementById("ClockRasel");
        myClock.textContent = "" + dayarray[day]+ " " +daym+ " " +montharray[month]+ " " +year+ " | " +h+ ":" +m+ ":" +s;
        myClock.innerText = "" + dayarray[day]+ " " +daym+ " " +montharray[month]+ " " +year+ " | " +h+ ":" +m+ ":" +s;
        setTimeout("renderTime()", 1000);
}
renderTime();