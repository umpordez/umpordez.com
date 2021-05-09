const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const logger = require('./logger');
const _ = require('lodash');
const validate = require('deep-email-validator').default;

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
        const isValidResponse = await validate({
            email: to,
            sender: 'ligeiro@umpordez.com',
            validateRegex: true,
            validateMx: false,
            validateTypo: true,
            validateDisposable: true,
            validateSMTP: true
        });

        if (!isValidResponse || !isValidResponse.valid) {
            throw new Error(`Invalid e-mail address: ${to}`);
        }

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
            replyTo: 'deividyz@gmail.com',
            from: `ligeiro <ligeiro@umpordez.com>`
        });

        logger.info(`{email} {sent to} to: ${to} tpl: ${tplName}`);
    } catch (ex) {
        logger.error(ex);
    }
}

module.exports = { sendEmail };

