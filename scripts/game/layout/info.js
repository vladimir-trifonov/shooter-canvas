/* global */

"use strict";

var Info = function() {	
	var _self = this;
	$.get("templates/partials/info.hbs").then(function(src) {
		_self.tpl = Handlebars.compile(src);
		_self._render();
	});
	return this;
};

Info.prototype = (function() {
	var p = Object.create(null);
	p.constructor = Info;

	p._render = function() {
		$(".container .info").remove();
		$(".container").append(this.tpl());
	};

	return p;
}());