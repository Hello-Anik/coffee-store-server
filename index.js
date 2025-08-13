const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());


//coffee_monster
//y61AgabOS580QoMK





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ityox9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

      
    const coffeeCollection = client.db('coffeeDB').collection('coffees');
    const userCollection = client.db('coffeeDB').collection('users');
    
    app.get('/coffees', async(req, res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    })

    app.get('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })
    app.post('/coffees', async(req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    })

    app.put('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id : new ObjectId(id) };
     const options = { upsert: true };
     const updatedCoffee = req.body;
     const updatedDoc = {
      $set : updatedCoffee
     }
     const result = await coffeeCollection.updateOne(filter, updatedDoc, options);
     res.send(result);
     
    })

    app.delete('/coffees/:id', async(req ,res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })
//users api
    app.get('/users', async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })
    app.post('/users',  async(req, res) => {
        const usersProfile = req.body;
        const result = await userCollection.insertOne(usersProfile);
    
        res.send(result)
    })

    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId (id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    app.patch('/users', async(req, res) => {
      const {email, lastSignInTime} = req.body;
      
      const filter = {email : email}
      const updatedDoc = {
        $set : {
          lastSignInTime,
        }
      }
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('This coffee Server Is Getting Hotter')
})

app.listen(port, () => {
    console.log(`this coffee server is running on ${port}`)
})

