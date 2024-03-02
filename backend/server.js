const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config()
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = "https://urlshortner-backend-nine.vercel.app/";

const databaseUser = process.env.DATABASE_USER;
const databasePass = process.env.DATABASE_PASS;
const databaseHost = process.env.DATABASE_HOST;
const databaseURL = process.env.DATABASE_URL

const pool = mysql.createPool(databaseURL);

app.use(bodyParser.json());
app.use(cors());

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to generate a short URL based on a long URL
function generateShortUrl(longUrl) {
    const shortUrlLength = 6; // Length of the short URL
    const randomString = generateRandomString(shortUrlLength);
    return randomString;
}


// Define routes
app.post('/api/generateURL', async (req, res) => {
    try {
        const longUrl = req.body.longUrl;

        let shortUrl;
        let isUnique = false;

        // Loop until a unique short URL is generated
        while (!isUnique) {
            // Generate short URL
            shortUrl = generateShortUrl(longUrl);

            // Check if the generated short URL already exists in the database
            const checkQuery = 'SELECT COUNT(*) AS count FROM url_mappings WHERE short_url = ?';
            const [rows] = await pool.promise().query(checkQuery, [shortUrl]);

            // If the count is 0, the short URL is unique
            if (rows[0].count === 0) {
                isUnique = true;
            }
        }

        // Store the mapping in the database
        const insertQuery = 'INSERT INTO url_mappings (short_url, long_url) VALUES (?, ?)';
        const insertParams = [shortUrl, longUrl];
        await pool.promise().query(insertQuery, insertParams);

        // Send the shortened URL back to the client
        res.status(200).json({ shortUrl });
    } catch (error) {
        console.error('Error generating short URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Define route to handle URL redirection
app.get('/:shortUrl', async (req, res) => {
    try {
        const shortUrl = req.params.shortUrl;
       // console.log(shortUrl)

        // Query the database to find the corresponding long URL
        const query = 'SELECT long_url FROM url_mappings WHERE short_url = ?';
        const [rows] = await pool.promise().query(query, [shortUrl]);


        // If a matching long URL is found, redirect the user
        if (rows.length > 0) {
            const longUrl = rows[0].long_url;
            //console.log(longUrl)
            res.redirect(longUrl);
        } else {
            // Handle case where short URL is not found
            res.status(404).send('Short URL not found');
        }
    } catch (error) {
        console.error('Error redirecting:', error);
        res.status(500).send('Internal server error');
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
});
