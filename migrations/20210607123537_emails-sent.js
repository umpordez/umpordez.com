exports.up = function(knex) {
    return knex.raw(`
        CREATE TABLE email_sent (
            template_name text not null,
            email text not null,

            metadata jsonb,

            subject text not null,
            utc_sent_on timestamp,

            utc_created_on timestamp not null
                constraint df_email_sent_utc_created_on default (now()),

            constraint pk_email_sent primary key (template_name, email)
        );
    `);
};

exports.down = function(knex) {
    return knex.raw(`
        DROP TABLE email_sent;
    `);
};
