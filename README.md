# Seesaw-Simulation

- This is a project written in pure JavaScript, HTML and CSS, and it is created for visualizing a seesaw simulation where objects with random-weight are dropped by clicking directly on the seesaw.

- I will be building this project in stages, continuing stage by stage and committing every addition and change I made along the way. 
- I will be adding the additions I made to the project to the README.md file aswell.

### Stage 1
- I defined the constants for the seesaw:
    - Plank length is 400 pixels
    - Pivot position is at the center -> 200 pixels from left
    - Max rotation is between -30 to +30 degrees
    - Weight range is 1-10 kg. Minimum and maximum values are stored as constants.
- I set the physics rules:
    - Torques = weight x distance from pivot (vector multiplication)
    - Distance is signed: left side is negative, right side is positive.
    - Angle = (right torque - left torque) / 10, clamped to -+ 30 degrees
- I created a basic HTML file, created an empty CSS file (will be completed later).
- I created the js file and decleared the constants, checked for their logs.

### Stage 2
- I defined the coordinate system:
    - Left edge of plank is 0 pixels
    - Center is 200 pixels
    - Right edge is 400 pixels.
- I created helper functions:
    - clickPositionToDistance(): converts a click position (0-400px) to a signed distance from the pivot.
    - getClickPositionRelativeToPlank(): gets where the user clicked relative to plank.
    - clickEventToDistance(): combines both to convert a click event to a distance from the pivot. 


### Stage 3
- I created the DOM structure for the seesaw:
    - Added a plank element for horizontal board representation
    - Added a pivot element that shows the center visually
    - Objects will be placed inside the plank element so they rotate with it.
- I styled the basic elements:
    - Plank: 400px wide, 20px tall, brown color, centered on the page
    - Pivot: Triangle shape, positioned below the plank at the center

### Stage 4
- I added CSS properties for rotation and animation:
    - Set transform-origin to center so the plank rotates around its center point
    - Plank starts horizontally
- I prepared styling for dropped objects:
    - Created .object class for objects that will be placed on the plank
    - Objects will have the same color, blue with weight labels displayed on them.(may change the colors later - probably will add a range: 1-4 blue, 4- 7 red etc.)

### Stage 5
- I created a global state object.
    - In  this object, I will keep an array of objects placed on the seesaw, and the current angle of the state.
- I created helper function:
    - generateObjectID() -> generates a unique id for each object
    - createObject(weight, distance) -> creates a new object with id, weight and distance from the pivot, and adds the new object to the state.objects
    - saveState() -> saves the current state to local storage.
    - loadState() -> loads the state from local storage.
    - resetState() -> resets the state to it's initial values.

### Stage 6
- I started working on the user interaction.
- When the user clicks on the plank:
    - We will calculate the distance from the pivot.
    - we will control to make sure the click is inside the boundaries of the plank. (when testing I got -200.5px, added check to make sure this does not happen)
    - We will generate a random weight.
    - We will create the new object with it's properties, add it to the state and save the state.

### Stage 7
- I started working on the torque and angle calculations.
    - Using a loop, I calculated the torque of every object, stored them in variables according to their distance from the pivot. 
    - Then, using the formula I calculated the raw angle and clamped it according to the min and max angles.
    - Apart from the torque values for the angle calculation, I decided to keep other data for further use:
        - left object count -> number of objects on the left side
        - right object count -> number of objects on the right side
        - total object count -> total number of objects
        - left weight count -> sum of all weights on the left side
        - right weight count -> sum of all weights on the right side
        - total weight count -> sum of all weights

### Stage 8
- I added updatePlankRotation() function to rotate the plank.
- Now, when we add an object to the plank, the plank will rotate according to the angle.
