import express from 'express'; // Import express
import pg from 'pg'; // Import pg
import dotenv from 'dotenv'; // Import dotenv
import presidentRoutes from './presidentController.js'; // Import presidentRoutes
import petRoutes from './petController.js';  // Import petRoutes

dotenv.config(); // Configure dotenv so we access its environment variables

const app = express(); // Invoke express framework and assign it to const app

app.use(express.json()); // Middleware from express that parses chunks of data into JSON format

app.use(express.static('public')); // Serve static files if needed

// Setting up the PostgreSQL pool using environment variables
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // Set the connection we want to be DATABASE_URL
  ssl: {
    rejectUnauthorized: false // Set to true in production for verified certificates
  }
});

// Connect the pool to the database
pool.connect()
  .then(() => console.log('Connected successfully to the database'))
  .catch(err => console.error('Failed to connect to the database', err));

// Use the routes from the president and pet controllers
app.use('/api/presidents', presidentRoutes(pool));
app.use('/api/pets', petRoutes(pool));

// Additional routes can be added here

// Start the server
const port = process.env.PORT || 3000; // Default to 3000 if no environment variable
app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});