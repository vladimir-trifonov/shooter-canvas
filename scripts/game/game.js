/* global
	images,
	Character,
	Circle,
	Target,
	config,
	mainData,
	MainDataCtrl,
	Scene,
	Timer,
	Rocket,
	menu,
	helper
*/

"use strict";

var Game = function(stage) {
	createjs.Container.call(this);

	this.stage = stage;
	this.nextId = 0;

	this._setCharacter();
	this._setTimer();

	this._initTargets();
	this._initEventHandlers();

	return this;
};

Game.prototype = (function() {
	var p = Object.create(createjs.Container.prototype);
	p.constructor = Game;

	p._initTargets = function() {
		this.scene = new Scene();
		this.addChild(this.scene);

		this.mainDataCtrl = new MainDataCtrl();

		this._addRandomTarget(2, 5);
		this._removeRandomTarget(5, 15);
	};

	p._addRandomTarget = function(min, max) {
		var _self = this;
		setTimeout(function() {
			_self.mainDataCtrl.add({
				uid: _self.nextId++,
				x: _.random(0, _self.stage.canvas.width - config.assets.target.width),
				y: _.random(0, _self.stage.canvas.height - config.assets.target.height),
				type: _.sample(config.assets.targets),
				live: true,
				width: config.assets.target.width,
				height: config.assets.target.height
			});
			_self.scene.update();

			_self._addRandomTarget.call(_self, min, max);
		}, _.random(min, max) * 1000);
	};

	p._removeRandomTarget = function(min, max) {
		var _self = this;
		setTimeout(function() {
			if (mainData.targets.length > 0) {
				var target = mainData.targets[_.random(0, mainData.targets.length - 1)];
				_self._removeTarget.call(_self, target.uid);
			}

			_self._removeRandomTarget.call(_self, min, max);
		}, _.random(min, max) * 1000);
	};

	p._removeTarget = function(uid) {
		this.mainDataCtrl.remove(uid);
		this.scene.update();
	};

	p._killTargets = function(e) {		
		_.each(this.scene.children, function(child) {
			if (child.live === true && helper.hasCollision(child, e.explosion)) {
				this.mainDataCtrl.edit(child.uid, {
					live: false
				});				
				menu.stats.inc("killed", 1);
			}
		}, this);
		this.scene.update();
	};

	p._setCharacter = function() {
		this.character = new Character(images);

		this.character.on("fire", function(e) {
			var rocket = new Rocket(this.character.rotation, this.character.x, this.character.y, e.targetX, e.targetY);
			this.addChild(rocket);

			rocket.on("rocketRemove", function(e) {
				this.removeChild(rocket);
			}, this, true);

			menu.stats.inc("shoots", 1);
		}, this);

		this.addChild(this.character);
	};

	p._initEventHandlers = function() {
		var _self = this;

		this.stage.on("stagemousemove", function(e) {
			this.character.rotate(e.stageX, e.stageY);
		}, this);

		this.stage.on("stagemousedown", function(e) {
			var button = e.nativeEvent.button,
				isLeftClick = (button === 0),
				isRightClick = (button === 2);

			if (isLeftClick) {
				this.character.fire(e.stageX, e.stageY);
			} else if (isRightClick) {
				this._clickAnimation(e.stageX, e.stageY);
				this.character.move(e.stageX, e.stageY);
			}
		}, this);

		this.stage.on("tick", function(e) {
			this.character.tick();
		}, this);

		document.addEventListener("keydown", this._onKeyDown.bind(this));
		document.addEventListener("keyup", this._onKeyUp.bind(this));

		this.on("explosion", this._killTargets);
		this.on("monsterKilled", function(e) {
			this._removeTarget(e.uid);
		}, this);
	};

	p._onKeyDown = function(e) {
		var action = this._getActionByKey(e.which);
		if (action) {
			this.character.actionStart(action);
		}
	};

	p._onKeyUp = function(e) {
		var action = this._getActionByKey(e.which);
		if (action) {
			this.character.actionEnd(action);
		}
	};

	p._getActionByKey = function(key) {
		switch (key) {
			case config.keys.LEFT:
			case config.keys.A:
				return Character.actions.moveLeft;
			case config.keys.RIGHT:
			case config.keys.D:
				return Character.actions.moveRight;
			case config.keys.W:
			case config.keys.UP:
				return Character.actions.moveUp;
			case config.keys.S:
			case config.keys.DOWN:
				return Character.actions.moveDown;
			case config.keys.SPACEBAR:
				return Character.actions.jump;
			case config.keys.SHIFT:
				return Character.actions.zigzag;
			default:
				return;
		}
	};

	p._clickAnimation = function(x, y) {
		var circle = new Circle(x, y);
		this.addChild(circle);

		circle.on("completed", function() {
			this.removeChild(circle);
		}, this, true);
	};

	p._setTimer = function() {
		var timer = new Timer(1);
		timer.on("tick", function(e) {
			menu.stats.update("time", e.time);
		}, this);
	};

	return p;
}());