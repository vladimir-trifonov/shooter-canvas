/* global */

"use strict";

function Laser() {
	createjs.Shape.call(this);

	this.graphics.setStrokeStyle(0.5);
	this.graphics.beginLinearGradientStroke(
		["#f00", "#252729"], [0, 1],
		14, -420,
		14, -500
	);

	this.graphics.moveTo(14, 0);
	this.graphics.lineTo(14, -500);

	return this;
}

Laser.prototype = (function() {
	var p = Object.create(createjs.Shape.prototype);
	p.constructor = Laser;

	return p;
}());