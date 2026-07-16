let modulename = "pause-tweaks";

function FindChild(child) {
	let pausechildren = document.getElementById("pause").children[0].children
	for (let i=0; i < pausechildren.length; i++) {
		if (pausechildren[i].localName == child) {
			return pausechildren[i];
		}
	}
}

function setupSpin() {
	let img = FindChild("img")
	
	if (img != null) {
		img.classList.remove("fa-spin")
		img.classList.add("pausetweaks-spin")
	}
}

function updateHeight(height) {
	if (game.settings.get(modulename, 'pause-smallerbg')) {
		$('#pause').css('top', `calc(${height}vh - 85px)`)
	} else {
		$('#pause').css('top', `calc(${height}vh - 100px)`)
	}
}

function updateScale(scale) {
	$('#pause').css('scale', scale/100);
}

function updateBGSize(toggle) {
	if (toggle) {
		$('#pause').css('left', 'calc(40vw)')
		$('#pause').css('width', '20%')
		$('#pause').css('height', '150px')
		$('#pause').css('top', `calc(${game.settings.get(modulename, 'pause-height')}vh - 85px)`)
	} else {
		$('#pause').css('left', '0')
		$('#pause').css('width', '100%')
		$('#pause').css('height', '180px')
		$('#pause').css('top', `calc(${game.settings.get(modulename, 'pause-height')}vh - 100px)`)
	}
}

function updateSpin(toggle) {
	let img = FindChild("img")
	let className = "pausetweaks-spin"
	
	if (img != null) {
		if (toggle && img.classList.contains(className)) {
			img.classList.remove(className)
		} else if (!toggle && !img.classList.contains(className)) {
			img.classList.add(className)
		}
	}
}

function updateSpinDirection(toggle) {
	if (toggle) {
		$('.pausetweaks-spin').css('animation-direction', 'reverse')
	} else {
		$('.pausetweaks-spin').css('animation-direction', 'normal')
	}
}

function updateSpinSpeed(time) {
	let img = FindChild("img")
	
	if (img != null) {
		img.style.animationDuration = (time/10).toString()+'s'
	}
}

function updatePulse(toggle) {
	if (toggle) {
		$('#pause.paused').css('animation', 'disabled')
	} else {
		$('#pause.paused').css('animation', 'pulse 3s ease-in-out infinite')
	}
}

function updateText(text) {
	FindChild("figcaption").innerHTML = text;
}

function updateImg(image) {
	let img = FindChild("img")
	if (img != null) {
		img.src = image;
	}
}

function ready() {
	game.settings.register(modulename, "pause-height", {
		name: game.i18n.localize("pausetweaks.settings.height.name"),
		hint: game.i18n.localize("pausetweaks.settings.height.hint"),
		scope: "world",
		config: true,
		range: {
			min: 0,
			max: 100,
			step: 1,
		},
		default: 50,
		type: Number,
		onChange: (value) => {
			updateHeight(value);
		}
	});
	
	game.settings.register(modulename, "pause-scale", {
		name: game.i18n.localize("pausetweaks.settings.scale.name"),
		hint: game.i18n.localize("pausetweaks.settings.scale.hint"),
		scope: "world",
		config: true,
		range: {
			min: 1,
			max: 200,
			step: 1,
		},
		default: 100,
		type: Number,
		onChange: (value) => {
			updateScale(value);
		}
	});
	
	game.settings.register(modulename, "pause-spinspeed", {
		name: game.i18n.localize("pausetweaks.settings.spinspeed.name"),
		hint: game.i18n.localize("pausetweaks.settings.spinspeed.hint"),
		scope: "world",
		config: true,
		range: {
			min: 1,
			max: 200,
			step: 1,
		},
		default: 50,
		type: Number,
		onChange: (value) => {
			updateSpinSpeed(value);
		}
	});
	
	game.settings.register(modulename, "pause-smallerbg", {
		name: game.i18n.localize("pausetweaks.settings.smallerbg.name"),
		hint: game.i18n.localize("pausetweaks.settings.smallerbg.hint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
		onChange: (value) => {
			updateBGSize(value)
        }
	});
	
	game.settings.register(modulename, "pause-nospin", {
		name: game.i18n.localize("pausetweaks.settings.nospin.name"),
		hint: game.i18n.localize("pausetweaks.settings.nospin.hint"),
		scope: "world",
		config: true,
		default: game.system.id == "dnd5e" ? true : false,
		type: Boolean,
		onChange: (value) => {
			updateSpin(value)
        }
	});
	
	game.settings.register(modulename, "pause-spindirection", {
		name: game.i18n.localize("pausetweaks.settings.spindirection.name"),
		hint: game.i18n.localize("pausetweaks.settings.spindirection.hint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
		onChange: (value) => {
			updateSpinDirection(value)
        }
	});
	
	game.settings.register(modulename, "pause-pulse", {
		name: game.i18n.localize("pausetweaks.settings.pulse.name"),
		hint: game.i18n.localize("pausetweaks.settings.pulse.hint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean,
		onChange: (value) => {
			updatePulse(value)
        }
	});
	
	game.settings.register(modulename, "pause-text", {
		name: game.i18n.localize("pausetweaks.settings.text.name"),
        hint: game.i18n.localize("pausetweaks.settings.text.hint"),
        scope: "world",
        config: true,
		default: "Game Paused",
        type: String,
        onChange: (value) => {
			updateText(value);
        }
    });
	
	game.settings.register(modulename, "pause-img", {
		name: game.i18n.localize("pausetweaks.settings.img.name"),
        hint: game.i18n.localize("pausetweaks.settings.img.hint"),
        scope: "world",
        config: true,
		default: game.system.id == "dnd5e" ? "systems/dnd5e/ui/official/ampersand.svg" : "ui/pause.svg",
        type: String,
		filePicker: 'imagevideo',
        onChange: (value) => {
			updateImg(value);
        }
    });
	
	applyAll();

	// Foundry v13+ re-renders the GamePause ApplicationV2 every time the pause
	// state toggles (_replaceHTML -> replaceChildren rebuilds img + figcaption),
	// which discards the tweaks applied above. Re-apply them on every render so
	// they persist past the first pause.
	Hooks.on("renderGamePause", applyAll);
}

function applyAll() {
	setupSpin();
	updateHeight(game.settings.get(modulename, 'pause-height'));
	updateScale(game.settings.get(modulename, 'pause-scale'));
	updateSpinSpeed(game.settings.get(modulename, 'pause-spinspeed'));
	updateBGSize(game.settings.get(modulename, 'pause-smallerbg'));
	updateSpin(game.settings.get(modulename, 'pause-nospin'));
	updateSpinDirection(game.settings.get(modulename, 'pause-spindirection'));
	updateText(game.settings.get(modulename, 'pause-text'));
	updateImg(game.settings.get(modulename, 'pause-img'));
	updatePulse(game.settings.get(modulename, 'pause-pulse'));
}

Hooks.on("ready", ready);
