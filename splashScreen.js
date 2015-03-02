/* global
	config
*/

"use strict";

function SplashScreen(options) {
	createjs.Container.call(this);

	this.config = config.splashScreen;

	this.txt = {};
	this.txt.x = 310;
	this.txt.y = 230;

	this._load(options.x, options.y);	
	return this;
}

SplashScreen.prototype = (function() {
	var p = Object.create(createjs.Container.prototype);
	p.constructor = SplashScreen;

	p._load = function(x, y) {
		var main = new createjs.Shape();
		main.graphics
			.setStrokeStyle(10)
			.beginStroke("#333638")
			.beginFill("#3E4144")
			.drawRoundRect(0, 0, 830, 480, 10);
		
		var button = new createjs.Shape();
		button.graphics
			.beginFill("rgba(39,61,69,0.8)")
			.drawRoundRect(245, 215, 330, 65, 5);

		button.on("click", function() {
			this.dispatchEvent("startGame");
		}, this, true);
		
		var txt = new createjs.Text("START GAME", "32px Foo", "#000");
		txt.x = this.txt.x;
		txt.y = this.txt.y;

		this.x = x;
		this.y = y;

		this.addChild(main, button, txt);
	};

	p.hide = function() {
		var tl = new TimelineLite();

		tl.to(this, 0.5, {
			y: -1000,
			ease: Back.easeIn,
			onComplete: function() {
				this.dispatchEvent("hidden");
			},
			onCompleteScope:this
		});
	};

	return p;
}());