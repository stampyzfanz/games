function mutate(x) {
	if (random(1) < 0.1) {
		let offset = randomGaussian() * 0.5;
		let newx = x + offset;
		// console.log('mutate')
		return newx;
	} else {
		return x;
	}
}

class Bird {
	constructor(brain) {
		// used acceleration origonally, used tut to realise it doesn't need acceleration
		this.r = 16;

		this.x = 50;
		this.y = height / 2;

		this.gravity = 0.5;
		this.lift = -10;

		this.vel = 0;

		this.score = 0;
		this.fitness = 0;

		if (brain) {
			this.brain = brain.copy();
			this.brain.mutate(mutate);
		} else {
			this.brain = new NeuralNetwork(5, 8, 1);
		}
	}

	copy() {
		return new Bird(this.brain);
	}

	draw() {
		// stroke(255);
		fill(255, 100);
		ellipse(this.x, this.y, this.r * 2);
	}

	update(i) {
		this.score++;

		this.vel += this.gravity;

		this.y += this.vel;
		if (this.y >= height - this.r) {
			this.delete(i);
			// this.y = height - this.r;
			// this.vel = 0;
		} else if (this.y <= this.r) {
			this.delete(i);
			// this.y = this.r;
			// this.vel = 0;
		}
	}

	up() {
		this.vel = 0;

		this.vel += this.lift;
	}

	think(pipes) {

		// Find closest pipe
		let closest = null;
		let closestDist = Infinity;
		for (let i = 0; i < pipes.length; i++) {
			let d = (pipes[i].x + pipes[i].w) - this.x;
			if (d < closestDist && d > 0) {
				closest = pipes[i];
				closestDist = d;
			}
		}

		// let inputs = [this.pos.y, 0.5, 0.2, 0.3]
		let inputs = [];
		inputs[0] = this.y / height;
		// 0-1 value for bird height
		inputs[1] = closest.top / height;
		// 0-1 value for top of pipe
		inputs[2] = closest.bottom / height;
		// 0-1 value for bottom of pipe
		inputs[3] = closest.x / width;
		// 0-1 value for how far away the pipe is
		inputs[4] = this.vel / 10;
		// 0-1 value of the direction the bird is heading

		let output = this.brain.predict(inputs);

		if (output[0] > 0.5) {
			this.up();
		}
	}

	// mutate() {
	// this.brain.mutate(0.1);
	// }

	delete(i) {
		savedBirds.push(birds.splice(i, 1)[0]);
	}
}