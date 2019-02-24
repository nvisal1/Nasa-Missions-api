const express = require('express')
const bodyParser = require('body-parser')

const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://Nick:SecWorkshop2@ds133202.mlab.com:33202/nasa-missions';
 
// Database Name
const dbName = 'nasa-missions';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    
    const db = client.db(dbName);
 
    app.get('/', (req, res) => {
        res.json({message: 'Welcome to the NASA Missions api'})
    });

    app.get('/missions', (req, res) => {
        db.collection('missions')
            .find()
            .toArray(function(err, docs) {
                if (err) {
                    console.error(err);
                    res.status(500).json({message: "Houston we have a problem"});
                } else {
                    res.status(200).json(docs);
                }
        });
    });

    app.post('/missions', (req, res) => {
        const mission = req.body;
        db.collection('missions')
            .insert(mission,
                function(err, result) {
                    if (err) {
                        console.error(err);
                        res.status(500).json({message: "Houston we have a problem"});
                    } else {
                        res.status(200).json(result.ops);
                    }
        });
    });

    app.get('/missions/:missionId', (req, res) => {
        const missionId = req.params.missionId;
        db.collection('missions')
            .find({
                _id: new ObjectId(missionId)
            })
            .toArray(function(err, docs) {
                if (err) {
                    console.error(err);
                    res.status(500).json({message: "Houston we have a problem"});
                } else {
                    res.status(200).json(docs);
                }
        });
    });

    app.patch('/missions/:missionId', (req, res) => {
        const missionId = req.params.missionId;
        const updates = req.body;
        db.collection('missions')
            .update(
                {_id: new ObjectId(missionId)},
                {$set: {updates}}
                , function(err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).json({message: "Houston we have a problem"})
                } else {
                    res.status(200).json(result);
                }
        });
    });

    app.delete('/missions/:missionId', (req, res) => {
        const missionId = req.params.missionId;
        db.collection('missions')
            .remove({
                _id: new ObjectId(missionId)
            }, function(err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).json({message: "Houston we have a problem"});
                } else {
                    res.status(200).json(result);
                }
        });
    });


    app.listen(3000, () => {
        console.log("NASA SERVER LAUNCHED ON PORT 3000")
    })
});

