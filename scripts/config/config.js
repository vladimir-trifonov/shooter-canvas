"use strict";

var config = {
	assets: {
		manifest: {
			main: [{
				id: "sniper",
				src: "assets/images/sniper.png"
			}, {
				id: "rocket",
				src: "assets/images/rocket.png"
			}, {
				id: "explosion",
				src: "assets/images/explosion.png"
			}, {
				id: "TARGET0",
				src: "assets/images/targets/target0.png"
			}, {
				id: "TARGET1",
				src: "assets/images/targets/target1.png"
			}, {
				id: "SKULL",
				src: "assets/images/targets/skull.png"
			}]
		},
		animation: {
			character: {
				pixelsPerSecond: 250,
				moveOffset: 50,
				jumpOffset: 200,
				zigzagOffset: -100
			},
			rocket: {
				pixelsPerSecond: 1000
			}
		},
		targets: [
			"TARGET0",
			"TARGET1"
		],
		target: {
			width: 46,
			height: 46
		}
	},
	keys: {
		LEFT: 37,
		RIGHT: 39,
		UP: 38,
		DOWN: 40,
		SPACEBAR: 32,
		A: 65,
		D: 68,
		W: 87,
		S: 83,
		SHIFT: 16
	}
};