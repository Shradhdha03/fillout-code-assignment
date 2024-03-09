
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { fetchDataFromAPI ,fetchAndFilterData } = require('../services/dataFetchingService');
const { filterSubmissionsByCriteria } = require('../utils/filterUtils');


// Mock environment variables
process.env.FILLOUT_API_URL = 'https://api.mockurl.com';
process.env.FILLOUT_API_KEY = 'mock_api_key';

const mock = new MockAdapter(axios);

describe('fetchDataFromAPI', () => {
    // Reset mocks before each test
    beforeEach(() => {
        mock.reset();
    });

    it('should fetch form submissions successfully', async () => {
        const formId = 'testFormId';
        const mockData = { responses: ['response1', 'response2'] };
        mock.onGet(`${process.env.FILLOUT_API_URL}/v1/api/forms/${formId}/submissions`).reply(200, mockData);

        const result = await fetchDataFromAPI(formId, 10, 0, {});
        expect(result).toEqual(mockData.responses);
    });

    it('should throw an error when the API call fails', async () => {
        const formId = 'testFormId';
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        mock.onGet(`${process.env.FILLOUT_API_URL}/v1/api/forms/${formId}/submissions`).networkError();

        await expect(fetchDataFromAPI(formId, 10, 0, {}))
            .rejects
            .toThrow('Network Error');

        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("Error calling the API: Network Error"),);

        // Cleanup spy
        consoleSpy.mockRestore();
    });
});
