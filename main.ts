radio.onReceivedString(function on_received_string(receivedString: string) {
    let [a, b] = _py.py_string_split(receivedString, ",")
    // x = int(receivedString[0:1]) * 25 - 127
    // y = int(receivedString[1:2]) * 25 - 127
    // z = int(receivedString[2:3]) * 25 - 127
    let x = parseInt(a)
    let y = parseInt(b)
    basic.showNumber(x)
    if (x < 2 && y < 2) {
        Rover.MotorStopAll(MotorActions.Stop)
    } else {
        let [left_speed, right_speed] = convert(x, y)
        Rover.MotorRunDual(left_speed, right_speed)
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    Rover.MotorStopAll(MotorActions.Stop)
})
let P3 : string[] = []
radio.setGroup(1)
basic.forever(function on_forever() {
    
})
function convert(nJoyX: number, nJoyY: number) {
    let fPivYLimit = 32.0
    //  TEMP VARIABLES
    let nMotPremixL = 0
    //  Motor (left)  premixed output        (-128..+127)
    let nMotPremixR = 0
    //  Motor (right) premixed output        (-128..+127)
    let nPivSpeed = 0
    //  Pivot Speed                          (-128..+127)
    let fPivScale = 0.0
    //  Balance scale b/w drive and pivot    (   0..1   )
    //  Calculate Drive Turn output due to Joystick X input
    if (nJoyY >= 0) {
        //  Forward
        nMotPremixL = nJoyX >= 0 ? 127.0 : 127.0 + nJoyX
        nMotPremixR = nJoyX >= 0 ? 127.0 - nJoyX : 127.0
    } else {
        //  Reverse
        nMotPremixL = nJoyX >= 0 ? 127.0 - nJoyX : 127.0
        nMotPremixR = nJoyX >= 0 ? 127.0 : 127.0 + nJoyX
    }
    
    //  Scale Drive output due to Joystick Y input (throttle)
    nMotPremixL = nMotPremixL * nJoyY / 128.0
    nMotPremixR = nMotPremixR * nJoyY / 128.0
    //  Now calculate pivot amount
    //   - Strength of pivot (nPivSpeed) based on Joystick X input
    //   - Blending of pivot vs drive (fPivScale) based on Joystick Y input
    nPivSpeed = nJoyX
    fPivScale = Math.abs(nJoyY) > fPivYLimit ? 0.0 : 1.0 - Math.abs(nJoyY) / fPivYLimit
    //  Calculate final mix of Drive and Pivot
    let nMotMixL = (1.0 - fPivScale) * nMotPremixL + fPivScale * nPivSpeed
    //  Motor (left)  mixed output           (-128..+127)
    let nMotMixR = (1.0 - fPivScale) * nMotPremixR + fPivScale * -nPivSpeed
    //  Motor (right) mixed output           (-128..+127)
    return [nMotMixL, nMotMixR]
}

