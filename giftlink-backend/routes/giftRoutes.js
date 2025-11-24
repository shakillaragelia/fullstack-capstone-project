const express = require('express');
const connectToDatabase = require('../models/db');
const { ObjectId } = require('mongodb');   // ← WAJIB untuk mencari _id

const router = express.Router();


// =======================
// GET /api/gifts
// =======================
router.get('/', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Retrieve gifts collection
        const collection = db.collection("gifts");

        // Task 3: Fetch all gifts
        const gifts = await collection.find({}).toArray();

        // Task 4: Return gifts
        res.json(gifts);

    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});


// =======================
// GET /api/gifts/:id
// =======================
router.get('/:id', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Retrieve gift collection
        const collection = db.collection("gifts");

        const id = req.params.id;

        // Task 3: Find gift by ID
        const gift = await collection.findOne({ _id: new ObjectId(id) });

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);

    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});


// =======================
// POST /api/gifts
// =======================
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gift = await collection.insertOne(req.body);

        res.status(201).json(gift.ops ? gift.ops[0] : req.body);
    } catch (e) {
        next(e);
    }
});


module.exports = router;
