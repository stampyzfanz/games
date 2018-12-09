"use strict";
const TOTAL = 1000;

let birds = [];
let savedBirds = [];
let pipes = [];
let counter = 1;
let cycles = 1;
// let slider;

const SPEED = 5;
const PIPE_SPACING = 90 * SPEED;

// console.log('no birds');

function setup() {
	createCanvas(600, 400);
	// slider = createSlider(1, 100, 1);
	for (let i = 0; i < TOTAL; i++) {
		birds[i] = new Bird();
	}

	pipes[0] = new Pipe(SPEED);
}


function draw() {

	// updating
	for (let n = 0; n < cycles; n++) {
		for (let i = 0; i < birds.length; i++) {
			birds[i].think(pipes);
			birds[i].update(i);
		}

		for (let i = 0; i < pipes.length; i++) {
			pipes[i].update();
				
			for (let j = birds.length-1; j >= 0; j--) {
				// console.log(birds[j]);
				if (pipes[i].hits(birds[j])) {
					// console.log('HIT');
					birds[j].delete(j);
				}
			}
		}

		if (birds.length === 0) {
			counter = 0;
			nextGeneration();
			pipes = [];
			// pipes.push(new Pipe(SPEED));
		}

		// print(PIPE_SPACING / SPEED);

		if (counter % (PIPE_SPACING / SPEED) === 0) {
		// if (frameCount % 100 === 0) {
			pipes.push(new Pipe(SPEED));
			// print('lol');
		}

		if (pipes.length > 3) {
			pipes.splice(0, 1);
		}

		counter++;
	}


	// drawing
	background(0);

	for (let i = 0; i < birds.length; i++) {
		birds[i].draw();
	}

	for (let i = 0; i < pipes.length; i++) {
		pipes[i].draw();
	}
}

function keyPressed() {
	if (key === 'S') {
		let bird = birds[0];

		let json = JSON.stringify(bird.brain);
		// saveJSON('bird.json', json);

		console.log(json)
	}
}