



const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(express.json());
app.use(cors());


const port = process.env.port || 8000;


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://VideoStremming:YgzRU39DfDsPgg4l@cluster0.japxgm3.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



// console.log(uri)


async function mongodbConnect() {


    try {

        const JobTaskVideoStemming = client
            .db("jobTaskStreming")
            .collection("allVideoUpload");
        const JobTaskVideoStemmingMessage = client
            .db("jobTaskStreming")
            .collection("allMessage");
        const JobTaskVideoStemmingNotifications = client
            .db("jobTaskStreming")
            .collection("Notifications");


        app.get("/allVideo", async (req, res) => {
            const result = await JobTaskVideoStemming.find({}).toArray()
            res.send(result)
        })
        app.get("/singleVideo/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }

            const result = await JobTaskVideoStemming.findOne(query)
            res.send(result)
        })

        app.post("/message", async (req, res) => {
            const body = req.body;
            const result = await JobTaskVideoStemmingMessage.insertOne(body)
            // console.log(body)
            res.send(result)
        })
        app.get("/message/:id", async (req, res) => {
            const id = req.params.id;
            const query = { "id": id };
            const result = await JobTaskVideoStemmingMessage.find(query).toArray()
            res.send(result)
        })
        app.get("/notification", async (req, res) => {

            const result = await JobTaskVideoStemmingNotifications.find({}).toArray()
            res.send(result)
        })

        app.put("/likeUpdate", async (req, res) => {
            const body = req.body;
            // console.log(body)
            const notification = {
                id: body?.id,
                title: body?.title

            }
            const videoNotiFication = await JobTaskVideoStemmingNotifications.insertOne(notification)
            const filter = { _id: new ObjectId(body?.id) };
            const updateCount = req.body;
            const options = { upsert: true }
            const updateDoc = {
                $push: {
                    videoLike: body?.id,
                }
            }
            const result = await JobTaskVideoStemming.updateOne(filter, updateDoc, options);
            // console.log("2", result)
            res.send(result);
        })
        app.put("/VewerUpdate", async (req, res) => {
            const id = req.body.e;
            console.log(id)
            const filter = { _id: new ObjectId(id) };
            const updateCount = req.body;
            console.log("1", updateCount)
            const options = { upsert: true }
            const updateDoc = {
                $push: {
                    videoViewer: id,
                }
            }
            const result = await JobTaskVideoStemming.updateOne(filter, updateDoc, options);
            console.log("2", result)
            res.send(result);
        })





    } finally {

    }
}
mongodbConnect().catch((err) => console.log(err));




app.get("/", async (req, res) => {
    res.send("server is running on port 8000")
});

app.listen(port, () => {
    console.log(`server is running video stemming task ${port}`)
})