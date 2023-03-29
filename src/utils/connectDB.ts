import mysql from 'serverless-mysql';
import { ConnectionString } from 'connection-string';

const { user, password, path, hostname: host, port } = new ConnectionString(
  process.env.DB_CONN_URL
);

const database = path?.[0];

const db = mysql({
  config: {
    host,
    port,
    database,
    user,
    password,
  },
});

export default db;
