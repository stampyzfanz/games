let popSize = 100;
let bubbles = [];
let isFlocking;

function setup() {
	createCanvas(800, 600);

	initialise();
	flocking_simulation_setup();

	isFlocking = createCheckbox('Flocking simulation', false)
		.changed(initialise);
}

function initialise() {
	bubbles = [];
	for (let i = 0; i < popSize; i++) {
		let pos = createVector(random(width), random(height));
		let vel = p5.Vector.random2D().mult(2);
		if (i == 0) {
			bubbles[i] = new Bubble(pos, vel, 5, 'Infected', i);
		} else {
			bubbles[i] = new Bubble(pos, vel, 5, 'Normal', i);
		}
	}
}

function draw() {
	background(0);

	for (let i = 0; i < bubbles.length; i++) {
		for (let j = 0; j < bubbles.length; j++) {
			let other = bubbles[j];
			// if different bubble
			if (other.id != bubbles[i].id) {
				// is touching
				if (other.isTouching(bubbles[i])) {
					if (!(isFlocking.checked())) {
						other.vel.mult(-1);
						bubbles[i].vel.mult(-1);
					}

					// If either are infected, infect the other.
					if (other.mode == 'Infected' ||
						bubbles[i].mode == 'Infected') {
						if (other.mode == 'Normal') {
							other.mode = 'Infected';
						}

						if (bubbles[i].mode == 'Normal') {
							bubbles[i].mode = 'Infected';
						}
					}
				}
			}

		}

		bubbles[i].edges();
		bubbles[i].update();
		bubbles[i].show();

		if (isFlocking.checked()) {
			bubbles[i].flock(bubbles);
		}
	}
}