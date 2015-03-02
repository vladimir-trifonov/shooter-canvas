/* global
	helper,
	config,
	images,
	Laser
*/

"use strict";

function Character() {
	createjs.Shape.call(this);

	this.config = config.assets.animation.character;

	this.width = 53;
	this.height = 63;

	this.x = 200;
	this.y = 200;
	this.regX = 15;
	this.regY = 1;
	this.tl = new TimelineMax();
	this.innerContainer = new createjs.Container();

	this.canAnimate = true;
	this.zigzagInProgress = false;
	this._autoZigZag = false;
	this.actions = {};
	this.lastAction = null;	

	this._loadCharacter();
	this._loadLaser();

	this.lastX = this.x;
	this.lastY = this.y;

	return this;
}

Character.actions = {
	moveLeft: "moveLeft",
	moveRight: "moveRight",
	moveUp: "moveUp",
	moveDown: "moveDown",
	jump: "jump",
	zigzag: "zigzag"
};

Character.prototype = (function() {
	var p = Object.create(createjs.Container.prototype);
	p.constructor = Character;

	p._loadCharacter = function() {
		var data = {
			images: [images.getResult("sniper")],
			framerate: 25,
			frames: {
				width: this.width,
				height: this.height
			},
			animations: {
				walk: [0, 6],
				idle: [0]
			}
		};

		var characterSpriteSheet = new createjs.SpriteSheet(data);
		this.character = new createjs.Sprite(characterSpriteSheet);

		this.addChild(this.innerContainer);
		this.innerContainer.addChild(this.character);
	};

	p._updateDistance = function() {
		var e = new createjs.Event("distanceInc", true);
		e.distance = Math.round(helper.lineDistance(this.x, this.y, this.lastX, this.lastY));
		this.dispatchEvent(e);
		this.lastX = this.x;
		this.lastY = this.y;
	};

	p._loadLaser = function() {
		this.laser = new Laser();
		this.innerContainer.addChild(this.laser);
	};

	p.rotate = function(x, y) {
		this.rotation = helper.calcAngle(this.x, this.y, x, y);
	};

	p.move = function(x, y) {
		var duration = helper.calcDuration(this.config.pixelsPerSecond, this.x, this.y, x, y);
		this._animateMove(duration, x, y, Linear.easeNone, true, true);

		this._stopZigZag();
		if (this.actions.zigzag) {
			this._startZigZag(true, false);
		}
	};

	p.fire = function(x, y) {
		var evt = new createjs.Event("fire");
		evt.targetX = x;
		evt.targetY = y;
		this.dispatchEvent(evt);
	};

	p.tick = function() {
		this._update();
	};

	p._animateMove = function(duration, x, y, ease, canBreak, mouseClick) {
		if (!this.canAnimate) return;
		if (!canBreak) this.canAnimate = false;

		var options = {
			x: x,
			y: y,
			ease: ease,
			overwrite: "all",
			onComplete: function() {
				this._idle();
				this.canAnimate = true;
				if (mouseClick) {
					this._stopZigZag();
				}
			},
			onCompleteScope: this,
			onUpdate: this._updateDistance.bind(this)
		};

		this._walk();
		this.tl.to(this, duration, options);
	};

	p._walk = function() {
		if (this.isWalking !== true) {
			this.isWalking = true;
			this.character.gotoAndPlay("walk");
		}
	};

	p._idle = function() {
		this.isWalking = false;
		this.character.gotoAndStop("idle");
	};

	p._update = function() {
		if (!this._isMoved()) return;

		var _self = this;
		var angle = helper.toRadians(this.rotation - 90);
		var isBlocked = false;
		var easing = Linear.easeNone;
		var offset = this.config.moveOffset;
		var canBreak = true;
		var directions = [];
		var res = helper.getOffsetByDirection(this.actions);

		if (res.angleOffset !== 0) {
			angle -= helper.toRadians(res.angleOffset);
		}

		if (this.actions.jump) {
			offset = this.config.jumpOffset;
			easing = Quart.easeIn;
		}

		if (this.actions.jump) {
			canBreak = false;
		}

		if (!this.actions.zigzag) {
			this._stopZigZag();
		} else if (!this.zigzagInProgress || this.side !== res.side) {
			this.side = res.side;
			this._startZigZag(false, this.side);
		}

		var offsetCos = offset * Math.cos(angle);
		var offsetSin = offset * Math.sin(angle);

		var x = this.x + (res.reverse ? -offsetCos : offsetCos);
		var y = this.y + (res.reverse ? -offsetSin : offsetSin);

		var duration = helper.calcDuration(this.config.pixelsPerSecond, this.x, this.y, x, y);
		this._animateMove(duration, x, y, easing, canBreak);
	};

	p._startZigZag = function(autoZigZag, side) {
		if (autoZigZag) this._autoZigZag = true;
		this.zigzagInProgress = true;

		var options = {
			yoyo: true,
			ease: Linear.easeNone,
			repeat: -1
		};

		var offset = this.config.zigzagOffset;

		if (side) {
			options.y = offset;
		} else {
			options.x = offset;
		}

		TweenMax.to(this.innerContainer, 0.5, options);
	};

	p._stopZigZag = function() {
		this.zigzagInProgress = false;
		this._autoZigZag = false;
		TweenMax.to(this.innerContainer, 0.2, {
			x: 0,
			y: 0
		});
	};

	p.actionStart = function(action) {
		this.actions[action] = true;
	};

	p.actionEnd = function(action) {
		this.actions[action] = false;
		if ((!this.actions.zigzag || !this._isMoved()) && !this._autoZigZag) {
			this._stopZigZag();
		}
	};

	p._isMoved = function() {
		var _self = this;
		return Object.keys(this.actions).some(function(action) {
			if (action !== "zigzag" && _self.actions && _self.actions[action]) {
				return true;
			}
		});
	};

	return p;
}());