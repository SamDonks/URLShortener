import { NextResponse } from 'next/server';
import { headers } from 'next/headers'

export async function POST(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await fetch('https://long-blue-angelfish-coat.cyclic.app/api/generateURL', {
                method: 'POST', // Specify the HTTP method
                headers: {
                    'Content-Type': 'application/json' // Specify the content type of the request body
                },
                body: JSON.stringify({ longUrl: 'YOUR_LONG_URL_HERE' }) // Replace 'YOUR_LONG_URL_HERE' with the actual long URL
            });

            // Check if the request was successful (status code 200)
            if (response.ok) {
                const data = await response.json();
                console.log('Shortened URL:', data.shortUrl);
            } else {
                // Handle error responses
                console.error('Error:', response.status);
                const errorData = await response.json();
                console.error('Error details:', errorData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            return { error: 'Internal Server Error' };
        }
    } else {
        // Return a response with status 401 if the request method is not POST
        return { error: 'Request Failed' };
    }
}
