const request = require("supertest");
const app = require("../app");
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv').config();

const dbName = "images";
const colName = "images";

/*
 * These are probably more like integration tests than unit tests since we are actually
 * connecting to the MongoDB database and pulling real data. 
 */
describe("Test API Endpoints", () => {
    beforeAll(async () => {
        connection = await MongoClient.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        db = await connection.db(dbName);
        collection = await db.collection(colName);
    });

    afterAll(async () => {
        await connection.close();
        await db.close();
        await MongoClient.close();
    })

    it("Test Root Path Successful Response", () => {
        return request(app)
            .get("/")
            .then(res => {
                expect(res.statusCode).toBe(200);
            });
    });

    // Connection seems to be kept open for the tests below
    // Jest detects open handles and does not exit
    // TODO: Fix this issue.
    it("Test Get Recent Images Success", () => {
        return request(app)
            .get("/api/images/recent")
            .then(res => {
                expect(res.statusCode).toBe(200);
            });
    });

    it("Test Get Most Liked Images Success", () => {
        return request(app)
            .get("/api/images/mostliked")
            .then(res => {
                expect(res.statusCode).toBe(200);
            });
    });

    it("Test Upload Endpoint Success", () => {
        let data = new FormData();
        // TODO: Upload test picture and delete?
    });

    it("Test Like Endpoint Success", () => {
        // Increment the like of an image in the DB by 1
        const path = "images/7RDEAElUSVOFSrbQedBkjQ.jpg";

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({path: path}),
        };

        console.log(requestOptions);
        return request(app)
            .post("/api/like", requestOptions)
            .then(res => {
                expect(res.statusCode).toBe(200);
                collection.updateOne(
                    { path: `${requestOptions.body}` },
                    { $inc: {likes: -1} })
            });
    });

    it("Test Like Endpoint Failure",  () => {
        // Try to increment the like of a file that does not exist
        const path = "asdf.png";

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({path: path}),
        };
        
        // console.log(requestOptions);
        return request(app)
            .post("/api/like", requestOptions)
            .then(res => {
                expect(res.statusCode).toBe(404);
            });
    })
});

