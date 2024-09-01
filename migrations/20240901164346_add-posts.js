
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
            'observabilidade',
            'Observabilidade',
            'node.js',
            '/assets/images/posts/capa-youtube-observabilidade.jpg',
            'A observabilidade é essencial em qualquer aplicação, e logs detalhados podem ajudar a diagnosticar problemas e a otimizar o desempenho',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2024-08-19'
        ), (
            'design-pattern-abstract-factory',
            'Entendendo o Design Pattern Abstract Factory com o Ligeiro',
            'design patterns',
            '/assets/images/posts/capa-youtube-abstract-factory.jpg',
            'O Design Pattern Abstract Factory fornece uma interface para criar famílias de objetos relacionados ou dependentes sem especificar suas classes concretas.',
            'Deividy Metheler Zachetti',
            'https://avatars.githubusercontent.com/u/1174445?v=4',
            '2024-08-20'
        )
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.raw(`
        DELETE FROM blog_posts where link IN (
            'observabilidade',
            'design-pattern-abstract-factory'
        );


    `);
};
