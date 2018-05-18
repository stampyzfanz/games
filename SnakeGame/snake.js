class Snake {
	constructor(scl) {
		this.scl = scl;

		this.x = 0;
		this.y = 0;
		this.xVel = 1;
		this.yVel = 0;

		this.total = 1;
		this.tail = [];

		this.alive = true;
	}

	update() {
		for (let i = 0; i < this.tail.length-1; i++) {
			this.tail[i] = this.tail[i+1]; 
		}

		if (this.total >= this.tail.length) {
			this.tail[this.total-1] = createVector(this.x, this.y);
		}
		// this.tail[this.total-1] = createVector(this.x, this.y);
		

		// for (let i = 0; i < this.total-1; i++) {
		// 	this.tail[i] = this.tail[i+1];
		// }

		// this.tail[this.total-1] = createVector(this.x, this.y);

		// this.tail.splice(0, 2);

		this.x += this.xVel* this.scl;
		this.y += this.yVel*this.scl;

		this.x = constrain(this.x, 0, width - this.scl);
		this.y = constrain(this.y, 0, height - this.scl);
	}

	show() {
		fill(255);
		// for (let i = 0; i < this.total; i++) {
			// rect(this.tail[i].x, this.tail[i].y, this.scl, this.scl);
		// }
		for (let i = 0; i < this.tail.length; i++) {
			if (this.tail[i] && this.alive) {
				rectMode(CORNER);
				rect(this.tail[i].x, this.tail[i].y, this.scl, this.scl);
			}
		}

	}

	dir(xVel, yVel) {
		this.xVel = xVel;
		this.yVel = yVel;
	}

	eat(pos) {
		let d = dist(this.x, this.y, pos.x, pos.y);
		if (d < 1) {
			this.total++;
		}
		return (d < 1);
	}

	hits() {
		for (let i = 0; i < this.tail.length; i++) {
			if (this.tail[i].x === this.x && this.tail[i].y === this.y) {
				// console.log('Hits itself');
				// console.log('lol');
				restart(this.tail.length);
			}
		}
	}
}