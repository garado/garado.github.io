// Credits:
// https://inspiredwebdev.com/add-dark-mode-to-your-website/

// this one is jut to wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    const themeStylesheet = document.getElementById('theme');
    const storedTheme = localStorage.getItem('theme');
    if(storedTheme){
        themeStylesheet.href = storedTheme;
    }
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        // if it's light -> go dark
        if (themeStylesheet.href.includes('light')){
            themeStylesheet.href = 'css/dark-theme.css';
        } else {
            // if it's dark -> go light
            themeStylesheet.href = 'css/light-theme.css';            
        }
        // save the preference to localStorage
        localStorage.setItem('theme',themeStylesheet.href)
    })
})