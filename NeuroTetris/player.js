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
			switch (nn_input_type) {
				case 0:
					this.brain = new NeuralNetwork(rows * cols * 3, 20, 6);
					break;
				case 1:
					this.brain = new NeuralNetwork(cols + 7 + 2, 1, 6);
					break;
			}
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
		// input depends on the hardcoded value at the start

		// for the first one:
		// 	input is one hot vector
		// 	0 symbolises unused cell
		// 	1 symbolises used cell
		// 	2 symbolises cell that the network can control

		// for the 2nd one:
		// 	Input 1: one hot vector of tetromino shape
		// 	Input 2 - 3: x and y of tetromino
		// 	Input 4 - 15? maybe: pass in the y value of the highest 
		// 		cell in col 0 that is used and isnt acive. Do this
		// 		for every other col




		let grid = [];
		this.grid.forEach((cell, i) => {
			let input = [1, 0, 0];


			if (cell.isUsed) {
				input = [0, 1, 0];
			}

			if (cell.isActive) {
				input = [0, 0, 1];
			}

			grid.push(input);
		});

		let inputs = [];
		switch (nn_input_type) {
			case 0:
				inputs = grid;
				inputs = inputs.flat(3);
				break;
			case 1:
				let t = this.active_tetromino;

				// Input 1: one hot vector of tetromino shape
				inputs[0] = new Array(7).fill(0)
				inputs[0][t.typeIndex] = 1;

				// Input 2 - 3: x and y of tetromino
				inputs[1] = [t.x, t.y];

				// Input 4 - 15? maybe: pass in the y value of the highest 
				// 	cell in col 0 that is used and isnt acive. Do this
				// 	for every other col
				for (let i = 0; i < cols; i++) {
					let input = 0;
					for (let j = 0; j < rows; j++) {
						// if the cell is used
						if (grid[index(i, j)][1]) {
							input = j;
							break;
						}

						if (typeof input == Number) {
							console.error('Bug: Break didn\'t work');
						}
					}

					inputs.push(input);
				}

				inputs = inputs.flat(1);
				break;
		}

		// console.log(inputs);

		testInputs = inputs;
		// let outputs = this.brain.predict(inputs);
		// console.log(outputs);

		// let maxOutputIndex = outputs.indexOf(Math.max(...outputs));
		// console.log(maxOutputIndex);
		let maxOutputIndex = 1;

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
	}
}