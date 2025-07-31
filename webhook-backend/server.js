require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const payload = req.body;

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.insertOne({
      receivedAt: new Date(),
      payload
    });

    await client.close();
    res.status(200).send('Received and stored successfully.');
  } catch (error) {
    console.error('MongoDB Insert Error:', error);
    res.status(500).send('Error storing data');
  }
});

app.get('/', (req, res) => {
  res.send('Webhook service is running.');
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
