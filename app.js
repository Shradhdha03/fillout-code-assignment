require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000; 

const { filteredResponsesHandler } = require('./handlers/filteredResponsesHandler');

// API Routes
const router = express.Router();
router.get('/:formId/filteredResponses', filteredResponsesHandler);
app.set('trust proxy', true);

// Home page
app.get('/', (req, res) => {
    const protocol = req.protocol; // 'http' or 'https'
    const host = req.get('host'); // Hostname or IP, including port if specified by the client
    const serverUrl = `${protocol}://${host}/cLZojxk94ous/filteredResponses`
    res.send(`<h3>Welcome to my Express application!<br/> Use url to get responses: <a href="${serverUrl}" >${serverUrl}</a><br/>- Shradhdha</h3>`);
});

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
