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

class Star {
    constructor(canvas, starRadius = 3) {
        this.coordinates = {
            x: starRadius + (Math.random() * canvas.width),
            y: starRadius + (Math.random() * canvas.height)
        };

        this.maxRadius = starRadius * Math.random();
        this.radius = 0.5;

        this.remainingLife = this.life;
        this.random = Math.random();
        this.life = 30 + Math.random() * 10;
        this.speed = {
            x: -3 + Math.random() * 6,
            y: -3 + Math.random() * 6
        };

        this.context = canvas.getContext('2d');
    }

    applyStarColor(random = this.random) {
        const { context } = this;

        if (random <= 0.5) {
            context.fillStyle = 'rgba(255, 255, 255, 1)';
            context.shadowColor = 'rgba(255, 255, 255, 0.5)';
            context.shadowBlur = 3;
        } else if (random > 0.75) {
            context.fillStyle = 'rgba(255, 254, 196, 1)';
            context.shadowColor = 'rgba(255, 254, 196, 0.5)';
            context.shadowBlur = 4;
        } else {
            context.fillStyle = 'rgba(192, 247, 255, 1)';
            context.shadowColor = 'rgba(192, 247, 255, 0.5)';
            context.shadowBlur = 7;
        }
    }

    draw(isMoving) {
        const { maxRadius, context, remainingLife } = this;
        if (remainingLife <= 0 || this.radius >= maxRadius) {
            return false;
        }

        context.beginPath();

        const { x, y } = this.coordinates;
        const radius = !isMoving ? this.maxRadius : this.radius;

        context.arc(x, y, radius, 0, Math.PI * 2);

        this.applyStarColor();
        context.fill();

        this.remainingLife--;
        this.radius += 0.25;
        this.coordinates.x += this.speed.x;
        this.coordinates.y += this.speed.y;

        return true;
    }
}

let lastHeaderWidth;
let lastHeaderHeight;

function renderStarsHeader() {
    const canvas = domqs('canvas');
    const newWidth = canvas.clientWidth;
    const newHeight = Math.max(window.innerHeight / 2, 500);

    if (lastHeaderWidth === newWidth && lastHeaderHeight === newHeight) {
        return;
    }

    const context = canvas.getContext('2d');
    canvas.width = newWidth;
    canvas.height = newHeight;

    lastHeaderWidth = newWidth;
    lastHeaderHeight = newHeight;

    domqs('body > header').style.height = `${canvas.height}px`;
    context.rect(0, 0, canvas.width, canvas.height);

    const bgRadiusX = randomNumber(100, canvas.width);
    const bgRadiusY = randomNumber(100, canvas.height);

    const bgGradient = context.createRadialGradient(
        bgRadiusX,
        bgRadiusY,
        randomNumber(10, 100),
        bgRadiusX,
        bgRadiusY,
        randomNumber(500, 1000),
    );

    bgGradient.addColorStop(0, '#a6179f');
    bgGradient.addColorStop(1, '#000000');

    context.fillStyle = bgGradient;
    context.fill();

    for (let i = 0; i <= Math.ceil(Math.random() * 5); ++i) {
        const star = new Star(canvas, 7);
        while (star.draw(true)) { };
    }

    for (let i = 0; i < 600; ++i) {
        new Star(canvas, 1).draw();
    }

    for (let i = 0; i < 100; ++i) {
        for (let n = 0; n <= 3; ++n) {
            new Star(canvas, n).draw();
        }
    }
};

function tryBindFooterLink() {
    if (!domqs('body > footer main > a')) { return; }

    domqs('body > footer main > a').addEventListener('click', (ev) => {
        ev.preventDefault();
        const bodyElement = domqs('body');
        bodyElement.classList.toggle('styled');

        const isStyled = isBodyStyled();
        ev.currentTarget.innerHTML = isStyled ? 'lost hope' :
            'a new hope';

        isStyled && renderStarsHeader();
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
        renderStarsHeader();

        const inputElement = domqs('input');
        inputElement && inputElement.focus();
    }

    tryBindFooterLink();
    tryBindForm();
}
window.onresize = debounce(renderStarsHeader, 250);
