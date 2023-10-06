// All original tasks are done from step 1 to step 5, with the addition extensions 6. further development
// 1-5
// 1. Renaming of backImg to prevImg has taken place. 
// 2. Frame differencing implemented by moving prevImg around. 
// 3. Learner has included Grid.js correctly and grid activates with movement.
// 4. Learner has included blur in order to reduce the amount of noise that activates the grid.
// 5. Learner has scaled down images processed (currImg, diffImg) so that the sketch runs fast after blurring has slowed it down.
// 6. + 2 extensions see below


// FINAL CODE WITH ALL STEPS AND EXTENSIONS


// S2 to S5

// ********************************
// FRAME DIFFERENCING EXAMPLE     *
// ********************************
// I wrote this code
var video; // video capture object (video) 
var prevImg; // previous frame image 
var diffImg; // difference image
var currImg; // current frame image
var thresholdSlider; // slider for threshold
var threshold; // threshold value
var grid; // global variable for the Grid class
// var soundFiles = []; // array to hold sound files

// function preload() {
//     // Load sound files
//     for (var i = 0; i < 8; i++) {
//         soundFiles[i] = loadSound('/libraries/p5.sound.min.js' + i + '.mp3'); // Replace with actual paths to sound files
//     }
// }
// end of code I wrote

function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();

    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);

    grid = new Grid(640, 480); // Initialize the Grid object

    // // Start audio context on user interaction
    // userStartAudio().then(function() {
    //     console.log('Audio context started.');
    // });
}

function draw() {
    background(0);
    image(video, 0, 0);

    // I wrote this code
    currImg = createImage(video.width, video.height); // create current frame image 
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height); // copy video capture object (video) to current frame image 

    // Apply blur filter to currImg
    currImg.resize(currImg.width / 4, currImg.height / 4); // Scale down currImg by 4
    currImg.filter(BLUR, 3); // Apply blur with 3 iterations

    diffImg = createImage(video.width, video.height); // create difference image 
    diffImg.resize(diffImg.width / 4, diffImg.height / 4); // Scale down diffImg
    diffImg.loadPixels(); // load pixels of difference image 

    threshold = thresholdSlider.value(); // set threshold to value of slider 

    if (typeof prevImg !== 'undefined') { // if previous frame image exists 
        prevImg.loadPixels(); // load pixels of previous frame image 
        currImg.loadPixels(); // load pixels of current frame image 
        for (var x = 0; x < currImg.width; x += 1) { // for every x coordinate 
            for (var y = 0; y < currImg.height; y += 1) { // for every y coordinate 
                var index = (x + (y * currImg.width)) * 4; // calculate index of pixel 
                var redSource = currImg.pixels[index + 0]; // red value of pixel
                var greenSource = currImg.pixels[index + 1]; // green value of pixel 
                var blueSource = currImg.pixels[index + 2]; // blue value of pixel

                var redPrev = prevImg.pixels[index + 0]; // red value of pixel 
                var greenPrev = prevImg.pixels[index + 1]; // green value of pixel 
                var bluePrev = prevImg.pixels[index + 2]; // blue value of pixel 

                var d = dist(redSource, greenSource, blueSource, redPrev, greenPrev, bluePrev); // calculate distance between pixels 

                if (d > threshold) { // if distance is greater than threshold 
                    diffImg.pixels[index + 0] = 0; // set red value of pixel to 0 
                    diffImg.pixels[index + 1] = 0; // set green value of pixel to 0
                    diffImg.pixels[index + 2] = 0; // set blue value of pixel to 0
                    diffImg.pixels[index + 3] = 255; // set alpha value of pixel to 255 
                    // playSound(index); // Play sound based on index
                } else { // if distance is less than threshold 
                    diffImg.pixels[index + 0] = 255; // set red value of pixel to 255
                    diffImg.pixels[index + 1] = 255; // set green value of pixel to 255 
                    diffImg.pixels[index + 2] = 255; // set blue value of pixel to 255
                    diffImg.pixels[index + 3] = 255; // set alpha value of pixel to 255
                }
            }
        }
    }
    diffImg.updatePixels(); // update pixels of difference image
    image(diffImg, 640, 0); // draw difference image to screen 

    noFill();
    stroke(255);
    text(threshold, 160, 35); // draw threshold value to screen 
    
    // Move this part to the end of the draw() function
    if (typeof currImg !== 'undefined') {
        prevImg = createImage(currImg.width, currImg.height); // create previous frame image 
        prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height); // copy current frame image to previous frame image 
    }

    grid.run(diffImg); // Call the run function of the Grid object
    // end of code I wrote
}

// function playSound(index) {
//     var noteIndex = floor(map(index, 0, diffImg.pixels.length, 0, soundFiles.length));
//     soundFiles[noteIndex].play();
// }

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
// I wrote this code
function distSquared(x1, y1, z1, x2, y2, z2){ // calculate distance between two pixels       
  var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1); // calculate distance squared 
  return d; // return distance squared
}
// end of code I wrote
