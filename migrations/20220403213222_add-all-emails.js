exports.up = function(knex) {
    // weell, I actually trust in all our subscriptions at the moment,
    // sooo, lets add them! :D
    return knex.raw(`
        insert into emails (email)
        select
            email
        from
            subscriptions
        where
            email not in (select email from emails) and
            email like '%@%'
        group by email
    `);
};

exports.down = function(knex) { };
