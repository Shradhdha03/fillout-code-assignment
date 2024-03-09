const { fetchAndFilterData } = require('../services/dataFetchingService');
const { parseFilters } = require('../utils/filterUtils');

/**
 * Handler for fetching and returning filtered form responses.
 */
const filteredResponsesHandler = async (req, res) => {
    const { formId } = req.params;
    const { limit = 150, offset = 0, filters, ...otherParams } = req.query;
    try {
        const parsedFilters = parseFilters(filters);
        const filteredResponses = await fetchAndFilterData(formId, otherParams, parsedFilters, parseInt(limit), parseInt(offset));
        res.json(filteredResponses);
    } catch (error) {
        console.error(`Error fetching form submissions: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while fetching the submissions.' });
    }
};

module.exports = { filteredResponsesHandler };
