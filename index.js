const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();


//middleware 
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlsofwm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {
    try{
        const myTaskCollections = client.db('taskManagment').collection('myTask')

        app.get('/my-task', async(req, res) => {
            const query = {}
            const cursor = await myTaskCollections.find().toArray();
            res.send(cursor)
        })
        app.post('/my-task', async(req, res) => {
            const task = req.body;
            const result = await myTaskCollections.insertOne(task);
            res.send(result)
        })

        app.put('/updateTask/:id', async(req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id)}
            const updatedUser = req.body;
            const options = { upsert: true}
            const updatedDoc = {
                $set:{
                    initialTask: updatedUser.initialTask
                }
            }
            const result = await myTaskCollections.updateOne(filter, updatedDoc, options);
            res.send(result)
            
            
        })
    }
    finally{

    }
}
run().catch(console.log)

app.use('/', (req, res) => {
    res.send('server was running')
})

app.listen(port, () => console.log(`server running port is ${port}`))