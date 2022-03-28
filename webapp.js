require('./dotenv');
process.env.TZ = 'UTC';

const knex = require('knex')(require('./knexfile'));

const fs = require('fs');
const path = require('path');
const express = require('express');

const logger = require('./logger');
const app = express();
const { sendEmail } = require('./email');

function fatalHandler(err) {
    logger.error(err, { FATAL: true });
}

const htmls = {
    index: fs.readFileSync(path.resolve(__dirname, 'public/index.html')),
    done: fs.readFileSync(path.resolve(__dirname, 'public/done.html'))
};

process.on('uncaughtException', fatalHandler);
process.on('unhandledRejection', fatalHandler);

app.set('trust proxy', 1);
function logResponse(req, res, id, ev) {
    logger.info(`[${req.ip}] {${req.method}} ${id} - ` +
        `${ev}: ${req.url} #${res.statusCode}`);
}

const kennyRequestsByIp = {};

app.use('/kenny', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Expose-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') { return res.sendStatus(200); }

    if (!kennyRequestsByIp[req.ip]) { kennyRequestsByIp[req.ip] = 0; }
    kennyRequestsByIp[req.ip]++;

    logger.info('Receiving kenny request :)');
    logger.info(req.headers);
    logger.info(req.body);

    const totalReqs = kennyRequestsByIp[req.ip];

    if (totalReqs < 5) {
        res.header('kenny', 'is-dead');
        res.end('omg, they killed kenny');
        return;
    }

    if (totalReqs < 8) {
        res.header('kenny', 'is-dead');
        res.end('YOU BASTARDS');
        return;
    }

    if (totalReqs < 8) {
        res.end('what is an error?');
        return;
    }

    if (totalReqs < 9) {
        res.end('what is the meaning of life?');
        return;
    }

    if (totalReqs < 10) {
        res.end('what are you doing here?');
        return;
    }

    if (totalReqs < 20) {
        res.end('nahhhhh');
        return;
    }

    if (totalReqs < 21) {
        res.end('are you trying to nuke me?');
        return;
    }

    if (totalReqs < 22) {
        res.end(`i know your ip is ${req.ip}`);
        return;
    }

    if (totalReqs < 25) {
        res.end('are you having fun?');
        return;
    }

    if (totalReqs < 100) {
        res.header('space', 'is-empy');
        res.end('null.');
        return;
    }


    if (totalReqs < 101) {
        res.end('you control your mind');
        return;
    }

    if (totalReqs < 102) {
        res.end('you control your body');
        return;
    }

    if (totalReqs < 103) {
        res.end('you control your spirit');
        return;
    }

    if (totalReqs < 104) {
        res.end('you are a free mind');
        return;
    }

    if (totalReqs < 105) {
        res.end('I do not chase, I attract');
        return;
    }
    if (totalReqs < 106) {
        res.end('what belongs to me, will simply find me');
        return;
    }

    if (totalReqs < 107) {
        res.end('I like BMTH');
        return;
    }


    if (totalReqs < 108) {
        res.end('https://www.youtube.com/watch?v=SDxS10O3uqo');
        return;
    }

    if (totalReqs < 111) {
        res.end('https://www.mit.edu/~xela/tao.html');
        return;
    }

    res.end('running out of coffe, have to go...');
});


app.use((req, res, next) => {
    const { ip, method, url } = req;

    const id = new Date().getTime();
    const msg = `[${ip}] {${method}} ${id} - Start: ${url}`;

    logger.info(msg);
    res.on('finish', () => { logResponse(req, res, id, 'Finish'); });
    res.on('close', () => { logResponse(req, res, id, 'Close'); });

    next();
});

const _get = app.get;
const _post = app.post;

app.post = function(route) {
    logger.info(`Binding route: {POST} ${route}`);
    return _post.apply(this, arguments);
};
app.get = function(route) {
    logger.info(`Binding route: {GET} ${route}`);
    return _get.apply(this, arguments);
};

const ipsThatWatchedFilepath = path.resolve(__dirname, 'ips-that-watched.json');

function getIpsThatWatched() {
    try {
        const watches = fs.readFileSync(ipsThatWatchedFilepath)
        return JSON.parse(watches);
    } catch (ex) {
        return [];
    }
}

function saveIpsThatWatched() {
    fs.writeFileSync(ipsThatWatchedFilepath, JSON.stringify(ipsThatWatched));
}

