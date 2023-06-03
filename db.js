const fs = require('fs');

class DBEngine {
    constructor(filename) {
        this.filename = filename;
        this.data = this.loadDataFromJson();
        this.transaction = [];
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

    saveDataToJson() {
        const jsonData = JSON.stringify(this.data, null, 2);
        fs.writeFileSync(this.filename, jsonData);
    }

    startTransaction() {
        this.transaction = JSON.parse(JSON.stringify(this.data));
    }

    commitTransaction() {
        this.transaction = [];
        this.saveDataToJson();
    }

    rollbackTransaction() {
        this.data = JSON.parse(JSON.stringify(this.transaction));
        this.transaction = [];
    }

    createEntity(entityName) {
        if (!this.data[entityName]) {
            this.data[entityName] = [];
            this.saveDataToJson();
        } else {
            throw new Error('Entity already exists.');
        }
    }

    deleteEntity(entityName) {
        if (this.data[entityName]) {
            delete this.data[entityName];
            this.saveDataToJson();
        } else {
            throw new Error('Entity does not exist.');
        }
    }

    addData(entityName, data) {
        if (this.data[entityName]) {
            this.data[entityName].push(data);
        } else {
            throw new Error('Entity does not exist.');
        }
    }

    removeData(entityName, index) {
        if (this.data[entityName] && this.data[entityName].length > index) {
            this.data[entityName].splice(index, 1);
        } else {
            throw new Error('Invalid entity name or index.');
        }
    }

    updateData(entityName, index, newData) {
        if (this.data[entityName] && this.data[entityName].length > index) {
            this.data[entityName][index] = newData;
        } else {
            throw new Error('Invalid entity name or index.');
        }
    }

    getEntityData(entityName) {
        if (this.data[entityName]) {
            return this.data[entityName];
        } else {
            throw new Error('Entity does not exist.');
        }
    }
}

// Example usage
module.exports = new DBEngine('database.json');

// Start a transaction
// db.startTransaction();

// Create an entity
// db.createEntity('users');

// Add data to the entity
// db.addData('users', { id: 1, name: 'John Doe' });
// db.addData('users', { id: 2, name: 'Jane Smith' });

// Commit the transaction
// db.commitTransaction();

// Retrieve entity data
// const users = db.getEntityData('users');
// console.log(users);

// Start a new transaction
// db.startTransaction();

// Update data
// db.updateData('users', 1, { id: 1, name: 'John Smith' });

// Rollback the transaction
// db.rollbackTransaction();

// Retrieve entity data after rollback
// const usersAfterRollback = db.getEntityData('users');
// console.log(usersAfterRollback);
