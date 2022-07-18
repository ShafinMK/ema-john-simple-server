const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const port =process.env.PORT || 3001;

//middleware
// parse various different custom JSON types as JSON
app.use(express.json());
app.use(cors());

// pass: mbgdy5cf7VIU0NcN
//user: dbuser1


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.wy12b.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri);

async function run(){
    console.log("mongodb connected successfully......");
    try{
        const database = client.db('ema_john_simple');
        const productCollection = database.collection('products');
        const ordertCollection = database.collection('orders');

        // GET API 
        app.get('/products', async(req, res)=>{
            console.log('all the products');
            console.log(req.query);
            const page = req.query.page;
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            const count = await cursor.count();
            let products;
            if(page){
                products = await cursor.skip(page*size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray();
            }

            
            res.send({count, products});
        });

        // POST to get key products
        app.post('/products/bykeys', async(req, res)=>{
            const keys = req.body;
            const query = {key: {$in : keys}};
            const products = await productCollection.find(query).toArray();
            console.log('the keys',keys);
            res.send(products);
        })
        // add Orders api
        app.post('/orders', async (req, res)=>{
            const order = req.body;
            console.log('order', order);
            const result = await ordertCollection.insertOne(order)
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})