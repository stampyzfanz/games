function nextGeneration() {
	calcFitness();

	for (let i = 0; i < TOTAL; i++) {
		// let parentA = pickOne(savedBirds);
		// let parentB = pickOne(savedBirds);
		// birds[i] = crossover(parentA, parentB);
		birds[i] = pickOne(savedBirds);
	}
	savedBirds = [];
}

function calcFitness() {
	let sum = 0;
	let best = 0;
	for (let b of savedBirds) {
		b.score = 1.1 ** b.score;
		// b.score = b.score ** (Math.log(b.score) / Math.log(3)); // polynomial - I think?
		sum += b.score;
		if (b.score > best) {
			best = b.score;
		}
	}

	console.log(Math.log(sum / savedBirds.length) / Math.log(1.1));
	createP(Math.log(sum / savedBirds.length) / Math.log(1.1));
	// createP(Math.log(best) / Math.log(1.1));
	// console.log('lolcat');
	// console.log(sum / savedBirds.length);
	// console.log(Math.log(best) / Math.log(1.1));
	// console.log(Math.log(best) / Math.log(best ** 3));

	for (let b of savedBirds) {
		b.fitness = b.score / sum;
	}
}

// function pickOne() {
// 	let bird = random(savedBirds);
// 	child = new Bird(bird.brain);
// 	// child.mutate();

// 	return child;
// }

function pickOne(birds) {
	// Start at 0
	let index = 0;

	// Pick a random number between 0 and 1
	let r = random(1);

	// Keep subtracting probabilities until you get less than zero
	// Higher probabilities will be more likely to be picked since they will
	// subtract a larger number towards zero
	while (r > 0) {
		r -= birds[index].fitness;
		// And move on to the next
		index += 1;
	}

	// Go back one
	index -= 1;

	// Make sure it's a copy!
	// (this includes mutation)
	// console.log(birds);
	// console.log(birds[index]);
	return birds[index].copy();
}