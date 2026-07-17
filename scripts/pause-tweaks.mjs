let modulename = "pause-tweaks";

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

function init() {
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
		type: Number
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
		type: Number
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
		type: Number
	});
	
	game.settings.register(modulename, "pause-smallerbg", {
		name: game.i18n.localize("pausetweaks.settings.smallerbg.name"),
		hint: game.i18n.localize("pausetweaks.settings.smallerbg.hint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});
	
	game.settings.register(modulename, "pause-nospin", {
		name: game.i18n.localize("pausetweaks.settings.nospin.name"),
		hint: game.i18n.localize("pausetweaks.settings.nospin.hint"),
		scope: "world",
		config: true,
		default: game.system.id == "dnd5e" ? true : false,
		type: Boolean
	});
	
	game.settings.register(modulename, "pause-spindirection", {
		name: game.i18n.localize("pausetweaks.settings.spindirection.name"),
		hint: game.i18n.localize("pausetweaks.settings.spindirection.hint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});
	
	game.settings.register(modulename, "pause-pulse", {
		name: game.i18n.localize("pausetweaks.settings.pulse.name"),
		hint: game.i18n.localize("pausetweaks.settings.pulse.hint"),
		scope: "world",
		config: true,
		default: false,
		type: Boolean
	});
	
	game.settings.register(modulename, "pause-text", {
		name: game.i18n.localize("pausetweaks.settings.text.name"),
        hint: game.i18n.localize("pausetweaks.settings.text.hint"),
        scope: "world",
        config: true,
		default: "Game Paused",
        type: String
    });
	
	game.settings.register(modulename, "pause-img", {
		name: game.i18n.localize("pausetweaks.settings.img.name"),
        hint: game.i18n.localize("pausetweaks.settings.img.hint"),
        scope: "world",
        config: true,
		default: game.system.id == "dnd5e" ? "systems/dnd5e/ui/official/ampersand.svg" : "ui/pause.svg",
        type: String,
		filePicker: 'imagevideo'
    });

	if (game.system.id == "dnd5e") {
		game.settings.register(modulename, "pause-dnd5e", {
			name: game.i18n.localize("pausetweaks.settings.dnd5e.name"),
			hint: game.i18n.localize("pausetweaks.settings.dnd5e.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean,
			requiresReload: true
		});
	}
}

function renderGamePause(app, html) {
	if (game.system.id == "dnd5e" && game.settings.get(modulename, 'pause-dnd5e')) {
		// Copied from the dnd5e system.
		// https://github.com/foundryvtt/dnd5e/blob/0f782c79a467b0ee6363f03bd9c6fb620a177d19/dnd5e.mjs#L610
		// As far as I'm aware this should be fine as I use the MIT license as well. Please open an issue if this is not acceptable.
		html.classList.add("dnd5e2");
		const container = document.createElement("div");
		container.classList.add("flexcol");
		container.append(...html.children);
		html.append(container);
	}

	//Find what we'll be changing
	let img = html.querySelector("img")
	let txt = html.querySelector("figcaption")
	let className = "pausetweaks-spin"

	//Setup Spin
	img.classList.remove("fa-spin")
	img.classList.add(className)

	//Old Functions, why change what isn't broken
	updateHeight(game.settings.get(modulename, 'pause-height'));
	updateScale(game.settings.get(modulename, 'pause-scale'));
	updateBGSize(game.settings.get(modulename, 'pause-smallerbg'));

	//Update Spin
	if (game.settings.get(modulename, 'pause-nospin')) {
		img.classList.remove(className)
	} else {
		img.classList.add(className)
	}

	//Spin Direction
	if (game.settings.get(modulename, 'pause-spindirection')) {
		$('.pausetweaks-spin').css('animation-direction', 'reverse')
	} else {
		$('.pausetweaks-spin').css('animation-direction', 'normal')
	}

	//Spin Speed
	img.style.animationDuration = (game.settings.get(modulename, 'pause-spinspeed')/10).toString()+'s'

	//Pulse Animation
	if (game.settings.get(modulename, 'pause-pulse')) {
		$('#pause.paused').css('animation', 'disabled')
	} else {
		$('#pause.paused').css('animation', 'pulse 3s ease-in-out infinite')
	}

	//Apply Text
	txt.innerHTML = game.settings.get(modulename, 'pause-text');

	//Apply Image
	img.src = game.settings.get(modulename, 'pause-img');
}

Hooks.on("init", init);
Hooks.on("renderGamePause", renderGamePause);
