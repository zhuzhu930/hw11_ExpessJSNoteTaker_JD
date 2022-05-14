const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

// Set the port
const PORT = process.env.PORT || 3001;
// Open up the Express app
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api', api);
app.use(express.static('public')); //we don't need to write routes for all the files in the public folder. 

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