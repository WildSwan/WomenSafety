
const express = require('express');
const bodyParser = require('body-parser');const PORT = process.env.PORT || 8080;  // Use 8080 for Fly.io
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const admin = require('firebase-admin');
const serviceAccount = require('D:/WomenSafety/serviceAccountKey.json'); // Path to your JSON file

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://women-safety-device-3a56d-default-rtdb.firebaseio.com'
});

const db = admin.database();
const app = express();
app.use(bodyParser.json());

// Route to retrieve all data under '00001' bucket
app.get('/data', async (req, res) => {
  try {
    const snapshot = await db.ref('/00001').once('value');
    res.json(snapshot.val());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to update a specific tag in the '00001' bucket
app.post('/data/:tag', async (req, res) => {
  const tag = req.params.tag; // The tag to update (e.g., battery, connect, etc.)
  try {
    await db.ref(`/00001/${tag}`).set(req.body.value); // Expecting { "value": "some_value" } in POST body
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
