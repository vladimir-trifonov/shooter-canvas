/* global
	config
*/

"use strict";

function Circle(x, y) {
	createjs.Shape.call(this);

	this.config = config.assets.animation.circle;
	
	this.scaleX = 1;
	this.scaleY = 1;
	this.alpha = 1;

	this.x = x;
	this.y = y;
	this.graphics.beginStroke("#f00").drawCircle(0, 0, 0.05);

	this.animate();

	return this;
}

Circle.prototype = (function() {
	var p = Object.create(createjs.Shape.prototype);
	p.constructor = Circle;	

	p.animate = function() {
		TweenMax.to(this, 1, {
			scaleX: 50,
			scaleY: 50,
			alpha: 0,
			onComplete: function() {
				this.dispatchEvent("completed");
			},
			onCompleteScope:this
		});
	};

	return p;
}());

