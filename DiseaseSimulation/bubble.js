class Bubble {
	constructor(pos, vel, r, mode, id) {
		this.pos = pos;
		this.vel = vel;
		this.acc = createVector();

		this.mode = mode;
		this.id = id;
		this.r = r;

		this.maxForce = 0.2;
		this.maxSpeed = this.vel.mag();
	}

	update() {
		if (isFlocking.checked()) {
			this.pos.add(this.vel);
			this.vel.add(this.acc);
			this.vel.limit(this.maxSpeed);
			this.acc.mult(0);
		} else {
			this.pos.add(this.vel);
		}

		if (this.mode == 'Infected') {
			// 0.1% chance to recover every tick
			if (random() < 0.001) {
				this.mode = 'Recovered';
			}
		}
	}

	show() {
		noStroke();
		if (this.mode == 'Infected') {
			fill(255, 0, 0);
		} else if (this.mode == 'Normal') {
			fill(100, 100, 150);
		} else if (this.mode == 'Recovered') {
			fill(255, 192, 248);
		}
		ellipse(this.pos.x, this.pos.y, 2 * this.r);
	}

	isTouching(other) {
		if (isFlocking.checked()) {
			// not touching but nearby
			// return this.pos.dist(other.pos) < 1.8 * (other.r + this.r);

			// square both sides of the inequality to make it faster
			let d = (this.pos.x - other.pos.x) ** 2 + (this.pos.y - other.pos.y) ** 2
			return d < (1.8 * (other.r + this.r)) ** 2;
		} else {
			// return this.pos.dist(other.pos) < other.r + this.r;

			// square both sides of the inequality to make it faster
			let d = (this.pos.x - other.pos.x) ** 2 + (this.pos.y - other.pos.y) ** 2
			return d < (other.r + this.r) ** 2;
		}
	}

	edges() {
		if (isFlocking.checked()) {
			if (this.pos.x > width) this.pos.x = 0;
			if (this.pos.x < 0) this.pos.x = width;
			if (this.pos.y > height) this.pos.y = 0;
			if (this.pos.y < 0) this.pos.y = height;
		} else {
			if (this.pos.x < this.r || this.pos.x > width - this.r) this.vel.x = this.vel.x * -1;
			if (this.pos.y < this.r || this.pos.y > height - this.r) this.vel.y = this.vel.y * -1;
		}
	}
}