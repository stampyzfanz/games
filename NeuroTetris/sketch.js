// https://en.wikipedia.org/wiki/Tetris#Gameplay and 
// https://simple.wikipedia.org/wiki/Tetris#Gameplay
// Has explanation on what a tetromino is. I prefer the
// simple wikipedia explanation.

let debug = false;

let w; // width of each cell
let cols, rows;

let moveInterval;

let players = [];
let savedPlayers = [];

// let TOTAL = 1000;
let TOTAL = 2;

async function setup() {
	w = debug ? 55 : 25;
	moveInterval = debug ? 512 : 256;

	// 20 by 10
	// 20:10
	// 10:5
	// 2:1
	// 550:x
	// 550:275
	createCanvas(250, 550)
		.parent('#canvas');

	cols = width / w;
	rows = height / w;

	for (let i = 0; i < TOTAL; i++) {
		players[i] = new Player();
	}

	findTetrominoTypes();
	setupDom();

	await sleep(500);
}

function draw() {
	background(0);

	// for every player
	for (let p of players) {
		for (let c of p.grid) {
			c.show();
		}

		fill(255, 0, 255);
		textAlign(CENTER, CENTER);
		textSize(32);
		text(p.points, width / 2, height / 4);
	}
}

function update(updateLogic) {
	// for every player
	for (let p of players) {
		for (let c of p.grid) {
			c.reset();
		}

		for (let t of p.tetrominoes) {
			if (t !== p.active_tetromino) {
				t.updateCells(false);
			}
		}

		if (!debug) {
			if (updateLogic == "don't update the logic please") {
				p.active_tetromino.updateCells(false);
			} else {
				p.think();
				p.active_tetromino.updateCells(true);
				p.checkIfDied();

				if (players.length === 0) {
					nextGeneration();
				}

				p.checkAllRowsCleared();
			}
		}

	}
}

function keyPressed() {
	for (let p of players) {
		switch (keyCode) {
			case LEFT_ARROW:
				p.active_tetromino.move(-1, 0);
				break;
			case RIGHT_ARROW:
				p.active_tetromino.move(1, 0);
				break;
			case DOWN_ARROW:
				p.active_tetromino.move(0, 1);
				break;
		}

		if (key == 'J') {
			p.active_tetromino.rotate(3); // 90 degrees anti-clockwise
		} else if (key == 'K') {
			p.active_tetromino.rotate(1); // 90 degrees clockwise
		}

		// refrain from updating the logic
		update("don't update the logic please");
	}
}

function prettyType(type) {
	for (let j = 0; j < type.length; j++) {
		type[j] = type[j].split('');
	}
	types.push(type);
}

async function mySetInterval() {
	update("update the logic pretty please");
	await sleep(moveInterval);
	mySetInterval(); // yay recusion :)
}