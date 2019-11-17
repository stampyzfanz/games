function setupDom() {
	createElement('br')
		.parent('#canvas');

	let speed = createSlider(0, Math.sqrt(1024), Math.sqrt(moveInterval), 0.01)
		.parent('#canvas')
		.style('display', 'inline-block')
		.style('width', '100%')
		.input(_ => moveInterval = speed.value() ** 2);

	let space = createP('&nbsp'.repeat(4))
		.style('display', 'inline-block')
		.parent('#canvas');

	let explanation = createP('Speed of the tetrominoes falling')
		.style('display', 'inline-block')
		.parent('#canvas');

	createElement('br')
		.parent('#canvas');

	let resetBtn = createButton('reset')
		.mousePressed(reset)
		.parent('#canvas');
}