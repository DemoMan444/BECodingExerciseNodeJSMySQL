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

// Middleware to parse JSON
app.use(express.json());

// API endpoint to fetch events
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

// API endpoint to fetch venues
app.get('/venues', (req, res) => {
    db.query('SELECT id, name FROM venues', (err, results) => {
        if (err) {
            console.error('Error fetching venues:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

// API endpoint to fetch teams
app.get('/teams', (req, res) => {
    db.query('SELECT id, name FROM teams', (err, results) => {
        if (err) {
            console.error('Error fetching teams:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

app.post('/add-event', (req, res) => {
    const { date, time, venue, home_team, away_team } = req.body;

    // Query to get the last inserted competition_id from the sports table
    db.query('SELECT MAX(id) AS last_competition_id FROM sports', (err, result) => {
        if (err) {
            console.error('Error fetching competition_id:', err.message);
            return res.status(500).send('Failed to get competition_id');
        }

        const competition_id = result[0].last_competition_id;

        // If no competition_id exists, return an error
        if (!competition_id) {
            return res.status(400).send('No competition found in sports table');
        }

        // Insert the new event with the automatically fetched competition_id
        const query = `
            INSERT INTO events (date_venue, time_venue_utc, competition_id, stadium_id, home_team_id, away_team_id)
            VALUES (?, ?, ?, NULLIF(?, ''), NULLIF(?, ''), ?);
        `;
        const values = [
            date,
            time,
            competition_id, // Use the last competition_id from sports table
            venue || null,   // Allow null for venue
            home_team || null, // Allow null for home_team
            away_team
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error adding event:', err.message);
                return res.status(500).send('Failed to add event');
            }
            res.status(201).send('Event added successfully');
        });
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
