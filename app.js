require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000; 

const { filteredResponsesHandler } = require('./handlers/filteredResponsesHandler');

// API Routes
const router = express.Router();
router.get('/:formId/filteredResponses', filteredResponsesHandler);
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
