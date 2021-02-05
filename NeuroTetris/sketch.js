// temp
let stop = false;

// https://en.wikipedia.org/wiki/Tetris#Gameplay and 
// https://simple.wikipedia.org/wiki/Tetris#Gameplay
// Has explanation on what a tetromino is. I prefer the
// simple wikipedia explanation.

let w = 25; // width of each cell
let cols, rows;

let moveInterval = 32; // 4
let isVisualising;

// let TOTAL = 1000;
let TOTAL = 1;
let players = [];
let savedPlayers = [];
let bestPlayer = null;

let updateCount = 0;

let generating = false;

// the game itself is 550 pixels, below that will be weight visualisation
let gameHeight = 550;
let visualisationHeight = 200;

let updateStack = [];

async function setup() {
	// 20 by 10
	// 20:10
	// 10:5
	// 2:1
	// 550:x
	// 550:275
	createCanvas(250, gameHeight + visualisationHeight)
		.parent('#canvas');

	noLoop();

	cols = width / w;
	rows = gameHeight / w;

	for (let i = 0; i < TOTAL; i++) {
		players[i] = new Player();
	}

	bestPlayer = players[0];

	findTetrominoTypes();
	setupDom();

	await sleep(500);
}

function draw(scoreArr) {
	strokeWeight(1)

	// 1. GAME
	if (!(generating)) {
		background(0);

		// for every player
		// for (let p of players) {
		if (players[0] == undefined) return;
		if (bestPlayer.isDead) bestPlayer = players[0];


		let p = scoreArr ? scoreArr[3] : bestPlayer;

		for (let c of p.grid) {
			c.show();
		}

		fill(255, 0, 255);
		textAlign(CENTER, CENTER);
		textSize(32);
		text(p.points, width / 2, gameHeight / 4);
		// }
	}


	fill('#d8f8ff');
	rect(0, gameHeight, width, visualisationHeight);
	// 2. MOVE VISUALISATION
	if (scoreArr) {
		// draw things
		translate(0, gameHeight);

		let algorithms = scoreArr[0];
		let genes = scoreArr[1];
		let score = scoreArr[2];
		let scores = scoreArr[4];

		// row 1
		for (let i = 0; i < 4; i++) {
			// first is algorithm result
			let y = visualisationHeight / 5 * (i + 1);
			let x = width / 4;
			// line
			strokeWeight(map(genes[i], 0, 1, 3, 15));
			stroke(0)
			line(x, y, x + width / 4, y);
			// circle
			noStroke();
			fill(algorithms[i] * 255)
			ellipse(x, y, 30)
			// text
			textSize(16)
			fill(algorithms[i] > 0.5 ? 0 : 255)
			text(Math.floor(algorithms[i] * 10), x, y)
		}

		// row 2
		for (let i = 0; i < 4; i++) {
			// first is algorithm result
			let y = visualisationHeight / 5 * (i + 1);
			let x = width / 2;
			// line
			strokeWeight(map(scores[i], 0, 1, 3, 15));
			stroke(0)
			line(x, y, width / 4 * 3, visualisationHeight / 2);
			// circle
			noStroke()
			fill(scores * 255)
			ellipse(x, y, 30)
			// text
			textSize(16)
			fill(scores[i] > 0.5 ? 0 : 255)
			text(Math.floor(scores[i] * 10), x, y)
			console.log(Math.floor(scores[i] * 10))
		}

		// final row - output node - row 3
		let y = visualisationHeight / 2;
		let x = width / 4 * 3;
		// circle
		fill(score * 255)
		ellipse(x, y, 30)
		// text
		textSize(16)
		fill(score > 0.5 ? 0 : 255)
		text(Math.floor(score * 10), x, y);
	}
}

function update(updateLogic) {
	if (updateLogic) {
		updateCount++;
	}

	players.forEach((p, i) => {
		for (let c of p.grid) {
			c.reset();
		}

		for (let t of p.tetrominoes) {
			if (t !== p.active_tetromino) {
				t.updateCells(false, p);
			} else {
				t.isGameOver2(p);
			}
		}

		if (updateLogic) {
			p.active_tetromino.updateCells(true, p);
		} else {
			p.active_tetromino.updateCells(false, p);
		}

		if (p.isDead) p.delete(i);

		if (updateLogic) p == bestPlayer ? p.think(true) : p.think();

		if (updateCount % 10 == 0 && updateLogic) p.points++;

		if (players.length === 0) {
			generating = true;
			shuffleTypes();
			nextGeneration();
		}

		if (updateLogic) p.checkAllRowsCleared();
	});

	redraw();
}

