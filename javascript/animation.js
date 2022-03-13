function fadeProfileElements() {
    var i = 0;
    var fadeProfile = document.getElementsByClassName("fade1");
    var fadeProfileLimit = fadeProfile.length;
    var fadeProfileInterval = setInterval(function() {
        if (i > (fadeProfileLimit - 2)) {
            clearInterval(fadeProfileInterval);
        }
        if (fadeProfile[i] != null) {
            fadeProfile[i].classList.toggle("fade");            
        }
        i++;
    }, 75);
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

function themeIcon() {
    const themeStylesheet = document.getElementById('theme');
    const darkIcon = document.getElementById('moon');
    const lightIcon = document.getElementById('sun');
    if (themeStylesheet.href.includes('light')){
        lightIcon.style.display = 'initial';
        darkIcon.style.display='none';
    } else {
        lightIcon.style.display = 'none';
        darkIcon.style.display='initial';
    }
}

window.onload = function() {
    // Fade stuff in
    setTimeout(fadeProfileElements, 100);
    setTimeout(fadeNavbarElements, 500);
    themeIcon();
};