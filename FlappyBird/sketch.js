"use strict";

let b;
let pipes = [];

const SPEED = 5;
const PIPE_SPACING = 100 * SPEED;

function setup() {
	createCanvas(600, 400);
	b = new Bird();
	pipes[0] = new Pipe(SPEED);
}


function draw() {
	background(0);

	b.draw();
	b.update();

	for (let i = 0; i < pipes.length; i++) {
		pipes[i].update();
		pipes[i].hits(b);
		pipes[i].draw();
	}

	// print(PIPE_SPACING / SPEED);

	if (frameCount % (PIPE_SPACING / SPEED) === 0) {
	// if (frameCount % 100 === 0) {
		pipes.push(new Pipe(SPEED));
		print('lol');
	}

	if (pipes.length > 3) {
		pipes.splice(0, 1);
	}
}

// function keyPressed() {
// 	if (key == ' ') { // used tut for key name
// 		// print('lol');
// 		b.up();
// 	}
// }

function mousePressed() {
// 	if (key == ' ') { // used tut for key name
		// print('lol');
		b.up();
// 	}
}
