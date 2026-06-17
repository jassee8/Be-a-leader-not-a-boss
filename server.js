const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const EMAIL_FILE = '/home/team/shared/emails.json';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/signup', (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).send('Invalid email address.');
    }

    // Read existing emails
    let emails = [];
    if (fs.existsSync(EMAIL_FILE)) {
        try {
            const data = fs.readFileSync(EMAIL_FILE, 'utf8');
            emails = JSON.parse(data);
        } catch (err) {
            console.error('Error reading emails file:', err);
        }
    }

    // Add new email if not already present
    if (!emails.includes(email)) {
        emails.push(email);
        try {
            fs.writeFileSync(EMAIL_FILE, JSON.stringify(emails, null, 2));
        } catch (err) {
            console.error('Error writing emails file:', err);
            return res.status(500).send('Internal server error.');
        }
    }

    // Redirect to the checklist page
    res.redirect('/checklist.html');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
