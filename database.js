const mysql = require('mysql2/promise');

let connection;

const connect = async () => {
  if (!connection) {
    connection = await mysql.createPool({
      host: 'remotemysql.com',
      user: 'QvfWf08ncx',
      password: 'qK2mmsJrEU',
      database: 'QvfWf08ncx',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return connection;
};

async function query(sql, params) {
  const db = await connect();
  const [results] = await db.execute(sql, params);

  return results;
}

module.exports = {
  query,
};
