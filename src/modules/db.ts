import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '81.31.247.100',
  port: 3306,
  user: 'EPlTfT',
  password: 'UlYMWPeFeQtnDsMM',
  database: 'jArbWOwo',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
