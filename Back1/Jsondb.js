const fs = require('fs');

class JsonDatabase {
  constructor(filename) {
    this.filename = filename;
    this.data = this.loadDataFromJson();
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
}

// Example usage
const db = new JsonDatabase('database.json');