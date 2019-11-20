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
	constructor(brain) {
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

		if (brain) {
			this.brain = brain.copy();
			this.brain.mutate(mutate);
		} else {
			this.brain = new NeuralNetwork(rows * cols * 3, 20, 6);
		}
	}

	copy() {
		return new Player(this.brain);
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
		// input is one hot vector
		// 0 symbolises unused cell
		// 1 symbolises used cell
		// 2 symbolises cell that the network can control



		let inputs = [];
		this.grid.forEach((cell, i) => {
			let input = [1, 0, 0];


			if (cell.isUsed) {
				input = [0, 1, 0];
			}

			if (cell.isActive) {
				input = [0, 0, 1];
			}

			inputs.push(input);
		});

		inputs = inputs.flat(3);

		// console.log(inputs);

		let outputs = this.brain.predict(inputs);
		// console.log(outputs);

		let maxOutputIndex = outputs.indexOf(Math.max(...outputs));
		// console.log(maxOutputIndex);

		this.moveActiveTetromino(maxOutputIndex);
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