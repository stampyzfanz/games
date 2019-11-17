// https://en.wikipedia.org/wiki/Tetris#Gameplay and 
// https://simple.wikipedia.org/wiki/Tetris#Gameplay
// Has explanation on what a tetromino is. I prefer the
// simple wikipedia explanation.

let debug = false;

let w; // width of each cell
let cols, rows;

let grid = [];

let tetrominoes = [];
let active_tetromino;

// let moveInterval = 250;
let moveInterval;
// let moveInterval = 25;
// let moveInterval = 5;


function setup() {
	// 20 by 10
	// 20:10
	// 10:5
	// 2:1
	// 550:x
	// 550:275
	createCanvas(275, 550)
		.parent('#canvas');

	cols = width / w;
	rows = height / w;

	for (let y = 0; y < height; y += w) {
		for (let x = 0; x < width; x += w) {
			let cell = new Cell(x, y, w);
			grid.push(cell);
		}
	}

	w = debug ? 25 : 55;
	moveInterval = debug ? 256 : 512;

	if (debug) {
		debugSetup();
	}

	findTetrominoTypes();
	setupDom();
}

function debugSetup() {
	active_tetromino = null;
	tetrominoes = [];

	let t = new Tetromino(0, 0, 0);
	t.y = rows - 1;
	tetrominoes.push(t);

	t = new Tetromino(3, 5, 1);
	t.rotate(3);
	t.y = rows - 3;
	tetrominoes.push(t);
}

function draw() {
	background(0);

	for (let c of grid) {
		c.show();
	}
}

function update(updateLogic) {
	for (let c of grid) {
		c.reset();
	}

	for (let t of tetrominoes) {
		if (t !== active_tetromino) {
			t.updateCells(false);
		}
	}

	if (!debug) {
		if (updateLogic == "don't update the logic please") {
			active_tetromino.updateCells(false);
		} else {
			active_tetromino.updateCells(true);
		}
	}

	checkAllRowsCleared();
}

function reset() {
	console.log("reset");
	for (let c of grid) {
		c.reset();
	}

	active_tetromino = null;
	tetrominoes = [];
	pickTetromino();
}

function checkRowCleared(rowNumber) {
	// checks the bottom row to see if it is all full
	// let y = rows - 1;
	let y = rowNumber;

	for (let x = 0; x < cols; x++) {
		if (!(grid[index(x, y)].isUsed)) {
			return;
		}
	}

	// the row is used
	for (let t of tetrominoes) {
		t.moveDown(rowNumber);
	}
}

function checkAllRowsCleared() {
	for (let row = 0; row < rows; row++) {
		checkRowCleared(row);
	}
}

function keyPressed() {
	switch (keyCode) {
		case LEFT_ARROW:
			active_tetromino.move(-1, 0);
			break;
		case RIGHT_ARROW:
			active_tetromino.move(1, 0);
			break;
		case DOWN_ARROW:
			active_tetromino.move(0, 1);
			break;
	}

	if (key == 'J') {
		active_tetromino.rotate(3); // 90 degrees anti-clockwise
	} else if (key == 'K') {
		active_tetromino.rotate(1); // 90 degrees clockwise
	}

	// refrain from updating the logic
	update("don't update the logic please");
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