const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

// getting the notes info
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});

// Html Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});



// using the notes info
app.post ('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNotes = {
      title,
      text,
    };
    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNote = JSON.parse(data);
        parsedNote.push(newNotes);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully added a new note')
        );
      }
    });

  const response = {
    status: 'success',
    body: newNotes,
  };

  console.log(response);
  res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting notes');
  }
});



// making the have a url
app.listen(PORT, () =>
  console.log(`Wesbite hosted at http://localhost:${PORT}`)
);
