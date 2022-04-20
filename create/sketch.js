let capture;
let poseNet;
let waterH = 0;
let poem = [
    "skin moistens, hair dampens,", 
    "wet trails down skin, down street, down dirt, into mud",
    "erodes rock, craves destined paths",
    "leaks spring, splatters spoil",
    "pooling, collecting, flooding",
    "a wave rises, cresting, crashing",
    "overwhelming, spilling destruction",
    "quenching thirsts, hydrating souls",
    "drowning lungs, gasping cries",
    "life-giving and life-taking"
];

function setup() {
    let myCanvas = createCanvas(600, 400);
    myCanvas.parent('myContainer');
    capture = createCapture(VIDEO);
    capture.hide();

    // Create a new poseNet method
    //console.log(ml5);
    poseNet = ml5.poseNet(capture, modelLoaded);
    poseNet.on('pose', gotPoses);

    noStroke();
    // Set text characteristics
    textSize(20);
    textStyle(BOLD);
}

// When the model is loaded
function modelLoaded() {
    console.log('Model Loaded!');
}

function gotPoses(poses) {
    //console.log('got poses!');
    //console.log(poses);
    if (poses.length > 0) {
        let newY = poses[0].pose.keypoints[0].position.y;
        // https://p5js.org/reference/#/p5/lerp
        waterH = lerp(waterH,newY,0.125)
        //console.log('Water height = '+waterH);
    }
}

function draw() {
    // flip the video
    // https://p5js.org/reference/#/p5/push
    push();
    // https://p5js.org/reference/#/p5/translate
    translate(capture.width,0);
    scale(-1.0,1.0); 
    image(capture,0,0);
    //image(capture, 0, 0, width, width * capture.height / capture.width);
    pop();
    filter(GRAY);

    // draw water
    fill(0,0,255, 50);
    // https://p5js.org/reference/#/p5/rect
    rect(0, waterH, width, height-waterH);

    // draw poem
    fill(0,255,128);
    // https://p5js.org/reference/#/p5/textAlign
    textAlign(LEFT, TOP);
    let index = round(map(waterH, 0, height, 9, 0));
    text(poem[index], 0, waterH);
    textAlign(RIGHT, BOTTOM);
    text('with each drop...', width, height);
}