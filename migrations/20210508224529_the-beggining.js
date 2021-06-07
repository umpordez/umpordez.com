exports.up = function(knex) {
    return knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        create table emails (
            email text not null constraint pk_emails primary key,

            utc_created_on timestamp not null
                constraint df_emails_utc_created_on default (now()),

            utc_last_email_open timestamp,
            opt_out boolean not null constraint df_emails_opt_out default(false)
        );

        create table subscriptions (
            id uuid not null constraint
                pk_subscriptions primary key default (uuid_generate_v4()),

            email text not null,
            ip text not null,
            user_agent text not null,
            headers text not null,

            utc_created_on timestamp not null
                constraint df_subscriptions_utc_created_on default (now()),

            utc_last_opened_on timestamp,
            utc_opted_out timestamp
        );
    `);
};

exports.down = function(knex) {
    return knex.raw(`
        drop table subscriptions;
        drop table emails;
    `);
};
