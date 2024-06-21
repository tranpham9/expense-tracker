const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();
const uri = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri);
client.connect();

// express app
const app = express();

// register
app.post('/api/registerUser', async (req, res, next) =>
    {
        const bodyProperties = Object.keys(req.body);
        const numFields = bodyProperties.length;

        const db = client.db('appData');
        const coll = db.collection('users');
        const tripColl = db.collection('trips');

        newObjectId = ObjectId();
        tripId = '';

        // registering with an invitation
        if(numFields == 5){
            var { userId, name, email, password, tripId} = req.body;
        }
        // default registering
        else {
            var { userId, name, email, password} = req.body;
        }
        let newUser = {
            _id:newObjectId,
            name:name,
            email:email,
            password:password,
            trips:[tripId]
        }
        try {
            // Update users collection with the new user
            await usersCollection.insertOne(newUser);
    
            // If tripId is provided, update trips collection to add user to the trip
            if (tripId) {
                await tripsCollection.updateOne(
                    { _id: ObjectId(tripId) }, // Find the trip by tripId
                    { $push: { users: newUserId } } // Add newUserId to the users array in the trip document
                );
            }
    
            res.status(200).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Failed to register user' });
        }



    });

app.listen(5000, () => {
    console.log('listening on port 5000')
})