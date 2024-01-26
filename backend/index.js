const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const app = express();
const port =  5000;


require('dotenv').config();
// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
const mongo_uri = process.env.MONGO_URI
// Connect to MongoDB (replace with your connection string)
let db;
const connectToMongo = async () => {
    try {
        if (!db) {
            db = await mongoose.connect(mongo_uri);
            console.log('MongoDB connected');
        }
    } catch (error) {
        console.log('Error connecting to MongoDB: ' + error);
    }
}

connectToMongo();


app.use('/api/auth', require('./routes/auth'));

// ... rest of the code
app.listen(port, ()=> console.log(`Listening on port ${port}`))
