let inCnv1 = document.getElementById("inCanvas1")
let inCnv2 = document.getElementById("inCanvas2")
let outCnv1 = document.getElementById("outCanvas1")
let outCnv2 = document.getElementById("outCanvas2")
let botCnv = document.getElementById("botCanvas")
let bl = document.getElementById("block")

let inCtx1 = inCnv1.getContext("2d")
let inCtx2 = inCnv2.getContext("2d")
let outCtx1 = outCnv1.getContext("2d")
let outCtx2 = outCnv2.getContext("2d")
let botCtx = botCnv.getContext("2d")

let ctrIdx, inL = [0, 0], inR = [0, 0], pi = Math.PI


let StkSize = 5, off = 20, dZone = .2, botSize = .45, whlSize = .12, vtrSize = .15, col = ["#009900", "#990000"], mVtrF = .75, diff = .1

window.addEventListener("resize", onResize)

function onResize() {
    inCnv2.width = inCnv2.clientWidth, inCnv2.height = inCnv2.clientHeight
    inCnv1.width = inCnv1.clientWidth, inCnv1.height = inCnv1.clientHeight
    outCnv1.width = outCnv1.clientWidth, outCnv1.height = outCnv1.clientHeight
    outCnv2.width = outCnv2.clientWidth, outCnv2.height = outCnv2.clientHeight
    botCnv.width = botCnv.clientWidth, botCnv.height = botCnv.clientHeight
    drawBase()
}
onResize()

window.addEventListener("gamepadconnected", (e) => {
    bl.style.zIndex = -10
    ctrIdx = e.gamepad.index
    getInputs()
})

function getInputs() {
    if (ctrIdx !== null) {
        const pad = navigator.getGamepads()[ctrIdx]
        if (pad) {
            inL[0] = pad.axes[0]
            inL[1] = pad.axes[1]
            inR[0] = pad.axes[2]
            inR[1] = pad.axes[3]

            if (Math.hypot(inL[0], inL[1]) < dZone) inL = [0, 0]
            if (Math.hypot(inR[0], inR[1]) < dZone) inR = [0, 0]
        }
        drawJoySticks()
        drawVectors(getOutputs())
        requestAnimationFrame(getInputs)
    }
}

function getOutputs() {
    if (inL[0] == 0 && inL[1] == 0) {
        let x = inR[0]
        return [x, -x, x, -x]
    } else {
        let x = inL[0], y = -inL[1]
        let a = Math.atan2(y, x), p = Math.hypot(x, y)

        let sin = Math.sin(a - pi/4), cos = Math.cos(a - pi/4)
        let max = Math.max(Math.abs(sin), Math.abs(cos))

        return [p*cos/max, p*sin/max, p*sin/max, p*cos/max]
    }
}

window.addEventListener("gamepaddisconnected", (e) => {
    ctrIdx = null
    bl.style.zIndex = 10
})

function drawJoySticks() {
    inCtx1.clearRect(0, 0, inCnv1.width, inCnv1.height);
    inCtx2.clearRect(0, 0, inCnv2.width, inCnv2.height);
    drawBaseJoySticks()

    inCtx1.fillStyle = "#ffffff"
    inCtx2.fillStyle = "#ffffff"

    let lX = (inL[0]+1)/2, lY = (inL[1]+1)/2, rX = (inR[0]+1)/2, rY = (inR[1]+1)/2
    let w = inCnv1.width - StkSize/2 - off*2, h = w
    let x1 = w*lX+off, y1 = h*lY+off
    let x2 = w*rX+off, y2 = h*rY+off

    inCtx1.beginPath()
    inCtx1.arc(x1, y1, StkSize*2, 0, 2*pi)
    inCtx1.fill()

    inCtx2.beginPath()
    inCtx2.arc(x2, y2, StkSize*2, 0, 2*pi)
    inCtx2.fill()
}

