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

// This is the state of the seesaw.
let state = {
    // Array of objects dropped onto the seesaw.
    objects: [],

    // Current angle of the seesaw.
    angle: 0,
}

/**
 * For each object, I need a unique id.
 * @returns {number}
 */
function generateObjectID() {
    return 'obj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Creates a new object and adds it to the state.
 * @param {number} weight - Weight of the object in kg.
 * @param {number} distance - Distance from the pivot in pixels
 * @returns {Object} - New object
 */
function createObject(weight, distance) {
    const newObject = {
        id: generateObjectID(),
        weight: weight,
        distance: distance
    };
    state.objects.push(newObject);
    return newObject;
}


/**
 * Saves the current state to local storage.
 */
function saveState() {
    try {
        localStorage.setItem('seesawState', JSON.stringify(state));
        console.log('State saved to local storage');
    } catch (error) {
        console.error('Error saving state:', error);
    }
}

/**
 * Loads the state from local storage.
 * @returns {boolean} -if loaded -> true, if not -> false
 */
function loadState() {
    try {
        const savedState = localStorage.getItem('seesawState');
        if (savedState) {
            state = JSON.parse(savedState);
            console.log('State loaded from local storage', state);
            return true;
        } 
    } catch (error) {
        console.error('Error loading state:', error);
    }
    return false;
}

/**
 * Resets the state to initial values.
 */
function resetState() {
    state = {
        objects: [],
        angle: 0
    };
    saveState();
    console.log('State reset done, clear for usage');
}


/**
 * Generates a random weight between minimum and maximum weight.
 * @returns {number} 
 */
function generateRandomWeight() {
    return Math.floor(Math.random() * (MAX_WEIGHT - MIN_WEIGHT + 1) + MIN_WEIGHT);
}

/**
 * Handles click event on the plank.
 * @param {MouseEvent} event
 */
function handlePlankClick(event) {
    // Get the plank
    const plankElement = document.getElementById('plank');

    if (!plankElement) {
        console.error('Plank element not found');
        return;
    }

    // Get click position relative to plank
    const clickX = getClickPositionRelativeToPlank(event, plankElement);

    // Clicks that are only inside the plank boundaries should be processed.
    if (clickX < 0 || clickX > PLANK_LENGTH) {
        console.log('Click is outside the plank boundaries, try again', {
            clickPosition: clickX.toFixed(1) + ' px',
            validRange: '0 to ' + PLANK_LENGTH + ' px',
        });
        return;
        
    }

    // Calculate distance from pivot
    const distance = clickPositionToDistance(clickX);

    // Generate random weight
    const weight = generateRandomWeight();

    // Create the new object and add it to the state
    const newObject = createObject(weight, distance);

    console.log('New object created:', {
        id: newObject.id,
        weight: weight + ' kg',
        distance: distance + ' px',
        side: distance < 0 ? 'left' : 'right'
    });

    // Render the new object
    renderObject(newObject);

    // Calculate new balance and angle
    calculateSeesawBalance();

    // Save the state to local storage
    saveState();
}

/**
 * Initialize the click listener on the plank.
 */
function initializeClickListener() {
    const plankElement = document.getElementById('plank');

    if (!plankElement) {
        console.error('Plank element not found');
        return;
    }

    // Attach click event listener to the plank

    plankElement.addEventListener('click', handlePlankClick);

    console.log('Click listener initialized, please click on the plank');
}

window.addEventListener('DOMContentLoaded', function() {
    const loaded = loadState();
    if (!loaded) {
        console.log('No saved state found to load, starting fresh');
    }

    initializeClickListener();
})

/**
 * Calculates the torques for a single object.
 * @param {Object} object
 * @returns {number}
 */
function calculateObjectTorque(object) {
    return object.weight * object.distance;
}

/**
 * Calculates the net torque and updates the seesaw angle.
 */
function calculateSeesawBalance() {
    // Initialize torque sums
    let leftTorque = 0;
    let rightTorque = 0; 
    let leftObjectsCount = 0; // Number of objects on the left side
    let rightObjectsCount = 0; // Number of objects on the right side
    let totalObjectsCount = 0; // Total number of objects
    let leftTotalWeight = 0; // Sum of all weights on the left side
    let rightTotalWeight = 0; // Sum of weights on the right side 
    let totalWeight = 0; // Sum of all weights 

    // Loop through all objects and calculate torques
    for (let i=0; i < state.objects.length; i++) {
        const object = state.objects[i];
        const torque = calculateObjectTorque(object);

        // Separate left and right torques
        if (object.distance < 0) {
            // Object is on the left side (negative distance)
            leftTorque += Math.abs(torque);
            leftObjectsCount++;
            leftTotalWeight += object.weight;
        } else if (object.distance > 0) {
            // Object is on the right side (positive distance)
            rightTorque += torque;
            rightObjectsCount++;
            rightTotalWeight += object.weight;
        }
        totalObjectsCount = leftObjectsCount + rightObjectsCount;
        totalWeight = leftTotalWeight + rightTotalWeight;
    }

    // Calculate angle with the formula
    const rawAngle = (rightTorque - leftTorque) / TORQUE_SCALE;

    // We have an angle between -30 to +30 degrees, so we need to clamp it.
    const angle = Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, rawAngle));

    // Update the state with the new angle
    state.angle = angle;

    // Update the weight totals display
    updateWeightTotals(leftTotalWeight, rightTotalWeight, leftObjectsCount, rightObjectsCount);

    console.log('Balance calculated:', {
        leftTorque: leftTorque.toFixed(2),
        rightTorque: rightTorque.toFixed(2),
        netTorque: (rightTorque - leftTorque).toFixed(2),
        angle: angle.toFixed(2) + ' degrees',
        objectCount: state.objects.length,
        leftObjectsCount: leftObjectsCount,
        rightObjectsCount: rightObjectsCount,
        totalObjectsCount: totalObjectsCount,
        leftTotalWeight: leftTotalWeight.toFixed(2) + ' kg',
        rightTotalWeight: rightTotalWeight.toFixed(2) + ' kg',
        totalWeight: totalWeight.toFixed(2) + ' kg'
    });

    // Update the visual rotation of the plank
    updatePlankRotation();

    return angle;
}

