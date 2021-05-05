const MongoClient = require('mongodb').MongoClient;
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const dbName = "images";
const colName = "images";
const uri = "mongodb+srv://dbAdmin:hello123@cluster0.p11mw.mongodb.net/images?retryWrites=true&w=majority";

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("Successfully connected to Database")
        const collection = client.db(dbName).collection(colName);

        app.get('/api/images/recent', (req, res) => {

            collection.find({}).toArray()
                .then(result => {
                    console.log(result)
                    res.send(result)
                })
                .catch(error => console.error(error))
        })

    })
    .catch(error => console.error(error))
