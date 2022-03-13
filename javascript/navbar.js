$(document).ready(function() {
    $(window).scroll(function () {
        // if past landing screen, fix navbar
        if ($(window).scrollTop() > ($(window).height() * .90)) {
            $('#navbar').addClass('navbar-fixed-top');
            $('.navlink').addClass('navlink-fixed');
            $('.hamburger').addClass('navlink-fixed');
        }
  
        // if landing screen is visible, unfix navbar
        if ($(window).scrollTop() < ($(window).height() * .9001)) {
            $('#navbar').removeClass('navbar-fixed-top');
            $('.navlink').removeClass('navlink-fixed');
            $('.hamburger').removeClass('navlink-fixed');
        }

        // on mobile: lazy load project box opacity
        if ($(window).innerWidth() < 450) {
            var projects = document.getElementsByClassName('project-overlay');
            for (var i = 0; i < projects.length; i++) {
                if (checkvisible(projects[i]) && !checkoffscreen(projects[i])) {
                    projects[i].setAttribute("style", "opacity:1");
                } else {
                    projects[i].setAttribute("style", "opacity:0");
                }
            }
        }
    });
  });

// gets Y position in pixels of the top of an element
function posY(elm) {
    var test = elm, top = 0;
    while (!!test && test.tagName.toLowerCase() !== "body") {
        top += test.offsetTop;
        test = test.offsetParent;
    }
    return top;
}

function viewPortHeight() {
    var de = document.documentElement;
    if(!!window.innerWidth)
    { return window.innerHeight; }
    else if( de && !isNaN(de.clientHeight) )
    { return de.clientHeight; }
    return 0;
}

// calculates how far user has scrolled down
function scrollY() {
    if( window.pageYOffset ) { return window.pageYOffset; }
    return Math.max(document.documentElement.scrollTop, document.body.scrollTop);
}

// returns true if enough of an element is visible on screen
function checkvisible( elm ) {
    var vpH = viewPortHeight(), // viewport height
        st = scrollY(), // scroll top
        y = posY(elm);
        return (vpH > (y - st) * 1.3);
}

// returns true if an element is far enough offscreen
function checkoffscreen( elm ) {
    var vpH = viewPortHeight(), // viewport height
        st = scrollY(), // scroll top
        y = posY(elm);
        return ((st * 1.08) > y);
}