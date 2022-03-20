function fadeProfileElements() {
  var i = 0;
  var fadeProfile = document.getElementsByClassName("fadeGroup1");
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
  var fadeProfile = document.getElementsByClassName("fadeGroup2");
  var fadeProfileLimit = fadeProfile.length;
  var fadeProfileInterval = setInterval(function() {
    if (i > (fadeProfileLimit - 2)) {
        clearInterval(fadeProfileInterval);
    }
    fadeProfile[i].classList.toggle("fade");
    i++;
  }, 75);
}

function toggleTheme() {
  const themeStylesheet = document.getElementById('theme');
  const storedTheme = localStorage.getItem('theme');
  
  // Check if using mobile display or not
  const iconTheme = document.getElementById('theme-toggle-icon');
  var useMobile = window.getComputedStyle(iconTheme).display === 'none';

  const darkIconWide = document.getElementById('moon-wide');
  const lightIconWide = document.getElementById('sun-wide');
  const darkIconMobile = document.getElementById('moon-mobile');
  const lightIconMobile = document.getElementById('sun-mobile');

  if (storedTheme){
    themeStylesheet.href = storedTheme;
  }
  
  // if it's light -> go dark
  if (themeStylesheet.href.includes('light')){
    themeStylesheet.href = 'css/theme/dark.css';
    if (useMobile) {
      lightIconMobile.style.display = 'none';
      darkIconMobile.style.display ='initial';
    } else {
      lightIconWide.style.display = 'none';
      darkIconWide.style.display = 'initial';
    }
  } else {
    // if it's dark -> go light
    themeStylesheet.href = 'css/theme/light.css';  
    if (useMobile) {
      darkIconMobile.style.display = 'none';
      lightIconMobile.style.display = 'initial';
    } else {
      darkIconWide.style.display = 'none';
      lightIconWide.style.display = 'initial';
    }
  }
  // save the preference to localStorage
  localStorage.setItem('theme',themeStylesheet.href)
}

window.onload = function() {
  // Fade stuff in
  setTimeout(fadeProfileElements, 100);
  setTimeout(fadeNavbarElements, 500);
  toggleTheme();
};