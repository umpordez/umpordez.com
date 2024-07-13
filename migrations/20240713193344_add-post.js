
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
            'Design Patterns (ai)',
            'https://i3.ytimg.com/vi/CPNUQskQLlA/hqdefault.jpg',
            'Design Patterns são padrões de código que se repetem ao longo da nossa vida',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2023-08-11'
        ),
        (
            'polling-nodejs',
            'Como atualizar sua UI em tempo real SEM websockets ',
            'node.js & JavaScript (ai)',
            'https://i3.ytimg.com/vi/tpMdzLOilUw/hqdefault.jpg',
            'Polling é uma estratégia de atualização em tempo real em que um cliente envia repetidamente...',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2022-03-14'
        ),
        (
            'github-actions-run-tests',
            'A melhor forma de rodar testes automatícamente',
            'node.js & tests & github (ai)',
            'https://i3.ytimg.com/vi/GTAEWhfDbug/hqdefault.jpg',
            'Primeiro, vamos remover tudo relacionado a Karma e Grunt do repositório. Em seguida, vamos instalar...',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2024-08-14'
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
            'melhorando-a-legibilidade-de-codigos-com-design-patterns',
            'github-actions-run-tests',
            'polling-nodejs'
        );


    `);
};
