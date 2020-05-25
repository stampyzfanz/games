function index(x, y) {
	return y * cols + x;
}

class Cell {
	constructor(x, y, w) {
		this.x = x;
		this.y = y;
		this.w = w;

		this.reset();
	}

	show() {
		stroke(50);
		fill(this.col);
		rect(this.x, this.y, this.w, this.w);
	}

	reset() {
		this.isUsed = false;
		this.whoUsed = -1;
		this.col = [0, 0, 0];
	}
}