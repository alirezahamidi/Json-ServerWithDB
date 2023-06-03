const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const DBEngine = require('./db');

const app = express();
app.use(bodyParser.json());

const db = DBEngine;
const secretKey = 'your-secret-key';

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Authenticate user (you can replace this with your own validation logic)
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// CRUD routes for users
app.get('/users', authenticateToken, (req, res) => {
  try {
    const users = db.getEntityData('users');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const users = db.getEntityData('users');
    const user = users.find((user) => user.id === parseInt(id));

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/users', authenticateToken, (req, res) => {
  const { id, name } = req.body;

  try {
    const users = db.getEntityData('users');
    const newUser = { id, name };
    users.push(newUser);
    db.saveDataToJson();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const users = db.getEntityData('users');
    const user = users.find((user) => user.id === parseInt(id));

    if (user) {
      user.name = name;
      db.saveDataToJson();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  try {
    const users = db.getEntityData('users');
    const index = users.findIndex((user) => user.id === parseInt(id));

    if (index !== -1) {
      users.splice(index, 1);
      db.saveDataToJson();
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
