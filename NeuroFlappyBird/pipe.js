class Pipe {
	constructor(speed) {
		this.x = width;
		// this.x = 100;
		this.w = 50;
		this.speed = speed;
		this.highlight = false;

		this.spacing = 125; // used formular from tut
		this.center = random(this.spacing, height - this.spacing); // used formular from tut

		this.bottom = this.center + this.spacing/2;
		this.top = this.center - this.spacing/2;
	}

	draw() {
		noStroke();
		// if (this.highlight) {
			// fill(255, 0, 0);
		// } else {
		fill(255);
		// }
		rectMode(CORNERS);
		// this.x = 100;
		rect(this.x, this.bottom, this.x + this.w, height);
		// this.x = 200;
		rect(this.x, this.top, this.x + this.w, 0);
	}

	update() {
		this.x -= this.speed;
	}

	hits(b) {
		if (b.y > this.bottom || b.y < this.top) {
			if (b.x > this.x && b.x < this.x + this.w) {
				this.highlight = true;
				return true;
			}
		}
		this.highlight = false;
	}
}