const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assets', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assets', 'index.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseErr) {
      console.error(parseErr);
      return res.status(500).json({ error: 'Failed to parse notes.' });
    }

    res.json(notes);
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to read notes.' });
    }

    let notes = [];
    try {
      notes = JSON.parse(data);
    } catch (parseErr) {
      console.error(parseErr);
      return res.status(500).json({ error: 'Failed to parse notes.' });
    }

    // Generate a unique ID for the new note (using 'uuid' package as an example)
    const { v4: uuidv4 } = require('uuid');
    newNote.id = uuidv4();

    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).json({ error: 'Failed to save note.' });
      }

      res.json(newNote);
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});