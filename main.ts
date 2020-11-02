// TEMP VARIABLES
// Motor (left)  premixed output        (-128..+127)
// Motor (right) premixed output        (-128..+127)
function convert (nJoyX: number, nJoyY: number) {
    fPivYLimit = 32
    // Pivot Speed                          (-128..+127)
    fPivScale = 0
    // Balance scale b/w drive and pivot    (   0..1   )
    // Calculate Drive Turn output due to Joystick X input
    if (nJoyY >= 0) {
        nMotPremixL = nJoyX >= 0 ? 127.0 : 127.0 + nJoyX
nMotPremixR = nJoyX >= 0 ? 127.0 - nJoyX : 127.0
    } else {
        nMotPremixL = nJoyX >= 0 ? 127.0 - nJoyX : 127.0
nMotPremixR = nJoyX >= 0 ? 127.0 : 127.0 + nJoyX
    }
    // Scale Drive output due to Joystick Y input (throttle)
    nMotPremixL = nMotPremixL * nJoyY / 128
    nMotPremixR = nMotPremixR * nJoyY / 128
    // Now calculate pivot amount
    // - Strength of pivot (nPivSpeed) based on Joystick X input
    // - Blending of pivot vs drive (fPivScale) based on Joystick Y input
    nPivSpeed = nJoyX
    fPivScale = Math.abs(nJoyY) > fPivYLimit ? 0.0 : 1.0 - Math.abs(nJoyY) / fPivYLimit
// Calculate final mix of Drive and Pivot
    nMotMixL = (1 - fPivScale) * nMotPremixL + fPivScale * nPivSpeed
    // Motor (left)  mixed output           (-128..+127)
    nMotMixR = (1 - fPivScale) * nMotPremixR + fPivScale * (0 - nPivSpeed)
    // Motor (right) mixed output           (-128..+127)
    return [nMotMixL, nMotMixR]
}
radio.onReceivedString(function (receivedString) {
    n = receivedString.indexOf(",")
    let ys = receivedString.slice(0, n)
let xs = receivedString.slice(n + 1, receivedString.length)
x = parseInt(xs) / 1024 * 255 - 128
    y = parseInt(ys) / 1024 * 255 - 128
    if (x < 10 && y < 10) {
        Rover.MotorStopAll(MotorActions.Stop)
    } else {
        let right_speed = 0
        let left_speed = 0
        let [left_speed, right_speed] = convert(x, y)
// basic.show_number(left_speed)
        Rover.MotorRunDual(left_speed, right_speed)
    }
})
input.onButtonPressed(Button.B, function () {
    Rover.MotorStopAll(MotorActions.Stop)
})
let n = 0
let nMotMixR = 0
let nMotMixL = 0
let nPivSpeed = 0
let fPivScale = 0
let fPivYLimit = 0
let P3: number[] = []
let nMotPremixR = 0
let nMotPremixL = 0
let y = 0
let x = 0
radio.setGroup(1)
basic.forever(function () {
	
})
