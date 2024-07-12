
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.raw(`
        create table newsletter (
            email text not null constraint pk_newsletter primary key,

            name text,
            courses jsonb,

            utc_created_on timestamp not null
                constraint df_newsletter_utc_created_on
                default (now())
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.raw(`
        drop table newsletter;
    `);
};
