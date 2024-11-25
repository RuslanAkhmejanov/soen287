/**
 * Helper function to safely parse JSON fields in the business object.
 * @param {Object} business - The business object to parse
 * @returns {Object} - The updated business object with parsed fields.
 */
export function parseBusinessData(business) {
    business.logos = safeParseJSON(business.logos);
    business.hours = safeParseJSON(business.hours);
    business.backgroundPics = safeParseJSON(business.backgroundPics);
    business.services = safeParseJSON(business.services);
    business.staffMembers = safeParseJSON(business.staffMembers);
    return business;
}

/**
 * Safely parses a JSON string into a JavaScript object.
 * If the input is already an object, it returns the input as-is.
 * In case of a JSON parsing error, it logs the error to the console 
 * and returns a default fallback value (an empty array by default).
 *
 * @param {any} json - The input data to be parsed. This can be a JSON string 
 *                      or an already-parsed JavaScript object.
 * @returns {any} - If the input is a valid JSON string, it returns the parsed 
 *                  JavaScript object. If the input is already an object, 
 *                  it returns the input as-is. If there's an error during parsing, 
 *                  it returns an empty array by default.
 */
export function safeParseJSON(json) {
    try {
        return typeof json === 'string' ? JSON.parse(json) : json;
    } catch (error) {
        console.error('JSON parsing error:', error);
        return [];
    }
}
