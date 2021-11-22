let capture;

function setup() {
    let myCanvas = createCanvas(600, 400);
    myCanvas.parent('myContainer');
    capture = createCapture(VIDEO);
    capture.hide();
}

function draw() {
    image(capture, 0, 0, width, width * capture.height / capture.width);
    //filter(INVERT);
}