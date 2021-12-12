import {referenceObject} from './index.js';

export default class Tooltips {
	constructor() {

		this._tooltip = document.querySelector('.tooltips>p');
		this._animation = false;
		this._showingCountCubs = false;
		this._shownCountCubs = true;
		this._queue = [];
	}

	setCountCubs(cub) {
		if (cub.model.userData.treePhenomena) {
			this._tooltip.style.fontFamily = 'OctoberCrow';
			this._queue.push({
				value: 'Now take it back',
				name: 'setCountCubs'
			});
		} else {
			this._tooltip.style.fontFamily = 'AmaticSCB';
			this._queue.push({
				value: 'Now take it back',
				name: 'setCountCubs'
			});
		}
	}

	exitScene() {
		this._exitScene = true;
		this._queue.push({
			value: 'Leave the Game...',
			name: 'exitScene'
		});
	}

	pawScene() {
		this._queue.push({
			value: 'In developing...',
			name: 'pawScene'
		});
	}

	showCountCubs(distanceToCub) {
		if (distanceToCub > 10 && this._shownCountCubs && !this._showingCountCubs) {
			this._shownCountCubs = false;
		}

		if (distanceToCub <= 10 && !this._showingCountCubs && !this._shownCountCubs) {
			this._shownCountCubs = true;
			this._showingCountCubs = true;
			this._queue.push({
				value: referenceObject.countCubs+'/3',
				name: 'showCountCubs'
			});
		}
	}

	Update(timeInSeconds) {
		if (!this._animation) {
			if (this._queue.length !== 0) {
				this._animation = true;
				this._tooltip.innerHTML = this._queue[0].value;
				this._tooltip.parentNode.style.zIndex = 5;
				this._tooltip.style.opacity = 1;
				this._tooltip.style.filter = 'blur(0px)';
				this._tooltip.addEventListener('transitionend', () => {
					setTimeout(() => {
						this._tooltip.style.opacity = 0;
						this._tooltip.style.filter = 'blur(20px)';

						this._tooltip.addEventListener('transitionend', () => {
							this._animation = false;
							this._tooltip.style.fontFamily = 'AmaticSCB';
							if (this._queue[0].name === 'showCountCubs') {
								this._showingCountCubs = false;
							}
							this._queue.splice(0, 1);
							this._tooltip.parentNode.style.zIndex = 5;
						}, {once: true});
					}, 1500);
				}, {once: true});
			}
		}
	}
}