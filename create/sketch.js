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
let osc, freq, amp;
let fft, noiseGen, audioFilter;
let vLevel;
let waveY = 0;
let poseX = 0;

function setup() {
    let myCanvas = createCanvas(600, 400);
    myCanvas.parent('myContainer');
    capture = createCapture(VIDEO);
    capture.hide();

    // Create a new poseNet method
    //console.log(ml5);
    poseNet = ml5.poseNet(capture, modelLoaded);
    poseNet.on('pose', gotPoses);

    //set up sound
    audioFilter = new p5.BandPass();  // surf
    // give the filter a narrow band (lower res = wider bandpass)
    audioFilter.res(50);
    noiseGen = new p5.Noise('brown');
    noiseGen.disconnect();
    noiseGen.connect(audioFilter);
    noiseGen.start();
    fft = new p5.FFT();

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
        poseX = poses[0].pose.keypoints[0].position.x;
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

    // mod the sound
    freq = constrain(map(poseX, 0, width, 220, 660), 220, 660);
    // set the LowPass cutoff frequency
    //xoff = xoff + 0.01;
    //let freq = noise(xoff) * 880;  // wind
    //let freq = noise(xoff) * 220;  // surf;
    audioFilter.freq(freq);

    vLevel = map(waterH, 0, height, 0.1, 1.0);
    outputVolume(1-vLevel);
    // inverted the origin is at the top

    // draw water
    fill(0,0,255, 50);
    drawWaveForm(waterH);

    // draw poem
    fill(0,255,128);
    // https://p5js.org/reference/#/p5/textAlign
    textAlign(LEFT, TOP);
    let index = round(map(waterH, 0, height, 9, 0));
    text(poem[index], 0, waterH);
    textAlign(RIGHT, BOTTOM);
    text('with each drop...', width, height);
}

// draw the waveform
function drawWaveForm(ym) {
    let yc = constrain(ym, 20, height-20);
    let spectrum = fft.waveform();
    beginShape();
    fill(0,0,255, 50);
    // draw the bottom right &  bottom right vertices
    vertex(width, height);
    vertex(0, height);
    for(let i = 0; i < spectrum.length; i++){
        let x = map(i, 0, spectrum.length, 0, width);
        let reading = spectrum[i] * 25;
        //let y = map(spectrum[i], -1, 1, yc, yc/1.25);
        waveY = lerp(waveY, map(reading, -1, 1, yc, yc/1.25), 0.125);
        vertex(x,waveY);
    }
    endShape();  
}