"use client";

import Image from "next/image";
import React from "react";
import { useState, ChangeEvent } from 'react';
import { BackgroundBeams } from "../components/ui/background-beams";
import { Button } from "../components/ui/moving-border";

export default function Home() {

  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const [userURL, setUserURL] = useState('');
  const [shortenedURL, setShortenedURL] = useState('');
  const [buttonText, setButtonText] = useState('Shorten URL');

  // Function to handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserURL(e.target.value);
  };

  const handleCopy = () => {
    // Check if the navigator clipboard API is supported
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }
    
    // Copy the shortened URL to the clipboard
    navigator.clipboard.writeText(shortenedURL)
      .then(() => {
        console.log('Shortened URL copied to clipboard');
        // Optionally, you can provide feedback to the user that the URL has been copied
      })
      .catch((error) => {
        console.error('Error copying shortened URL to clipboard:', error);
        // Handle error, such as displaying an error message to the user
      });
  };
  
  const handleShortenURL = async () => {
    try {
        const response = await fetch('https://long-blue-angelfish-coat.cyclic.app/api/generateURL', {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Content-Type': 'application/json' // Specify the content type of the request body
            },
            body: JSON.stringify({ longUrl: userURL }) // Pass the user's URL input
        });

        // Check if the request was successful (status code 200)
        if (response.ok) {
            const data = await response.json();
            console.log('Shortened URL:', data.shortUrl);
            setShortenedURL('https://long-blue-angelfish-coat.cyclic.app/' + data.shortUrl);
            setButtonText('Copy');
        } else {
            // Handle error responses
            console.error('Error:', response.status);
            const errorData = await response.json();
            console.error('Error details:', errorData);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        // Handle network or server errors
    }
};
  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased align-center">
      <div className="max-w-2xl mx-auto p-4 z-10">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Shorten your URL
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">
          Please enter your URL below and it will be shortered for other people to use!
        </p>
        <div className='flex flex-col items-center justify-center mt-4'>
        <input
          type="text"
          placeholder="Enter URL"
          className="rounded-lg border text-white border-neutral-800 focus:ring-transparent w-full relative z-10 mt-4 px-2 py-2 bg-neutral-950 placeholder:text-neutral-700"
          value={shortenedURL || userURL}
          onChange={handleInputChange}
        />
        <button onClick={shortenedURL ? handleCopy : handleShortenURL} className="inline-flex h-12 mt-3 animate-shimmer items-center justify-center rounded-md border border-neutral-800 bg-[linear-gradient(110deg,#000103,45%,#262626,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-neutral-400 transition-colors">
        {buttonText}
      </button>
      </div>
      </div>
      <BackgroundBeams />
    </div>
  );
}
