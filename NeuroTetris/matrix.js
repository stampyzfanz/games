// let matrix = ["*█*".split(''), "███".split('')];
// matrix = [
// 	[1, 2],
// 	[3, 4],
// 	[5, 6],
// ];
// console.log(matrix);
function rotateMatrix(matrix, times) {
	if (times < 0) times = 4 - times;

	for (let i = 0; i < matrix.length; i++) {
		if (typeof matrix[i] == 'String') {
			matrix[i] = matrix[i].split('');
		}
	}

	let matrices = [matrix];
	for (let t = 0; t < times; t++) {
		// ROTATE MATRIX CLOCKWISE
		// transpose matrix
		// ?????
		// profit

		// ???? step is flipping elts of row

		matrix = matrices[t];

		// transpose
		let transposed_matrix = [];

		for (let i = 0; i < matrix.length; i++) {
			for (let j = 0; j < matrix[i].length; j++) {
				try {
					transposed_matrix[j][i] = matrix[i][j];
				} catch (e) {
					transposed_matrix[j] = [];
					transposed_matrix[j][i] = matrix[i][j];
				}
			}
		}

		// console.log("transposed:")
		// console.log(transposed_matrix);

		// flip
		let flipped_matrix = [];
		for (let i = 0; i < transposed_matrix.length; i++) {
			flipped_matrix[i] = [];
			// console.log("flipped")
			// console.log(flipped_matrix)

			let ilength = transposed_matrix[i].length
			for (let j = 0; j < ilength; j++) {
				flipped_matrix[i][j] = transposed_matrix[i][ilength - j - 1];
			}
		}

		matrices.push(flipped_matrix);
	}



	// console.table(matrices);


	return matrices[times];
}

// console.log(rotateMatrix(matrix, 1));