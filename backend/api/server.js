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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register
app.post('/api/registerUser', async (req, res, next) =>
    {

        const db = client.db('appData');
        const userColl = db.collection('User');
        const tripColl = db.collection('Trip');

        // incoming name, email, password, tripId(invitation)
        const {name, email, password, tripId} = req.body;

        let newUser = {
            name: name,
            email: email,
            password: password,
            trips: [tripId]
        }
        try {
            // Update users collection with the new user
            await userColl.insertOne(newUser);

            // query for the _id automatically created by mongodb
            const query = { email: email};
            const projection = {_id: 1};

            // retrieve only the _id from the database
            const result = await userColl.findOne(query, projection)

            // If tripId is provided, update trips collection to add user to the trip
            if (tripId) {
                await tripColl.updateOne(
                    { _id: ObjectId(tripId) }, // Find the trip by tripId
                    { $push: { User: result._id } } // Add newUserId to the users array in the trip document
                );
            }
    
            res.status(200).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Failed to register user' });
        }
    });

app.post('/api/login', async (req, res, next) =>
{
    const db = client.db('appData');
    const userColl = db.collection('User');

    const {email, password} = req.body;

    const user = await userColl.findOne({email: email});

    if(user){
        
        const result = (password === user.password);

        if(result){
            res.status(200).json({message: user._id});
        }
        else{
            res.status(400).json({error: "Email/Password doesn't match"});
        }
    }
    else{
        res.status(200).json({error: "User doesn't exist"});
    }

});

app.listen(5000, () => {
    console.log('listening on port 5000')
})