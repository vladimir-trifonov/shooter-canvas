/* global 
	mainData
*/

"use strict";

var Stats = function() {
	var _self = this;
	$.get("templates/partials/stats.hbs").then(function(src) {
		_self.tpl = Handlebars.compile(src);
		_self._render();
	});

	return this;
};

Stats.prototype = (function() {
	var p = Object.create(null);
	p.constructor = Stats;

	p._render = function() {
		$(".container .stats").remove();
		$(".container").append(this.tpl(mainData.stats));
	};

	p.inc = function(key, val) {
		mainData.stats[key] += val;
		this._render();
	};

	p.update = function(key, val) {
		mainData.stats[key] = val;
		this._render();
	};

	return p;
}());