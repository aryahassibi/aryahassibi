let pg;
let angle = 0;

// From https://github.com/spite/ccapture.js/ downloaded:
//     CCapture.all.min.js
//     gif.worker.js
//     webm-writer.js
//     download.js
// and placed in the sketch/ folder
// Run a local server e.g. python -m http.server

// --- GIF capture settings ---
const DO_CAPTURE_GIF = false;                   // <<< set to true to record a GIF
const TOTAL_FRAMES = 250;                       // how many frames to record
let capturer;
let recordingStarted = false;
let recordedFrames = 0;
let canvasElm;

function setup() {

    const canvas = createCanvas(600, 300, WEBGL);
    setAttributes("alpha", true); // alpha channel for transparent background
    canvasElm = canvas.elt;

    // Offscreen graphics for the oval texture
    pg = createGraphics(512, 256);
    drawMetalTextureWithText();

    if (DO_CAPTURE_GIF) {
        // CCapture: set up GIF recording
        capturer = new CCapture({
            format: "gif",
            workersPath: "./",
            framerate: 30,
            verbose: true,
            transparent: true, // some builds support transparent export
        });
    }
}

function draw() {

    const t = frameCount % TOTAL_FRAMES;

    background(0, 0);
    // background(10);

    // Lights
    ambientLight(80);
    directionalLight(255, 255, 255, 0.5, -1, -0.5);
    pointLight(255, 255, 255, 200, -200, 300);

    // Camera & rotation
    rotateX(cos(angle * 0.5) * 0.1);
    rotateZ(cos(-angle * 0.5) * 0.15);
    rotateY(-angle * 0.5);

    // Apply the texture and draw an ellipsoid/oval
    noStroke();
    texture(pg);
    ellipsoid(150, 50, 150, 64, 48);

    // angle += 0.02;
    angle = 4 * PI * (t / TOTAL_FRAMES);

    // --- GIF capture logic 
    if (DO_CAPTURE_GIF) {
        if (!recordingStarted) {
            capturer.start();
            recordingStarted = true;
        }
        capturer.capture(canvasElm);
        recordedFrames++;

        if (recordedFrames >= TOTAL_FRAMES) {
            noLoop(); 
            capturer.stop();
            capturer.save();
        }
    }
}

function drawMetalTextureWithText() {
    pg.push();
    pg.clear();
    pg.background(40);

    // Vertical stripes
    for (let x = 0; x < pg.width; x++) {
        const t = x / pg.width;
        const base = 150 + 80 * sin(t * TWO_PI * 6); // wavy brightness
        pg.stroke(base);
        pg.line(x, 0, x, pg.height);
    }

    // Horizontal dark bands
    pg.noStroke();
    for (let y = 0; y < pg.height; y += 5) {
        const alpha = 40;
        pg.fill(0, alpha);
        pg.rect(0, y, pg.width, 3);
    }

    // Text settings
    pg.textAlign(CENTER, CENTER);
    pg.textSize(29.5);
    pg.stroke(0);
    pg.strokeWeight(1.4);
    pg.fill(0);

    const textString = "Hey, it’s arya · Welcome to my profile · ";

    // Center text + duplicate offset copies to wrap around the oval
    const cx = pg.width / 2;
    const cy = pg.height / 2;

    // Middle main text
    pg.text(textString, cx, cy);

    // wrap-around repetition
    // pg.text(textString, cx - pg.width / 1, cy);
    // pg.text(textString, cx + pg.width / 1, cy);

    pg.pop();
}
