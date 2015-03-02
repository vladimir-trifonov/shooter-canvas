/* global 
	config,
	mainData,
	Info,
	Stats
*/

"use strict";

var Menu = function() {
	this._render();
	return this;
};

Menu.prototype = (function() {
	var p = Object.create(null);
	p.constructor = Menu;

	p._render = function() {
		var _self = this;
		$.get("templates/menu.hbs").then(function(src) {
			var tpl = Handlebars.compile(src)();

			$("body").append(tpl);
			_self._initPartials.call(_self);
			_self._initEventHandlers();
		});
	};

	p._initPartials = function() {	
		this.info = new Info();	
		this.stats = new Stats();		
	};

	p._initEventHandlers = function() {
		$(".menu").on("click", ".color-select", function() {
			$(this).parents(".menu").attr("data-skin", $(this).attr("data-skin"));
		});
	};	

	return p;
}());