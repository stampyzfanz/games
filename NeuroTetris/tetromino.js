let types = [];
let randomTypeArr = [];

function findTetrominoTypes() {
	for (let i = 1; i < 8; i++) {
		let type;
		if (i != 7) {
			type = loadStrings('Tetromino/' + i + '.txt', prettyType);
		} else {
			type = loadStrings('Tetromino/7.txt', type => {
				prettyType(type);

				let typeIndexArr = [];
				for (let i = 0; i < types.length; i++) {
					typeIndexArr.push(i);
				}

				for (let i = 0; i < 14; i++) {
					let shuffled = shuffle(typeIndexArr, false);
					for (let j = 0; j < 7; j++) {
						randomTypeArr.push([shuffled[j], 0]);
					}
				}

				// for every player
				for (let p of players) {
					pickTetromino(p);
				}
				// window.setInterval(update, moveInterval);
				mySetInterval();

			});
		}
	}
}

function pickTetromino(player) {
	let type, width, x;
	if (player.tetrominoNum >= randomTypeArr) {
		type = floor(random(types.length));
		width = types[type][0].length;
		x = floor(random(cols - width));
	} else {
		type = randomTypeArr[player.tetrominoNum][0];
		x = randomTypeArr[player.tetrominoNum][1];
	}

	player.active_tetromino = new Tetromino(x, type,
		player.tetrominoes.length + 1, player);
	player.tetrominoes.push(player.active_tetromino);
	player.active_tetromino.isGameOver1(player);
	player.active_tetromino.updateCells(false, player);
}

function kill(i, player) {
	player.tetrominoes.splice(i, 1);
}

class Tetromino {
	constructor(x, typeIndex, i, player) {
		this.x = x;
		this.typeIndex = typeIndex;
		// copy arr. was type was changed in this.moveDown() 
		// it changed the types array
		this.type = JSON.parse(JSON.stringify(types[typeIndex]));
		this.y = 0;
		this.i = i;

		this.rotation = 0;

		this.col = getRandomColour();

		player.tetrominoNum++;
	}

	isGameOver1(player) {
		let anyBlank = true;
		for (let j = 0; j < this.type.length; j++) {
			for (let i = 0; i < this.type[j].length; i++) {
				if (this.type[j][i] == '█') {
					anyBlank = false;

					let x = i + this.x;
					let y = j + this.y;

					if (player.grid[index(x, y)].isUsed) {
						// Game over

						player.isDead = true;
					}
				}
			}
		}
	}

	isGameOver2(player) {
		if (this.y > rows + 1) {
			player.isDead = true;
		}
	}

	updateCells(ifUpdateY, player) {
		if (ifUpdateY) {
			// check that there isn't another tetromino or the bottom 
			// of the screen that it would fall through

			if (this.canMove(0, 1, undefined, player)) {
				this.y++;
			} else {
				// Pick another
				pickTetromino(player);
			}
		}


		// for every char in type:
		// 	if it is a block
		// 		change cell 's status at that point 
		// 		to full, change cell's colour

		// change cell colour
		for (let j = 0; j < this.type.length; j++) {
			for (let i = 0; i < this.type[j].length; i++) {
				if (this.type[j][i] == '█') {
					// Change cell colour

					let x = i + this.x;
					let y = j + this.y;

					// console.log(x, y)
					player.grid[index(x, y)].col = this.col;
					player.grid[index(x, y)].isUsed = true;
					player.grid[index(x, y)].whoUsed = this.i;
				}
			}
		}
	}

	canMove(xoff, yoff, type, player) {
		if (type == undefined) {
			type = this.type;
		}
		for (let j = 0; j < type.length; j++) {
			for (let i = 0; i < type[j].length; i++) {
				if (type[j][i] == '█') {
					let x = i + this.x + xoff;
					// one below where the cell would be
					let y = j + this.y + yoff;
					// try will get executed when it reaches the bottom
					// and there is no cell underneath to check

					if (x < 0 || x >= cols) {
						return false;
					}

					try {
						if (player.grid[index(x, y)].isUsed) {
							// if its me that I will touch if I move
							if (player.grid[index(x, y)].whoUsed ==
								this.i) {
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

	move(x, y, player) {
		if (this.canMove(x, y, undefined, player)) {
			// move(x, y); // lol recurisiveness
			this.x += x
			this.y += y;
		}
	}

	rotate(times, player) {
		let type = rotateMatrix(this.type, times);
		if (this.canMove(0, 0, type, player)) {
			this.type = type;
			// make it so it rotates the cells of the board not just the shape itself
			this.updateCells(false, player);
		}
	}

	moveDown(rowNumber) {
		console.log("moved");

		let cellNum = 0;
		let highCellNum = 0;

		// for every cell
		for (let j = 0; j < this.type.length; j++) {
			for (let i = 0; i < this.type[j].length; i++) {
				if (this.type[j][i] == '█') {
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
				if (this.type[j][i] == '█') {
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