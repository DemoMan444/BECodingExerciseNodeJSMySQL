const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

const config = require('./config');

// Configure the connection using the config file
const db = mysql.createConnection(config.db);

// Check if the connection is successful
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL.');
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to fetch data from the database
app.get('/dbevents', (req, res) => {
    const query = `
        SELECT e.date_venue AS date, e.time_venue_utc AS time, 
               s.competition_name AS sport, v.name AS venue, 
               ht.name AS team1, at.name AS team2, 
               CONCAT(ht.name, ' vs ', at.name) AS description
        FROM events e
        LEFT JOIN venues v ON e.stadium_id = v.id
        LEFT JOIN teams ht ON e.home_team_id = ht.id
        LEFT JOIN teams at ON e.away_team_id = at.id
        LEFT JOIN sports s ON e.competition_id = s.id
        ORDER BY e.date_venue, e.time_venue_utc;
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

// Handle 404 errors for undefined routes
app.use((req, res) => {
    res.status(404).send('This page does not exist.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
