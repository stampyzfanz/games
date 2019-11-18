center = 128;
width = 127;
frequency = 2.4;

function getRandomColour() {
	return _makeColorGradient(frequency, frequency, frequency, 0, 2, 4, center, width, random(150));
}

function _makeColorGradient(frequency1, frequency2, frequency3,
	phase1, phase2, phase3,
	center, width, len) {
	if (center == undefined) center = 128;
	if (width == undefined) width = 127;

	var red = Math.sin(frequency1 * len + phase1) * width + center;
	var grn = Math.sin(frequency2 * len + phase2) * width + center;
	var blu = Math.sin(frequency3 * len + phase3) * width + center;
	return [red, grn, blu];
}