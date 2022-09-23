const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = 30000;

const app = express();
require('dotenv').config();  // .env;
// ============= middleware ==================
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());



// ==========================================
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://amazonDB:l667tA6usYoQflmO@cluster0.hbcvbmv.mongodb.net/amazonData?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// ========================================== 
app.get('/', (req, res) =>{
    res.send('mayday mayday..!!')
});


// ==========================================

client.connect(err => {
  const productCollection = client.db("amazonData").collection("products");
  const orderCollection = client.db("amazonData").collection("orders");
  // perform actions on the collection object
  
  // ================  Insert Products  ========================
  app.post('/addProduct', (req, res) =>{
    const product = req.body;
    // console.log(product);
    productCollection.insertOne(product)
    .then(result =>{
      res.send(result.insertedCount)
      
    })
  })
  
  // ================  Read All Products  ========================
  app.get('/products', (req, res) =>{
    productCollection.find({}).limit(10)
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })
  // ================  Read single Product  ========================
  app.get('/product/:id', (req, res) =>{
    productCollection.find({id: req.params.id})
    .toArray((err, documents) =>{
      res.send(documents[0]);
      
    })
  })
  // ================  Read Product by ids  =======================
  app.post('/productsByIds', (req, res) =>{
    const productIds = req.body;
    productCollection.find({id: { $in: productIds}})  // vid:50.4; $in die id deye onek specific data pawa jabe;
    .toArray((err, documents) =>{
      res.send(documents)
    })
  })
  // ================  Insert Orders  ============================
  app.post('/addOrder', (req, res) =>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result =>{
      res.send(result.insertedCount)
      // console.log(result);
      
    })
  })
  
});





app.listen( process.env.PORT || port);