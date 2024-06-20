const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://TheBeast:COP4331@ourdatabase.gejke7n.mongodb.net/';
const client = new MongoClient(url);
client.connect();


// express app
const app = express();

// register
app.post('/api/registerUser', (req, res, next) =>
    {
        // incoming name, email, phone, password, tripID
        const { name, email, phone, password, tripID} = req.body;

        
    });

app.listen(5000, () => {
    console.log('listening on port 5000')
})