# Skipli Challenge - Client and Server Setup

This repository contains a sample application with a client-side using Create React App and a server-side using Express.js.

## Prerequisites

Before running this application, ensure you have the following installed on your machine:

- Node.js and npm (Node Package Manager)
- Git (optional, for cloning the repository)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/trietle101/skipli-challenge.git
   cd skipli-challenge
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

## Running the Application

### Start the Server

1. Navigate to the server folder:
   ```bash
   cd ../server
   ```

2. Start the server:
   ```bash
   npm start
   ```

   The server will start running at http://localhost:3001.

### Start the Client (Create React App)

1. Navigate to the client folder:
   ```bash
   cd ../client
   ```

2. Start the client:
   ```bash
   npm start
   ```

   The client application will open in your default web browser at http://localhost:3000.

## Usage

- Open your web browser and navigate to http://localhost:3000 to view the client-side application.
- The client-side React application will communicate with the server-side Express.js application running at http://localhost:3001.

## Folder Structure

- `server/`: Contains the Express.js server code.
- `client/`: Contains the Create React App client-side code.

