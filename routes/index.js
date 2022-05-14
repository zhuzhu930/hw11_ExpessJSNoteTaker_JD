const express = require('express');
//const path = require('path');

// Import our modular router for notes
const notesRouter = require('./notes');

const app = express();

app.use('/notes', notesRouter);

module.exports = app;
