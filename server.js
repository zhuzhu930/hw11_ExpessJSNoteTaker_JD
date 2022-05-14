const express = require('express');
const path = require('path');
// const fsUtils = require('fsUtils');
const api = require('./routes/index.js');
// Helper method for generating unique ids
// const uuid = require('./helpers/uuid');
// Set the port
const PORT = process.env.PORT || 3001;
// Open up the app
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api', api);
app.use(express.static('public'));

// GET Route for index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Wildcard route to direct users to index.html
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
    console.log(`App listening at http;//localhost:${PORT}.`)
);