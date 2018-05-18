class Bird {
	constructor() {
		// used acceleration origonally, used tut to realise it doesn't need acceleration
		this.r = 16;

		this.x = 50;
		this.y = height/2;

		this.gravity = 0.5;
		this.lift = -10;

		this.vel = 0;
	}

	draw() {
		ellipse(this.x, this.y, this.r * 2);
	}

	update() {
		this.vel += this.gravity;

		this.y += this.vel;
		if (this.y >= height - this.r) {
			this.y = height - this.r;
			// this.vel = 0;
		} else if (this.y <= this.r) {
			this.y = this.r;
			// this.vel = 0;
		}
	}

	up() {
		this.vel = 0;

		this.vel += this.lift;
	}
}