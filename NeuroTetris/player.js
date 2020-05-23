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
			this.genes = [];
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
		// TODO: THINK

		// let maxOutputIndex = outputs.indexOf(Math.max(...outputs));
		// console.log(maxOutputIndex);

		// this.moveActiveTetromino(maxOutputIndex);
	}

	aggregateLines() {
		// the max y for each x
		let maxYs = {}

		for (let c of this.grid) {
			// if its bigger than the one in the obj or if its not in the obj
			if (c.y > maxYs.x || !(c.x in maxYs)) {
				maxYs[c.x] = c.y;
			}
		}

		// per https://stackoverflow.com/questions/16449295/
		// how-to-sum-the-values-of-a-javascript-object
		return Object.values(obj).reduce((a, b) => a + b);
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