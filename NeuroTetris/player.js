function mutate(x) {
	if (random(1) < 0.05) {
		let offset = randomGaussian() * 0.2;
		let newx = x + offset;
		// console.log('mutate')
		return newx;
	} else {
		return x;
	}
}


class Player {
	constructor(genes) {
		this.grid = [];
		this.tetrominoes = [];
		this.active_tetromino;
		this.points = 0;
		this.isDead = false;
		this.tetrominoNum = 0;


		for (let y = 0; y < height; y += w) {
			for (let x = 0; x < width; x += w) {
				let cell = new Cell(x, y, w);
				this.grid.push(cell);
			}
		}

		if (genes) {
			this.genes = genes.mutate(mutate);
		} else {
			// TODO: STARTING GENES
			this.genes = [random(-1, 1), random(-1, 1), random(-1, 1), random(-1, 1)];
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

	think() {
		// go thru every combination of orientation and position of tetrominoes
		let clone = deepclone(this);

		let bestScore = -Infinity;
		let bestPosition = null;

		this.active_tetromino.x = 0;
		// every combination of thing thingy
		for (let i = 0; i < 4; i++) {
			let x = 0;
			// try to put it in every position from left to right
			while (clone.active_tetromino.canMove(x, 0)) {
				// go down to the bottommost place it can
				clone.active_tetromino.rotate(i);
				clone.active_tetromino.move(x, 0);
				while (clone.active_tetromino.canMove(0, -1)) {
					clone.active_tetromino.move(0, -1);
				}

				// its at the bottom now look at its score
				// debugger;
				let score = this.genes[0] * clone.aggregateLines(clone.grid) +
					this.genes[1] * clone.completedLines(clone.grid) +
					this.genes[2] * clone.holes(clone.grid) +
					this.genes[3] * clone.bumpiness(clone.grid);

				if (score > bestScore) {
					bestPosition = [clone.active_tetromino.x, clone.active_tetromino.y];
					bestScore = score;
				}

				// in clone lib
				clone = deepclone(this);
				x++;
			}
		}

		let x = bestPosition[0];
		let y = bestPosition[1];
		this.active_tetromino.move(x, y);
	}

	getMaxYs(grid) {
		// the max y for each x
		let maxYs = {}

		for (let c of grid) {
			// if its bigger than the one in the obj or if its not in the obj
			if (c.y > maxYs.x || !(c.x in maxYs)) {
				maxYs[c.x] = c.y;
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
			if (c.y < maxYs[c.x]) {
				holes++;
			}
		}

		return holes;
	}

	bumpiness(grid) {
		let maxYs = this.getMaxYs(grid);

		let bumpiness = 0;
		for (let i = 1; i < cols.length; i++) {
			let col = maxYs.hasOwnproperty(i) ? maxYs[i] : 0;
			let prevcol = maxYs.hasOwnproperty(i) ? maxYs[i] : 0;

			bumpiness += abs(col - prevcol);
		}

		return bumpiness;
	}

	delete(i) {
		savedPlayers.push(players.splice(i, 1)[0]);
	}

	moveActiveTetromino(type) {
		switch (type) {
			case 0:
				this.active_tetromino.move(-1, 0);
				break;
			case 1:
				this.active_tetromino.move(1, 0);
				break;
			case 2:
				this.active_tetromino.move(0, 1);
				break;
			case 3:
				this.active_tetromino.rotate(3);
				break;
			case 4:
				this.active_tetromino.rotate(1);
				break;
			case 5:
				// do nothing
				break;
		}
		// refrain from updating the logic
		update("don't update the logic please");
	}
}