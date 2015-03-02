"use strict";

var helper = {
	lineDistance: function(x0, y0, x1, y1) {
		var xs = 0;
		var ys = 0;

		xs = x1 - x0;
		xs = xs * xs;

		ys = y1 - y0;
		ys = ys * ys;

		return Math.sqrt(xs + ys);
	},
	calcAngle: function(x0, y0, x1, y1) {
		var dx = x1 - x0,
			dy = y1 - y0,
			angle = Math.atan2(dy, dx) / Math.PI * 180 + 90;

		return angle;
	},
	calcDuration: function(pixelsPerSecond, x0, y0, x1, y1) {
		var distance = helper.lineDistance(x0, y0, x1, y1);
		return Math.abs(distance / pixelsPerSecond);
	},
	toRadians: function(angle) {
		return angle * (Math.PI / 180);
	},
	getOffsetByDirection: function(actions) {
		var angleOffset = 0;
		var reverse = false;
		var side = false;

		if (actions.moveRight) {
			angleOffset = -90;
			side = true;
		} else if (actions.moveLeft) {
			angleOffset = 90;
			side = true;
		}

		if (actions.moveDown) {
			if (angleOffset !== 90 && angleOffset !== -90) {
				reverse = true;
			}
			angleOffset = (angleOffset === 90 ? 135 : (angleOffset === -90 ? 225 : angleOffset));
		} else if (actions.moveUp) {
			angleOffset = (angleOffset === 90 ? 45 : (angleOffset === -90 ? -45 : angleOffset));
		}

		return {
			angleOffset: angleOffset,
			reverse: reverse,
			side: side
		};

	},
	pad: function(val) {
		return val > 9 ? val : "0" + val;
	},
	secToTime: function(sec) {
		return helper.pad(parseInt(sec / 3600 % 60, 10)) +
			":" +
			helper.pad(parseInt(sec / 60 % 60, 10)) +
			":" +
			helper.pad(sec % 60);
	},
	hasCollision: function(obj1, obj2) {
		var distance = Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
		if (distance < obj1.radius + obj2.radius) {
			return true;
		}
		return false;
	}
};