radio.onReceivedString(function on_received_string(receivedString: string) {
    let n = receivedString.indexOf(",")
    let x = 0
    let y = 0
    let ys = receivedString.slice(0, n)
    let xs = receivedString.slice(n + 1, receivedString.length)
    x = parseInt(xs) / 1024 * 255 - 128
    y = parseInt(ys) / 1024 * 255 - 128
    if (Math.abs(x) < 10 && Math.abs(y) < 10) {
        Rover.MotorStopAll(MotorActions.Stop)
    } else {
        let [left_speed, right_speed] = convert(x, y)
        // basic.show_number(left_speed)
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
    // basic.show_number(nJoyY)
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

