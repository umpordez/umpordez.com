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

    if (scrollpos > 700) {
        document.getElementById('scrollToTopBtn')?.classList.remove('hidden');
        document.getElementById('top-header')?.classList.add('sticky-header');
        return;
    }

    document.getElementById('scrollToTopBtn')?.classList.add('hidden');
    document.getElementById('top-header')?.classList.remove('sticky-header');
}

window.addEventListener('scroll', setOnScroll);
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


const $elements = document.querySelectorAll('.js-toggle-menu') || [];
for (const $element of $elements) {
    $element.addEventListener('click', (ev) => {
        ev.preventDefault();

        const menus = document.querySelector('.menus');
        const overlay = document.querySelector('.overlay');

        menus.classList.toggle('open-menus');
        overlay.classList.toggle('hidden');
    });
}

const $formElements = document.querySelectorAll('.js-newsletter-form');
for (const $form of $formElements) {
    $form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const email = Array
            .from($form.elements)
            .find((e) => e.name === 'email')?.value || '';

        if (!email) {
            return alert('Por favor, preencha o seu e-mail! :/');
        }

        const { course } = $form.dataset;

        try {
            const res = await fetch('/newsletter', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ course, email })
            });

            if (res.status !== 200) {
                throw new Error('Uh oh! Tenta de novo, algo deu errado :/')
            }

            alert('Contato cadastrado, aguarde!!');
        } catch (ex) {
            console.error(ex);
            alert(ex.message);
        }
    });
}
