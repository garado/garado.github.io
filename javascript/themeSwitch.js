// Credits:
// https://inspiredwebdev.com/add-dark-mode-to-your-website/

function toggleTheme() {
    const themeStylesheet = document.getElementById('theme');
    const storedTheme = localStorage.getItem('theme');
    const darkIcon = document.getElementById('moon');
    const lightIcon = document.getElementById('sun');
    if (storedTheme){
        themeStylesheet.href = storedTheme;
    }
    
    // if it's light -> go dark
    if (themeStylesheet.href.includes('light')){
        themeStylesheet.href = 'css/theme/dark.css';
        lightIcon.style.display = 'none';
        darkIcon.style.display='initial';
    } else {
        // if it's dark -> go light
        themeStylesheet.href = 'css/theme/light.css';  
        darkIcon.style.display = 'none';      
        lightIcon.style.display='initial';
    }
    // save the preference to localStorage
    localStorage.setItem('theme',themeStylesheet.href)
}