function drawVectors(v) {
    outCtx1.clearRect(0, 0, outCnv1.width, outCnv1.height)
    outCtx2.clearRect(0, 0, outCnv2.width, outCnv2.height)
    drawBaseMovement()

    botCtx.clearRect(0, 0, botCnv.width, botCnv.height)
    let focus = drawBaseRobot()

    let sum = [0, 0], sum2 = 0

    for (let i = -1; i < 2; i+=2) {
        for (let j = -1; j < 2; j+=2) {
            //BOT
            let idx = i+(j+3)/2
            var w = botCnv.width, h = w
            let p = v[idx]
            var x1 = focus[idx][0], y1 = focus[idx][1]
            var x2 = x1+p*w*vtrSize*i*j, y2 = y1-p*h*vtrSize

            botCtx.strokeStyle = p > 0 ? col[0] : col[1]
            if (p != 0) {
                botCtx.beginPath()
                botCtx.moveTo(x1, y1)
                botCtx.lineTo(x2, y2)
                botCtx.stroke()
            }

            //MOVEMENT
            var w = outCnv1.width, h = w
            var x1 = w/2, y1 = h/2
            var x2 = x1+p*w*vtrSize*mVtrF*i*j, y2 = y1-p*h*vtrSize*mVtrF

            sum[0] += x2-x1, sum[1] += y2-y1
            if (idx % 2 == 0) sum2 += y2-y1

            outCtx1.strokeStyle = p > 0 ? col[0] + "C0" : col[1] + "C0"
            outCtx2.strokeStyle = p > 0 ? col[0] + "C0" : col[1] + "C0"
            if (p != 0) {
                outCtx1.beginPath()
                outCtx1.moveTo(x1, y1)
                outCtx1.lineTo(x2, y2)
                outCtx1.stroke()
                
                var x2 = idx % 2 == 0 ? x1-diff*w : x1+diff*w
                outCtx2.beginPath()
                outCtx2.moveTo(x2, y1)
                outCtx2.lineTo(x2, y2)
                outCtx2.stroke()
            }
        }
    }
    //MOVEMENT
    var w = outCnv1.width, h = w
    var x1 = w/2, y1 = h/2
    var x2 = sum[0]+x1, y2 = sum[1]+y1
    outCtx1.strokeStyle = "#ffc208"
    if (sum[0] != 0 || sum[1] != 0) {
        outCtx1.beginPath()
        outCtx1.moveTo(x1, y1)
        outCtx1.lineTo(x2, y2)
        outCtx1.stroke()
    }

    let rot = sum[1]-2*sum2
    let d = 2*diff*w
    outCtx2.strokeStyle = "#ffc208"
    if (rot != 0) {
        outCtx2.beginPath()
        outCtx2.moveTo(x1+d, y1)
        outCtx2.lineTo(x1+d, y1+rot)
        outCtx2.moveTo(x1-d, y1)
        outCtx2.lineTo(x1-d, y1-rot)
        outCtx2.stroke()
    }
}

function drawBase() {
    drawBaseJoySticks()
    drawJoySticks()
    drawBaseMovement()
    drawBaseRobot()
}

function drawBaseJoySticks() {
    let list = [inCtx1, inCtx2]
    list.forEach((ctx) => {
        ctx.strokeStyle = "#ffffff7f"
        ctx.lineWidth = StkSize

        ctx.beginPath()
        ctx.arc(inCnv1.width/2-StkSize/4, inCnv1.height/2-StkSize/2, inCnv1.width/2-StkSize, 0, 2*pi)
        ctx.stroke()
    })
}

function drawBaseMovement() {
    let list = [outCtx1, outCtx2]
    let w = outCnv1.width, h = w

    list.forEach((ctx) => {
        ctx.strokeStyle = "#ffffff7f"
        ctx.lineWidth = StkSize
        ctx.lineCap = "round"

        ctx.beginPath()
        ctx.moveTo(w/2, off)
        ctx.lineTo(w/2, h-off)
        ctx.moveTo(off, h/2)
        ctx.lineTo(w-off, h/2)
        ctx.stroke()
    })
}

function drawBaseRobot() {
    botCtx.strokeStyle = "#ffffff7f"
    botCtx.lineWidth = StkSize
    let w = botCnv.width, h = w
    let p = (1-botSize)/2

    botCtx.beginPath()
    botCtx.rect(w*p, h*p, w*botSize, h*botSize)
    botCtx.stroke()

    botCtx.strokeStyle = "#ffffff"
    botCtx.lineCap = "round"

    let focus = []
    botCtx.beginPath()
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            let x1 = w*p+w*botSize*j, y1 = h*p+h*botSize*i
            let x2 = w*whlSize+w*(1-whlSize*2)*j, y2 = h*whlSize+h*(1-whlSize*2)*i
            botCtx.moveTo(x1, y1)
            botCtx.lineTo(x2, y2)
            focus[2*i+j] = [(x1+x2)/2, (y1+y2)/2]
        }
    }
    botCtx.stroke()
    return focus
}

drawBase()