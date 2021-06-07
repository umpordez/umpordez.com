#!/usr/bin/env node

require('./dotenv');
process.env.TZ = 'UTC';
const knex = require('knex')(require('./knexfile'));

const { sendEmail } = require('./email');
const logger = require('./logger');

const templateName = process.argv[2]; // :)
if (!templateName) { throw new Error('A template, you must pass.'); }

const subject = process.argv[3];
if (!subject) { throw new Error('A subject, is necessary, you know.'); }

async function emailSender() {
    // yeah, only one email at time, a select at time, super expensive; whatever
    const emailRows = await knex.select('emails.email').from('emails').where(
        knex.raw(`not exists (
            -- no injection protection because we trust ourselves ;p
            select
                1
            from
                email_sent
            where
                email = emails.email and
                template_name = '${templateName}'
    )`)).limit(1);

    if (!emailRows.length) {
        logger.info('all good my friend, you can go now.');
        return process.exit(0);
    }

    const { email } = emailRows[0];
    logger.info(`sending ${templateName} for ${email}`);

    try {
        await sendEmail(email, subject, templateName);
        await knex('email_sent').insert({
            email,
            subject,
            template_name: templateName
        });
    } catch (ex) {
        logger.error(ex);
        process.exit(1);
    }

    return emailSender();
}

emailSender();