function normaliseUpdateStack() {
	newUpdateStack = [];

	// score
	let min = Infinity;
	let max = -Infinity
	for (let scoreArr of updateStack) {
		let scores = scoreArr[0].map((x, i) => x * scoreArr[1][i]);
		let thismax = Math.max(...scores);
		let thismin = Math.min(...scores)
		if (thismax > max) max = thismax;
		if (thismin < min) min = thismin;
	}

	for (let i = 0; i < updateStack.length; i++) {
		let scoreArr = updateStack[i];
		let scores = scoreArr[0].map((x, i) => x * scoreArr[1][i]);

		newUpdateStack[i] = [];
		newUpdateStack[i][4] = scores.map(x => map(x, min, max, 0, 1));
	}

	// algorithms
	// min = [Infinity, Infinity, Infinity, Infinity];
	// max = [-Infinity, -Infinity, -Infinity, -Infinity];
	min = Infinity
	max = -Infinity
	for (let scoreArr of updateStack) {
		// for (let i = 0; i < scoreArr.length; i++) {
		// 	if (scoreArr[i] > max[i]) max[i] = scoreArr[i];
		// 	if (scoreArr[i] < min[i]) min[i] = scoreArr[i];
		// }
		let thismax = Math.max(...scoreArr[0]);
		let thismin = Math.min(...scoreArr[0]);
		if (thismax > max) max = thismax;
		if (thismin < min) min = thismin;
	}


	for (let i = 0; i < updateStack.length; i++) {
		let scoreArr = updateStack[i];

		newUpdateStack[i][0] = [];
		for (let j = 0; j < scoreArr[0].length; j++) {
			newUpdateStack[i][0][j] = map(updateStack[i][0][j], min, max, 0, 1);
		}
	}

	// genes
	min = Infinity;
	max = -Infinity
	for (let scoreArr of updateStack) {
		for (let i = 0; i < scoreArr[1].length; i++) {
			let thismax = Math.max(...scoreArr[1]);
			let thismin = Math.min(...scoreArr[1]);
			if (thismax > max) max = thismax;
			if (thismin < min) min = thismin;
		}
	}

	for (let i = 0; i < updateStack.length; i++) {
		let scoreArr = updateStack[i];

		newUpdateStack[i][1] = [];
		for (let j = 0; j < scoreArr[1].length; j++) {
			newUpdateStack[i][1][j] = map(updateStack[i][1][j], min, max, 0, 1);
		}
	}


	// score
	min = Infinity;
	max = -Infinity
	for (let scoreArr of updateStack) {
		if (max < scoreArr[2]) max = scoreArr[2];
		if (min > scoreArr[2]) min = scoreArr[2];
	}

	for (let i = 0; i < updateStack.length; i++) {
		let scoreArr = updateStack[i];
		let score = map(scoreArr[2], min, max, 0, 1);
		newUpdateStack[i][2] = score;

		// the player itself
		newUpdateStack[i][3] = updateStack[i][3];
	}

	min = Infinity;
	max = -Infinity
	for (let scoreArr of updateStack) {
		if (max < scoreArr[2]) max = scoreArr[2];
		if (min > scoreArr[2]) min = scoreArr[2];
	}

	updateStack = newUpdateStack;
}

function prettyType(type) {
	for (let j = 0; j < type.length; j++) {
		type[j] = type[j].split('');
	}
	types.push(type);
}

async function mySetInterval() {
	if (!(generating)) {
		if (updateStack.length >= 1) {
			redraw(undefined, updateStack.pop())
		} else {
			update(true);
		}
	}
	await sleep(moveInterval);
	mySetInterval(); // yay recusion :)
}


// copy paste but adding argument to library draw function and hoping it works
p5.prototype.redraw = function (n, arg) {
	this.resetMatrix();
	if (this._renderer.isP3D) {
		this._renderer._update();
	}

	var numberOfRedraws = parseInt(n);
	if (isNaN(numberOfRedraws) || numberOfRedraws < 1) {
		numberOfRedraws = 1;
	}

	var userSetup = this.setup || window.setup;
	var userDraw = this.draw || window.draw;
	if (typeof userDraw === 'function') {
		if (typeof userSetup === 'undefined') {
			this.scale(this._pixelDensity, this._pixelDensity);
		}
		var self = this;
		var callMethod = function (f) {
			f.call(self);
		};
		for (var idxRedraw = 0; idxRedraw < numberOfRedraws; idxRedraw++) {
			this._setProperty('frameCount', this.frameCount + 1);
			this._registeredMethods.pre.forEach(callMethod);
			userDraw(arg);
			this._registeredMethods.post.forEach(callMethod);
		}
	}
};