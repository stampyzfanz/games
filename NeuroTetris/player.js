class Player {
	constructor(genes) {
		this.grid = [];
		this.tetrominoes = [];
		this.active_tetromino;
		this.points = 0;
		this.isDead = false;
		this.tetrominoNum = 0;


		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				let cell = new Cell(x * w, y * w, w);
				this.grid.push(cell);
			}
		}

		if (genes) {
			this.genes = genes;

			let d = (this.genes[0] ** 2 + this.genes[1] ** 2 +
				this.genes[2] ** 2 + this.genes[3] ** 2) ** 0.5;
			for (let i = 0; i < genes.length; i++) {
				genes[i] /= d;
			}
		} else {
			// TODO: STARTING GENES
			// this.genes = [random(-1, 1), random(-1, 1), random(-1, 1), random(-1, 1)]; 
			this.genes = [-0.510066, 0.760666, -0.35663, -0.184483];
		}
	}

	// reset() {
	// 	for (let c of this.grid) {
	// 		c.reset();
	// 	}

	// 	this.active_tetromino = null;
	// 	this.tetrominoes = [];
	// 	pickTetromino(this);

	// 	this.points = 0;
	// }

	ifRowCleared(rowNumber, grid) {
		if (!(grid)) grid = this.grid;

		// checks the bottom row to see if it is all full
		// let y = rows - 1;
		let y = rowNumber;

		for (let x = 0; x < cols; x++) {
			if (!(this.grid[index(x, y)].isUsed)) {
				return false;
			}
		}

		return true;
	}

	checkRowCleared(rowNumber) {
		// checks the bottom row to see if it is all full
		// let y = rows - 1;
		let y = rowNumber;

		for (let x = 0; x < cols; x++) {
			if (!(this.grid[index(x, y)].isUsed)) {
				return;
			}
		}

		// the row is used
		for (let t of this.tetrominoes) {
			t.moveDown(rowNumber);
		}

		this.points += cols * 100;
	}

	checkAllRowsCleared() {
		for (let row = 0; row < rows; row++) {
			this.checkRowCleared(row);
		}
	}

	think(isDrawn) {
		// if it doesn't know where it desires to go, decide where it desires to go
		// before I added === undefined if desired x = 0 it would recompute this every tick
		if (this.active_tetromino.desiredx === undefined) {
			// go thru every combination of orientation and position of tetrominoes
			// let clone = deepclone(this);
			// let clone = t structuredCloneAsync(this);
			// let clone = deepclone(this);
			let clone = _.cloneDeep(this);

			let bestScore = -Infinity;
			let bestPosition = null;

			clone.active_tetromino.x = 0;

			// every combination of thing thingy
			for (let i = 0; i < 4; i++) {
				let x = 0;

				// try to put it in every position from left to right
				while (clone.active_tetromino.canMove(x, 0, undefined, clone)) {

					// go down to the bottommost place it can
					clone.active_tetromino.move(x, 0, clone);
					while (clone.active_tetromino.canMove(0, 1, undefined, clone)) {
						clone.active_tetromino.move(0, 1, clone);
					}

					// while the tetromino is lower, it hasn't updated its cells yet
					// so update so it updates grid or else the score will be the same for everything

					// but even if we update the current one, itll leave the traces of the previous 
					// cells behind
					for (let c of clone.grid) c.reset();
					for (let t of clone.tetrominoes) t.updateCells(false, clone)


					// its at the bottom now look at its score
					let score = this.genes[0] * clone.aggregateLines(clone.grid) +
						this.genes[1] * clone.completedLines(clone.grid) +
						this.genes[2] * clone.holes(clone.grid) +
						this.genes[3] * clone.bumpiness(clone.grid);

					if (isDrawn && isVisualising.checked()) {
						updateStack.push([
							[
								clone.aggregateLines(clone.grid),
								clone.completedLines(clone.grid),
								clone.holes(clone.grid),
								clone.bumpiness(clone.grid)
							],
							this.genes,
							score,
							_.cloneDeep(clone),
							// below here is for debugging score algorithm
							// x,
							// clone.active_tetromino.x,
							// clone.active_tetromino.y,
							// clone.active_tetromino.rotation
						]);
					}

					// if (stop) debugger;

					if (score > bestScore) {
						bestPosition = [clone.active_tetromino.x, clone.active_tetromino.y, i];
						bestScore = score;
					}

					// in clone lib
					clone = _.cloneDeep(this);
					// it needs to rotate again if its cloned, before it tries to move
					clone.active_tetromino.rotate(i, clone);


					// rotate -i times, which is the same as 4-i times if i<4
					// clone.active_tetromino.move(0, 0, clone);
					// clone.active_tetromino.rotate(-i, clone);

					// for (let c of clone.grid) c.reset();
					// for (let t of clone.tetrominoes) t.updateCells(false, clone)


					x++;
				}
			}

			if (bestPosition == null) {
				this.isDead = true;
				// console.log('best position == null');
				// gameover
				return;
			}

			this.active_tetromino.desiredx = bestPosition[0];
			this.active_tetromino.desiredy = bestPosition[1];
			this.active_tetromino.desiredRotation = bestPosition[2];

			// only normalise updateStack if it pushed to the stack
			if (isDrawn && isVisualising.checked()) {
				// debugger;
				normaliseUpdateStack();
			}
		}

		this.moveActive();
		// debugger;
	}

	moveActive() {
		// look at whether to go left or right
		let xoff = this.active_tetromino.desiredx - this.active_tetromino.x;
		this.active_tetromino.move(constrain(xoff, -1, 1), 0, this);

		/*
		My explanation I posted to my non coder friend after I made it:
		But to a machine 360 degrees isnt the same as 0 degrees, 360 degrees is the opposite side
		How would you go about finding whether to go clockwise or counterclockwise?
		Solution: current - desired
		If thats < 180 then go that far and you will reach desired
		If its > 180 degrees then add 360 degrees to the smallest one
		Then subtract again
		And turn that far
		And will you reach desired with smallest turn
		*/

		// look at whether to turn clockwise or counterclockwise
		let current = this.active_tetromino.rotation;
		let desired = this.active_tetromino.desiredRotation;
		if (current - desired > 2) {
			// add 4 to smallest one
			if (current > desired) {
				desired += 4;
			} else {
				current += 4;
			}
		}
		let rotation_vel = current - desired;
		let constrained = constrain(rotation_vel, -1, 1);
		// it cant do -1 (-90 degrees) due to naive rotation algorithm, 
		// just do it 3 (270 degrees)
		this.active_tetromino.desiredRotation += constrained;
		this.active_tetromino.rotate(constrained, this);

		update(false);
	}

	getMaxYs(grid) {
		// the max y for each x
		let maxYs = {}

		for (let c of grid) {
			// if its smaller than the one in the obj or if its not in the obj and its active

			// / w because the y is the actual pixel y not y in array
			if ((c.y / w < maxYs[c.x / w] || !((c.x / w) in maxYs)) && c.isUsed) {
				// 20 minus because its from the bottom to the top
				maxYs[c.x / w] = rows - c.y / w;
			}
		}

		return maxYs;
	}

	aggregateLines(grid) {
		// per https://stackoverflow.com/questions/16449295/
		// how-to-sum-the-values-of-a-javascript-object
		return Object.values(this.getMaxYs(grid)).reduce((a, b) => a + b);
	}

	completedLines(grid) {
		let completedLines = 0;

		for (let row = 0; row < rows; row++) {
			if (this.ifRowCleared(row, grid)) completedLines++;
		}

		return completedLines;
	}

	holes(grid) {
		let maxYs = this.getMaxYs(grid);

		let holes = 0;
		for (let c of grid) {
			if (c.y / w > maxYs[c.x / w]) {
				if (c.isUsed) holes++;
			}
		}

		return holes;
	}

	bumpiness(grid) {
		// if (stop) debugger;
		let maxYs = this.getMaxYs(grid);

		let bumpiness = 0;
		for (let i = 1; i < cols; i++) {
			let col = maxYs.hasOwnProperty(i) ? maxYs[i] : 0;
			let prevcol = maxYs.hasOwnProperty(i - 1) ? maxYs[i - 1] : 0;

			bumpiness += abs(col - prevcol);
		}

		return bumpiness;
	}

	delete(i) {
		savedPlayers.push(players.splice(i, 1)[0]);
	}
}