/* global
	SplashScreen,
	config,
	Menu,
	Game
*/

"use strict";

var images = null;
var menu = null;

var App = {
	init: function(id) {
		this.config = config.assets;
		this._addStage(id);
		this._loadAssets();
	},

	_loadAssets: function() {
		images = new createjs.LoadQueue(false);
		images.on("complete", this._loadSplash, this, true);
		images.loadManifest(this.config.manifest.main);
	},

	_addStage: function(id) {
		this.stage = new createjs.Stage(id);
	},

	_loadSplash: function() {
		this.splashScreen = new SplashScreen({
			x: 75,
			y: 200
		});
		this.splashScreen.on("startGame", function() {
			this._preInitGame();
			this._hideSplash();
		}, this, true);

		this.stage.addChild(this.splashScreen);
		this.stage.update();
	},

	_preInitGame: function() {
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.on("tick", this.stage);
	},

	_hideSplash: function() {
		this.splashScreen.on("hidden", function() {
			this.stage.removeChild(this.splashScreen);
			this._startGame();
		}, this);
		this.splashScreen.hide();
	},

	_startGame: function() {
		var game = new Game(this.stage);
		this.stage.addChild(game);
		this._loadGameLayout();
		this._initGameEventHandlers();
	},

	_loadGameLayout: function() {
		menu = new Menu();
	},

	_initGameEventHandlers: function() {
		this.stage.on("distanceInc", function(e) {
			menu.stats.inc("distance", e.distance);
		}, this);
	}
};

window.onload = function() {
	var app = Object.create(App);
	app.init("canvas");
};