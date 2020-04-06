$(document).ready(function() {
    // while scrolling
    $(window).scroll(function () { 
  
        // if past header
        if ($(window).scrollTop() > ($(window).height() * .90)) {
            $('#navbar').addClass('navbar-fixed-top');
            $('.navlink').addClass('navlink-fixed');
        }
  
        // if before header
        if ($(window).scrollTop() < ($(window).height() * .901)) {
            $('#navbar').removeClass('navbar-fixed-top');
            $('.navlink').removeClass('navlink-fixed');
        }
    });
  });