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

function convertTo24HourFormat(timeStr) {
    // Split time string into hours and period (AM/PM)
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');

    hours = parseInt(hours);  // Convert to integer for calculation

    if (period === 'AM' && hours === 12) {
        hours = 0; // 12 AM is 00:00
    } else if (period === 'PM' && hours !== 12) {
        hours += 12; // Convert PM hours to 24-hour time (e.g., 1 PM -> 13)
    }

    minutes = minutes || '00'; // Default to '00' if minutes is not present
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
}

export function convertTimeRange(object) {
    // Split the time range into open and close times
    Object.keys(object.hours).forEach(function(day) {
        if (object.hours[day] === 'Closed') {
            return;
        } else {
            const [openTime, closeTime] = object.hours[day].split(' - ');
            
            // Convert each time to 24-hour format
            const open24hr = convertTo24HourFormat(openTime.trim());
            const close24hr = convertTo24HourFormat(closeTime.trim());
            object.hours[day] = 'Open ' + open24hr + ' ' + close24hr;
        }
    });
}

function convertTo12HourFormat(time24hr) {
    // Split the input into hours and minutes
    let [hours, minutes] = time24hr.split(':');
    hours = parseInt(hours);  // Convert hours to a number

    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    if (hours > 12) {
        hours -= 12;  // Convert hours > 12 to 12-hour format
    } else if (hours === 0) {
        hours = 12;   // Handle midnight (00:00) as 12 AM
    }

    // Format hours and minutes for consistency
    return `${hours}:${minutes} ${period}`;
}

export function convertTimeRangeBack(object) {

    const hours = {};

    for (let key in object) {
        if (object[key] === 'Closed') {
            hours[key] = object[key];
            continue;
        } else {
            const openTime24hr = object[key][1];
            const closeTime24hr = object[key][2];
            const open12hr = convertTo12HourFormat(openTime24hr);
            const close12hr = convertTo12HourFormat(closeTime24hr);
            hours[key] = `${open12hr} - ${close12hr}`
        }
    }
    return hours;
}
