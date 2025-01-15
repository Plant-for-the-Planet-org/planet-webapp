import postgres from 'serverless-postgres';
import { ConnectionString } from 'connection-string';

// Types for database configuration
interface DatabaseConfig {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  debug?: boolean;
}

interface Field {
  name: string;
  tableID: number;
  columnID: number;
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
  format: string;
}

// Type for query response from serverless-postgres
interface QueryResult<T> {
  command: 'SELECT' | 'UPDATE' | 'INSERT' | 'DELETE';
  rowCount: number;
  rows: T[];
  fields: Field[];
}

const {
  user,
  password,
  path,
  hostname: host,
  port,
} = new ConnectionString(process.env.DB_CONN_URL);

const database = path?.[0];

const config: DatabaseConfig = {
  host,
  port: port,
  database,
  user,
  password,
  debug: process.env.NODE_ENV === 'development',
};

const db = new postgres(config);

/**
 * Executes a SQL query with proper connection handling
 * @param queryText - The SQL query text with $1, $2, etc. for parameters
 * @param values - Array of parameter values [$1, $2 etc.]
 * @returns Promise resolving to an array of query results
 * @throws Error if query fails
 */
export async function query<T>(
  queryText: string,
  values: unknown[] = []
): Promise<T[]> {
  try {
    await db.connect();
    const result: QueryResult<T> = await db.query(queryText, values);
    return result.rows;
  } finally {
    await db.clean(); // This is better than quit() for serverless environments
  }
}

export default db;
