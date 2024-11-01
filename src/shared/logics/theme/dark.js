import { hasClass, addClass, removeClass } from '@/shared/utils/domUtils';

/**
 * update dark theme
 * @param {string|null} mode 
 */
export async function updateDarkTheme(mode = 'light') {
    const htmlRoot = document.getElementById('htmlRoot');
    if(!htmlRoot) {
        return;
    }
    const hasDarkClass = hasClass(htmlRoot, 'dark');
    if(mode === 'dark') {
        htmlRoot.setAttribute('data-theme', 'dark');
        if(!hasDarkClass) {
            addClass(htmlRoot, 'dark');
        }
    } else {
        htmlRoot.setAttribute('data-theme', 'light');
        if(hasDarkClass) {
            removeClass(htmlRoot, 'dark');
        }
    }
}