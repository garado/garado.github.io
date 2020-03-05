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

function aboutScroll() {
    var element = document.getElementById("about");
    element.scrollIntoView();
}

function projectScroll() {
    var element = document.getElementById("projects");
    element.scrollIntoView();
}

function resumeScroll() {
    var element = document.getElementById("resume");
    element.scrollIntoView();
}

window.onload = function() {
    // Fade stuff in
    setTimeout(fadeProfileElements, 100);
    setTimeout(fadeNavbarElements, 1000);

    // Scrolling navbar links into view
    document.getElementById("nav-about").addEventListener("click", aboutScroll);
    document.getElementById("nav-projects").addEventListener("click", projectScroll);
    document.getElementById("nav-resume").addEventListener("click", resumeScroll);
};