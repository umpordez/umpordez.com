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

const css = fs.readFileSync(path.resolve(__dirname, 'public/umpordez.css'));
const javascript = fs.readFileSync(
    path.resolve(__dirname, 'public/umpordez.js')
);

process.on('uncaughtException', fatalHandler);
process.on('unhandledRejection', fatalHandler);

app.set('trust proxy', 1);
app.use((req, res, next) => {
    const { ip, method, url } = req;

    const id = new Date().getTime();
    const msg = `[${ip}] {${method}} ${id} - Start: ${url}`;

    logger.info(msg);
    res.on('close', () => {
        logger.info(`[${req.ip}] {${req.method}} ${id} - ` +
            `Close: ${req.url} #${res.statusCode}`);
    });

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

app.get('/join/:email', async(req, res) => {
    const { headers, ip } = req;
    const userAgent = headers['user-agent'];
    const { email } = req.params;

    try {
        const { id } = (await knex('subscriptions').insert({
            email,
            ip,
            user_agent: userAgent,
            headers
        }).returning('*'))[0];

        res.json({ url: `/${id}/subscribed` });
        sendEmail(email, 'Abra esse e-mail', 'signup', { id });
    } catch (ex) {
        logger.error(ex);
        res.status(500).end('foi mal, mas algo deu errado. :/');
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


app.get('/umpordez.css', (req, res) => { res.end(css); });
app.get('/umpordez.js', (req, res) => { res.end(javascript); });
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

app.get('/index', (req, res) => { res.end(htmls.index); });
app.get('/index.html', (req, res) => { res.end(htmls.index); });
app.get('/:id/subscribed', (req, res) => { res.end(htmls.done); });

app.get('/', (req, res) => { res.end(htmls.index); });

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
