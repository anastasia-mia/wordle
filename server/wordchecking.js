let wordList = require('wordlist-english');
const express = require('express');
const cors = require('cors');

const words = wordList['english'];
const app = express();

function checkWordExistence(word) {
    return words.includes(word.toLowerCase());
}

app.use(express.json());
app.use(cors());

app.get('/check-word', (req, res) => {
    const inputWord = req.query.word;
    const wordExists = checkWordExistence(inputWord);
    res.json({ exists: wordExists });
});

app.listen(3013, () => {
    console.log('Server is running on port 3000');
});