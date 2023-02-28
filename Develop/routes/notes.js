const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');

// GET Route for retrieving notes
notes.get('/', (req, res) => {
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)))
});

// POST Route for submitting feedback
notes.post('/', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, './db/notes.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

notes.delete('/:id', (req, res) => {
  var id = req.params.id;

  readFromFile('./db/notes.json').then((data) => {
    var json = JSON.parse(data);

    var i = 0;
    var target = 0;
    json.forEach(note => {
      
      if (note.id === id) {
        target = i;
      }
      i++;
    });

    json.splice(target, 1);

    writeToFile('./db/notes.json', json);
    res.json(json);
  })
});

module.exports = notes;
