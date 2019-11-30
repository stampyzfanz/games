function setupDom() {
	function br() {
		createElement('br')
			.parent('#canvas');
	}

	function space() {
		createP('&nbsp'.repeat(4))
			.style('display', 'inline-block')
			.parent('#canvas');
	}

	br();


	let explanation1 = createP('What is the word spelt in braille by the tetrominoes? ')
		.style('display', 'inline-block')
		.parent('#canvas');

	space();

	let userGuessedWord = createInput('')
		.parent('#canvas')
		.style('display', 'inline-block')
		.changed(() => {
			// only let the user guess if the word is finished
			if (paused) {
				console.log('word guessed');
				feedback.style('display', 'inline-block');
				if (userGuessedWord.value() == word) {
					points += word.length * 10;
					feedback.html('You are correct');
				} else {
					feedback.html(`You guessed ${userGuessedWord.value()}\
						but the correct word was ${word}`);
				}
				pickWord();
				paused = false;
			}
		});

	// feedback to user
	let feedback = createP('')
		.style('display', 'none')
		.parent('#canvas');

	let speed = createSlider(0, Math.sqrt(1024), Math.sqrt(moveInterval), 0.01)
		.parent('#canvas')
		.style('display', 'inline-block')
		.style('width', '100%')
		.input(_ => moveInterval = speed.value() ** 2);

	space();

	let explanation2 = createP('Speed of the tetrominoes falling')
		.style('display', 'inline-block')
		.parent('#canvas');

	br();

	let resetBtn = createButton('reset')
		.mousePressed(reset)
		.parent('#canvas');
}