# basic.show_number(nJoyY)
# TEMP VARIABLES
# Motor (left)  premixed output        (-128..+127)
# Motor (right) premixed output        (-128..+127)
def convert(nJoyX: number, nJoyY: number):
    global fPivYLimit, fPivScale, nMotPremixL, nMotPremixR, nPivSpeed, nMotMixL, nMotMixR
    fPivYLimit = 32
    # Pivot Speed                          (-128..+127)
    fPivScale = 0
    # Balance scale b/w drive and pivot    (   0..1   )
    # Calculate Drive Turn output due to Joystick X input
    if nJoyY >= 0:
        nMotPremixL = 127.0 if nJoyX >= 0 else 127.0 + nJoyX
        nMotPremixR = 127.0 - nJoyX if nJoyX >= 0 else 127.0
    else:
        nMotPremixL = 127.0 - nJoyX if nJoyX >= 0 else 127.0
        nMotPremixR = 127.0 if nJoyX >= 0 else 127.0 + nJoyX
    # Scale Drive output due to Joystick Y input (throttle)
    nMotPremixL = nMotPremixL * nJoyY / 128
    nMotPremixR = nMotPremixR * nJoyY / 128
    # Now calculate pivot amount
    # - Strength of pivot (nPivSpeed) based on Joystick X input
    # - Blending of pivot vs drive (fPivScale) based on Joystick Y input
    nPivSpeed = nJoyX
    fPivScale = 0.0 if abs(nJoyY) > fPivYLimit else 1.0 - abs(nJoyY) / fPivYLimit
    # Calculate final mix of Drive and Pivot
    nMotMixL = (1 - fPivScale) * nMotPremixL + fPivScale * nPivSpeed
    # Motor (left)  mixed output           (-128..+127)
    nMotMixR = (1 - fPivScale) * nMotPremixR + fPivScale * (0 - nPivSpeed)
    # Motor (right) mixed output           (-128..+127)
    return [nMotMixL, nMotMixR]

def on_received_string(receivedString):
    global n, x, y
    n = receivedString.index_of(",")
    x = int(receivedString.slice(n + 1, len(receivedString))) / 1024 * 255 - 128
    y = int(receivedString.slice(0, n)) / 1024 * 255 - 128
    if abs(x) < 10 and abs(y) < 10:
        Rover.motor_stop_all(MotorActions.STOP)
    else:
        myList = convert(x, y)
        # basic.show_number(left_speed)
        Rover.motor_run_dual(myList[0], myList[1])
radio.on_received_string(on_received_string)

def on_button_pressed_b():
    Rover.motor_stop_all(MotorActions.STOP)
input.on_button_pressed(Button.B, on_button_pressed_b)

y = 0
x = 0
nMotMixR = 0
nMotMixL = 0
nPivSpeed = 0
nMotPremixL = 0
nMotPremixR = 0
P3: List[number] = []
fPivYLimit = 0
fPivScale = 0
n = 0
radio.set_group(1)

def on_forever():
    pass
basic.forever(on_forever)
