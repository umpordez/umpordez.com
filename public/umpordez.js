function domqs(selector) {
    return document.querySelector(selector);
}

function debounce(fn, timer) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(context, args);
        }, timer);
    };
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function isBodyStyled() {
    return domqs('body').classList.contains('styled');
}

function tryBindFooterLink() {
    if (!domqs('body > footer main > a')) { return; }

    domqs('body > footer main > a').addEventListener('click', (ev) => {
        ev.preventDefault();
        const bodyElement = domqs('body');
        bodyElement.classList.toggle('styled');

        const isStyled = isBodyStyled();
        ev.currentTarget.innerHTML = isStyled ? 'lost hope' :
            'a new hope';
    });
}

const acceptedEmailRegex = /^\S+@\S+\.\w{2}|\w{3}$/;
function looksLikeAValidEmail(email) {
    return acceptedEmailRegex.test(email);
}

function tryBindForm() {
    if (!domqs('form')) { return; }
    domqs('form').addEventListener('submit', (ev) => {
        ev.preventDefault();
        const email = domqs('input').value.replace(/\s/g, '').slice(0, 200);

        if (!looksLikeAValidEmail(email)) {
            alert('uh oh! parece que você não digitou um e-mail legal...');
            domqs('input').focus();
            return;
        }

        domqs('button').innerHTML = 'sending...';

        fetch(`/join/${email}`, {
            method: 'GET',
            headers: {
                here: 'without-you',
                baby: 'loveyou'
            }
        }).then((res) => {
            if (res.status === 200) {
                return res.json();
            }

            return res.text().then((res) => { throw new Error(res); });
        }).then(({ url }) => {
            window.location.href = url;
        }).catch((ex) => {
            alert(ex.message || 'uh oh. :(');
            domqs('button').innerHTML = 'join speedy';
        });
    });
}

window.onload = function() {
    if (isBodyStyled()) {
        const inputElement = domqs('input');
        inputElement && inputElement.focus();
    }

    tryBindFooterLink();
    tryBindForm();
}

function onResize() {

}

window.onresize = debounce(onResize, 250);
