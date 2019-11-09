function test_performance() {
	start = performance.now();
	redraw();
	end = performance.now();
	console.log(end - start);
	console.log(end);
	console.log(start);
}