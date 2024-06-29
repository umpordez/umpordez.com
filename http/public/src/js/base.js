window['AOS']?.init({ once: true });

const $screenLoader = document.querySelector('.screen_loader');
if ($screenLoader) {
    setTimeout(() => {
        document.body.removeChild($screenLoader);
    }, 200);
}

function scrollToTop() {
    document
        .documentElement
        .scrollTo({ top: 0, behavior: 'smooth' });
}

const $scrollToTop = document.querySelector('.js-scroll-to-top');
$scrollToTop?.addEventListener('click', scrollToTop);

function setOnScroll () {
    let scrollpos = window.scrollY;

    if (scrollpos > 0) {
        document.getElementById('scrollToTopBtn')?.classList.remove('hidden');
        document.getElementById('top-header')?.classList.add('sticky-header');
        return;
    }

    document.getElementById('scrollToTopBtn')?.classList.add('hidden');
    document.getElementById('top-header')?.classList.remove('sticky-header');
}

window.addEventListener('scrool', setOnScroll());
setOnScroll();

function toggleTheme (isFirstTime = false) {
    let theme = window.localStorage.getItem('theme') || 'dark';

    if (!isFirstTime) {
        theme = theme === 'light' ? 'dark' : 'light';
    }

    window.localStorage.setItem('theme', theme);

    if (theme === 'dark') {
        document.querySelector('body').classList.add('dark');
        return;
    }

    document.querySelector('body').classList.remove('dark');
}

toggleTheme(true);

const $toggleTheme = document.querySelector('.js-toggle-theme');
$toggleTheme?.addEventListener('click', () => toggleTheme());