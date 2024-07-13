Skipli Challenge - Client and Server Setup
This repository contains a sample application with a client-side using Create React App and a server-side using Express.js.

Prerequisites
Before running this application, ensure you have the following installed on your machine:

Node.js and npm (Node Package Manager)
Git (optional, for cloning the repository)
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/trietle101/skipli-challenge.git
cd skipli-challenge
Install dependencies:

bash
Copy code
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
Running the Application
Start the Server
Navigate to the server folder:

bash
Copy code
cd ../server
Start the server:

bash
Copy code
npm start
The server will start running at http://localhost:3001.

Start the Client (Create React App)
Navigate to the client folder:

bash
Copy code
cd ../client
Start the client:

bash
Copy code
npm start
The client application will open in your default web browser at http://localhost:3000.

Usage
Open your web browser and navigate to http://localhost:3000 to view the client-side application.
The client-side React application will communicate with the server-side Express.js application running at http://localhost:3001.
Folder Structure
server/: Contains the Express.js server code.
client/: Contains the Create React App client-side code.
