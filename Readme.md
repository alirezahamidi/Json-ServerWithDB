# Server Description

The Express.js server is responsible for handling HTTP requests and providing an interface to interact with the database. It includes authentication using JWT tokens and supports CRUD operations for the "users" entity. Here's a breakdown of the server's functionality:

- **Login**: The server provides a `/login` route where clients can send a POST request with username and password to authenticate. If the credentials are valid, the server generates a JWT token and returns it to the client.

- **Authentication**: The server includes an `authenticateToken` middleware that verifies the JWT token sent in the request's Authorization header. If the token is valid, the middleware sets `req.user` with the user information extracted from the token, allowing access to protected routes.

- **User Routes**:
  - GET `/users`: Returns the list of all users in the database. Requires authentication.
  - GET `/users/:id`: Returns the details of a specific user identified by `id`. Requires authentication.
  - POST `/users`: Creates a new user based on the request body. Requires authentication.
  - PUT `/users/:id`: Updates the details of a specific user identified by `id`. Requires authentication.
  - DELETE `/users/:id`: Deletes a specific user identified by `id`. Requires authentication.

# DB Description

The `DBEngine` class represents a simple database engine that provides transaction support and stores entities as keys in a JSON file. Here's an overview of the DBEngine's functionality:

- **Data Storage**: The database stores entities as keys in a JSON file (`database.json`). Each entity contains an array of data.

- **Transaction Support**: The DBEngine supports transactions using the `startTransaction()`, `commitTransaction()`, and `rollbackTransaction()` methods. Transactions allow a set of database operations to be performed as a single unit of work that can be either committed or rolled back.

- **Entity Management**:
  - `createEntity(entityName)`: Creates a new entity with the specified `entityName`.
  - `deleteEntity(entityName)`: Deletes an existing entity with the specified `entityName`.

This server and DB implementation are powered by ChatGPT under my guidance.