/**
 * Updates the plank's rotation to match the current angle.
 */
function updatePlankRotation() {
    const plankElement = document.getElementById('plank');

    if (!plankElement) {
        console.error('Plank element not found - cannot update rotation');
        return;
    }

    plankElement.style.transform = `rotate(${state.angle}deg)`;

    updateAngleDisplay(state.angle);

    console.log('Plank rotation updated to:', state.angle.toFixed(2) + ' degrees');
}

/**
 * Updates the weight totals display in the UI.
 * @param {number} leftWeight
 * @param {number} rightWeight
 * @param {number} leftCount
 * @param {number} rightCount
 */
function updateWeightTotals(leftWeight, rightWeight, leftCount, rightCount) {
    const leftWeightElement = document.getElementById('left-weight');
    const rightWeightElement = document.getElementById('right-weight');
    const leftCountElement = document.getElementById('left-count');
    const rightCountElement = document.getElementById('right-count');

    if (!leftWeightElement || !rightWeightElement || !leftCountElement || !rightCountElement) {
        console.error('Weight display elements not found - cannot update totals');
        return;
    }

    leftWeightElement.textContent = leftWeight.toFixed(1);
    rightWeightElement.textContent = rightWeight.toFixed(1);

    leftCountElement.textContent = leftCount;
    rightCountElement.textContent = rightCount;

    console.log('Weight totals updated:', {
        left: leftWeight.toFixed(1) + ' kg (' + leftCount + ' objects)',
        right: rightWeight.toFixed(1) + ' kg (' + rightCount + ' objects)'
    });
}

/**
 * Updates the angle display in the UI.
 * @param {number} angle
 */
function updateAngleDisplay(angle) {
    const angleElement = document.getElementById('angle-display');

    if (!angleElement) {
        console.error('Angle display element not found - cannot update');
        return;
    }

    angleElement.textContent = angle.toFixed(1) + '°';

    if (angle > 0) {
        angleElement.style.color = '#28A745';
    } else if (angle < 0) {
        angleElement.style.color = '#DC3545';
    } else {
        angleElement.style.color = '#007BFF';
    }

    console.log('Angle display updated to:', angle.toFixed(1) + '°');
}

/**
 * Creates a DOM element for an object and adds it to the plank.
 * @param {Object} object
 */
function renderObject(object) {
    const plankElement = document.getElementById('plank');

    if (!plankElement) {
        console.error('Plank element not found - cannot render object');
        return;
    }

    // Create the object element
    const objectElement = document.createElement('div');
    objectElement.className = 'object';
    objectElement.id = object.id;

    // Set the weight label
    objectElement.textContent = object.weight + ' kg';

    // Position the object on the plank relative to the left edge
    const positionFromLeft = PIVOT_POSITION + object.distance;

    const objectWidth = 30;
    objectElement.style.left = (positionFromLeft - objectWidth / 2) + 'px';

    const objectHeight = 30;
    const plankHeight = 20;
    objectElement.style.top = ((plankHeight - objectHeight) / 2) + 'px';

    plankElement.appendChild(objectElement);

    console.log('Object rendered', {
        id: object.id,
        weight: object.weight + ' kg',
        distance: object.distance + ' px',
        positionFromLeft: positionFromLeft + ' px'
    });
}

/**
 * Renders all objects from state for restoring after page reload
 */
function renderAllObjects() {
    const plankElement = document.getElementById('plank');

    if (!plankElement) {
        console.error('Plank element not found - cannot render objects');
        return;
    }

    // Clear existing objects
    const existingObjects = plankElement.querySelectorAll('.object');
    existingObjects.forEach(obj => obj.remove());

    // Render each object in state
    for (let i=0; i < state.objects.length; i++) {
        renderObject(state.objects[i]);
    }

    console.log('All objects rendered:', state.objects.length);
}

/**
 * Removes a rendered object from the DOM.
 * @param {string} objectId
 */
function removeRenderedObject(objectId) {
    const objectElement = document.getElementById(objectId);
    if (!objectElement) {
        objectElement.remove();
        console.log('Object removed from DOM:', objectId);
    }
}

function updateAllDisplays() {
    calculateSeesawBalance();
}

/**
 * Resets the seesaw simulation to initial state.
 * Objects are removed, angle is reset to 0.
 * Saves the reset state.
 */
function resetSimulation() {
    const plankElement = document.getElementById('plank');
    if (plankElement) {
        const existingObjects = plankElement.querySelectorAll('.object');
        existingObjects.forEach(obj => obj.remove());
    }

    resetState();

    updateAllDisplays();

    console.log('Simulation reset done, ready for new session');
}

/**
 * Initializes the reset button.
 */
function initializeResetButton(){
    const resetButton = document.getElementById('reset_button');

    if (!resetButton) {
        console.error('Reset button not found - cannot initialize');
        return;
    }

    resetButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the seesaw? All objects will be removed.')) {
            resetSimulation();
        }
    });

    console.log('Reset button initialized, click to reset');
}

window.addEventListener('DOMContentLoaded', function() {
    const loaded = loadState();
    if (!loaded) {
        console.log('No saved state found to load, starting fresh');
    } else {
        renderAllObjects();
        updateAllDisplays();
    }

    updateAngleDisplay(state.angle);

    initializeClickListener();
    initializeResetButton();
})