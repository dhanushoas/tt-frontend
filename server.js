const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the build output directory
// Check angular.json "outputPath"
const buildPath = path.join(__dirname, 'dist', 'bcrypt');

app.use(express.static(buildPath));

// Handle Angular routing by returning index.html for all non-file requests
app.get('*', function (req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
