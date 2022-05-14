const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
  readFromFile,
  readAndAppend,
  writeToFile,
} = require('../helpers/fsUtils');

// GET Route for retrieving all the notes
notes.get('/', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// GET Route for a specific note
notes.get('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.note_id === noteId);
      return result.length > 0
        ? res.json(result)
        : res.json('No note with that ID');
    });
});

// DELETE Route for a specific note
notes.delete('/:note_id', (req, res) => {
  const noteId = req.params.note_id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((json) => {
      // Make a new array of all notes except the one with the ID provided
      const result = json.filter((note) => note.note_id !== noteId);

      // Save that array
      writeToFile('./db/db.json', result);

      // Respond to DELETE
      res.json(`Item ${noteId} has been deleted.`);
    });
});

// POST Route for a new note
notes.post('/', (req, res) => {
  // console.log(req.body);
  //destructuring the items in req.body
  const { noteTitle, noteText } = req.body;

  if (req.body) {
    const newNote = {
      noteTitle,
      noteText,
      note_id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');
    
    const response = {
      status: "Success", 
      body: newNote,
    };

    res.json(response);
  } else {
    res.error('Error in adding a note.');
  }
});

module.exports = notes;
