const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Use bodyParser to parse JSON request bodies
app.use(bodyParser.json());

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Replace with your MySQL username
    password: 'password', // Replace with your MySQL password
    database: 'salon_db'  // Replace with your database name
});

// Connect to MySQL database
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// POST route to handle creating appointments
app.post('/appointments/create', (req, res) => {
    const { service, stylist, date, time } = req.body;

    // Validate the data
    if (!service || !stylist || !date || !time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Insert the new appointment into the MySQL database
    const query = 'INSERT INTO appointments (service, stylist, date, time) VALUES (?, ?, ?, ?)';
    db.query(query, [service, stylist, date, time], (err, result) => {
        if (err) {
            console.error('SQL Error:', err); // Log SQL errors
            return res.status(500).json({ error: 'Failed to create appointment' });
        }

        // Send the newly created appointment back as a response
        const newAppointment = {
            id: result.insertId,  // Use insertId to get the newly created appointment ID
            service,
            stylist,
            date,
            time
        };

        res.status(200).json(newAppointment);  // Respond with the new appointment data
    });
});

// GET route to fetch all appointments
app.get('/appointments', (req, res) => {
    const query = 'SELECT * FROM appointments';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching appointments:', err);
            return res.status(500).json({ error: 'Failed to fetch appointments' });
        }

        res.status(200).json(results); // Send JSON response with all appointments
    });
});

// Start the Express server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
