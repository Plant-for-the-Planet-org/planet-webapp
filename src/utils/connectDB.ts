import mysql from 'serverless-mysql';
import { ConnectionString } from 'connection-string';

const { user, password, path, hosts } = new ConnectionString(
  process.env.DB_CONN_URL
);

const database = path && path[0];
const port = hosts && hosts[0].port;
const host = hosts && hosts[0].name;

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
