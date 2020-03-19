class Bubble {
	constructor(pos, vel, r, mode, id) {
		this.pos = pos;
		this.vel = vel;
		this.mode = mode;
		this.id = id;
		this.r = r;
	}

	update() {
		this.pos.add(this.vel);

		if (this.mode == 'Infected') {
			// 0.1% chance to recover every tick
			if (random() < 0.001) {
				this.mode = 'Recovered';
			}
		}
	}

	show() {
		if (this.mode == 'Infected') {
			fill(255, 0, 0);
		} else if (this.mode == 'Normal') {
			fill(100, 100, 150);
		} else if (this.mode == 'Recovered') {
			fill(255, 192, 248);
		}
		ellipse(this.pos.x, this.pos.y, this.r);
	}

	isTouching(other) {
		return this.pos.dist(other.pos) < other.r + this.r;
	}

	edges() {
		if (this.pos.x < 0 || this.pos.x > width) this.vel.x = this.vel.x * -1;
		if (this.pos.y < 0 || this.pos.y > height) this.vel.y = this.vel.y * -1;
	}
}