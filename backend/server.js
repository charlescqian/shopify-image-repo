const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const { format } = require('util');

const app = express();
const port = process.env.PORT || 5000;
const storage = new Storage();
let path = require("path");

const dbName = "images";
const colName = "images";
const uri = "mongodb+srv://dbAdmin:hello123@cluster0.p11mw.mongodb.net/images?retryWrites=true&w=majority";

// app.use(express.json());

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 20 * 1024 * 1024, // no larger than 20 MB
    },
});

const bucket = storage.bucket('image-repo-charles');

MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("Successfully connected to Database")
        const collection = client.db(dbName).collection(colName);

        // app.use(express.static(path.join(__dirname, '../frontend/build')));

        // // app.get('/', (req, res) => {
        // //     res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
        // // })
        /*
         * Get recent images uploaded by all users
         *
         */
        app.get('/api/images/recent', (req, res) => {
            console.log('Get recent images API Called');
            collection.find({}).toArray()
                .then(result => {
                    console.log(result);
                    res.send(result);
                })
                .catch(error => console.error(error))
        })
        
        app.post('/api/upload', upload.array("images", 10), (req, res, next) => {
            console.log('Upload API called');
            console.log(req.files);
            console.log(req.file);
            console.log(req.body);
            console.log(req.params);
            console.log(req.headers);
            if (!req.files) {
                res.status(400).send('No file uploaded.');
                console.log('bleh');
                return;
            }
            
            // const blob = bucket.file(req.file.name);
            // const blobStream = blob.createWriteStream();

            // blobStream.on('error', err => {
            //     next(err);
            // });

            // blobStream.on('finish', () => {
            //     const publicUrl = format(
            //         `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            //     );
            //     res.status(200).send(publicUrl);
            // });

            // blobStream.end(req.file.buffer);
        })
        
        app.listen(port, () =>
            console.log(`Server listening on port ${port}`)
        )
    })
    .catch(error => console.error(error))
