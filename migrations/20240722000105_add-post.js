
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.raw(`
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
            'proxy-reverso-nodejs-nginx',
            'Proxy Reverso com Nginx + Node.js',
            'node.js & nginx',
            '/assets/images/posts/capa-youtube-proxy-reverso.jpg',
            'Olá, sou o Ligeiro e neste post vou explicar como configurar múltiplos sites usando NGINX',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2024-07-21'
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.raw(`
        DELETE FROM blog_posts where link IN (
            'proxy-reverso-nodejs-nginx'
        );


    `);
};
