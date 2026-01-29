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
    