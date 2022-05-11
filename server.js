const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
// Set the port
const PORT = 3001;
// Open up the app
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ entended: true}));
app.use(express.static('public'));

// GET Route for index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Promise version of fs.readFile
//? readFromFile is dark yellow, not working
const readFromFile = util.promisify(fs.readFile);

/**
 *  Function to write data to the JSON file given a destination and some content
 *  @param {string} destination The file you want to write to.
 *  @param {object} content The content you want to write to the file.
 *  @returns {void} Nothing
 */

//? writeToFile is dark yellow, not working
const writeToFile = (destination, content) =>
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
        err ? console.error(err) : console.info(`\nData written to ${destination}`)
    );

/**
 *  Function to read data from a given a file and append some content
 *  @param {object} content The content you want to append to the file.
 *  @param {string} file The path to the file you want to save to.
 *  @returns {void} Nothing
 */

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
};

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`); 
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// POST Route for a new note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { noteTitle, noteText, addedBy } = req.body;

    if(req.body) {
        const newNote = {
            noteTitle, 
            noteText, 
            addedBy, 
            note_id: uuid(), 
        };

        readAndAppend(newNote, './db/db.json');
        res.json(`A new note is added successfully 🚀`);
    } else {
        res.error('Error, your note is not added');
    }
});

