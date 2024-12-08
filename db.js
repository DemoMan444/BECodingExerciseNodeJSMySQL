const mysql = require('mysql2');
const config = require('./config');

// Configure the connection using the config file
const db = mysql.createConnection(config.db);

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to the MySQL database.');
});

module.exports = db;
