let video;
let videoPath = 'assets/newVid1hHD.mp4'; //960 × 540

let poseNet;
let pose;
let skeleton;
let poseNetOptions = {
  flipHorizontal: shouldUseLiveVideo,
  //scoreThreshold: 0.6, // defaults 0.5
  detectionType: 'single',
};
let nn;
let poseLabel = "unknown";

function preload(){
  //console.log("preloading...");
  // create a neural network
  let options = {
    inputs: 34,
    ouputs: 4,
    task: 'classification',
    debug: true // determines whether or not to show the training visualization
  }
  nn = ml5.neuralNetwork(options);
  // poem = loadStrings('poem.txt');
  // mySound = loadSound('assets/audio/rainsound.mp3');
  //console.log("preloading done!");
}
  
function setup() {
  console.log("setting up...");
  // set canvas size and framerate to match video
  createCanvas(960, 540);
  frameRate(30);
  noCursor();
  checkbox = createCheckbox('draw skeleton', false);
  checkbox.changed(myCheckedEvent);

  if (shouldUseLiveVideo == true) {
    video = createCapture(VIDEO);
  } else {
    video = createVideo(videoPath, vidCanPlay);
  }
  video.hide();

  // Create a new poseNet object
  //console.log(ml5);
  // https://learn.ml5js.org/#/reference/posenet
  poseNet = ml5.poseNet(video, poseNetOptions, onPoseNetLoaded);
  poseNet.on("pose", onPoses);

  console.log("loading pre-trained model...");
  let modelDetails = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin'
  }
  nn.load(modelDetails, modelLoadedCallback);
  //nn.load('model/model.json', modelLoaded);
}

// This function is called when the video loads
function vidCanPlay() {
  console.log("Video can play");
  video.volume(0);
  video.loop();
}

// invoked when the model is loaded
function onPoseNetLoaded() {
  console.log("PoseNet Loaded!");
}

function modelLoadedCallback() {
  console.log('pre-trained model loaded!');
  // continue on your neural network journey
  // use nn.classify() for classifications or nn.predict() for regressions
  classifyPose();
}

// invoked when poses are detected
function onPoses(poses) {
  //console.log('got poses!');
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function draw() {
  if (poseNetOptions.flipHorizontal == true) {
    // flip the video
    // https://p5js.org/reference/#/p5/push
    push();
    // https://p5js.org/reference/#/p5/translate
    translate(video.width,0);
    scale(-1.0,1.0); 
    image(video,0,0);
    pop();
  } else {
    image(video,0,0);
  }
  if (pose) {
    if (shouldShowSkeleton == true) {
      drawKeypoints();
      drawSkeleton();
    }
    //TODO: classify, see Daniel Shiffman's video
    //nn.classify()
  }
  fill(255, 0, 255);
  noStroke();
  textSize(60);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 2);
}

// handle the onscreen checkbox
function myCheckedEvent() {
  if (this.checked()) {
    shouldShowSkeleton = true;
  } else {
    shouldShowSkeleton = false;
  }
}

// draws body keypoints, the greener the keypoints, the higer the confidence
function drawKeypoints() {
  for (let i = 5; i < pose.keypoints.length; i++) {
    let conf = pose.keypoints[i].score;
  	// only draw keypoint above a certain confidence score
    if (conf > 0.5) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      // https://p5js.org/reference/#/p5/lerp
      let c = lerp(0, 255, conf);
      fill(0, c, 0);
      ellipse(x, y, 6, 6);
    }
  }
}

// draws the skeleton
function drawSkeleton() {
  for (let i = 0; i < skeleton.length; i++) {
    let a = skeleton[i][0];
    let b = skeleton[i][1];
    stroke(255);
    line(a.position.x, a.position.y, b.position.x, b.position.y);
  }
}

function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    nn.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {
  if (results[0].confidence > 0.75) {
    poseLabel = results[0].label;
  }
  console.log(results[0].label);
  console.log(results[0].confidence);
  classifyPose();
}