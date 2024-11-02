let inCnv1 = document.getElementById("inCanvas1")
inCnv1.width = inCnv1.clientWidth, inCnv1.height = inCnv1.clientHeight
let inCnv2 = document.getElementById("inCanvas2")
inCnv2.width = inCnv2.clientWidth, inCnv2.height = inCnv2.clientHeight

let inCtx1 = inCnv1.getContext("2d")
let inCtx2 = inCnv2.getContext("2d")

let ctrIdx, InLeft = [0, 0], InRight = [0, 0], pi = Math.PI


let StrokeSize = 5, JoyOffset = 20

window.addEventListener("gamepadconnected", (e) => {
    ctrIdx = e.gamepad.index
    getInputs()
})

function getInputs() {
    if (ctrIdx !== null) {
        const pad = navigator.getGamepads()[ctrIdx]
        if (pad) {
            InLeft[0] = pad.axes[0]
            InLeft[1] = pad.axes[1]
            InRight[0] = pad.axes[2]
            InRight[1] = pad.axes[3]
        }
        drawJoySticks()
        requestAnimationFrame(getInputs)
    }
}

window.addEventListener("gamepaddisconnected", (e) => {
    ctrIdx = null
    //STOP THE SITE
})

function drawJoySticks() {
    inCtx1.clearRect(0, 0, inCnv1.width, inCnv1.height);
    inCtx2.clearRect(0, 0, inCnv2.width, inCnv2.height);
    drawBaseJoySticks()

    inCtx1.fillStyle = "#ffffff"
    inCtx2.fillStyle = "#ffffff"

    let lX = (InLeft[0]+1)/2, lY = (InLeft[1]+1)/2, rX = (InRight[0]+1)/2, rY = (InRight[1]+1)/2
    let w = inCnv1.width - StrokeSize/2 - JoyOffset*2
    inCtx1.beginPath()
    inCtx1.arc(w*lX+JoyOffset, w*lY+JoyOffset, StrokeSize*2, 0, 2*pi)
    inCtx1.fill()

    inCtx2.beginPath()
    inCtx2.arc(w*rX+JoyOffset, w*rY+JoyOffset, StrokeSize*2, 0, 2*pi)
    inCtx2.fill()
}

function drawBase() {
    drawBaseJoySticks()
    drawJoySticks()
}

function drawBaseJoySticks() {

    inCtx1.strokeStyle = "#ffffff7f"
    inCtx1.lineWidth = StrokeSize
    inCtx2.strokeStyle = "#ffffff7f"
    inCtx2.lineWidth = StrokeSize

    inCtx1.beginPath()
    inCtx1.arc(inCnv1.width/2-StrokeSize/4, inCnv1.height/2-StrokeSize/2, inCnv1.width/2-StrokeSize, 0, 2*pi)
    inCtx1.stroke()

    inCtx2.beginPath()
    inCtx2.arc(inCnv1.width/2-StrokeSize/4, inCnv1.height/2-StrokeSize/2, inCnv1.width/2-StrokeSize, 0, 2*pi)
    inCtx2.stroke()
}

drawBase()