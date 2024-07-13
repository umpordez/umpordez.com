
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
            'melhorando-a-legibilidade-de-codigos-com-design-patterns',
            'Melhorando a Legibilidade do Código com Design Patterns',
            'Design Patterns',
            'https://i3.ytimg.com/vi/CPNUQskQLlA/hqdefault.jpg',
            'Design Patterns são padrões de código que se repetem ao longo da nossa vida',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2023-08-11'
        );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.raw(`
        DELETE FROM blog_posts where link = 'melhorando-a-legibilidade-de-codigos-com-design-patterns';

    `);
};
