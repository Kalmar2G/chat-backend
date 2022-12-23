const mysql = require('mysql2/promise');

let connection;

const connect = async () => {
  if (!connection) {
    connection = await mysql.createPool({
      host: 'server165.hosting.reg.ru',
      user: 'u1883666_front-u',
      password: 'aQ2eA5jE9n',
      database: 'u1883666_chat-frontend',
      waitForConnections: true,
      connectionLimit: 20,
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
