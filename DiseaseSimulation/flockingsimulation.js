// requires p5

function flocking_simulation_setup() {
	let extension = Bubble;
	createElement('br');

	createP('Alignment slider &nbsp&nbsp&nbsp').style('display', 'inline-block');
	let alignSlider = createSlider(0, 5, 1, 0.1);
	createElement('br');

	createP('Cohesian slider &nbsp&nbsp&nbsp').style('display', 'inline-block');
	let cohesionSlider = createSlider(0, 5, 1, 0.1);
	createElement('br');

	createP('Seperation slider &nbsp&nbsp&nbsp').style('display', 'inline-block');
	let separationSlider = createSlider(0, 5, 1, 0.1);
	createElement('br');


	// extension.prototype.constructor = function() {
	// 	// this.pos = createVector(width / 2, height / 2);
	// 	this.pos = createVector(random(width), random(height));
	// 	this.vel = p5.Vector.random2D();
	// 	this.vel.setMag(random(2, 4));
	// 	this.acc = createVector();

	// 	this.maxForce = 0.2;
	// 	this.maxSpeed = 2;
	// }

	// extension.prototype.update = function(flock) {
	// 	this.pos.add(this.vel);
	// 	this.vel.add(this.acc);
	// 	this.vel.limit(this.maxSpeed);
	// 	this.acc.mult(0);
	// }

	// extension.prototype.edges = function() {
	// 	if (this.pos.x > width) this.pos.x = 0;
	// 	if (this.pos.x < 0) this.pos.x = width;
	// 	if (this.pos.y > height) this.pos.y = 0;
	// 	if (this.pos.y < 0) this.pos.y = height;
	// }

	extension.prototype.align = function(flock) {
		let perceptionRadius = 50;

		let total = 0;
		// average of velocities
		let steering = createVector();
		for (let other of flock) {
			// if other isnt me and is close to me
			if (other !== this && this.pos.dist(other.pos) < perceptionRadius) {
				steering.add(other.vel);
				total++;
			}
		}

		if (total > 0) {
			steering.div(total);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	extension.prototype.cohesion = function(flock) {
		let perceptionRadius = 50;

		let total = 0;
		// average of positions
		let steering = createVector();
		for (let other of flock) {
			// if other isnt me and is close to me
			if (other !== this && this.pos.dist(other.pos) < perceptionRadius) {
				steering.add(other.pos);
				total++;
			}
		}

		if (total > 0) {
			steering.div(total);
			steering.sub(this.pos);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}
		return steering;
	}

	extension.prototype.separation = function(flock) {
		let perceptionRadius = 50;
		let total = 0;

		// average of positions
		let steering = createVector();
		for (let other of flock) {
			let d = this.pos.dist(other.pos);
			// if other isnt me and is close to me
			if (other !== this && d < perceptionRadius) {
				let diff = p5.Vector.sub(this.pos, other.pos);

				diff.div(d * d);
				steering.add(diff);

				total++;
			}
		}

		if (total > 0) {
			steering.div(total);
			steering.setMag(this.maxSpeed);
			steering.sub(this.vel);
			steering.limit(this.maxForce);
		}

		return steering;
	}

	extension.prototype.flock = function(birds) {
		let alignment = this.align(birds);
		let cohesion = this.cohesion(birds);
		let separation = this.separation(birds);

		alignment.mult(alignSlider.value());
		cohesion.mult(cohesionSlider.value());
		separation.mult(separationSlider.value());

		this.acc.add(alignment);
		this.acc.add(cohesion);
		this.acc.add(separation)
	}

	// extension.prototype.show = function() {
	// 	strokeWeight(8);
	// 	stroke(255);
	// 	point(this.pos.x, this.pos.y);
	// }
}