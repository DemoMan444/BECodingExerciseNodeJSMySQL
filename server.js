const express = require('express');
const mysql = require('mysql2');
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

app.get('/', (req, res) => {
    const query = `
        SELECT e.id, e.season, e.status, e.time_venue_utc, e.date_venue, 
               v.name AS stadium, 
               ht.name AS home_team, at.name AS away_team, 
               e.home_goals, e.away_goals, e.winner, 
               e.stage_name, s.competition_name
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
