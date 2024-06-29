import path from 'node:path';
import { fileURLToPath } from 'url';

import dotenv from "dotenv";
import express from 'express';

import logger from '../core/logger.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();

app.use(express.static(path.resolve(__dirname, './public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views/'));

const configByUrl = {
    '': {
        title: 'umpordez',
        description: '',
        image: '',
        site: '',
        creator: ''
    }
};

function getPage(url) {
    return {
        url,
        ...(configByUrl[url.replace('/', '')] || {})
    };
}

app.get('/', (req, res) => {
    res.render('home', { page: getPage(req.url) });
});

app.get('/manifesto', (req, res) => {
    res.render('manifesto', { page: getPage(req.url) });
});

app.get('/sobre', (req, res) => {
    res.render('sobre', { page: getPage(req.url) });
});

app.get('/cursos', (req, res) => {
    res.render('cursos', { page: getPage(req.url) });
});

app.get('/blog', (req, res) => {
    res.render('blog', { page: getPage(req.url) });
});

app.get('/design-patterns', (req, res) => {
    res.render('design-patterns', { page: getPage(req.url) });
});

app.get('/umpordez', (req, res) => {
    res.render('umpordez', { page: getPage(req.url) });
});

app.get('/arquitetura-web-apps', (req, res) => {
    res.render('arquitetura-web-apps', { page: getPage(req.url) });
});

app.get('/blog', (req, res) => {
    res.render('blog', { page: getPage(req.url) });
});

app.listen(process.env.HTTP_PORT, () => {
    logger.info(`http server opened on ${process.env.HTTP_PORT}`);
});
