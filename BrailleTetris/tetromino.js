function pickWord() {
	word = random(words);
	wordCharIndex = 0;
	nextTetromino();
}

function nextTetromino() {
	if (wordCharIndex >= word.length) {
		// TODO
		pickWord();
		return;
	}

	let brailleChar = brailleTable[word[wordCharIndex]];
	let x = floor(random(cols - 2));

	active_tetromino = new Tetromino(x, wordCharIndex, brailleChar,
		tetrominoes.length + 1);

	tetrominoes.push(active_tetromino);
	active_tetromino.isGameOver();
	active_tetromino.updateCells();

	wordCharIndex++;
}

function kill(i) {
	tetrominoes.splice(i, 1);
}

class Tetromino {
	constructor(x, wordCharIndex, brailleChar, i) {
		this.x = x;
		this.y = 0;
		this.i = i;

		this.col = getRandomColour();

		this.letter = word[wordCharIndex];
		let binArr = brailleChar
			.charCodeAt(0)
			.toString(2)
			.padStart(16, '0')
			.split('')
			// find last 6 digits
			.slice(-6);
		// eg. TODO give eaxmple

		// console.log(binArr);
		// console.log(this.letter);

		this.type = [];
		this.type[0] = [binArr[6 - 1], binArr[6 - 4]];
		this.type[1] = [binArr[6 - 2], binArr[6 - 5]];
		this.type[2] = [binArr[6 - 3], binArr[6 - 6]];

		// console.log(this.type);
		// console.log(brailleChar);
	}

	isGameOver() {
		for (let j = 0; j < this.type.length; j++) {
			for (let i = 0; i < this.type[j].length; i++) {
				if (this.type[j][i] == '1') {
					let x = i + this.x;
					let y = j + this.y;

					if (grid[index(x, y)].isUsed) {
						// Game over

						reset();
					}
				}
			}
		}
	}

	updateCells(ifUpdateY) {
		if (ifUpdateY) {
			// check that there isn't another tetromino or the bottom 
			// of the screen that it would fall through

			if (this.canMove(0, 1)) {
				this.y++;
			} else {
				// Pick another
				nextTetromino();
			}
		}


		// for every char in type:
		// 	if it is a block
		// 		change cell 's status at that point 
		// 		to full, change cell's colour

		// change cell colour
		for (let j = 0; j < this.type.length; j++) {
			for (let i = 0; i < this.type[j].length; i++) {
				if (this.type[j][i] == '1') {
					// Change cell colour

					let x = i + this.x;
					let y = j + this.y;

					// console.log(x, y)
					grid[index(x, y)].col = this.col;
					grid[index(x, y)].isUsed = true;
					grid[index(x, y)].whoUsed = this.i;
				}
			}
		}
	}

	canMove(xoff, yoff, type) {
		if (type == undefined) {
			type = this.type;
		}
		for (let j = 0; j < type.length; j++) {
			for (let i = 0; i < type[j].length; i++) {
				if (type[j][i] == '1') {
					let x = i + this.x + xoff;
					// one below where the cell would be
					let y = j + this.y + yoff;
					// try will get executed when it reaches the bottom
					// and there is no cell underneath to check

					if (x < 0 || x >= cols) {
						return false;
					}

					try {
						if (grid[index(x, y)].isUsed) {
							// if its me that I will touch if I move
							if (grid[index(x, y)].whoUsed == this.i) {
								// its okay, keep going
							} else {
								return false;
							}
						}
					} catch (e) {
						// if it'll touch the edge
						return false;
					}
				}
			}
		}
		return true;
	}

	move(x, y) {
		if (this.canMove(x, y)) {
			// move(x, y); // lol recurisiveness
			this.x += x
			this.y += y;
		}
	}

	rotate(times) {
		let type = rotateMatrix(this.type, times);
		if (this.canMove(0, 0, type)) {
			this.type = type;
		}
	}

	moveDown(rowNumber) {
		console.log("moved")

		let cellNum = 0;
		let highCellNum = 0;

		// for every cell
		for (let j = 0; j < this.type.length; j++) {
			for (let i = 0; i < this.type[j].length; i++) {
				if (this.type[j][i] == '1') {
					cellNum++;

					let celly = j + this.y;

					// if cell's y is equal to the rowNumber
					if (celly == rowNumber) {
						// replace with air
						this.type[j][i] = '*';

						// if cell's y is less than rowNumber
					} else if (celly < rowNumber) {
						// go down - maybe
						highCellNum++;
					}
				}
			}
		}

		// if all the cells need to go down
		if (highCellNum == cellNum) {
			this.y++;
			return;
		}

		// else if only some cells need to go down
		// for every cell

		// Bug solve -> loop from bottom to top
		for (let j = this.type.length - 1; j >= 0; j--) {
			for (let i = 0; i < this.type[j].length; i++) {
				if (this.type[j][i] == '1') {
					// if it needs to go down
					let celly = j + this.y;
					if (celly < rowNumber) {
						// go down
						this.type[j + 1][i] = this.type[j][i];
						this.type[j][i] = '*';
					}
				}
			}
		}
	}
}