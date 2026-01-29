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


console.log("Seesaw Simulation - Constants Loaded");
console.log("Plank Length:", PLANK_LENGTH, "px");
console.log("Pivot POSITION:", PIVOT_POSITION, "px");
console.log("Max angle:", MAX_ANGLE, "degrees");