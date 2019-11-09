// Requires p5

class PerlinNoiseColor {
	constructor(width, height, inc) {
		this.width = width;
		this.height = height;
		this.inc = inc;

		this.grid = [];

		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				let index = y * this.width + x;
				let num = noise(x * inc / 10, y * inc / 10) * TWO_PI * 4;
				let angle = p5.Vector.fromAngle(num);
				angle.setMag(1);

				this.grid[index] = getRawColor(TWO_PI, angle.heading());
				// makes it arr of ints eg [198, 2, 108, 255]
			}
		}
	}

	getColor(x, y) {
		let index = y * this.width + x;
		return this.grid[index];
	}

	get1DGrid() {
		return this.grid.flat(1); // 1 should be enough but just in case
	}
}