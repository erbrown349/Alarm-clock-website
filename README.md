# Alarm Clock Website

This FullStack Website allows you to see your current time within the area, and set an alarm, which plays a sound when setoff. In addition to this, the website saves previous alarm times you have used across multiple devices to the MongoDB Database. Even when the server is off, it temporary saves the last attempts used using the Frontend Coding.   

# How to Run the Project Locally
# Clone the Repository 

bash
git clone https://github.com/your-username/alarmclock.git
cd alarmclock 

# Install Dependencies
npm install 

# Setup Environment Variables
Create a .env file based on .env.example:
PORT=5001
MONGO_URI=your_mongo_connection_uri
If you don’t have a MongoDB URI, you can get one from MongoDB Atlas.

# Start the Backend Server
npm start
This runs server.js on http://localhost:5001.

You should see:

MongoDB connected
Server running on http://localhost:5001
5. Open the Frontend
Open Frontend/index.html directly in your browser:

file:///path/to/project/Frontend/index.html
Or with Live Server in VS Code.

Make sure your backend server is still running so alarm data is stored and fetched.

# Run Backend Tests

Backend tests are written using Jest + Supertest.

To run the tests:
npm test
