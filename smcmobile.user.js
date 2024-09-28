// ==UserScript==
// @name         Super Mario Construct Touch Controls
// @description  Adds touch support for Super Mario Construct
// @author       WINRARisyou
// @namespace    https://winarisyou.github.io/SMC-TouchControls
// @homepage     https://github.com/WINRARisyou/SMC-TouchControls
// @downloadURL  https://winrarisyou.github.io/SMC-TouchControls/smcmobile.user.js
// @match        https://levelsharesquare.com/html5/supermarioconstruct/*
// @version      1.0.1
// @updateURL    https://winrarisyou.github.io/SMC-TouchControls/smcmobile.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

window.debugMode = false;

function initTouchControls() {
	const gamepadConfig = {
		specialButtons: {
			position: { bottom: "0px", left: "0px" },
			size: { width: "100%", height: "100%" },
			buttons: [
				{ id: 'pause', label: 'Pause', x: "50%", y: "0px", width: "60px", height: "60px", key: 'p', keyCode: 80 }
			]
		},
		dpad: {
			position: { bottom: 10, left: 10 },
			size: { width: 150, height: 150 },
			buttons: [
				{ id: 'up', label: '↑', x: 50, y: 0, width: 50, height: 50, key: 'ArrowUp', keyCode: 38 },
				{ id: 'left', label: '←', x: 0, y: 50, width: 50, height: 50, key: 'ArrowLeft', keyCode: 37 },
				{ id: 'right', label: '→', x: 100, y: 50, width: 50, height: 50, key: 'ArrowRight', keyCode: 39 },
				{ id: 'down', label: '↓', x: 50, y: 100, width: 50, height: 50, key: 'ArrowDown', keyCode: 40 }
			]
		},
		actionButtons: {
			position: { bottom: 10, right: 10 },
			size: { width: 200, height: 130 },
			buttons: [
				{ id: 'jump', label: 'Jump', x: 0, y: 70, width: 60, height: 60, key: 'z', keyCode: 90 },
				{ id: 'run', label: 'Run', x: 70, y: 70, width: 60, height: 60, key: 'x', keyCode: 88 },
				{ id: 'spinjump', label: 'Spin', x: 140, y: 70, width: 60, height: 60, key: 'c', keyCode: 67 },
				{ id: 'usepowerup', label: 'Use Powerup', x: 105, y: 0, width: 60, height: 60, key: ' ', keyCode: 32 }
			]
		}
	};

	function createButton(button, container) {
		const elem = document.createElement('button');
		elem.id = button.id;
		elem.textContent = button.label;
		elem.style.position = 'absolute';
		if (container.id != "special") {
			elem.style.left = `${button.x}px`;
			elem.style.top = `${button.y}px`;
			elem.style.width = `${button.width}px`;
			elem.style.height = `${button.height}px`;
		} else {
			elem.style.left = `${button.x}`;
			elem.style.top = `${button.y}`;
			elem.style.width = `${button.width}`;
			elem.style.height = `${button.height}`;
		}
		elem.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		elem.style.border = '1px solid black';
		elem.style.borderRadius = '5px';
		elem.style.fontSize = '14px';
		elem.style.userSelect = 'none';
		container.appendChild(elem);
		return elem;
	}

	function createGamepad() {
		const gamepad = document.createElement('div');
		gamepad.id = 'touch-gamepad';
		gamepad.style.position = 'fixed';
		gamepad.style.zIndex = '9999';
		gamepad.style.pointerEvents = 'none';
		gamepad.style.width = '100%';
		gamepad.style.height = '100%';
		document.body.appendChild(gamepad);

		const special = document.createElement('div')
		special.id = 'special'
		special.style.position = 'absolute';
		special.style.width = `${gamepadConfig.specialButtons.size.width}`;
		special.style.height = `${gamepadConfig.specialButtons.size.height}`;
		special.style.bottom = `${gamepadConfig.specialButtons.position.bottom}`;
		special.style.left = `${gamepadConfig.specialButtons.position.left}`;
		special.style.pointerEvents = 'auto';
		if (window.debugMode == true) {
			special.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
		}
		gamepad.appendChild(special);

		const dpad = document.createElement('div');
		dpad.id = 'dpad';
		dpad.style.position = 'absolute';
		dpad.style.width = `${gamepadConfig.dpad.size.width}px`;
		dpad.style.height = `${gamepadConfig.dpad.size.height}px`;
		dpad.style.bottom = `${gamepadConfig.dpad.position.bottom}px`;
		dpad.style.left = `${gamepadConfig.dpad.position.left}px`;
		dpad.style.pointerEvents = 'auto';
		if (window.debugMode == true) {
			dpad.style.backgroundColor = 'rgba(0, 0, 255, 0.2)';
		}
		gamepad.appendChild(dpad);

		const actionButtons = document.createElement('div');
		actionButtons.id = 'action-buttons';
		actionButtons.style.position = 'absolute';
		actionButtons.style.width = `${gamepadConfig.actionButtons.size.width}px`;
		actionButtons.style.height = `${gamepadConfig.actionButtons.size.height}px`;
		actionButtons.style.bottom = `${gamepadConfig.actionButtons.position.bottom}px`;
		actionButtons.style.right = `${gamepadConfig.actionButtons.position.right}px`;
		actionButtons.style.pointerEvents = 'auto';
		if (window.debugMode == true) {
			actionButtons.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
		}
		gamepad.appendChild(actionButtons);

		const buttons = {};

		gamepadConfig.specialButtons.buttons.forEach(button => {
			const elem = createButton(button, special);
			buttons[button.id] = { ...button, element: elem };
		});

		gamepadConfig.dpad.buttons.forEach(button => {
			const elem = createButton(button, dpad);
			buttons[button.id] = { ...button, element: elem };
		});

		gamepadConfig.actionButtons.buttons.forEach(button => {
			const elem = createButton(button, actionButtons);
			buttons[button.id] = { ...button, element: elem };
		});

		// Debug information
		if (window.debugMode == true) {
			const debugInfo = document.createElement('div');
			debugInfo.id = 'debug-info';
			debugInfo.style.position = 'fixed';
			debugInfo.style.top = '10px';
			debugInfo.style.left = '10px';
			debugInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
			debugInfo.style.color = 'white';
			debugInfo.style.padding = '10px';
			debugInfo.style.fontFamily = 'monospace';
			debugInfo.style.fontSize = '12px';
			debugInfo.style.zIndex = '10000';
			document.body.appendChild(debugInfo);

			updateDebugInfo();
		}

		return buttons;
	}

	function updateDebugInfo() {
		const gamepad = document.getElementById('touch-gamepad');
		const dpad = document.getElementById('dpad');
		const actionButtons = document.getElementById('action-buttons');
		const debugInfo = document.getElementById('debug-info');

		debugInfo.innerHTML = `
            Gamepad: ${gamepad.offsetWidth}x${gamepad.offsetHeight}<br>
            D-pad: ${dpad.offsetLeft},${dpad.offsetTop} ${dpad.offsetWidth}x${dpad.offsetHeight}<br>
            Action: ${actionButtons.offsetLeft},${actionButtons.offsetTop} ${actionButtons.offsetWidth}x${actionButtons.offsetHeight}
        `;
	}

	const buttons = createGamepad();

	let activeButtons = new Set();
	let touchMap = new Map();

	function simulateKeyEvent(keyInfo, type) {
		const event = new KeyboardEvent(type, {
			bubbles: true,
			cancelable: true,
			key: keyInfo.key,
			keyCode: keyInfo.keyCode,
			which: keyInfo.keyCode,
			code: `Key${keyInfo.key.toUpperCase()}`,
		});

		const originalPreventDefault = event.preventDefault.bind(event);
		event.preventDefault = function () {
			if (type === 'keydown') {
				event.defaultPrevented = true;
			}
			originalPreventDefault();
		};

		document.dispatchEvent(event);
		window.dispatchEvent(event);

		if (type === 'keydown' && !event.defaultPrevented) {
			simulateKeyEvent(keyInfo, 'keypress');
		}
	}

	function handleButtonPress(button) {
		if (!activeButtons.has(button)) {
			activeButtons.add(button);
			simulateKeyEvent(buttons[button], 'keydown');
			buttons[button].element.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
		}
	}

	function handleButtonRelease(button) {
		if (activeButtons.has(button)) {
			activeButtons.delete(button);
			simulateKeyEvent(buttons[button], 'keyup');
			buttons[button].element.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		}
	}

	function handleTouchStart(event) {
		event.preventDefault();
		Array.from(event.changedTouches).forEach(touch => {
			const element = document.elementFromPoint(touch.clientX, touch.clientY);
			const button = element.id;
			if (button in buttons) {
				touchMap.set(touch.identifier, button);
				handleButtonPress(button);
			}
		});
	}

	function handleTouchMove(event) {
		event.preventDefault();
		Array.from(event.changedTouches).forEach(touch => {
			const element = document.elementFromPoint(touch.clientX, touch.clientY);
			const newButton = element.id;
			const oldButton = touchMap.get(touch.identifier);

			if (oldButton !== newButton) {
				if (oldButton in buttons) {
					handleButtonRelease(oldButton);
				}
				if (newButton in buttons) {
					touchMap.set(touch.identifier, newButton);
					handleButtonPress(newButton);
				} else {
					touchMap.delete(touch.identifier);
				}
			}
		});
	}

	function handleTouchEnd(event) {
		event.preventDefault();
		Array.from(event.changedTouches).forEach(touch => {
			const button = touchMap.get(touch.identifier);
			if (button) {
				handleButtonRelease(button);
				touchMap.delete(touch.identifier);
			}
		});
	}

	const gamepad = document.getElementById('touch-gamepad');
	gamepad.addEventListener('touchstart', handleTouchStart, { passive: false });
	gamepad.addEventListener('touchmove', handleTouchMove, { passive: false });
	gamepad.addEventListener('touchend', handleTouchEnd, { passive: false });
	gamepad.addEventListener('touchcancel', handleTouchEnd, { passive: false });

	// Update debug info on window resize
	window.addEventListener('resize', updateDebugInfo);
}

window.resetWithDebug = function resetWithDebug() {
	var gamepad = document.getElementById('touch-gamepad')
	if (gamepad != undefined) {
		gamepad.remove()
	}
	var debug = document.getElementById('debug-info')
	if (debug != undefined) {
		debug.remove()
	}
	window.debugMode = true
	initTouchControls()
}

window.resetControls = function resetControls() {
	var gamepad = document.getElementById('touch-gamepad')
	if (gamepad != undefined) {
		gamepad.remove()
	}
	var debug = document.getElementById('debug-info')
	if (debug != undefined) {
		debug.remove()
	}
	window.debugMode = false
	initTouchControls()
}

initTouchControls();
