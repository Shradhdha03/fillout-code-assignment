const axios = require('axios');
const { filterSubmissionsByCriteria } = require('../utils/filterUtils');

/** 
 * Asynchronously fetches form submissions from the Fillout API based on given criteria.
 * 
 * @param {string} formId - The ID of the form to fetch submissions for.
 * @param {object} filters - Criteria to filter submissions by.
 * @param {number} limit - The maximum number of submissions to return.
 * @param {number} offset - The offset from which to start fetching submissions.
 * @param {string} otherParams - The other query params that are api supports.
 * @returns {Promise<Array>} A promise that resolves to an array of filtered form submissions.
*/
const fetchDataFromAPI = async (formId, limit, offset, otherParams) => {
    const url = `${process.env.FILLOUT_API_URL}/v1/api/forms/${formId}/submissions`;
    const headers = {
        'Authorization': `Bearer ${process.env.FILLOUT_API_KEY}`,
    };
    const params = { limit, offset, ...otherParams };

    try {
        const response = await axios.get(url, { params, headers });
        return response.data.responses;
    } catch (error) {
        console.error(`Error calling the API: ${error.message}`);
        throw error;
    }
};



/**
 * Fetches and filters data based on form ID and provided criteria.
 * 
 * @param {string} formId - The ID of the form to fetch data for.
 * @param {object} otherParams - Additional parameters to pass to the API call.
 * @param {Array} filters - Filtering criteria to apply to the fetched data.
 * @param {number} limit - The maximum number of items to return in the response.
 * @param {number} offset - The offset from the start of the dataset for the return data.
 * @returns {object} An object containing the filtered responses, total number of filtered responses, and the total page count based on offset.
 */
const fetchAndFilterData = async (formId, otherParams, filters,  limit, offset) => {
    let allFilteredData = [];
    let apiOffset = 0; // Initial offset for API calls
    const apiLimit = 150; // Max items the API can return in one call
    let hasMoreData = true;
    
    while (hasMoreData) {
        const data = await fetchDataFromAPI(formId, apiLimit, apiOffset, otherParams);
        const filteredData = data && filters ? filterSubmissionsByCriteria(data, filters) : data;
        allFilteredData = allFilteredData.concat(filteredData);
        apiOffset += apiLimit;

        if (data.length < apiLimit) hasMoreData = false;
    }
    
    return {
        responses: allFilteredData.slice(offset, offset + limit),
        totalResponses: allFilteredData.length,
        pageCount: Math.ceil(allFilteredData.length / limit)
    };
};

module.exports = { fetchAndFilterData ,fetchDataFromAPI};
