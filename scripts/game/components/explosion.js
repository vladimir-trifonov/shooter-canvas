/* global 
	images
*/

"use strict";

function Explosion() {
	createjs.Container.call(this);

	this.explosionInfo = {
		width: 128,
		height: 128
	};

	var explosionSpriteSheet = new createjs.SpriteSheet({
		images: [images.getResult("explosion")],
		framerate: 30,
		frames: {
			width: this.explosionInfo.width,
			height: this.explosionInfo.height
		},
		animations: {
			explode: [0, 39]
		}
	});

	this.spriteSheet = explosionSpriteSheet;

	this.x = -64;
	this.y = -64;

	return this;
}

Explosion.prototype = (function() {
	var p = Object.create(createjs.Sprite.prototype);
	p.constructor = Explosion;

	p.explode = function(x, y) {
		this.on("animationend", function() {
			this.dispatchEvent("exploded", true);
		}, this, true);

		this.play("explode");
		this._notify(x, y);
	};

	p._notify = function(x, y) {
		var e = new createjs.Event("explosion", true);
		e.explosion = {
			x: x,
			y: y,
			radius: this.explosionInfo.width / 2
		};
		this.dispatchEvent(e);
	};

	return p;
}());