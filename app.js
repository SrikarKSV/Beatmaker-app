class DrumKit {
	constructor() {
		this.pads = document.querySelectorAll('.pad');
		this.playBtn = document.querySelector('.play');
		this.kickSound = document.querySelector('.kick-sound');
		this.snareSound = document.querySelector('.snare-sound');
		this.hihatSound = document.querySelector('.hihat-sound');
		this.muteBtn = document.querySelectorAll('.mute');
		this.selects = document.querySelectorAll('select');
		this.tempoSlider = document.querySelector('#tempo-slider');
		this.tempoNr = document.querySelector('.tempo-nr');
		this.index = 0;
		this.bpm = 150;
		this.isPlaying = null;
	}
	activePad() {
		this.classList.toggle('active');
	}
	repeat() {
		let step = this.index % 8;
		const activeBars = document.querySelectorAll(`.b${step}`);
		activeBars.forEach((bar) => {
			bar.classList.add('scale');
			if (bar.classList.contains('active')) {
				if (bar.classList.contains('kick-pad')) {
					this.kickSound.currentTime = 0;
					this.kickSound.play();
				} else if (bar.classList.contains('snare-pad')) {
					this.snareSound.currentTime = 0;
					this.snareSound.play();
				} else if (bar.classList.contains('hihat-pad')) {
					this.hihatSound.currentTime = 0;
					this.hihatSound.play();
				}
			}
		});
		this.index++;
	}
	start() {
		const bpm = 60 / this.bpm * 1000;
		if (!this.isPlaying) {
			this.isPlaying = setInterval(() => {
				this.repeat();
			}, bpm);
		} else {
			clearInterval(this.isPlaying);
			this.isPlaying = null;
		}
	}
	updateBtn() {
		// If it's null
		if (!this.isPlaying) {
			this.playBtn.innerText = 'Stop';
			this.playBtn.classList.add('active');
		} else {
			this.playBtn.innerText = 'Play';
			this.playBtn.classList.remove('active');
		}
	}
	mute(e) {
		const muteIndex = e.target.getAttribute('data-track');
		e.target.classList.toggle('active');
		if (e.target.classList.contains('active')) {
			switch (muteIndex) {
				case '0':
					this.kickSound.volume = 0;
					break;
				case '1':
					this.snareSound.volume = 0;
					break;
				case '2':
					this.hihatSound.volume = 0;
					break;
			}
		} else {
			switch (muteIndex) {
				case '0':
					this.kickSound.volume = 1;
					break;
				case '1':
					this.snareSound.volume = 1;
					break;
				case '2':
					this.hihatSound.volume = 1;
					break;
			}
		}
	}
	changeSound(e) {
		const selectionName = e.target.name;
		const selectionValue = e.target.value;
		switch (selectionName) {
			case 'kick-select':
				this.kickSound.src = selectionValue;
				break;
			case 'snare-select':
				this.snareSound.src = selectionValue;
				break;
			case 'hihat-select':
				this.hihatSound.src = selectionValue;
				break;
		}
	}
	changeTempo(e) {
		const tempoText = document.querySelector('.tempo-nr');
		tempoText.innerText = e.target.value;
	}
	updateTempo(e) {
		clearInterval(this.isPlaying);
		this.isPlaying = null;
		this.bpm = e.target.value;
		// const playBtn = document.querySelector('.play');
		if (this.playBtn.classList.contains('active')) {
			this.start();
		}
	}
	saveActivePad() {
		let activePads;
		if (!localStorage.getItem('activePads')) {
			activePads = [];
		} else {
			activePads = JSON.parse(localStorage.getItem('activePads'));
		}
		if (this.classList.contains('active')) {
			activePads.push([ this.classList[1], this.classList[2] ]);
			localStorage.setItem('activePads', JSON.stringify(activePads));
		} else {
			const activePadName = this.classList[1];
			const activePadButtonName = this.classList[2];
			const index = activePads.findIndex((pad) => {
				if (pad[0] === activePadName && pad[1] === activePadButtonName) {
					return pad;
				}
			});
			activePads.splice(index, 1);
			localStorage.setItem('activePads', JSON.stringify(activePads));
		}
	}
	loadActivePad() {
		let activePads;
		if (!localStorage.getItem('activePads')) {
			activePads = [];
		} else {
			activePads = JSON.parse(localStorage.getItem('activePads'));
		}
		this.pads.forEach((pad) => {
			activePads.forEach((check) => {
				if (check[0] === pad.classList[1] && check[1] === pad.classList[2]) {
					pad.classList.add('active');
				}
			});
		});
	}
}

const drumKit = new DrumKit();

// Event Listener

drumKit.pads.forEach((pad) => {
	pad.addEventListener('click', drumKit.activePad);
	pad.addEventListener('click', drumKit.saveActivePad);
	pad.addEventListener('transitionend', function() {
		pad.classList.remove('scale');
	});
});

drumKit.playBtn.addEventListener('click', function() {
	drumKit.updateBtn();
	drumKit.start();
});

drumKit.muteBtn.forEach((btn) => {
	btn.addEventListener('click', (e) => {
		drumKit.mute(e);
	});
});

drumKit.selects.forEach((select) => {
	select.addEventListener('change', function(e) {
		drumKit.changeSound(e);
	});
});

drumKit.tempoSlider.addEventListener('input', function(e) {
	drumKit.changeTempo(e);
});
drumKit.tempoSlider.addEventListener('change', function(e) {
	drumKit.updateTempo(e);
});

document.addEventListener('DOMContentLoaded', () => {
	drumKit.loadActivePad();
});
