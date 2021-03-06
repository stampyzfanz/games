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
let bestPlayer = null;

// let TOTAL = 1000;
let TOTAL = 50;

let updateCount = 0;

async function setup() {
	w = debug ? 55 : 25;
	moveInterval = debug ? 512 : 4;

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

	bestPlayer = players[0];

	findTetrominoTypes();
	setupDom();

	await sleep(500);
}

function draw() {
	background(0);

	// for every player
	// for (let p of players) {
	// let p = players[0];
	let p = bestPlayer;

	if (bestPlayer.isDead) {
		p = players[0];
	}

	for (let c of p.grid) {
		c.show();
	}

	fill(255, 0, 255);
	textAlign(CENTER, CENTER);
	textSize(32);
	text(p.points, width / 2, height / 4);
	// }

}

function update(updateLogic) {
	if (updateLogic) {
		updateCount++;
	}

	// for every player
	// for (let p of players) {
	players.forEach((p, i) => {
		for (let c of p.grid) {
			c.reset();
		}

		for (let t of p.tetrominoes) {
			if (t !== p.active_tetromino) {
				t.updateCells(false, false);
			} else {
				t.isGameOver2();
			}
		}

		if (!debug) {
			if (updateLogic == "don't update the logic please") {
				p.active_tetromino.updateCells(false, true);
			} else {
				p.active_tetromino.updateCells(true, true);
				if (p.isDead) {
					p.delete(i);
				}

				p.think();

				if (updateCount % 100 == 0) {
					p.points++;
				}

				if (players.length === 0) {
					nextGeneration();
				}

				p.checkAllRowsCleared();
			}
		}
	});
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