const db = require('./config/database');

db.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
  if (err) {
    console.error('Error executing query:', err.stack);
    return;
  }
  console.log('The solution is:', results[0].solution);
  db.end(); // Cerrar la conexión después de la prueba
});
