function nextGeneration() {
	calcFitness();

	for (let i = 0; i < TOTAL; i++) {
		let parentA = pickOne(savedPlayers);
		let parentB = pickOne(savedPlayers);
		let genes = crossover(parentA, parentB);
		// players[i] = pickOne(savedPlayers);
		players[i] = new Player(genes);
	}

	for (let p of players) {
		pickTetromino(p);
	}

	savedPlayers = [];
	generating = false;
}

function calcFitness() {
	let sum = 0;
	let best = 0;
	let bestB
	for (let b of savedPlayers) {
		// b.points = 1.1 ** b.points;
		b.points = b.points ** 50;
		// b.points = b.points ** (Math.log(b.points) / Math.log(3)); // polynomial - I think?
		sum += b.points;
		if (b.points > best) {
			best = b.points;
			bestB = b;
		}
	}


	// console.log(Math.log(sum / savedPlayers.length) / Math.log(1.1));
	// createP(Math.log(sum / savedPlayers.length) / Math.log(1.1));
	console.log('avg: ' + (sum ** (1 / 50)) / savedPlayers.length);
	createP('best: ' + (best ** (1 / 50)) / savedPlayers.length);
	// createP((sum / savedPlayers.length) ** (1 / 50));
	// createP(Math.log(best) / Math.log(1.1));
	console.log('best: ' + best ** (1 / 50));

	if (best ** (1 / 50) >= 1000) {
		console.log(bestB);
	}

	if (best > bestPlayer.points) {
		bestPlayer = bestB;
	}

	// console.log(sum / savedPlayers.length);
	// console.log(Math.log(best) / Math.log(1.1));
	// console.log(Math.log(best) / Math.log(best ** 3));

	for (let b of savedPlayers) {
		b.fitness = b.points / sum;
	}
}

// function pickOne() {
// 	let bird = random(savedPlayers);
// 	child = new Bird(bird.brain);
// 	// child.mutate();

// 	return child;
// }

function pickOne(players) {
	// Start at 0
	let index = 0;

	// Pick a random number between 0 and 1
	let r = random(1);

	// Keep subtracting probabilities until you get less than zero
	// Higher probabilities will be more likely to be picked since they will
	// subtract a larger number towards zero
	while (r > 0) {
		r -= players[index].fitness;
		// And move on to the next
		index += 1;
	}

	// Go back one
	index -= 1;

	// Make sure it's a copy!
	// (this includes mutation)
	// console.log(birds);
	// console.log(birds[index]);

	// maybe I should've used the mutation function I copy pasted but kept in the player.js file

	let clone = deepclone(players[index]);
	// 5% chance of random component mutating
	if (random() < 0.05) {
		// mutate random gene by small change to it
		let index = floor(random(4));
		// random number between 0.2 and -0.2
		clone.genes[index] += map(random(), 0, 1, 0.2, -0.2);
	}
	return clone;
}

function crossover(parentA, parentB) {
	// I wish it was vectors now that I think about it
	// return parentA.genes * parentA.fitness + parentB.genes * parentB.fitness;
	let genes = [];
	for (let i = 0; i < parentA.genes.length; i++) {
		genes[i] = parentA.genes[i] * parentA.fitness + parentB.genes[i] * parentB.fitness;
		genes[i] /= parentA.fitness + parentB.fitness;
	}
	return genes;
}