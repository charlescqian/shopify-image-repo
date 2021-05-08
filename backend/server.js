const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const { format } = require('util');

const app = express();
const port = process.env.PORT || 5000;
const gc = require('./config/')

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

const bucket = gc.bucket('image-repo-charles');

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
         * TODO: Should pull the X most recent pictures (X=20?) and sort them by upload time
         */
        app.get('/api/images/recent', (req, res) => {
            console.log('Get recent images API Called');
            collection.find({}).sort({uploadTime:-1}).limit(20).toArray()
                .then(result => {
                    console.log(result);
                    const sortedResult = result.sort((a, b) => b.uploadTime - a.uploadTime)
                    console.log(sortedResult)
                    res.send(result);
                })
                .catch(error => console.error(error))
        })
        
        app.post('/api/upload', upload.array("images", 10), (req, res, next) => {
            console.log('Upload API called');
            console.log(req.files);

            if (!req.files) {
                res.status(400).send('No file uploaded.');
                return;
            }
            
            req.files.forEach(file => {
                const blob = bucket.file(`images/${file.originalname}`);
                const blobStream = blob.createWriteStream();
                
                // TODO: Error handling and return proper status for the uploads
                // Should it return an error if any file fails to upload?
                blobStream.on('error', err => {
                    next(err);
                });

                blobStream.on('finish', () => {
                    const publicUrl = format(
                        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
                    );
                    res.status(200).send(publicUrl);
                });

                blobStream.end(file.buffer);

                // Add File metadata to DB
                let image = { 
                    path: `images/${file.originalname}`, 
                    owner: "cqian",
                    uploadTime: new Date()
                }

                collection.insertOne(image, (err, res) => {
                    if (err) throw err;
                    console.log("Document inserted");
                });
            })
            
        })
        
        app.listen(port, () =>
            console.log(`Server listening on port ${port}`)
        )
    })
    .catch(error => console.error(error))
