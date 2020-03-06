function fadeProfileElements() {
    var i = 0;
    var fadeProfile = document.getElementsByClassName("fade1");
    var fadeProfileLimit = fadeProfile.length;
    var fadeProfileInterval = setInterval(function() {
        if (i > (fadeProfileLimit - 2)) {
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
        if (i > (fadeProfileLimit - 2)) {
            clearInterval(fadeProfileInterval);
        }
        fadeProfile[i].classList.toggle("fade");
        i++;
    }, 75);
}

window.onload = function() {
    // Fade stuff in
    setTimeout(fadeProfileElements, 100);
    setTimeout(fadeNavbarElements, 1000);
};