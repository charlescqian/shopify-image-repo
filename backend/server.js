const MongoClient = require('mongodb').MongoClient;
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
let path = require("path");

const dbName = "images";
const colName = "images";
const uri = "mongodb+srv://dbAdmin:hello123@cluster0.p11mw.mongodb.net/images?retryWrites=true&w=majority";

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("Successfully connected to Database")
        const collection = client.db(dbName).collection(colName);
        console.log(path.join(__dirname, '../frontend/build/index.html'));

        app.use(express.static(path.join(__dirname, '../frontend/build')));

        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
        })
        /*
         * Get recent images uploaded by all users
         *
         */
        app.get('/api/images/recent', (req, res) => {
            console.log('API Called');
            collection.find({}).toArray()
                .then(result => {
                    console.log(result);
                    res.send(result);
                })
                .catch(error => console.error(error))
        })
        

        app.listen(port, () =>
            console.log(`Server listening on port ${port}`)
        )
    })
    .catch(error => console.error(error))
