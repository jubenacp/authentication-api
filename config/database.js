const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'junction.proxy.rlwy.net',
  user: 'root',
  password: 'TjDgqmyAOmjYKqGhCHEbBpcTYcWWhCOB',
  database: 'authdb',
  port: 49276
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

module.exports = connection;
