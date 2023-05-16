const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f1hhq8d.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        const servicesCollection = client.db('geniusCar').collection('services');
        const ordersCollection = client.db('geniusCar').collection('orders')

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })

        app.get('/orders', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }

            const cursor = ordersCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await ordersCollection.insertOne(order)
            res.send(result)
        })

        app.patch('/orders/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) }
            const status = req.body.status;
            console.log(query)
            const updatedDoc = {
                $set: {
                    status: status
                }
            }
            const result = await ordersCollection.updateOne(query, updatedDoc);
            res.send(result)
        })
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(error => console.error(error))




app.get('/', (req, res) => {
    res.send('Genius car server running')
})
app.listen(port, () => {
    console.log(`Genius car running on ${port} `)
})