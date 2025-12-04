// ==========================
//   IMPORTS & CONFIG
// ==========================
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');

// Logger instance
const logger = pino();

// Load env variables
dotenv.config();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;


// ===========================================================
//                     REGISTER ENDPOINT
// ===========================================================

router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Access users collection
        const collection = db.collection("users");

        // Task 3: Check for existing email
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // Task 4: Save new user
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 5: Create JWT token
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');

        res.json({ authtoken, email: req.body.email });

    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});


// ===========================================================
//                     LOGIN ENDPOINT
// ===========================================================

router.post('/login', async (req, res) => {
    try {
        // Task 1: Connect to MongoDB
        const db = await connectToDatabase();

        // Task 2: Access users collection
        const collection = db.collection("users");

        // Task 3: Look up user by email
        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            // Task 4: Compare passwords
            const match = await bcryptjs.compare(req.body.password, theUser.password);
            if (!match) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong password' });
            }

            // Task 5: Get user details
            const userName = theUser.firstName;
            const userEmail = theUser.email;

            // Task 6: Create JWT token
            const payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };

            const authtoken = jwt.sign(payload, JWT_SECRET);

            logger.info('User logged in successfully');

            return res.json({
                authtoken,
                userName,
                userEmail
            });
        }

        // Task 7: If email not found
        logger.error('User not found');
        return res.status(404).json({ error: 'User not found' });

    } catch (e) {
        console.error(e);
        return res.status(500).send('Internal server error');
    }
});


// Export router
module.exports = router;
