//  basic.show_number(nJoyY)
//  TEMP VARIABLES
//  Motor (left)  premixed output        (-128..+127)
//  Motor (right) premixed output        (-128..+127)
function convert(nJoyX: number, nJoyY: number): number[] {
    
    fPivYLimit = 32
    //  Pivot Speed                          (-128..+127)
    fPivScale = 0
    //  Balance scale b/w drive and pivot    (   0..1   )
    //  Calculate Drive Turn output due to Joystick X input
    if (nJoyY >= 0) {
        nMotPremixL = nJoyX >= 0 ? 127.0 : 127.0 + nJoyX
        nMotPremixR = nJoyX >= 0 ? 127.0 - nJoyX : 127.0
    } else {
        nMotPremixL = nJoyX >= 0 ? 127.0 - nJoyX : 127.0
        nMotPremixR = nJoyX >= 0 ? 127.0 : 127.0 + nJoyX
    }
    
    //  Scale Drive output due to Joystick Y input (throttle)
    nMotPremixL = nMotPremixL * nJoyY / 128
    nMotPremixR = nMotPremixR * nJoyY / 128
    //  Now calculate pivot amount
    //  - Strength of pivot (nPivSpeed) based on Joystick X input
    //  - Blending of pivot vs drive (fPivScale) based on Joystick Y input
    nPivSpeed = nJoyX
    fPivScale = Math.abs(nJoyY) > fPivYLimit ? 0.0 : 1.0 - Math.abs(nJoyY) / fPivYLimit
    //  Calculate final mix of Drive and Pivot
    nMotMixL = (1 - fPivScale) * nMotPremixL + fPivScale * nPivSpeed
    //  Motor (left)  mixed output           (-128..+127)
    nMotMixR = (1 - fPivScale) * nMotPremixR + fPivScale * (0 - nPivSpeed)
    //  Motor (right) mixed output           (-128..+127)
    return [nMotMixL, nMotMixR]
}

radio.onReceivedString(function on_received_string(receivedString: string) {
    let myList: number[];
    
    n = receivedString.indexOf(",")
    x = parseInt(receivedString.slice(n + 1, receivedString.length)) / 1024 * 255 - 128
    y = parseInt(receivedString.slice(0, n)) / 1024 * 255 - 128
    if (Math.abs(x) < 10 && Math.abs(y) < 10) {
        Rover.MotorStopAll(MotorActions.Stop)
    } else {
        myList = convert(x, y)
        //  basic.show_number(left_speed)
        Rover.MotorRunDual(myList[0], myList[1])
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    Rover.MotorStopAll(MotorActions.Stop)
})
let y = 0
let x = 0
let nMotMixR = 0
let nMotMixL = 0
let nPivSpeed = 0
let nMotPremixL = 0
let nMotPremixR = 0
let P3 : number[] = []
let fPivYLimit = 0
let fPivScale = 0
let n = 0
radio.setGroup(1)
basic.forever(function on_forever() {
    
})
