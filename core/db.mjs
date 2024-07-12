import V from 'argument-validator';
import knexModule from 'knex';

import knexConfig from '../knexfile.mjs';

const knex = knexModule(knexConfig);

class TableGateway {
    constructor(db, tableName) {
        V.object(db, 'db');

        if (tableName) {
            V.string(tableName, 'tableName');
            this.tableName = tableName;
        }

        const { knex } = db;

        this._db = db;
        this.knex = knex;
    }

    async allRows(whereObject) {
        if (!whereObject) {
            return this.knex
                .select('*')
                .from(this.tableName);
        }

        return this.knex
            .select('*')
            .from(this.tableName)
            .where(whereObject);
    }

    async deleteOne(whereObject) {
        V.object(whereObject, 'whereObject');

        await this.knex(this.tableName).where(whereObject).del();
    }

    async tryOneRow(values) {
        V.object(values, 'values');

        const rows = await this.knex.select('*')
            .from(this.tableName)
            .where(values);

        return rows[0];
    }

    async oneRow(values) {
        V.object(values, 'values');

        const rows = await this.knex.select('*')
            .from(this.tableName)
            .where(values);

        if (rows.length > 1) {
            const str = JSON.stringify(values);
            throw new Error(`${str} expected oneRow, but got ${rows.length} rows`);
        }

        if (rows.length) { return rows[0]; }

        const str = JSON.stringify(values);
        throw new Error(`${str} expected oneRow, but got no rows`);
    }

    async insertOne(values) {
        V.object(values, 'values');

        return (await this.knex(this.tableName)
            .insert(values).returning('*'))[0];
    }

    async updateOne(whereObject, values) {
        V.object(whereObject, 'whereObject');
        V.object(values, 'values');

        return (await this.knex(this.tableName)
            .where(whereObject)
            .update(values)
            .returning('*'))[0];
    }
}

class Db {
    static get knex () { return this.knex; }

    constructor() {
        this.knex = knex;
        this.name = process.env.PSQL_DB_DATABASE;
    }

    async buildTableGateways() {
        const stmt = `
            SELECT
                table_schema || '.' || table_name as table
            FROM
                information_schema.tables
            WHERE
                table_type = 'BASE TABLE'
            AND
                table_schema NOT IN ('pg_catalog', 'information_schema');
        `;

        const tables = await this.allRows(stmt);

        for (const table of tables) {
            const tableName = table.table.split('.')[1];

            if (this[tableName]) { continue; }

            this[tableName] = new TableGateway(this, tableName);
        }
    }

    async noData(sql) {
        V.string(sql, 'sql');
        await knex.raw(sql);
    }

    async allRows(sql) {
        V.string(sql, 'sql');
        return (await knex.raw(sql)).rows;
    }

    async tryOneRow(sql) {
        V.string(sql, 'sql');

        const { rows } = await knex.raw(sql);
        return rows[0];
    }

    async oneRow(sql) {
        V.string(sql, 'sql');
        const { rows } = await knex.raw(sql);

        if (rows.length === 1) { return rows[0]; }

        if (!rows.length) {
            throw new Error(`${sql} expected oneRow, but got no rows`);
        }

        throw new Error(`${sql} expected oneRow, but got ${rows.length} rows`);
    }
}

export { knex, Db, TableGateway };
export default Db;
