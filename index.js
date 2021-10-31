const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5500;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cjoji.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('Db connected successfully.');

        const database = client.db('Burger');
        const offersCollection = database.collection('Offers');
        const ordersCollection = database.collection('Orders');

        // Get All Offers
        app.get('/offers', async (req, res) => {
            const cursor = offersCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        // Get A Specific Offer
        app.get('/offer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await offersCollection.findOne(query);
            res.send(user);
        });

        // Insert An Offer
        app.post('/addOffer', async (req, res) => {
            console.log('request for adding offer', req.body);
            const newOffer = req.body;
            const result = await offersCollection.insertOne(newOffer);
            console.log('added offer', result);
            res.json(result);
        });

        // Get All Orders
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        });

        // Insert An Order
        app.post('/addOrder', async (req, res) => {
            console.log('request for adding order', req.body);
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder);
            console.log('added order', result);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('First nodejs script.');
});

app.listen(port, () => {
    console.log('App is listening at port ', port);
});