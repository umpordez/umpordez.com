/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.raw(`
        CREATE TABLE blog_posts (
            link text not null
                constraint pk_blog_posts primary key,

            title text not null,
            category text not null,
            image_url text not null,

            short_description text not null,

            created_by_name text not null,
            created_by_image_url text not null,

            utc_created_on timestamp not null
                constraint df_blog_posts_utc_created_on
                default (now())
        );

        INSERT INTO blog_posts (
            link,
            title,
            category,
            image_url,
            short_description,
            created_by_name,
            created_by_image_url,
            utc_created_on
        ) VALUES (
            'javascript-hoisting',
            'JavaScript Hoisting',
            'JavaScript',
            '/assets/images/posts/javascript.png',
            'Toda definição em JavaScript é "hoisted" no topo de seu escopo. Mas o que isso significa',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2018-02-04'
        ),

        (
            'como-usar-o-node-postgres-com-query-parametrizada',
            'Como usar o node-postgres com query parametrizada',
            'node.js & postgres',
            '/assets/images/posts/node-postgres.png',
            'Digamos que você não tem um orm, ou simplesmente não quer usar um e decidiu usar o mais próximo possível do nativo.',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2018-02-12'
        ),

        (
            '3-formas-de-passar-configs-para-uma-app-em-nodejs',
            '3 formas de passar configurações para uma app em Node.js',
            'node.js',
            '/assets/images/posts/nodejs.png',
            'Descubra 3 formas de passar config para Node.js, a terceira é a que eu uso',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2018-02-14'
        )
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.raw(`
        DROP TABLE blog_posts;
    `);
};
