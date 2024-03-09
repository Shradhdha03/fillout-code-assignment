
/**
 * Parses a JSON string representing filters into an object.
 * If the input is invalid, returns null and logs the error.
 * 
 * @param {string|null|undefined} filters - The JSON string of filters.
 * @return {object|null} The parsed filters object or null if parsing fails.
 */
const parseFilters = (filters) => {
    if (!filters) {
        console.log("No filters provided, returning null.");
        return null;
    }

    try {
        const parsedFilters = JSON.parse(filters);
        if (typeof parsedFilters === 'object' && parsedFilters !== null) {
            return parsedFilters;
        } else {
            console.error("Parsed filters is not an object.");
            return null;
        }
    } catch (error) {
        console.error(`Error parsing filters: ${error.message}`);
        return null;
    }
};

/**
 * Filters a collection of form responses based on specified criteria.
 * 
 * @param {Array} responses - Array of form responses to filter.
 * @param {Array} filters - Array of filter criteria objects.
 * @return {Array} Filtered array of form responses.
 */
const filterSubmissionsByCriteria = (responses, filters) => {
    if (!Array.isArray(filters) || filters.length === 0) {
        console.log("No filters provided, returning original responses.");
        return responses;
    }

    return responses.filter(response => filters.every(filter => {
        const question = response.questions.find(q => q.id === filter.id);
        if (!question) return false; // If question doesn't match any filter id, exclude response
        return evaluateFilter(question.value, filter.value, filter.condition);
    }));
};

/**
 * Evaluates a single filter condition between a question value and a filter value.
 * 
 * @param {any} questionValue - The value of the question to be filtered.
 * @param {any} filterValue - The value to compare the question value against.
 * @param {string} condition - The condition to evaluate ('equals', 'does_not_equal', 'greater_than', 'less_than').
 * @return {boolean} Result of the evaluation.
 */
const evaluateFilter = (questionValue, filterValue, condition) => {
    switch (condition) {
        case 'equals':
            return questionValue == filterValue;
        case 'does_not_equal':
            return questionValue != filterValue;
        case 'greater_than':
            return new Date(questionValue) > new Date(filterValue);
        case 'less_than':
            return new Date(questionValue) < new Date(filterValue);
        default:
            console.log(`Unsupported filter condition: ${condition}`);
            return false;
    }
};


module.exports = { parseFilters, filterSubmissionsByCriteria ,evaluateFilter };
