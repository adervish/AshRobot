def on_received_string(receivedString):
    global P3
    P3 = receivedString.split(",")

    Y = 0
    Y = parse_float(P3[0])
    Y = (Y - 512)/512*127
    Y = Y

    X = 0
    X = parse_float(P3[1])
    X = (X - 512)/512*127
    X = X

    (left_speed, right_speed) = convert(X,Y )
    Rover.motor_run_dual(left_speed, right_speed)
radio.on_received_string(on_received_string)

def on_button_pressed_b():
    Rover.motor_stop_all(MotorActions.STOP)
input.on_button_pressed(Button.B, on_button_pressed_b)

P3: List[str] = []
radio.set_group(1)

def on_forever():
    pass
basic.forever(on_forever)


def convert(nJoyX, nJoyY):
    fPivYLimit = 32.0

    # TEMP VARIABLES
    nMotPremixL = 0 # Motor (left)  premixed output        (-128..+127)
    nMotPremixR = 0 # Motor (right) premixed output        (-128..+127)
    nPivSpeed = 0   # Pivot Speed                          (-128..+127)
    fPivScale = 0.0 # Balance scale b/w drive and pivot    (   0..1   )

    # Calculate Drive Turn output due to Joystick X input
    if(nJoyY>=0):
    # Forward
        nMotPremixL = 127.0 if nJoyX>=0 else 127.0 + nJoyX
        nMotPremixR = 127.0 - nJoyX if nJoyX>=0 else 127.0
    else:
    # Reverse
        nMotPremixL = 127.0 - nJoyX if nJoyX>=0 else 127.0
        nMotPremixR = 127.0 if nJoyX>=0 else 127.0 + nJoyX

    # Scale Drive output due to Joystick Y input (throttle)
    nMotPremixL = nMotPremixL * nJoyY/128.0
    nMotPremixR = nMotPremixR * nJoyY/128.0

    # Now calculate pivot amount
    #  - Strength of pivot (nPivSpeed) based on Joystick X input
    #  - Blending of pivot vs drive (fPivScale) based on Joystick Y input
    nPivSpeed = nJoyX
    fPivScale = 0.0 if abs(nJoyY)>fPivYLimit else 1.0-abs(nJoyY)/fPivYLimit

    # Calculate final mix of Drive and Pivot
    nMotMixL = (1.0-fPivScale)*nMotPremixL + fPivScale*( nPivSpeed) # Motor (left)  mixed output           (-128..+127)
    nMotMixR = (1.0-fPivScale)*nMotPremixR + fPivScale*(-nPivSpeed) # Motor (right) mixed output           (-128..+127)
    return (nMotMixL, nMotMixR)