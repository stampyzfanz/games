"use strict";

let scl = 20;
let s;

let food;

function setup() {
	createCanvas(600, 400);
	s = new Snake(scl);
	frameRate(10);
	// food = createVector(random(width), random(height));
	pickLoc();

	s.eat(food);
}

function draw() {
	background(0);

	noStroke();

	for (let i = 0; i <= width; i += scl) {
		for (let j = 0; j <= height; j += scl) {
			// console.log(i/scl+j/scl);
			// let alpha = 1;
			if (i/scl % 2 == j/scl % 2) {
				fill(0);
			} else {
				fill (100);
			}
			rect(i, j, scl, scl);
		} 
	}

	fill(255, 0, 0);

	s.update();
	s.show();
	s.hits();


	if (s.eat(food)) {
		pickLoc();
	}

	fill(255, 0, 100);
	rectMode(CORNER)
	rect(food.x, food.y, scl, scl); 

	// rectMode(CORNERS);
	stroke(128);
	// for (let i = 0; i <= width; i += scl) {
	// 	// for (let j = 0; j <= height; j += 50) {
	// 	line(0, i, width, i);
		// rect()
		// line(100, 100, 20, 20);

		// rect(100, 100)
		// }
	// }


	// for (let i = 0; i <= width; i += scl) {
	// 	line(i, 0, i, width);
	// }
}

function keyPressed() {
	switch(keyCode) {
		case UP_ARROW:
			s.dir(0, -1);
			break;
		case DOWN_ARROW:
			s.dir(0, 1);
			break;
		case LEFT_ARROW:
			s.dir(-1, 0);
			break;
		case RIGHT_ARROW:
			s.dir(1, 0);
			break;
	}
}

function pickLoc() {
	let cols = floor(width/scl);
	let rows = floor(height/scl);
	food = createVector(floor(random(cols)), floor(random(rows)));
	food.mult(scl);
}

async function restart(score) {
	// alert('You Lost. You got ' + score + ' points. Good luck for next time!');
	// ellipse(400, 600, 30);
	rectMode(CORNERS);
	textSize(32);
	let dim = {
		x: 5,
		y: 3
	}; // dimensions of textbox
	text('You Lost. You got ' + score + ' points. Good luck for next time!', // text for textbox
		width/2 - width/dim.x - 70, height/2 - height/dim.y, // point A for textbox
		width/2 + width/dim.x, height/2 + height/dim.y); // point B for textbox
	// drawText('lol cat');

	s.alive = false;

	await sleep(2000);


	s = new Snake(scl);

	fill(255, 255, 255, 128)
	// rect(width/2 - width/dim.x, height/2 - height/dim.y, width/2 + width/dim.x, height/2 + height/dim.y);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}