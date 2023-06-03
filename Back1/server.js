const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');

class JsonDatabase {
  constructor(filename, secretKey) {
    this.filename = filename;
    this.secretKey = secretKey;
    this.data = this.loadDataFromJson();
    this.app = express();
    this.app.use(express.json());
    this.setupRoutes();
  }

  saveDataToJson() {
    const jsonData = JSON.stringify(this.data, null, 2);
    fs.writeFileSync(this.filename, jsonData);
  }

  loadDataFromJson() {
    try {
      const jsonData = fs.readFileSync(this.filename);
      const data = JSON.parse(jsonData);
      return data;
    } catch (error) {
      return {};
    }
  }

  saveEntity(entityName, entityData) {
    this.data[entityName] = entityData;
    this.saveDataToJson();
  }

  getEntity(entityName) {
    return this.data[entityName] || null;
  }

  deleteEntity(entityName) {
    delete this.data[entityName];
    this.saveDataToJson();
  }

  authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, this.secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  }

  setupRoutes() {
    this.app.post('/login', (req, res) => {
      const { username, password } = req.body;

      if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ username }, this.secretKey, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });

    this.app.get('/api/:entity', this.authenticateToken, (req, res) => {
      const { entity } = req.params;
      const data = this.getEntity(entity);

      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: 'Entity not found' });
      }
    });

    this.app.post('/api/:entity', this.authenticateToken, (req, res) => {
      const { entity } = req.params;
      const entityData = req.body;
      this.saveEntity(entity, entityData);
      res.sendStatus(201);
    });

    this.app.delete('/api/:entity', this.authenticateToken, (req, res) => {
      const { entity } = req.params;
      this.deleteEntity(entity);
      res.sendStatus(204);
    });

    this.app.put('/api/:entity', this.authenticateToken, (req, res) => {
      const { entity } = req.params;
      const entityData = req.body;
      this.saveEntity(entity, entityData);
      res.sendStatus(204);
    });
  }

  startServer(port) {
    this.app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  }
}

// Example usage
const db = new JsonDatabase('database.json', 'your-secret-key');
db.startServer(3000);
