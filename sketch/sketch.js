let pg;
let angle = 0;

// --- GIF capture settings ---
const DO_CAPTURE_GIF = true; // <<< set to true to record a GIF
const TOTAL_FRAMES = 10; // how many frames to record

// I recommend running a local server to download the framews easier (e.g. python -m http.server)

function setup() {
    createCanvas(600, 300, WEBGL);
    setAttributes("alpha", true); // alpha channel for transparent background

    // Offscreen graphics for the oval texture
    pg = createGraphics(512, 256);
    drawMetalTextureWithText();
}

function draw() {
    if (DO_CAPTURE_GIF) {
        frameRate(5);
    }

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
        if (frameCount <= TOTAL_FRAMES) {
            saveCanvas("frame-" + nf(frameCount, 4), "png");
        } else {
            noLoop();
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
