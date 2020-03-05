function fadeProfileElements() {
    var i = 0;
    var fadeProfile = document.getElementsByClassName("fade1");
    var fadeProfileLimit = fadeProfile.length;
    var fadeProfileInterval = setInterval(function() {
        console.log("i is " + i + "limit is " + fadeProfileLimit);
        if (i > (fadeProfileLimit - 1)) {
            console.log("null");
            clearInterval(fadeProfileInterval);
        }
        fadeProfile[i].classList.toggle("fade");
        i++;
    }, 150);
}

function fadeNavbarElements() {
    var i = 0;
    var fadeProfile = document.getElementsByClassName("fade2");
    var fadeProfileLimit = fadeProfile.length;
    var fadeProfileInterval = setInterval(function() {
        console.log("i is " + i + "limit is " + fadeProfileLimit);
        if (i > (fadeProfileLimit - 1)) {
            console.log("null");
            clearInterval(fadeProfileInterval);
        }
        fadeProfile[i].classList.toggle("fade");
        i++;
    }, 75);
}


window.onload = function() {
    setTimeout(fadeProfileElements, 100);
    setTimeout(fadeNavbarElements, 1000);
};