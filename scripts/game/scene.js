/* global 
	mainData,
	Monster
*/

"use strict";

function Scene(width, height) {
	createjs.Container.call(this);

	this.oldData = [];

	return this;
}

Scene.prototype = (function() {
	var p = Object.create(createjs.Container.prototype);
	p.constructor = Scene;

	p.update = function() {
		this.newData = mainData.targets;

		var current = _.pluck(this.oldData, "uid");
		var forAdd = _.difference(this.newData, this.oldData);
		var forUpdate = _.intersection(this.newData, this.oldData);

		if (current.length !== this.children.length) {
			this._remove(current);
		}

		if (forAdd.length > 0) {
			this._add(forAdd);
		}

		if (forUpdate.length > 0) {
			this._edit(forUpdate);
		}

		this.oldData = _.clone(this.newData);
	};

	p._add = function(targets) {
		_.each(targets, function(target) {
			var newTarget = new Monster(target.uid, target.type, target.x, target.y, target.width, target.height, target.live);
			this.addChild(newTarget);
		}, this);
	};

	p._remove = function(targets) {
		var indexes = [];
		_.each(this.children, function(child) {
			if (_.indexOf(targets, child.uid) === -1) {
				indexes.push(this.getChildIndex(child));
			}
		}, this);

		this.removeChildAt(indexes);
	};

	p._edit = function(targets) {
		_.each(this.children, function(child) {
			var target = _.findWhere(targets, {
				uid: child.uid
			});
			_.extend(child, target);
			child.update();
		}, this);
	};

	return p;
}());