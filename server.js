const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Serve static files from the root directory and 'assets'
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api/folders', (req, res) => {
    const assetsPath = path.join(__dirname, 'assets');
    fs.readdir(assetsPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('Error reading assets directory:', err);
            return res.status(500).json({ error: 'Failed to read folders' });
        }

        const folders = entries
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        res.json(folders);
    });
});

app.get('/api/images/:folderName', (req, res) => {
    const folderName = req.params.folderName;
    const folderPath = path.join(__dirname, 'assets', folderName);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Error reading folder ${folderName}:`, err);
            return res.status(500).json({ error: 'Failed to read images' });
        }

        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const images = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return imageExtensions.includes(ext);
        }).map(file => `/assets/${folderName}/${file}`); // Adjust path for client

        res.json(images);
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});