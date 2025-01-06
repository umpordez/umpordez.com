import path from 'node:path';
import { fileURLToPath } from 'url';

import dotenv from "dotenv";
import express from 'express';

import logger from '../core/logger.mjs';
import { knex } from '../core/db.mjs';

import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const app = express();

app.use(express.static(path.resolve(__dirname, './public')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './views/'));

const configByUrl = {
    '': {
        title: 'umpordez - Se torne um programador altamente produtivo em 2025',
        description: 'o caminho de um programador que vale por dez',
        image: '/assets/images/logo.png',
        site: 'https://umpordez.com',
        creator: 'Deividy Metheler Zachetti'
    },

    'fundamentos-do-desenvolvedor': {
        title: 'Descubra agora Os Fundamentos de um Desenvolvedor',
        description: 'Conteúdos selecionados para desenvolver uma ' +
            'base sólida na programação, conhecimento para o iniciante ' +
            '(que não faz idéia o que é programação) até para o mais ' +
            'avançado (com técnicas para iniciar projetos, ' +
            'separar tarefas, contribuir em projetos Open Source, além de ' +
            'um curso inteiro de Design Patterns!)',

        // eslint-disable-next-line
        image: 'https://s3.sa-east-1.amazonaws.com/public.obonde/iseiv2/u/7130f128-5528-4c11-a4da-ea8f5aec2a83/dc6a3fcd-72c6-4a18-b2a6-793b82e8bba3-fundamentos.png',
        site: 'https://umpordez.com/fundamentos-do-desenvolvedor',
        creator: 'Deividy Metheler Zachetti'
    },
    'design-patterns': {
        title: 'Melhor curso de Design Patterns por Ligeiro - umpordez [10x]',
        description: 'Domine os 23 Patterns do famoso livro de Design Pattern' +
            ', mais patterns do Martin Fowler e alguns patterns criados pelo ' +
            'ligeiro para o desenvolvimento de Web Apps em 2024. ',

        image: 'https://umpordez.com/assets/images/design-patterns-book.png',
        site: 'https://umpordez.com/design-patterns',
        creator: 'Deividy Metheler Zachetti'
    },

    'o-programador-iniciante': {
        title: 'Transforme seu Futuro com a Programação guiado pelo Ligeiro' +
            ' um programdor 10x - umpordez',
        description: 'Junte-se à comunidade de jovens desenvolvedores e ' +
            'troque conhecimentos sobre programação e novas tecnologias. ' +
            'Participe de desafios e workshops que vão elevar suas ' +
            'habilidades. Inscreva-se e faça parte da mudança! ',

        image: '/assets/images/logo.png',
        site: 'https://umpordez.com/o-programador-iniciante',
        creator: 'Deividy Metheler Zachetti'
    }
};

function getPage(url) {
    return {
        url,
        ...(configByUrl[url.replace('/', '')] || configByUrl[''])
    };
}


function buildAjaxHandler(fn) {
    return async (req, res) => {
        try {
            await fn(req, res);
        } catch (ex) {
            console.error(ex);
            res.status(500).json({ msg: ex.message });
        }
    };
}

function buildHandler(fn) {
    return async (req, res) => {
        try {
            const _render = res.render;

            res.render = (tpl, options = {}) => {
                options.page = options.page || {};
                options.page = { ...getPage(req.url), ...options.page };

                return _render.call(res, tpl, options);
            };

            await fn(req, res);
        } catch (ex) {
            // MAY go to error page?
            console.error(ex);
            res.render('404', { page: getPage(req.url) });
        }
    };
}

app.get('/home', buildHandler((req, res) => {
    res.render('home');
}));

app.get('/confirmado', buildHandler((req, res) => {
    res.render('confirmado');
}));


app.get('/fundamentos-do-desenvolvedor', buildHandler((req, res) => {
    res.render('fundamentos-do-desenvolvedor');
}));

app.get('/', buildHandler((req, res) => {
    res.render('umpordez');
}));

app.get('/tao', buildHandler((req, res) => {
    res.render('tao');
}));

app.get('/sobre', buildHandler((req, res) => {
    res.render('sobre');
}));

