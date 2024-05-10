import { Kysely } from 'kysely';
import { DB } from 'kysely-codegen';

export type Database = Kysely<DB>;
