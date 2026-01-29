// The plank is 400 pixels long
const PLANK_LENGTH = 400;

// The pivot is exactly at the center of the plank
const PIVOT_POSITION = PLANK_LENGTH / 2;

// Maximum rotation angle in degrees
const MAX_ANGLE = 30;

// Minimum rotation angle in degrees
const MIN_ANGLE = -30;

// Weight range for random in objects in kg
const MIN_WEIGHT = 1;
const MAX_WEIGHT = 10;

// Scaling factor for converting torque to angle
// angle = (right torque - left torque) * TORQUE_SCALE
const TORQUE_SCALE = 10;

/**
 * Converts a click position (relative to the plank) to a signed distance from the pivot.
 * @param {number} clickX - X position of click relative to the plank's left edge (0 to PLANK_LENGTH)
 * @returns {number} Signed distance from pivot in pixels
*/

function clickPositionToDistance(clickX) {
    const distance = clickX - PIVOT_POSITION;
    return distance;
}

/**
 * Gets the position of a click relative to the plank.
 * @param {MouseEvent} event - The click event
 * @param {HTMLElement} plankElement - The plank element
 * @returns {number} - X position relative to plank's left edge
 */

function getClickPositionRelativeToPlank(event, plankElement) {
    // Get the plank position relative to the viewport
    const plankRect = plankElement.getBoundingClientRect();

    // Get the click position relative to the viewport
    const clickX = event.clientX;

    // Calculate click position relative to plank's left edge
    const relativeX = clickX - plankRect.left;

    return relativeX;
}

/**
 * This is the main function that I will be using when handling a click event.
 * @param {MouseEvent} event - The click event
 * @param {HTMLElement} plankElement - The plank element
 * @returns {number} - Signed distance from pivot in pixels
 */

function clickEventToDistance(event, plankElement) {
    const clickX = getClickPositionRelativeToPlank(event, plankElement);
    const distance = clickPositionToDistance(clickX);
    return distance;
}

