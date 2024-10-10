const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload.route'); // Path to your router file
const port = process.env.PORT || 3000;

// Use the upload routes from the router
app.use('/upload', uploadRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});