function debounceSaveIpsThatWatched() {
    this.timer = clearTimeout(this.timer);

    this.timer = setTimeout(() => {
        saveIpsThatWatched();
    }, 1000);
}

const signupsByIp = {};
const ipsThatWatched = getIpsThatWatched();

// MAY use subscription.id instead of raw email? people can be bad here?
// :thinking:
app.get('/leave/:email', async(req, res) => {
    const { email } = req.params;

    // no return check, no validation, just an update
    await knex('emails').update({ opt_out: true }).where({ email });
    res.send('thank you for staying so long. see you around!');
});

app.get('/has-watched', (req, res) => {
    res.send(ipsThatWatched.includes(req.ip) ? '1' : '0');
});

app.get('/watch', (req, res) => {
    if (!ipsThatWatched.includes(req.ip)) {
        ipsThatWatched.push(req.ip);
        debounceSaveIpsThatWatched();
    }

    return res.end();
});

app.get('/join/:email', async(req, res) => {
    const { headers, ip } = req;
    const userAgent = headers['user-agent'];
    const { email } = req.params;

    if (!signupsByIp[ip]) { signupsByIp[ip] = 0; }

    signupsByIp[ip]++;
    if (signupsByIp[ip] > 10) {
        res.status(500).end('ei, ou você está com dificuldades em receber o ' +
            'nosso e-mail de cadastro, ou está na maldade. >)\n' +
            'de qualquer forma, mande um e-mail manual para deividyz@gmail.com'
        );
        return;
    }

    let id;
    try {
        const subscription = (await knex('subscriptions').insert({
            email,
            ip,
            user_agent: userAgent,
            headers
        }).returning('*'))[0];
        id = subscription.id;
        logger.info(`{subscription} subscribed ${email}`);

        res.json({ url: `/you-are-nice/subscribed` });
    } catch (ex) {
        logger.error(ex);
        res.status(500).end('foi mal, mas algo deu errado. :/');
    }

    try {
        await sendEmail(email, 'open', 'signup', { id });
    } catch (ex) {
        logger.error(ex);
    }
});

app.all('/confirm/:id.:format?', async(req, res) => {
    const { id } = req.params;
    if (!id) { return res.end('oh no.'); }

    try {
        const { email } = (await knex('subscriptions').update({
            utc_last_opened_on: 'now()'
        }).where({ id }).returning('*'))[0];

        await knex('emails').insert({
            email,
            utc_last_email_open: 'now()'
        }).onConflict('email').merge();
    } catch (ex) {
        logger.error(ex);
        return res.status(500).end('oh, no.');
    }

    if (req.params.format === 'png') {
        return res.sendFile(path.resolve(__dirname, 'public/umdez.png'));
    }

    res.header('Content-Type', 'text/html');

    res.end(`
        <!doctype html>
        <html lang='pt-br'>
        <head>
            <meta charset='utf-8' />
            <title>all right!</title>
            <meta http-equiv="refresh" content="3;url=https://umpordez.com" />
        </head>
        <body>
            <p>tudo certo! :)</p>

            <p>
                <i>você será redirecionado em breve...</i>
            </p>
        </body>
    `);
});


app.get('/umpordez.css', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/umpordez.css'));
});
app.get('/umpordez.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/umpordez.js'));
});

app.get('/fonts/Starjhol.woff2', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/fonts/Starjhol.woff2'));
});
app.get('/fonts/Starjhol.woff', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/fonts/Starjhol.woff'));
});

app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/favicon.png'));
});
app.get('/favicon.png', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/favicon.png'));
});

app.get('/index', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.end(htmls.index);
});
app.get('/index.html', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.end(htmls.index);
});
app.get('/:id/subscribed', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.end(htmls.done);
});

app.get('/', (req, res) => {
    res.header('Content-Type', 'text/html');
    res.end(htmls.index);
});

app.get = _get;
app.post = _post;

app.use(function(req, res) {
    res.status(404).end('not found.');
});

app.use(function(err, req, res, next) {
    logger.error(err);
    if (res.headersSent) { return next(err); }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: true,
        code: statusCode,
        msg: err.msg || err.message || err
    });
});

app.listen(process.env.HTTP_PORT, () => {
    logger.info(`It's alive! http://localhost:${process.env.HTTP_PORT}`);
}).on('error', fatalHandler);
