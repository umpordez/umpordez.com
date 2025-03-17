import './base.js';

const $form = document.querySelector('form');
$form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const values = Array
        .from($form.elements)
        .reduce((acc, curr) => {
            const { name, value } = curr;
            if (!name || !value) { return acc; }

            acc[name] = value;

            return acc;
        }, {});

    if (!values.email) {
        alert('Por favor, preencha o seu e-mail');
        document.querySelector('input[name="email"]').focus();
        return;
    }

    try {
        const res = await fetch('/umpordez', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        });

        if (res.status !== 200) {
            throw new Error('Uh oh! Tenta de novo, algo deu errado :/')
        }

        location.href = '/confirmado';
    } catch (ex) {
        console.error(ex);
        alert(ex.message);
    }
});

function scrollToTop() {
    document
        .documentElement
        .scrollTo({ top: 0, behavior: 'smooth' });
}

const elements = document.querySelectorAll('a');

if (elements && elements.length) {
    for (const el of elements) {
        el.addEventListener('click', (ev) => {
            if (!ev.target.href.includes('#')) { return; }

            ev.preventDefault();
            scrollToTop();

            setTimeout(() => {
                document.querySelector('input').focus();
            }, 200);
        });
    }
}
