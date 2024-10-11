const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/verify-token', authenticateToken, (req, res) => {
  res.json({ userId: req.userId, message: 'Token is valid' });
});

const uri = "mongodb+srv://tactileengineeringmaterials:EX6bUSOLMp95n8wd@tactile-materials.wgwpa.mongodb.net/?retryWrites=true&w=majority&appName=Tactile-Materials";
const client = new MongoClient(uri);
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
  }
}

connectToDatabase();

// User registration
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const db = client.db();
    const user = await db.collection('users').insertOne({
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const db = client.db();
    const user = await db.collection('users').findOne({ email });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Authentication failed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.userId;
    next();
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add this function to your server.js file
async function testDatabaseConnection() {
    try {
      // Connect to the database
      await client.connect();
      console.log("Connected successfully to MongoDB");
  
      // Get the database name
      const dbName = client.db().databaseName;
      console.log(`Database name: ${dbName}`);
  
      // Perform a simple query
      const collections = await client.db().listCollections().toArray();
      console.log("Collections in the database:");
      collections.forEach(collection => {
        console.log(collection.name);
      });
  
      // Close the connection
      await client.close();
      console.log("Database connection closed");
    } catch (error) {
      console.error("Database connection test failed:", error);
    }
  }
