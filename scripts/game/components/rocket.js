/* global
	helper,
	config,
	images,
	Explosion
*/

"use strict";

function Rocket(angle, x0, y0, x1, y1) {
	createjs.Container.call(this);

	this.x = x0;
	this.y = y0;
	this.rotation = angle;
	this.width = 26;
	this.height = 49;
	this.config = config.assets.animation.rocket;	

	this._loadRocket();

	this.animate(x1, y1);
	return this;
}

Rocket.prototype = (function() {
	var p = Object.create(createjs.Container.prototype);
	p.constructor = Rocket;

	p.animate = function(x, y) {
		var duration = helper.calcDuration(this.config.pixelsPerSecond, this.x, this.y, x, y);

		this.addChild(this.rocket);	
		this._rocketAnimation(duration, x, y);
	};

	p._loadRocket = function() {
		var rocketSpriteSheet = new createjs.SpriteSheet({
			images: [images.getResult("rocket")],
			frames: {
				width: this.width,
				height: this.height
			},
			animations: {
				fly: [0, 4]
			}
		});
		this.rocket = new createjs.Sprite(rocketSpriteSheet);
	};
	
	p._rocketAnimation = function(duration, x, y) {
		this.rocket.gotoAndPlay("fly");
		TweenMax.to(this, duration, {
			x: x,
			y: y,
			ease: Linear.easeNone,
			onComplete: function() {
				this.removeChild(this.rocket);

				var explosion = new Explosion();
				this.addChild(explosion);	
				explosion.on("exploded", function() {
					this.removeChild(explosion);
					this.dispatchEvent("rocketRemove", true);
				}, this, true);

				explosion.explode(x, y);
			},
			onCompleteScope: this
		});
	};

	return p;
}());