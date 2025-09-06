const express = require('express');
const path = require('path');
const app = express();

// Serve frontend files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Simple API endpoint
app.get('/api/message', (req, res) => {
    res.json({ message: "Hello from backend!" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
