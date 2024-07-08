import './base.js';

const $form = document.querySelector('form.js-form-contact');
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

    console.log(values)

    try {
        const res = await fetch('/email', {
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

        alert('E-mail enviado! Logo respondo :)');
    } catch (ex) {
        console.error(ex);
        alert(ex.message);
    }
});