app.get('/cursos', buildHandler((req, res) => {
    res.render('cursos');
}));

app.get('/blog', buildHandler(async (req, res) => {
    const posts = await knex('blog_posts')
        .orderBy('utc_created_on', 'desc');

    res.render('blog', { posts });
}));

app.get('/design-patterns', buildHandler((req, res) => {
    res.render('umpordez');
}));

app.get('/o-programador-iniciante', buildHandler((req, res) => {
    res.render('umpordez');
}));

app.get('/umpordez', buildHandler((req, res) => {
    res.render('umpordez');
}));

app.get('/arquitetura-web-apps', buildHandler((req, res) => {
    res.render('arquitetura-web-apps');
}));

app.get('/post/:link', buildHandler(async (req, res) => {
    const post = await knex('blog_posts').where({
        link: req.params.link
    }).first();

    const pageCfg = {
        ...getPage(req.url),
        title: post.title,
        description: post.short_description,
        image: post.image_url,
        creator: post.created_by_name
    };

    res.render('blog-post', { page: pageCfg, post });
}));

app.post('/email', express.json(), buildAjaxHandler(async (req, res) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const html = `<div>
        <p>Contato de umpordez</p>

        <p>IP:<br />${req.ip}</p>
        ${Object
            .entries(req.body)
            .map(([key, value]) => `<p>${key}:<br />${value}</p>`)
            .join('\n')}
</div>`;

    const email = (req.body.email || '').replace(/\s/g, '').toLowerCase();
    console.log(html);

    if (email) {
        const course = 'email';
        const emailInNewsletter = await knex('newsletter').where({
            email
        }).first();

        const courses = emailInNewsletter?.courses || [];
        if (!courses.includes(course)) {
            courses.push(course);
        }

        await knex('newsletter').insert({
            email,
            courses: JSON.stringify(courses)
        }).onConflict('email').merge();
    }

    res.status(200).json({ ok: true });

    try {
        await transporter.sendMail({
            to: process.env.EMAIL_TO,
            subject: 'Contato de umpordez',
            html,
            replyTo: email || process.env.EMAIL_FROM_EMAIL,
            from: process.env.EMAIL_FROM_EMAIL
        });
    } catch (ex) {
        console.error(ex);
    }
}));

app.post('/umpordez', express.json(), buildAjaxHandler(async (req, res) => {
    let { email, course } = req.body;

    email = email.trim().toLowerCase();
    course = (course || 'umpordez').trim().toLowerCase();

    const emailInNewsletter = await knex('newsletter').where({
        email
    }).first();

    const courses = emailInNewsletter?.courses || [];
    if (!courses.includes(course)) {
        courses.push(course);
    }

    const { phone } = req.body;

    await knex('newsletter').insert({
        email,
        utc_created_on: 'now()',
        phone: phone || '',
        courses: JSON.stringify(courses)
    }).onConflict('email').merge();

    try {
        await fetch(`${process.env.LISTMONK_URL}/api/subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `token ${process.env.LISTMONK_TOKEN}`
            },
            body: JSON.stringify({
                email,
                status: 'enabled',
                name: '',
                lists: [3],
                attribs: { phone }
            })
        });
    } catch (ex) {
        logger.error(ex);
    }

    res.status(200).json({ ok: true });
}));

app.post('/newsletter', express.json(), buildAjaxHandler(async (req, res) => {
    let { email, course } = req.body;

    email = email.trim().toLowerCase();
    course = course.trim().toLowerCase();

    const emailInNewsletter = await knex('newsletter').where({
        email
    }).first();

    const courses = emailInNewsletter?.courses || [];
    if (!courses.includes(course)) {
        courses.push(course);
    }

    await knex('newsletter').insert({
        email,
        courses: JSON.stringify(courses)
    }).onConflict('email').merge();

    res.status(200).json({ ok: true });
}));

app.use(buildHandler((req, res) => {
    res.render('404');
}));

app.listen(process.env.HTTP_PORT, () => {
    logger.info(`http server opened on ${process.env.HTTP_PORT}`);
});
