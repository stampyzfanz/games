class Player {
	constructor() {
		this.grid = [];
		this.tetrominoes = [];
		this.active_tetromino;
		this.points = 0;


		for (let y = 0; y < height; y += w) {
			for (let x = 0; x < width; x += w) {
				let cell = new Cell(x, y, w);
				this.grid.push(cell);
			}
		}

	}

	reset() {
		for (let c of this.grid) {
			c.reset();
		}

		this.active_tetromino = null;
		this.tetrominoes = [];
		pickTetromino(this);

		this.points = 0;
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

		this.points += cols;
	}



	checkAllRowsCleared() {
		for (let row = 0; row < rows; row++) {
			this.checkRowCleared(row);
		}
	}
}