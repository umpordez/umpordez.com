const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const logger = require('./logger');
const _ = require('lodash');

const cachedEmails = {};

async function sendEmail(to, subject, tplName, data = {}) {
    const transporter = nodemailer.createTransport({
        host: process.env.AWS_SES_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.AWS_SES_USER,
            pass: process.env.AWS_SES_PASSWORD
        }
    });

    logger.info(`{email} {sending} to: ${to} tpl: ${tplName}...`);
    data.baseUrl = process.env.BASE_URL;

    try {
        const template = cachedEmails[tplName] || _.template(
            (await fs.promises.readFile(
                path.resolve(__dirname, 'emails', `${tplName}.html`))
            ).toString()
        );
        cachedEmails[tplName] = template;

        const html = template(data);
        await transporter.sendMail({
            to,
            subject,
            html,
            replyTo: 'ligeiro@umpordez.com',
            from: `ligeiro <ligeiro@umpordez.com>`
        });

        logger.info(`{email} {sent to} to: ${to} tpl: ${tplName}`);
    } catch (ex) {
        logger.error(ex);
    }
}

module.exports = { sendEmail };

