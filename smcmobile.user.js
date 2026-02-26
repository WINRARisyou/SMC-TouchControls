// ==UserScript==
// @name         Super Mario Construct Touch Controls
// @description  Adds touch support for Super Mario Construct
// @author       WINRARisyou
// @namespace    https://winarisyou.github.io/SMC-TouchControls
// @homepage     https://github.com/WINRARisyou/SMC-TouchControls
// @downloadURL  https://winrarisyou.github.io/SMC-TouchControls/smcmobile.user.js
// @match        https://levelsharesquare.com/html5/supermarioconstruct/*
// @version      1.2.1
// @updateURL    https://winrarisyou.github.io/SMC-TouchControls/smcmobile.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==
/* WINRARisyou was here. */
window.CONTROLS_VERSION = "1.2.1"
if (window.debugmode !== true) window.debugmode = false;

window.assetsURL = "https://winrarisyou.github.io/SMC-TouchControls/game";

// TouchControls class manages the mobile/touch gamepad UI and its interactions
window.TouchControls = class TouchControls {
	constructor(mobile = true) {
		this.mobile = mobile;
		this.reset = window.reset || true;
		this.TouchControlsLoaded = false;
		this.activeButtons = new Set();
		this.touchMap = new Map();
		this.activeButtonStates = {};
		this.toggledButtons = new Set();
		this.originalButtonData = {};
		this.buttons = {};

		// Configuration for all gamepad buttons and containers
		this.gamepadConfig = {
			specialButtons: {
				position: { top: "3px", left: "0px" },
				size: { width: "100%", height: "2px" },
				buttons: [
					{ id: "pause", border: false, label: "Pause", color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "pause-active.png", inactive: "pause-inactive.png", x: "36px", y: "0px", width: "30px", height: "30px", key: "p", keyCode: 80 },
					{ id: "fullscreen", border: false, label: "Fullscreen", color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "fullscreen-active.png", inactive: "fullscreen-inactive.png", x: "3px", y: "0px", width: "30px", height: "30px", key: "", keyCode: null },
					{ id: "item", border: false, label: "Item", color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", x: "calc(50% - 30px)", active: "item-active.png", inactive: "item-inactive.png", y: "0px", width: "60px", height: "30px", key: "Shift", keyCode: 16 },
					{ id: "settings", border: false, label: "Settings", color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", x: "calc(100% - 33px)", active: "settings-active.png", inactive: "settings-inactive.png", y: "0px", width: "30px", height: "30px", key: "", keyCode: null }
				]
			},
			dpad: {
				position: { bottom: 60, left: 10 },
				size: { width: 150, height: 150 },
				buttons: [
					{ id: "up", label: "↑", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "up-active.png", inactive: "up-inactive.png", x: 50, y: 0, width: 50, height: 50, key: "ArrowUp", keyCode: 38 },
					{ id: "left", label: "←", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "left-active.png", inactive: "left-inactive.png", x: 0, y: 50, width: 50, height: 50, key: "ArrowLeft", keyCode: 37 },
					{ id: "right", label: "→", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "right-active.png", inactive: "right-inactive.png", x: 100, y: 50, width: 50, height: 50, key: "ArrowRight", keyCode: 39 },
					{ id: "down", label: "↓", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "down-active.png", inactive: "down-inactive.png", x: 50, y: 100, width: 50, height: 50, key: "ArrowDown", keyCode: 40 },
					{ id: "center", label: "", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "center.png", inactive: "center.png", x: 50, y: 50, width: 50, height: 50, key: "", keyCode: 0 },
					{ id: "up-left", label: "↖", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "", inactive: "", x: 0, y: 0, width: 50, height: 50, keys: ["ArrowUp","ArrowLeft"], keyCodes: [38,37] },
					{ id: "up-right", label: "↗", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "", inactive: "", x: 100, y: 0, width: 50, height: 50, keys: ["ArrowUp","ArrowRight"], keyCodes: [38,39] },
					{ id: "down-left", label: "↙", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "", inactive: "", x: 0, y: 100, width: 50, height: 50, keys: ["ArrowDown","ArrowLeft"], keyCodes: [40,37] },
					{ id: "down-right", label: "↘", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "", inactive: "", x: 100, y: 100, width: 50, height: 50, keys: ["ArrowDown","ArrowRight"], keyCodes: [40,39] }
				]
			},
			actionButtons: {
				position: { bottom: 60, right: 10 },
				size: { width: 200, height: 130 },
				buttons: [
					{ id: "jump", label: "Jump", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "B-active.png", inactive: "B-inactive.png", x: 0, y: 70, width: 60, height: 60, key: "z", keyCode: 90 },
					{ id: "run", label: "Run", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "Y-active.png", inactive: "Y-inactive.png", x: 70, y: 70, width: 60, height: 60, key: "x", keyCode: 88 },
					{ id: "spinjump", label: "Spin", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "A-active.png", inactive: "A-inactive.png", x: 140, y: 70, width: 60, height: 60, key: "c", keyCode: 67 },
					{ id: "usepowerup", label: "Use Powerup", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "X-active.png", inactive: "X-inactive.png", x: 105, y: 0, width: 60, height: 60, key: " ", keyCode: 32 },
					{ id: "togglerun", label: "Toggle Run", border: false, color1: "rgba(255, 255, 255, 0)", color2: "rgba(255, 255, 0, 0)", active: "autorun-active.png", inactive: "autorun-inactive.png", x: 35, y: 0, width: 60, height: 60, key: "x", keyCode: 88, isToggle: true }
				]
			}
		};
	}

	// Initializes the touch controls UI and event listeners
	init() {
		if (this.TouchControlsLoaded && this.reset === false) {
			console.warn("Touch Controls have already been created! Don't make 'em twice!");
			return;
		}

		// Prompt user if not on mobile/touch device
		if (!this.mobile) {
			const onPC = prompt("You are not on a mobile/touch device. Do you want to delete touch Controls?", "Yes/No");
			if (!onPC) { 
				this.init();
				return;
			}
			if (onPC.toLowerCase().includes("y")) {
				return;
			} else if (!onPC.toLowerCase().includes("n")) {
				return;
			}
		}

		this.reset = false;
		this.TouchControlsLoaded = true;
		window.TouchControlsLoaded = true;
		
		this.preloadImages();
		this.createGamepad();
		this.setupEventListeners();
		
		if (window.debugmode) {
			this.setupDebugInfo();
		}
	}

	// Preloads button images to prevent flickering
	preloadImages() {
		const allButtons = [
			...this.gamepadConfig.specialButtons.buttons,
			...this.gamepadConfig.dpad.buttons,
			...this.gamepadConfig.actionButtons.buttons
		];

		let hiddenImgContainer = document.getElementById("hiddenImgContainer");
		if (!hiddenImgContainer) {
			hiddenImgContainer = document.createElement("div");
			hiddenImgContainer.id = "hiddenImgContainer";
			document.body.appendChild(hiddenImgContainer);
		}

		allButtons.forEach(button => {
			[button.active, button.inactive].forEach(btnState => {
				const img = new Image();
				img.src = `${window.assetsURL}/${btnState}`;
				this.createHiddenImages(img.src);
			});
		});
	}

	// Creates hidden images for preloading
	createHiddenImages(url) {
		const hiddenImgContainer = document.getElementById("hiddenImgContainer");
		const hiddenImg = document.createElement("img");
		hiddenImg.src = url;
		hiddenImg.style.position = "absolute";
		hiddenImg.style.width = "1px";
		hiddenImg.style.height = "1px";
		hiddenImg.style.opacity = "0";
		hiddenImg.style.pointerEvents = "none";
		hiddenImg.style.zIndex = "-1";
		hiddenImgContainer.appendChild(hiddenImg);
	}

	// Creates a button element for the gamepad
	createButton(button, container) {
		const elem = document.createElement("button");
		elem.id = button.id;
		elem.style.position = "absolute";
		
		if (container.id !== "special") {
			elem.style.left = `${button.x}px`;
			elem.style.top = `${button.y}px`;
			elem.style.width = `${button.width}px`;
			elem.style.height = `${button.height}px`;
			this.originalButtonData[button.id] = {
				x: button.x,
				y: button.y,
				width: button.width,
				height: button.height,
			};
		} else {
			elem.style.left = `${button.x}`;
			elem.style.top = `${button.y}`;
			elem.style.width = `${button.width}`;
			elem.style.height = `${button.height}`;
		}
		
		elem.style.backgroundSize = "cover";
		elem.style.backgroundImage = `url("${window.assetsURL}/${button.inactive}")`;
		elem.style.backgroundColor = button.color1;
		elem.setAttribute("onclick", "event.stopImmediatePropagation();event.stopPropagation();event.preventDefault()");
		elem.style.border = "1px solid black";
		
		if (button.border) {
			elem.style.borderRadius = "5px";
		} else {
			elem.style.border = "none";
		}
		
		elem.style.fontSize = "14px";
		elem.style.userSelect = "none";
		container.appendChild(elem);
		return elem;
	}

	// Creates the gamepad UI and its containers
	createGamepad() {
		const gamepad = document.createElement("div");
		const gameFrame = document.getElementById("game-wrapper");
		gamepad.id = "touch-gamepad";
		gamepad.style.position = "fixed";
		gamepad.style.zIndex = "9998";
		gamepad.style.pointerEvents = "none";
		gamepad.style.width = "100%";
		gamepad.style.height = "100%";
		gamepad.style.top = "0px";
		gamepad.style.left = "0px";
		gameFrame.appendChild(gamepad);

		// Create special buttons container
		const special = this.createContainer("special", this.gamepadConfig.specialButtons);
		gamepad.appendChild(special);

		// Create dpad container
		const dpad = this.createContainer("dpad", this.gamepadConfig.dpad);
		gamepad.appendChild(dpad);

		// Create action buttons container
		const actionButtons = this.createContainer("action-buttons", this.gamepadConfig.actionButtons);
		gamepad.appendChild(actionButtons);

		// Create buttons for each container
		this.gamepadConfig.specialButtons.buttons.forEach(button => {
			const elem = this.createButton(button, special);
			this.buttons[button.id] = { ...button, element: elem };
		});

		this.gamepadConfig.dpad.buttons.forEach(button => {
			const elem = this.createButton(button, dpad);
			this.buttons[button.id] = { ...button, element: elem };
		});

		this.gamepadConfig.actionButtons.buttons.forEach(button => {
			const elem = this.createButton(button, actionButtons);
			this.buttons[button.id] = { ...button, element: elem };
		});

		// Set global references for compatibility
		window.originalButtonData = this.originalButtonData;
	}

	// Creates a container (div) for a group of buttons
	createContainer(id, config) {
		const container = document.createElement("div");
		container.id = id;
		container.style.position = "absolute";
		container.style.pointerEvents = "auto";

		if (id === "special") {
			container.style.width = config.size.width;
			container.style.height = config.size.height;
			container.style.top = config.position.top;
			container.style.left = config.position.left;
		} else {
			container.style.width = `${config.size.width}px`;
			container.style.height = `${config.size.height}px`;
			if (config.position.bottom !== undefined) {
				container.style.bottom = `${config.position.bottom}px`;
			}
			if (config.position.left !== undefined) {
				container.style.left = `${config.position.left}px`;
			}
			if (config.position.right !== undefined) {
				container.style.right = `${config.position.right}px`;
			}
		}

		// Show debug background color if debugmode is enabled
		if (window.debugmode) {
			const colors = { special: "rgba(0, 255, 0, 0.2)", dpad: "rgba(0, 0, 255, 0.2)", "action-buttons": "rgba(255, 0, 0, 0.2)" };
			container.style.backgroundColor = colors[id];
		}

		return container;
	}

	// Sets up touch event listeners for the gamepad
	setupEventListeners() {
		const gamepad = document.getElementById("touch-gamepad");
		gamepad.addEventListener("touchstart", this.handleTouchStart.bind(this), { passive: false });
		gamepad.addEventListener("touchmove", this.handleTouchMove.bind(this), { passive: false });
		gamepad.addEventListener("touchend", this.handleTouchEnd.bind(this), { passive: false });
		gamepad.addEventListener("touchcancel", this.handleTouchEnd.bind(this), { passive: false });

		if (window.debugmode) {
			window.addEventListener("resize", this.updateDebugInfo.bind(this));
		}
	}

	// Creates and displays debug info overlay
	setupDebugInfo() {
		const debugInfo = document.createElement("div");
		debugInfo.id = "debug-info";
		debugInfo.style.position = "fixed";
		debugInfo.style.top = "10px";
		debugInfo.style.left = "10px";
		debugInfo.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
		debugInfo.style.color = "white";
		debugInfo.style.padding = "10px";
		debugInfo.style.fontFamily = "monospace";
		debugInfo.style.fontSize = "12px";
		debugInfo.style.zIndex = "9999";
		document.body.appendChild(debugInfo);

		this.updateDebugInfo();
		window.updateDebugInfo = this.updateDebugInfo.bind(this);
	}

	// Updates debug info overlay with current gamepad/container sizes
	updateDebugInfo() {
		const gamepad = document.getElementById("touch-gamepad");
		const dpad = document.getElementById("dpad");
		const actionButtons = document.getElementById("action-buttons");
		const debugInfo = document.getElementById("debug-info");

		if (debugInfo) {
			debugInfo.innerHTML = `
				Gamepad: ${gamepad.offsetWidth}x${gamepad.offsetHeight}<br>
				D-pad: ${dpad.offsetLeft},${dpad.offsetTop} ${dpad.offsetWidth}x${dpad.offsetHeight}<br>
				Action: ${actionButtons.offsetLeft},${actionButtons.offsetTop} ${actionButtons.offsetWidth}x${actionButtons.offsetHeight}
			`;
		}
	}

	// Simulates a keyboard event in the game iframe and main window
	simulateKeyEvent(keyInfo, type) {
		const iframe = document.getElementById("game"); // Get the iframe
		if (!iframe || !iframe.contentWindow) {
			console.error("Iframe not found or inaccessible.");
			return;
		}
		const iframeDocument = iframe.contentWindow.document;

		const event = new KeyboardEvent(type, {
			bubbles: true,
			cancelable: true,
			key: keyInfo.key,
			keyCode: keyInfo.keyCode,
			which: keyInfo.keyCode,
			code: `Key${keyInfo.key.toUpperCase()}`,
		});

		document.dispatchEvent(event);
		window.dispatchEvent(event);
		iframeDocument.dispatchEvent(event);

		// Also fire keypress after keydown if not prevented
		if (type === "keydown" && !event.defaultPrevented) {
			this.simulateKeyEvent(keyInfo, "keypress");
		}
	}

	// Handles logic for pressing a button (including toggles and special cases)
	handleButtonPress(buttonId) {
		const currentButton = this.buttons[buttonId];
		if (!currentButton) return;

		// Normalize keys: support single key (key/keyCode) or multiple (keys/keyCodes)
		let keys;
		let keyCodes;
		if (Array.isArray(currentButton.keys)) {
			keys = currentButton.keys;
		} else if (currentButton.key) {
			keys = [currentButton.key];
		} else {
			keys = [];
		}

		if (Array.isArray(currentButton.keyCodes)) {
			keyCodes = currentButton.keyCodes;
		} else if (currentButton.keyCode) {
			keyCodes = [currentButton.keyCode];
		} else {
			keyCodes = [];
		}

		// Handle fullscreen button
		if (buttonId === "fullscreen") {
			const iframe = document.getElementById("game-wrapper");
			if (document.fullscreenElement || document.webkitFullscreenElement) {
				currentButton.element.style.backgroundImage = `url("${window.assetsURL}/${currentButton.inactive}")`;
				if (document.exitFullscreen) return document.exitFullscreen();
				if (document.webkitExitFullscreen) return document.webkitExitFullscreen();
			}
			currentButton.element.style.backgroundImage = `url("${window.assetsURL}/${currentButton.active}")`;
			if (iframe.requestFullscreen) return iframe.requestFullscreen();
			if (iframe.webkitRequestFullscreen) return iframe.webkitRequestFullscreen();
		}

		// Handle settings button
		if (buttonId === "settings") {
			window.settingsMenu.open(currentButton);
			return;
		}

		// Handle toggle buttons (supporting multiple keys)
		if (currentButton.isToggle) {
			if (this.toggledButtons.has(buttonId)) {
				this.toggledButtons.delete(buttonId);
				// release all associated keys
				keys.forEach((key, i) => {
					this.activeButtonStates[key] = false;
					const code = keyCodes[i] ?? 0;
					this.simulateKeyEvent({ key: key, keyCode: code }, "keyup");
				});
				currentButton.element.style.backgroundColor = currentButton.color1;
				currentButton.element.style.backgroundImage = `url("${window.assetsURL}/${currentButton.inactive}")`;
			} else {
				this.toggledButtons.add(buttonId);
				keys.forEach((key, i) => {
					this.activeButtonStates[key] = true;
					const code = keyCodes[i] ?? 0;
					this.simulateKeyEvent({ key: key, keyCode: code }, "keydown");
				});
				currentButton.element.style.backgroundColor = currentButton.color2;
				currentButton.element.style.backgroundImage = `url("${window.assetsURL}/${currentButton.active}")`;
			}
		} else {
			// Non-toggle: only simulate keydown if not already active for this button
			if (!this.activeButtons.has(buttonId)) {
				this.activeButtons.add(buttonId);
				keys.forEach((key, i) => {
					this.activeButtonStates[key] = true;
					const code = keyCodes[i] ?? 0;
					this.simulateKeyEvent({ key: key, keyCode: code }, "keydown");
				});
				currentButton.element.style.backgroundColor = currentButton.color2;
				currentButton.element.style.backgroundImage = `url("${window.assetsURL}/${currentButton.active}")`;
                // --- Highlight related buttons when pressing diagonals ---
				if (["up-left", "up-right", "down-left", "down-right"].includes(buttonId)) {
					const related = {
						"up-left": ["up", "left"],
						"up-right": ["up", "right"],
						"down-left": ["down", "left"],
						"down-right": ["down", "right"]
					}[buttonId];

					related.forEach(id => {
						const btn = this.buttons[id];
						if (btn) {
							btn.element.style.backgroundImage = `url("${window.assetsURL}/${btn.active}")`;
						}
					});
				}
			}
		}
	}

	// Handles logic for releasing a button
	handleButtonRelease(buttonId) {
		const currentButton = this.buttons[buttonId];
		if (!currentButton) return;

		const keys = Array.isArray(currentButton.keys) ? currentButton.keys : (currentButton.key ? [currentButton.key] : []);
		const keyCodes = Array.isArray(currentButton.keyCodes) ? currentButton.keyCodes : (currentButton.keyCode ? [currentButton.keyCode] : []);

		// Only release non-toggle buttons
		if (!currentButton.isToggle) {
			if (this.activeButtons.has(buttonId)) {
				this.activeButtons.delete(buttonId);
				// release all associated keys
				keys.forEach((key, i) => {
					this.activeButtonStates[key] = false;
					const code = keyCodes[i] ?? 0;
					this.simulateKeyEvent({ key: key, keyCode: code }, "keyup");
				});
				currentButton.element.style.backgroundColor = currentButton.color1;
				currentButton.element.style.backgroundImage = `url("${window.assetsURL}/${currentButton.inactive}")`;
				// --- Restore related button images when releasing diagonals ---
				if (["up-left", "up-right", "down-left", "down-right"].includes(buttonId)) {
					const related = {
						"up-left": ["up", "left"],
						"up-right": ["up", "right"],
						"down-left": ["down", "left"],
						"down-right": ["down", "right"]
					}[buttonId];

					related.forEach(id => {
						const btn = this.buttons[id];
						if (btn && !this.activeButtons.has(id)) {
							btn.element.style.backgroundImage = `url("${window.assetsURL}/${btn.inactive}")`;
						}
					});
				}
			}
		}
	}

	// Handles touchstart event: activates button under touch
	handleTouchStart(event) {
		event.preventDefault();
		Array.from(event.changedTouches).forEach(touch => {
			const element = document.elementFromPoint(touch.clientX, touch.clientY);
			const buttonId = element.id;
			if (buttonId in this.buttons) {
				this.touchMap.set(touch.identifier, buttonId);
				this.handleButtonPress(buttonId);
			}
		});
	}

	// Handles touchmove event: updates button activation as finger moves
	handleTouchMove(event) {
		event.preventDefault();
		Array.from(event.changedTouches).forEach(touch => {
			const element = document.elementFromPoint(touch.clientX, touch.clientY);
			const newButton = element?.id;
			const oldButton = this.touchMap.get(touch.identifier);

			if (oldButton !== newButton) {
				if (oldButton in this.buttons) {
					this.handleButtonRelease(oldButton);
				}
				if (newButton in this.buttons) {
					this.touchMap.set(touch.identifier, newButton);
					this.handleButtonPress(newButton);
				} else {
					this.touchMap.delete(touch.identifier);
				}
			}
		});
	}

	// Handles touchend/touchcancel event: releases button under touch
	handleTouchEnd(event) {
		event.preventDefault();
		Array.from(event.changedTouches).forEach(touch => {
			const buttonId = this.touchMap.get(touch.identifier);
			if (buttonId) {
				this.handleButtonRelease(buttonId);
				this.touchMap.delete(touch.identifier);
			}
		});
	}

	// Removes gamepad UI and debug info from DOM
	destroy() {
		const gamepad = document.getElementById("touch-gamepad");
		if (gamepad) {
			gamepad.remove();
		}
		const debug = document.getElementById("debug-info");
		if (debug) {
			debug.remove();
		}
		this.TouchControlsLoaded = false;
		window.TouchControlsLoaded = false;
	}

	// Resets the touch controls by destroying and re-initializing
	reset() {
		this.destroy();
		this.init();
	}
}

// Create hidden images to prevent unloading
window.createHiddenImages = function createHiddenImages(url) {
	const hiddenImgContainer = document.getElementById("hiddenImgContainer");
	const hiddenImg = document.createElement("img");
	hiddenImg.src = url;
	hiddenImg.style.position = "absolute";
	hiddenImg.style.width = "1px";
	hiddenImg.style.height = "1px";
	hiddenImg.style.opacity = "0";
	hiddenImg.style.pointerEvents = "none";
	hiddenImg.style.zIndex = "-1";
	hiddenImgContainer.appendChild(hiddenImg);
}

window.touchControlsInstance = null;

function initTouchControls() {
	if (window.touchControlsInstance) {
		window.touchControlsInstance.destroy();
	}
	window.touchControlsInstance = new window.TouchControls(true);
	window.touchControlsInstance.init();
	return window.touchControlsInstance;
}

window.resetWithDebug = function resetWithDebug() {
	window.debugmode = true;
	window.reset = true;
	initTouchControls();
}

window.resetControls = function resetControls() {
	window.debugmode = false;
	window.reset = true;
	initTouchControls();
}

window.deleteControls = function deleteControls() {
	if (window.touchControlsInstance) {
		window.touchControlsInstance.destroy();
		window.touchControlsInstance = null;
	}
}

window.resetLocalStorage = function resetLocalStorage() {
	localStorage.removeItem("winrarisyou.mobileEditorWarning");
	localStorage.removeItem("winrarisyou.TouchControlsSettings");
}

/* Settings Menu */
function initSettingsMenu() {
	window.settingsMenu = new window.SettingsMenu();
}

window.SettingsMenu = class SettingsMenu {
	constructor() {
		this.settingsOpen = false;
		this.containerIds = ["dpad", "action-buttons", "special"];
		this.originalSizes = {};
		this.settings = JSON.parse(localStorage.getItem("winrarisyou.TouchControlsSettings")) || {};
		this.settingsButton = null;
		this.init();
	}

	init() {
		this.containerIds.forEach(id => {
			let container = document.getElementById(id);
			if (container) {
				// Store original dimensions
				this.originalSizes[id] = {
					width: container.offsetWidth,
					height: container.offsetHeight,
					aspectRatio: container.offsetWidth / container.offsetHeight
				};
			}
		});

		this.createModal();
		this.setupEventListeners();
		this.showMobileWarningPopup();
	}

	/**
	 * @param {string} id The id of the div
	 * @param {string} top The top value of the div
	 * @param {string} left The left value of the div
	 * @param {string} width The width of the div
	 * @param {string} height The height of the dive
	 * @param {string} zIndex The zIndex of the div
	 * @param {string} opacity The opacity of the div
	 * @param {string} padding The padding of the div
	 * @param {string} display The display type of the div
	 * @param {string} position The position type of the div
	 * @param {string} boxShadow The shadow of the div, e.g. "0 0 50px 5px rgba(0, 0, 0, 0.4)"
	 * @param {string} transform The transform of the div
	 * @param {string} borderRadius The border radius of the div
	 * @param {string} backgroundColor The background Color of the div
	 * @returns The callback to the div
	 */
	createDiv(id, top, left, width, height, zIndex, opacity, padding, display, position, boxShadow, transform, borderRadius, backgroundColor) {
		var div = document.createElement("div")
		if (id) div.id = id;
		div.style.top = top;
		div.style.left = left;
		div.style.width = width;
		div.style.height = height;
		div.style.zIndex = zIndex;
		div.style.opacity = opacity;
		div.style.padding = padding;
		div.style.display = display;
		div.style.position = position;
		div.style.boxShadow = boxShadow;
		if (transform) div.style.transform = transform;
		if (borderRadius) div.style.borderRadius = borderRadius;
		if (backgroundColor) div.style.backgroundColor = backgroundColor;
		return div
	}

	createSlider(min, max, step, defaultValue) {
		var slider = document.createElement("input");
		slider.type = "range"
		slider.min = min;
		slider.max = max;
		slider.step = step;
		slider.value = defaultValue;
		return slider
	}

	setScale(elementId, scale) {
		let container = document.getElementById(elementId);
		if (container && this.originalSizes[elementId]) {
			let original = this.originalSizes[elementId];
			if (window.debugmode) console.info(`Container ${container.id} has an aspect ratio of ${original.aspectRatio} and is being scaled at ${scale} scale.`)
			if (container.id !== "special") container.style.width = `${original.width * scale}px`;
			if (container.id === "special") {
				container.style.height = `${original.height * scale}px`;
			} else {
				container.style.height = `${original.height * scale}px`;
			}
			container.querySelectorAll("button").forEach((btn) => {
				const originalButton = window.originalButtonData[btn.id];
				if (originalButton) {
					btn.style.width = `${originalButton.width * scale}px`;
					btn.style.height = `${originalButton.height * scale}px`;
					btn.style.left = `${originalButton.x * scale}px`;
					btn.style.top = `${originalButton.y * scale}px`;
				}
			});
		}
	}

	createModal() {
		// Create modal element
		if (!document.getElementById("TouchControlsSettings")) {
			this.settingsModalElem = this.createDiv(
				"TouchControlsSettings", 
				"50%", "50%", 
				`${window.innerWidth * 0.52}px`, 
				`fit-content`, 
				"99999", 
				"inherit", 
				"10px", 
				"none", 
				"fixed", 
				"0 0 50px 5px rgba(0, 0, 0, 0.4)", 
				"translate(-50%, -50%)", 
				"6px", 
				"rgba(83, 60, 175, 0.92)"
			);
			this.settingsModalElem.style.paddingTop = "0px";
			this.settingsModalElem.style.transition = "opacity 0.3s";
			this.settingsModalElem.style.paddingBottom = "0px"
			document.body.append(this.settingsModalElem);
		} else {
			this.settingsModalElem = document.getElementById("TouchControlsSettings");
		}

		// Create page overlay
		if (!document.getElementById("bg")) {
			this.bg = this.createDiv(
				"bg", 
				"0px", "0px", 
				"100%", "100%", 
				"99998", 
				"0.6", 
				null, 
				"none", 
				"fixed", 
				null, 
				null, 
				null, 
				"#000000"
			);
			this.bg.style.transition = "opacity 0.3s"
			document.body.append(this.bg)
		} else {
			this.bg = document.getElementById("bg");
		}

		this.createCloseButton();
		this.createOpacityControls();
		this.createScaleControls();
		this.createVersionLabel();

		window.settingsModal = this.settingsModalElem;
	}

	createCloseButton() {
		if (!document.getElementById("closeSettingsMenu")) {
			this.closeButton = document.createElement("button");
			this.closeButton.id = "closeSettingsMenu"
			this.closeButton.innerHTML = "&times;";
			this.closeButton.style.position = "absolute";
			this.closeButton.style.top = "-2px";
			this.closeButton.style.right = "5px";
			this.closeButton.style.background = "transparent";
			this.closeButton.style.border = "none";
			this.closeButton.style.fontSize = "24px";
			this.closeButton.style.cursor = "pointer";
			this.closeButton.style.color = "#fff";
			this.closeButton.style.fontWeight = "bold";
			this.settingsModalElem.appendChild(this.closeButton);
		} else { 
			this.closeButton = document.getElementById("closeSettingsMenu"); 
		}
	}

	createOpacityControls() {
		let savedOpacity = this.settings.controlOpacity ?? "1";
		
		// Opacity Label
		if (!document.getElementById("opacityLabel")) {
			this.opacityLabel = document.createElement("label");
			this.opacityLabel.id = "opacityLabel";
			this.opacityLabel.style.paddingTop = "10px";
			this.opacityLabel.innerText = `Controls Opacity: ${savedOpacity * 100}%`;
			this.settingsModalElem.appendChild(this.opacityLabel);
		} else { 
			this.opacityLabel = document.getElementById("opacityLabel"); 
		}
		
		// Opacity Slider
		if (!document.getElementById("opacitySlider")) {
			this.opacitySlider = this.createSlider(0, 1, 0.01, savedOpacity);
			this.opacitySlider.id = "opacitySlider"
			this.settingsModalElem.appendChild(this.opacitySlider);
			
			this.opacitySlider.addEventListener("input", () => {
				this.opacityLabel.innerText = `Controls Opacity: ${Math.round(100 * this.opacitySlider.value)}%`
				document.querySelectorAll("#touch-gamepad button").forEach(btn => {
					if (btn.id !== "settings") {
						btn.style.opacity = this.opacitySlider.value;
					}
				});
				this.bg.style.opacity = 0;
			});
			
			this.opacitySlider.addEventListener("mouseup", () => { this.bg.style.opacity = 0.6; });
			this.opacitySlider.addEventListener("touchend", () => { this.bg.style.opacity = 0.6; });
			this.opacitySlider.addEventListener("touchcancel", () => { this.bg.style.opacity = 0.6; });
		} else { 
			this.opacitySlider = document.getElementById("opacitySlider"); 
		}

		// Apply saved opacity
		document.querySelectorAll("#touch-gamepad button").forEach(btn => {
			if (btn.id !== "settings") {
				btn.style.opacity = this.opacitySlider.value;
			}
		});
	}

	createScaleControls() {
		let savedScale = this.settings.controlScale ?? "1";
		
		// Scale Label
		if (!document.getElementById("scaleLabel")) {
			this.scaleLabel = document.createElement("label");
			this.scaleLabel.id = "scaleLabel"
			this.scaleLabel.innerText = `Button Scale: ${Math.round(100 * savedScale)}%`;
			this.settingsModalElem.appendChild(this.scaleLabel);
		} else { 
			this.scaleLabel = document.getElementById("scaleLabel"); 
		}

		// Scale Slider
		if (!document.getElementById("scaleSlider")) {
			this.scaleSlider = this.createSlider(0.5, 2, 0.01, savedScale);
			this.scaleSlider.id = "scaleSlider"
			this.settingsModalElem.appendChild(this.scaleSlider);
			
			this.scaleSlider.addEventListener("input", () => {
				this.bg.style.opacity = 0;
				this.settingsModalElem.style.opacity = 0.9;
		
				let scale = this.scaleSlider.value;
				this.scaleLabel.innerText = `Button Scale: ${Math.round(100 * scale)}%`;
		
				this.containerIds.forEach(id => {
					if (window.debugmode) window.touchControlsInstance.updateDebugInfo();
					this.setScale(id, scale);
				});
			});
		
			this.scaleSlider.addEventListener("mouseup", () => { 
				this.bg.style.opacity = 0.6; 
				this.settingsModalElem.style.opacity = "inherit" 
			});
			this.scaleSlider.addEventListener("touchend", () => { 
				this.bg.style.opacity = 0.6; 
				this.settingsModalElem.style.opacity = "inherit" 
			});
			this.scaleSlider.addEventListener("touchcancel", () => { 
				this.bg.style.opacity = 0.6; 
				this.settingsModalElem.style.opacity = "inherit" 
			});
		} else { 
			this.scaleSlider = document.getElementById("scaleSlider"); 
		}
		
		// Apply saved scale
		this.containerIds.forEach(id => {
			if (window.debugmode) window.touchControlsInstance.updateDebugInfo();
			this.setScale(id, savedScale);
		});
	}

	createVersionLabel() {
		if (!document.getElementById("versionLabel")) {
			this.versionLabel = document.createElement("i");
			this.versionLabel.id = "versionLabel"
			this.versionLabel.innerText = `Version ${window.CONTROLS_VERSION}`
			this.versionLabel.style.paddingTop = "10px";
			this.settingsModalElem.appendChild(this.versionLabel)
		} else { 
			this.versionLabel = document.getElementById("versionLabel"); 
		}
	}

	setupEventListeners() {
		// Close modal on button click
		this.closeButton.addEventListener("click", () => {
			if (this.settingsOpen) this.close(window.settingsButton);
		});

		window.addEventListener("resize", () => {
			this.settingsModalElem.style.width = `${window.innerWidth * 0.52}px`;
			this.settingsModalElem.style.height = `fit-content`;
			this.bg.style.width = "100%"
			this.bg.style.height = "100%"
		});
	}

	open(settingsButton) {
		window.settingsButton = settingsButton
		if (this.settingsOpen) {
			this.close(settingsButton);
			return;
		}
		this.settingsOpen = true;
		
		// Exit fullscreen if active
		if (document.fullscreenElement || document.webkitFullscreenElement) {
			if (document.exitFullscreen) document.exitFullscreen();
			if (document.webkitExitFullscreen) document.webkitExitFullscreen();
		}
		
		settingsButton.element.style.backgroundImage = `url("${window.assetsURL}/${settingsButton.active}")`;
		this.settingsModalElem.style.display = "block";
		this.bg.style.display = "block";
		document.body.style.overflow = "hidden";
	}

	close(settingsButton) {
		this.settingsOpen = false;
		if (settingsButton) {
			settingsButton.element.style.backgroundImage = `url("${window.assetsURL}/${settingsButton.inactive}")`;
		}
		this.settingsModalElem.style.display = "none";
		this.bg.style.display = "none";
		document.body.style.overflow = "";
		
		// Save settings
		let scale = this.scaleSlider.value;
		let opacity = this.opacitySlider.value;
		localStorage.setItem("winrarisyou.TouchControlsSettings", JSON.stringify({
			"controlScale": scale, 
			"controlOpacity": opacity
		}));
	}

	showMobileWarningPopup() {
		if (localStorage.getItem("winrarisyou.mobileEditorWarning") === "shown") {
			return;
		}

		let popup = this.createDiv(
			"mobileWarningPopup",
			"50%", "50%",
			"80%", "fit-content",
			"100000", "inherit",
			"15px", "block", "fixed",
			"0 0 10px rgba(0,0,0,0.5)",
			"translate(-50%, -50%)",
			"8px", "#222"
		);
		popup.style.maxWidth = "400px";
		popup.style.color = "#fff";
		popup.style.textAlign = "center";
		popup.innerHTML = `<p>Editing on mobile is not fully supported. Some functions (like erasing) will not work without a mouse and/or keyboard.</p>`;

		let bg = document.getElementById("bg")

		let closeButton = document.createElement("button");
		closeButton.innerText = "5";
		closeButton.style.marginTop = "10px";
		closeButton.style.padding = "8px 12px";
		closeButton.style.background = "#191919";
		closeButton.style.color = "#fff";
		closeButton.style.border = "none";
		closeButton.style.borderRadius = "4px";
		closeButton.style.cursor = "not-allowed";
		closeButton.disabled = true;
		closeButton.addEventListener("click", function () {
			bg.style.display = "none";
			popup.remove();
			localStorage.setItem("winrarisyou.mobileEditorWarning", "shown");
			document.body.style.overflow = "";
		});
		let countdown = 5;
		var interval = setInterval(function () {
			countdown--;
			closeButton.innerText = (countdown > 0) ? countdown.toString() : "OK";
			if (countdown === 0) {
				clearInterval(interval);
				closeButton.disabled = false;
				closeButton.style.cursor = "pointer";
			}
		}, 1000);
		popup.appendChild(closeButton);
		document.body.appendChild(popup);
		document.body.appendChild(bg);
		document.body.style.overflow = "hidden";
		bg.style.display = "block";
	}
}

/* End Settings Menu */

// Initialize the touch controls and settings menu
initTouchControls();
initSettingsMenu();

/* WINRARisyou was here. */
// TFD was here too
