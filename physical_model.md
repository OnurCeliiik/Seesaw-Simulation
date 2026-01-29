## Physics Model Explanation

1. Each object has:
    - weight in kg
    - distance from pivot in pixels
    - sign: negative => left, positive => right

2. Torque calculation:
    torque = weight x distance (vector multiplication)

3. Net torque determines angle:
    - Sum all torques on the right side
    - Sum all torques on the left side
    - angle = clamp((rightTorque - leftTorque) / TORQUE_SCALE, MIN_ANGLE, MAX_ANGLE)
