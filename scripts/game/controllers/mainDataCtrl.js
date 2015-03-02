/* global
	mainData
*/

"use strict";

function MainDataCtrl() {
	createjs.EventDispatcher.call(this);
	return this;
}

MainDataCtrl.prototype = (function() {
	var p = Object.create(createjs.EventDispatcher.prototype);
	p.constructor = MainDataCtrl;

	p.add = function(target) {
		mainData.targets.push(target);
	};

	p.remove = function(uid) {
		var target = _.findWhere(mainData.targets, {uid: uid});
		mainData.targets = _.without(mainData.targets, target);	
	};

	p.edit = function(uid, data) {
		_.extend(_.findWhere(mainData.targets, {uid: uid}), data);
	};

	return p;
}());