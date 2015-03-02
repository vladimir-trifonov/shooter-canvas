/* global 
	images
*/

"use strict";

function Monster(uid, type, x, y, width, height, live) {
	createjs.Bitmap.call(this);

	this.image = images.getResult(type);
	this.x = x;
	this.y = y;
	this.uid = uid;
	this.width = width;
	this.height = height;
	this.live = live;
	this.radius = this.width / 2;

	return this;
}

Monster.prototype = (function() {
	var p = Object.create(createjs.Bitmap.prototype);
	p.constructor = Monster;

	p.update = function() {
		if (this.preventUpdate) {
			return;
		}

		if (this.live === false) {
			this._kill();
		}
	};

	p._kill = function() {
		this.preventUpdate = true;
		this.image = images.getResult("SKULL");
		TweenMax.to(this, 10, {
			alpha: 0,
			onComplete: function() {
				var e = new createjs.Event("monsterKilled", true);
				e.uid = this.uid;
				this.dispatchEvent(e);
			},
			onCompleteScope: this,
		});		
	};

	return p;
}());