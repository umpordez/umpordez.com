import assert from 'node:assert';
import { knex, Db, TableGateway } from '../../core/db.mjs';

import '../setup.mjs';

describe('db', () => {
    it('knex is connected to a db', async () => {
        const { rows } = await knex
            .raw('select 1 from information_schema.tables');

        assert(rows);
        assert(rows.length > 1);
    });

    it('Db initialize', async () => {
        await knex.raw(`create table if not exists foo_test(id int)`);

        const db = new Db();

        assert(db);
        assert(!db.foo_test);

        await db.buildTableGateways();
        assert(db.foo_test);

        await knex.raw(`drop table foo_test`);
    });

    it('db.noData/allRows/oneRow/tryOneRow', async () => {
        const db = new Db();

        await db.noData('drop table if exists foo_test_2');
        await db.noData('create table if not exists foo_test_2(id int)');

        await assert.rejects(async () => {
            await db.noData('create table foo_test_2(id int)');
        }, /already exists/);

        await db.noData('insert into foo_test_2(id) values (1), (1), (2);');
        const rows = await db.allRows('select * from foo_test_2');

        assert(rows);
        assert(rows.length === 3);
        assert(rows.find((r) => r.id === 2));

        await assert.rejects(async () => {
            await db.oneRow(`select * from foo_test_2 where id = '1'`);
        }, /but got 2 rows/);

        const first = await db
            .tryOneRow(`select * from foo_test_2 where id = '1'`);

        assert(first);
        await db.noData('drop table if exists foo_test_2');
    });

    it('TableGateway methods', async () => {
        await knex.raw(`
            create table if not exists foo_test(
                id int,
                name text,
                created_on timestamp not null
                    constraint df_foo_test_created_on
                    default(now())
            )
        `);

        const db = new Db();
        const tg = new TableGateway(db, 'foo_test');

        const row = await tg.insertOne({ id: 1, name: 'Foobar' });

        assert(row.id);
        assert(row.name);
        assert(row.created_on);

        const updatedRow = await tg.updateOne(
            { id: row.id },
            { name: 'Barfoo' }
        );

        assert(updatedRow.name !== row.name);
        assert.strictEqual(updatedRow.name, 'Barfoo');

        const readRow = await tg.oneRow({ id: row.id });
        assert(readRow);

        assert.strictEqual(readRow.name, updatedRow.name);

        assert.strictEqual(readRow.utc_created_on, updatedRow.utc_created_on);
        assert.strictEqual(readRow.utc_created_on, row.utc_created_on);

        const newRow = await tg.insertOne({ id: 1, name: 'Speedy' });

        assert(newRow);

        assert.strictEqual(newRow.id, 1);
        assert.strictEqual(newRow.name, 'Speedy');

        const allRows = await tg.allRows({ id: 1 });
        assert(allRows.length === 2);

        await assert.rejects(async () => {
            await tg.oneRow({ id: 1 });
        }, /but got 2 rows/);

        const first = await tg.tryOneRow({ id: 1 });
        assert(first);

        await tg.deleteOne({ id: 1, name: 'Barfoo' });
        const onlyOneRow = await tg.oneRow({ id: 1 });

        assert.strictEqual(onlyOneRow.id, 1);
        assert.strictEqual(onlyOneRow.name, 'Speedy');

        await knex.raw(`drop table foo_test`);
    });
});
