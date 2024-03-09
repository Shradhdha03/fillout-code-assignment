// parseFilters.test.js

const { parseFilters, evaluateFilter ,filterSubmissionsByCriteria} = require('../utils/filterUtils');

describe('parseFilters', () => {
    it('should return null if filters is falsy', () => {
        expect(parseFilters(null)).toBeNull();
        expect(parseFilters(undefined)).toBeNull();
        expect(parseFilters('')).toBeNull();
    });

    it('should return null and log an error if filters is not a valid JSON string', () => {
        // Spy on console.error to verify it gets called
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

        // Invalid JSON
        const result = parseFilters('invalid JSON');
        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error parsing filters:'));

        // Cleanup spy
        consoleSpy.mockRestore();
    });

    it('should return the parsed object if filters is a valid JSON object string', () => {
        // Valid JSON object string
        const filters = JSON.stringify({ key: 'value' });
        const result = parseFilters(filters);

        // Expected to parse back into an object
        expect(result).toEqual({ key: 'value' });
    });

});


describe('evaluateFilter', () => {
    it('should return true for equal values using "equals"', () => {
        expect(evaluateFilter('test', 'test', 'equals')).toBe(true);
    });

    it('should return false for unequal values using "equals"', () => {
        expect(evaluateFilter('test', 'Test', 'equals')).toBe(false);
    });

    it('should return true for non-equal values using "does_not_equal"', () => {
        expect(evaluateFilter('test', 'Test', 'does_not_equal')).toBe(true);
    });

    it('should return false for equal values using "does_not_equal"', () => {
        expect(evaluateFilter('test', 'test', 'does_not_equal')).toBe(false);
    });

    it('should return true when questionValue is greater using "greater_than"', () => {
        expect(evaluateFilter('2022-01-02', '2022-01-01', 'greater_than')).toBe(true);
    });

    it('should return false when questionValue is less using "greater_than"', () => {
        expect(evaluateFilter('2022-01-01', '2022-01-02', 'greater_than')).toBe(false);
    });

    it('should return true when questionValue is less using "less_than"', () => {
        expect(evaluateFilter('2022-01-01', '2022-01-02', 'less_than')).toBe(true);
    });

    it('should return false when questionValue is greater using "less_than"', () => {
        expect(evaluateFilter('2022-01-02', '2022-01-01', 'less_than')).toBe(false);
    });

    it('should handle unsupported conditions gracefully', () => {
        expect(evaluateFilter('test', 'Test', 'unknown_condition')).toBe(false);
    });
});


describe('filterSubmissionsByCriteria', () => {
    it('returns all responses if no filters are provided', () => {
        const responses = [{ id: 1, questions: [{ id: 'q1', value: 'Yes' }] }];
        expect(filterSubmissionsByCriteria(responses, [])).toEqual(responses);
    });

    it('returns filtered responses based on a single criterion', () => {
        const responses = [
            { id: 1, questions: [{ id: 'q1', value: 'Yes' }] },
            { id: 2, questions: [{ id: 'q1', value: 'No' }] },
        ];
        const filters = [{ id: 'q1', value: 'Yes', condition: 'equals' }];
        expect(filterSubmissionsByCriteria(responses, filters)).toEqual([responses[0]]);
    });

    it('returns filtered responses based on multiple criteria', () => {
        const responses = [
            { id: 1, questions: [{ id: 'q1', value: 'Yes' }, { id: 'q2', value: '10' }] },
            { id: 2, questions: [{ id: 'q1', value: 'No' }, { id: 'q2', value: '10' }] },
        ];
        const filters = [
            { id: 'q1', value: 'Yes', condition: 'equals' },
            { id: 'q2', value: '10', condition: 'equals' },
        ];
        expect(filterSubmissionsByCriteria(responses, filters)).toEqual([responses[0]]);
    });

    it('excludes responses without matching question IDs', () => {
        const responses = [
            { id: 1, questions: [{ id: 'q1', value: 'Yes' }] },
            { id: 2, questions: [{ id: 'q3', value: 'No' }] },
        ];
        const filters = [{ id: 'q2', value: 'Yes', condition: 'equals' }];
        expect(filterSubmissionsByCriteria(responses, filters)).toEqual([]);
    });

    it('handles complex filtering conditions', () => {
        const responses = [
            { id: 1, questions: [{ id: 'q1', value: '2022-01-01' }] },
            { id: 2, questions: [{ id: 'q1', value: '2023-01-01' }] },
        ];
        const filters = [{ id: 'q1', value: '2022-06-01', condition: 'less_than' }];
        expect(filterSubmissionsByCriteria(responses, filters)).toEqual([responses[0]]);
    });
});


