// fork of: 
//   https://editor.p5js.org/codingtrain/sketches/XjLDE7gu6
//   by Daniel Shiffman
//   https://thecodingtrain.com/CodingInTheCabana/002-collatz-conjecture.html
//   https://youtu.be/EYLWxwo1Ed8
let n = 6;
let d = 71;

let color_gen;

let rainbow;
let normal;

function setup() {
	// createCanvas(400, 400);
	createCanvas(700, 700);
	// pixelDensity(1);
	angleMode(DEGREES);

	color_gen = new PerlinNoiseColor(width * pixelDensity(), height, 0.01);
	noLoop();

	rainbow = createGraphics(width, height);
	rainbow.loadPixels();
	let colored_pixels = color_gen.get1DGrid();
	for (let i = 0; i < rainbow.pixels.length; i++) {
		rainbow.pixels[i] = colored_pixels[i];
	}
	rainbow.updatePixels();

	normal = createGraphics(width, height);
	// normal.pixelDensity(1);
}

function draw() {
	normal.background(48);
	normal.push();
	normal.translate(width / 2 / pixelDensity(), height / 2 / pixelDensity());

	// you cant make it so that it draw in invisible line or circle
	// so I made it arbitaritly red
	// then iterate over pixels arr to make red invisible

	normal.noFill();
	normal.stroke(255, 0, 0)
	normal.beginShape();
	for (let i = 0; i < 361; i++) {
		let k = i * d;
		let r = sin(n * k) * (width / 2 / pixelDensity());
		let dir = k;
		let x = r * cos(dir);
		let y = r * sin(dir);

		normal.vertex(x, y);

		// 	if (prevx) {
		// 		// x could've been negative or a decimal
		// 		// let x_index = round(x) + width / 2;
		// 		// let y_index = round(y) + height / 2;
		// 		// stroke(color_gen.getColor(x_index, y_index));
		// 		normal.stroke(255, 0	, 0); // transparent
		// 		// normal.strokeWeight(4);
		// 		normal.line(x, y, prevx, prevy);
		// 	}
		// 	prevx = x;
		// 	prevy = y;
		// }

		// normal.fill(255, 0, 0);
		// normal.ellipse(0, 0, 100);
	}
	normal.endShape();

	normal.loadPixels();
	for (let i = 0; i < normal.pixels.length; i += 4) {
		if (normal.pixels[i] !== 48) {
			normal.pixels[i + 3] = 0;
		}
	}
	normal.updatePixels();

	background(0);
	image(rainbow, 0, 0, width, height);
	image(normal, 0, 0, width, height);
	normal.pop();
}