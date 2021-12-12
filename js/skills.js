import {referenceObject} from './index.js';

export default class Skills {
	constructor() {
		this._Init();
	}

	_Init() {

		const WRAPPER_SKILLS = document.querySelector('.wrapper-skills');

		this._drawingGraphicLogo = false;
		this._drawingModelingLogo = false;

		this._transitionData = [
			{
				name: 'programming',
				logo: {
					animProperties: [
						{
							value: 'filter',
							max: 'blur(0)',
							min: 'blur(25px)'
						},
						{
							value: 'opacity',
							max: '1',
							min: '0'
						}
					],
					html: `<div class="skills-logo"><div></div><div class="skills-logo__typingline"></div></div>`
				},
				header: {
					node: document.querySelector('.skills-row__header>h2'),
					animProperties: [
						{
							value: 'width',
							max: '100%',
							min: '0'
						},
						{
							value: 'padding',
							max: '0 1px',
							min: '0'
						}
					],
					html: `<h2>PROGRAMMING</h2>`
				},
				description: {
					animProperties: [
						{
							value: 'transform',
							max: 'scaleY(1.0)',
							min: 'scaleY(0.0)'
						}
					],
					html: `<p>Development and support of web applications, script writing, 3D and 2D animation.</p>`
				},
				list: {
					nodes: document.querySelectorAll('.skills-row__list>p'),
					animProperties: [
						{
							value: 'width',
							max: '100%',
							min: '0'
						}
					],
					html: `<p>JS</p><p>PHP</p><p>HTML<span>\\</span>CSS</p><p>SASS</p><p>THREE JS</p><p>WebGL</p><p>GSAP</p><p>Git<span>\\</span>GitHub</p>`
				}
			},
			{
				name: 'modeling',
				logo: {
					animProperties: [
						{
							value: 'filter',
							max: 'blur(0)',
							min: 'blur(25px)'
						},
						{
							value: 'opacity',
							max: '1',
							min: '0'
						}
					],
					html: `<div class="skills-logo"><canvas id="modeling-logo" width="50" height="50"></canvas></div>`
				},
				header: {
					animProperties: [
						{
							value: 'width',
							max: '100%',
							min: '0'
						},
						{
							value: 'padding',
							max: '0 1px',
							min: '0'
						}
					],
					html: `<h2>MODELING</h2>`
				},
				description: {
					animProperties: [
						{
							value: 'transform',
							max: 'scaleY(1.0)',
							min: 'scaleY(0.0)'
						}
					],
					html: `<p>Modeling, texturing, animation, rendering of 3D characters and objects.</p>`
				},
				list: {
					animProperties: [
						{
							value: 'width',
							max: '100%',
							min: '0'
						}
					],
					html: `<p>BLENDER</p><p>SUBSTANCE</p>`
				}
			},
			{
				name: 'graphic',
				logo: {
					animProperties: [
						{
							value: 'filter',
							max: 'blur(0)',
							min: 'blur(25px)'
						},
						{
							value: 'opacity',
							max: '1',
							min: '0'
						}
					],
					html: `<div class="skills-logo"><canvas id="graphic-logo" width="50" height="50"></canvas></div>`
				},
				header: {
					animProperties: [
						{
							value: 'width',
							max: '100%',
							min: '0'
						},
						{
							value: 'padding',
							max: '0 1px',
							min: '0'
						}
					],
					html: `<h2>GRAPHIC</h2>`
				},
				description: {
					animProperties: [
						{
							value: 'transform',
							max: 'scaleY(1.0)',
							min: 'scaleY(0.0)'
						}
					],
					html: `<p>Drawing icons and logos from sketches, editing images.</p>`
				},
				list: {
					animProperties: [
						{
							value: 'width',
							max: '100%',
							min: '0'
						}
					],
					html: `<p>PHOTOSHOP</p><p>ILLUSTRATOR</p>`
				}
			},
			{
				name: 'fake',
				logo: {
					animProperties: [
						{
							value: 'filter',
							max: 'blur(0)',
							min: 'blur(25px)'
						},
						{
							value: 'opacity',
							max: '1',
							min: '0'
						}
					],
					html: `<div class="skills-logo"><div></div></div>`
				},
				header: {
					animProperties: [
						{
							value: 'width',
							max: '100%',
							min: '0'
						},
						{
							value: 'padding',
							max: '0 1px',
							min: '0'
						}
					],
					html: `<h2></h2>`
				},
				description: {
					animProperties: [
						{
							value: 'transform',
							max: 'scaleY(1.0)',
							min: 'scaleY(0.0)'
						}
					],
					html: `<p></p>`
				},
				list: {
					animProperties: [
						{
							value: 'width',
							max: '100%',
							min: '0'
						}
					],
					html: `<p></p>`
				}				
			}			
		]

		this._examplesData = {
			sketchfab: {
				img: `<img src="../pictures/sketchfabExamples.jpg" alt="">`,
				description: 'Some of my 3d models are on display here.',
				link: 'https://sketchfab.com/Sargone'
			},
			fdn: {
				img: `<img src="../pictures/fdn.jpg" alt="">`,
				description: 'The site is a dummy, everything except the design was done by me. Navigation through the pages is carried out using the input field in the burger menu.',
				link: 'http://fdn.dmitry-oryol.com'
			}
		};

		this._examplesContentEvent();

		let clickOrTouch;

		if (referenceObject.isMobile) {
			clickOrTouch = 'touchend';
		} else {
			clickOrTouch = 'click';
		}

		document.querySelector('.examples-pop-up__close').addEventListener(`${clickOrTouch}`, () => {
			document.querySelector('.examples-pop-up-wrapper').classList.toggle('_active');
			document.documentElement.style.overflowY = 'visible';
		});

		document.querySelector('.examples-pop-up-wrapper').addEventListener(`${clickOrTouch}`, (event) => {
			if (event.target.classList.contains('examples-pop-up-wrapper')) {
				document.querySelector('.examples-pop-up-wrapper').classList.toggle('_active');
				document.documentElement.style.overflowY = 'visible';
			}
		});

		this._transitionData[0].next = this._transitionData[1];
		this._transitionData[1].next = this._transitionData[2];
		this._transitionData[2].next = this._transitionData[0];

		this.currentSlide = this._transitionData[0];

		const SLIDER_PARENT = document.querySelector('.skills-slider'),
			  SLIDER_UNDERLINE = document.querySelector('.skills-slider__underline'),
			  ROW_HEADER = document.querySelector('.skills-row>.skills-row__header>h2'),
			  ROW_LIST = document.querySelectorAll('.skills-row>.skills-row__list>p'),
			  ROW_DESCRIPTION = document.querySelector('.skills-row>.skills-row__header>p'),
			  ROW_LOGO = document.querySelector('.skills-row>.skills-row__header>.skills-logo');

		for (const child of SLIDER_PARENT.children) {
			if (child.classList[0] === this.currentSlide.name) {
				child.style.color = 'white';

				const CHILD_WIDTH = child.getBoundingClientRect().width;
				const CHILD_LEFT = child.offsetLeft;
				SLIDER_UNDERLINE.style.width = `${CHILD_WIDTH}px`;
				SLIDER_UNDERLINE.style.left = `${CHILD_LEFT}px`;
			}			
		}

		ROW_LIST.forEach(p => {
			p.style.width = '100%';
		})

		ROW_HEADER.style.width = '100%';
		ROW_HEADER.style.padding = '0 5px';

		ROW_LOGO.style.filter = 'blur(0)';
		ROW_LOGO.style.opacity = '1';

		ROW_LOGO.addEventListener('transitionend', this._programmingLogo, {once: true});

		ROW_DESCRIPTION.style.transform = 'scaleY(1.0)';

		this._changeChapter();
	}


    _eventTouchStartExampleContent() {
      this._touchMoves = false;
    }

    _eventTouchMoveExampleContent() {
      this._touchMoves = true;
    }

    _eventTouchEndExampleContent(event) {
		if (this._touchMoves) {
			return;
		}

		if (!event.target.classList.contains('_active')) {
			if (!event.target.parentNode.classList.contains('_active')) {
				return;
			}
			const popUpItem = this._examplesData[`${event.target.parentNode.classList[3]}`];
			this._examplesPopUp(popUpItem.img, popUpItem.description, popUpItem.link);
			document.querySelector('.examples-pop-up-wrapper').classList.toggle('_active');
			return;
		}
		const popUpItem = this._examplesData[`${event.target.parentNode.classList[3]}`];
		this._examplesPopUp(popUpItem.img, popUpItem.description, popUpItem.link);
		document.querySelector('.examples-pop-up-wrapper').classList.toggle('_active');
    }

    _eventClickExampleContent(event) {

		if (!event.target.classList.contains('_active')) {
			if (!event.target.parentNode.classList.contains('_active')) {
				return;
			}
			const popUpItem = this._examplesData[`${event.target.parentNode.classList[3]}`];
			this._examplesPopUp(popUpItem.img, popUpItem.description, popUpItem.link);
			document.querySelector('.examples-pop-up-wrapper').classList.toggle('_active');
			return;
		}
		const popUpItem = this._examplesData[`${event.target.parentNode.classList[3]}`];
		this._examplesPopUp(popUpItem.img, popUpItem.description, popUpItem.link);
		document.querySelector('.examples-pop-up-wrapper').classList.toggle('_active');
    }


	_examplesContentEvent() {
	    const exampleContent = document.querySelector('.content-examples');

	    this._touchMoves = false;

	    if (referenceObject.isMobile) {
	      exampleContent.addEventListener('touchstart', () => {
	      	this._eventTouchStartExampleContent();
	      });
	      exampleContent.addEventListener('touchmove', () => {
	      	this._eventTouchMoveExampleContent();
	      });
	      exampleContent.addEventListener('touchend', (event) => {
	      	this._eventTouchEndExampleContent(event);
	      });
	    } else {
	      exampleContent.addEventListener('click', (event) => {
	      	this._eventClickExampleContent(event);
	      });
	    }
	}


	_examplesPopUp(img, description, link) {
		document.querySelector('.examples-pop-up__image').innerHTML = img;
		document.querySelector('.examples-pop-up>p').innerText = description;

		document.documentElement.style.overflowY = 'hidden';

		document.querySelector('.examples-pop-up__button').href = link;
		return false;
	}


	_graphicLogo() {

		this._drawingModelingLogo = false;

		const CANVAS = document.getElementById('graphic-logo');

		this._drawData = {
			screen: {
				value: 0,
				max: 30
			},
			fastening: {
				value: 0,
				max: 4
			},
			stand: {
				value: 0,
				max: 4
			},
			brush: {
				value: 50,
				max: 0,
				color: [255, 0, 0],
				transition: 'red-green'
			}
		}

		if (CANVAS) {
			this._ctx = CANVAS.getContext('2d');
		}

		this._drawingGraphicLogo = true;
	}


	graphicLogoUpdate(timeInSeconds) {

		if (document.getElementById('graphic-logo') === null || !this._ctx) {
			return;
		}

		this._ctx.clearRect(0, 0, 50, 50);

		this._ctx.lineCap = 'butt';
		this._ctx.lineWidth = 2;

		this._ctx.fillStyle = 'rgb(255, 255, 255)';
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';

		if (this._drawData['screen'].value < this._drawData['screen'].max) {
			this._drawData['screen'].value += timeInSeconds * 64;
			if (this._drawData['screen'].value > this._drawData['screen'].max) {
				this._drawData['screen'].value = this._drawData['screen'].max;
			}
		}	


		if (this._drawData['fastening'].value < this._drawData['fastening'].max && this._drawData['screen'].value === this._drawData['screen'].max) {
			this._drawData['fastening'].value += timeInSeconds * 16;
			if (this._drawData['fastening'].value > this._drawData['fastening'].max) {
				this._drawData['fastening'].value = 4;
			}
		}


		if (this._drawData['stand'].value < this._drawData['stand'].max && this._drawData['fastening'].value === this._drawData['fastening'].max) {
			this._drawData['stand'].value += timeInSeconds * 16;
			if (this._drawData['stand'].value > this._drawData['stand'].max) {
				this._drawData['stand'].value = 4;
			}
		}


		if (this._drawData['brush'].value > this._drawData['brush'].max) {
			this._drawData['brush'].value -= timeInSeconds * 75;
			if (this._drawData['brush'].value < this._drawData['brush'].max) {
				this._drawData['brush'].value = this._drawData['brush'].max;
			}
		}


		if (this._drawData['brush'].transition === 'red-green') {
			if (this._drawData['brush'].color[0] > 0) {
				this._drawData['brush'].color[0] -= timeInSeconds * 100;
				this._drawData['brush'].color[1] += timeInSeconds * 100;
				if (this._drawData['brush'].color[0] < 0) {
					this._drawData['brush'].color[0] = 0;
					this._drawData['brush'].color[1] = 255;
					this._drawData['brush'].transition = 'green-blue';
				}
			}
		} else if (this._drawData['brush'].transition === 'green-blue') {
			if (this._drawData['brush'].color[1] > 0) {
				this._drawData['brush'].color[1] -= timeInSeconds * 100;
				this._drawData['brush'].color[2] += timeInSeconds * 100;
				if (this._drawData['brush'].color[1] < 0) {
					this._drawData['brush'].color[1] = 0;
					this._drawData['brush'].color[2] = 255;
					this._drawData['brush'].transition = 'blue-red';
				}
			}
		} else {
			if (this._drawData['brush'].color[2] > 0) {
				this._drawData['brush'].color[2] -= timeInSeconds * 100;
				this._drawData['brush'].color[0] += timeInSeconds * 100;
				if (this._drawData['brush'].color[2] < 0) {
					this._drawData['brush'].color[2] = 0;
					this._drawData['brush'].color[0] = 255;
					this._drawData['brush'].transition = 'red-green';
				}
			}
		}


		roundRect(this._ctx, 2, 7, 46, this._drawData['screen'].value, 1, false, true);

		function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
			if (typeof stroke === 'undefined') {
				stroke = true;
			}
			if (typeof radius === 'undefined') {
				radius = 5;
			}
			if (typeof radius === 'number') {
				radius = {tl: radius, tr: radius, br: radius, bl: radius};
			} else {
				let defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
				for (let side in defaultRadius) {
					radius[side] = radius[side] || defaultRadius[side];
				}
			}

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgb(255, 255, 255)';			
			ctx.moveTo(x + radius.tl, y);
			ctx.lineTo(x + width - radius.tr, y);
			ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
			ctx.lineTo(x + width, y + height - radius.br);
			ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = 8;
			ctx.strokeStyle = 'rgb(255, 255, 255)';
			ctx.moveTo(x + width, y + height - radius.br - 2);
			ctx.lineTo(x + radius.bl, y + height - radius.bl - 2);
			ctx.stroke();

			ctx.beginPath();
			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgb(255, 255, 255)';
			ctx.moveTo(x + radius.bl, y + height);
			ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
			ctx.lineTo(x, y + radius.tl);
			ctx.quadraticCurveTo(x, y, x + radius.tl, y);

			if (fill) {
				ctx.fill();
			}
			if (stroke) {
				ctx.stroke();
			}

		}

		const arrayColor = this._drawData.brush.color;

		this._ctx.beginPath();
		this._ctx.fillRect(16, 41, 18, this._drawData.fastening.value);

		this._ctx.beginPath();
		this._ctx.fillRect(10, 45, 30, this._drawData.stand.value);

		this._ctx.beginPath();
		this._ctx.strokeStyle = `rgb(${arrayColor})`;
		this._ctx.moveTo(23, 19 - this._drawData.brush.value);
		this._ctx.quadraticCurveTo(27, 18 - this._drawData.brush.value, 25, 16 - this._drawData.brush.value);
		this._ctx.lineTo(25, 19 - this._drawData.brush.value);
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.fillStyle = `rgb(${arrayColor})`;
		this._ctx.arc(26, 16 - this._drawData.brush.value, 2, 0, 2 * Math.PI, false);
		this._ctx.fill();

		this._ctx.beginPath();
		this._ctx.lineWidth = 4;
		this._ctx.lineCap = `round`;
		this._ctx.strokeStyle = `rgb(${arrayColor})`;
		this._ctx.moveTo(29, 11 - this._drawData.brush.value);
		this._ctx.lineTo(35, 2 - this._drawData.brush.value);
		this._ctx.stroke();
	}


	_modelingLogo() {

		this._drawingGraphicLogo = false;

		this._drawData = {
			arcs: {
				value: 0,
				max: 2 * Math.PI
			},
			lines: {
				values: {
					fromFirstToFourth: [22, 5],
					fromFirstToSixth: [28, 5],
					fromFourthToFiveth: [5, 16],
					fromFourthToSecond: [8, 14],
					fromSixthToSeventh: [45, 16],
					fromSixthToSecond: [42, 14],
					fromFivethToThird: [8, 36],
					fromSeventhToThird: [42, 36],
					fromSecondToThird: [25, 26]
				},
				max: {
					fromFirstToFourth: [8, 11],
					fromFirstToSixth: [42, 11],
					fromFourthToFiveth: [5, 32],
					fromFourthToSecond: [22, 21],
					fromSixthToSeventh: [45, 32],
					fromSixthToSecond: [28, 21],
					fromFivethToThird: [22, 43],
					fromSeventhToThird: [28, 43],
					fromSecondToThird: [25, 42]
				}
			}
		}		

		const CANVAS = document.getElementById('modeling-logo');

		if (CANVAS) {
			this._ctx = CANVAS.getContext('2d');
			this._ctx.lineWidth = 2;
		}

		this._drawingModelingLogo = true;
	}


	modelingLogoUpdate(timeInSeconds) {

		if (document.getElementById('modeling-logo') === null || !this._ctx) {
			return;
		}

		this._ctx.clearRect(0, 0, 50, 50);

		if (this._drawData.arcs.value < this._drawData.arcs.max) {
			this._drawData.arcs.value += timeInSeconds * 5;

			if (this._drawData.arcs.value > this._drawData.arcs.max) {
				this._drawData.arcs.value = this._drawData.arcs.max;
			}
		}

		for (const LINE in this._drawData.lines.values) {
			switch (LINE) {
				case 'fromFirstToFourth':
					if (this._drawData.lines.values[LINE][0] > this._drawData.lines.max[LINE][0]) {
						this._drawData.lines.values[LINE][0] -= timeInSeconds * 10 * 2;
						if (this._drawData.lines.values[LINE][0] < this._drawData.lines.max[LINE][0]) {
							this._drawData.lines.values[LINE][0] = this._drawData.lines.max[LINE][0];
						}
					}

					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
				case 'fromFirstToSixth':
					if (this._drawData.lines.values[LINE][0] < this._drawData.lines.max[LINE][0]) {
						this._drawData.lines.values[LINE][0] += timeInSeconds * 10 * 2;
						if (this._drawData.lines.values[LINE][0] > this._drawData.lines.max[LINE][0]) {
							this._drawData.lines.values[LINE][0] = this._drawData.lines.max[LINE][0];
						}
					}

					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
				case 'fromFourthToFiveth':
					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10 * 3;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
				case 'fromFourthToSecond':
					if (this._drawData.lines.values[LINE][0] < this._drawData.lines.max[LINE][0]) {
						this._drawData.lines.values[LINE][0] += timeInSeconds * 10 * 2;
						if (this._drawData.lines.values[LINE][0] > this._drawData.lines.max[LINE][0]) {
							this._drawData.lines.values[LINE][0] = this._drawData.lines.max[LINE][0];
						}
					}

					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
				case 'fromSixthToSeventh':
					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10 * 3;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
				case 'fromSixthToSecond':
					if (this._drawData.lines.values[LINE][0] > this._drawData.lines.max[LINE][0]) {
						this._drawData.lines.values[LINE][0] -= timeInSeconds * 10 * 2;
						if (this._drawData.lines.values[LINE][0] < this._drawData.lines.max[LINE][0]) {
							this._drawData.lines.values[LINE][0] = this._drawData.lines.max[LINE][0];
						}
					}

					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
				case 'fromFivethToThird':
					if (this._drawData.lines.values[LINE][0] < this._drawData.lines.max[LINE][0]) {
						this._drawData.lines.values[LINE][0] += timeInSeconds * 10 * 2;
						if (this._drawData.lines.values[LINE][0] > this._drawData.lines.max[LINE][0]) {
							this._drawData.lines.values[LINE][0] = this._drawData.lines.max[LINE][0];
						}
					}

					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
				case 'fromSeventhToThird':
					if (this._drawData.lines.values[LINE][0] > this._drawData.lines.max[LINE][0]) {
						this._drawData.lines.values[LINE][0] -= timeInSeconds * 10 * 2;
						if (this._drawData.lines.values[LINE][0] < this._drawData.lines.max[LINE][0]) {
							this._drawData.lines.values[LINE][0] = this._drawData.lines.max[LINE][0];
						}
					}

					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
				case 'fromSecondToThird':
					if (this._drawData.lines.values[LINE][1] < this._drawData.lines.max[LINE][1]) {
						this._drawData.lines.values[LINE][1] += timeInSeconds * 10 * 3;
						if (this._drawData.lines.values[LINE][1] > this._drawData.lines.max[LINE][1]) {
							this._drawData.lines.values[LINE][1] = this._drawData.lines.max[LINE][1];
						}
					}
					break;
			}
		}

		this._ctx.beginPath();
		this._ctx.arc(25, 5, 3, 0, this._drawData.arcs.value, false);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.arc(25, 22, 3, 0, this._drawData.arcs.value, false);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.arc(5, 13, 3, 0, this._drawData.arcs.value, false);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.arc(45, 13, 3, 0, this._drawData.arcs.value, false);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.arc(25, 45, 3, 0, this._drawData.arcs.value, false);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.arc(5, 35, 3, 0, this._drawData.arcs.value, false);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.arc(45, 35, 3, 0, this._drawData.arcs.value, false);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();


		this._ctx.beginPath();
		this._ctx.moveTo(22, 5);
		this._ctx.lineTo(this._drawData.lines.values['fromFirstToFourth'][0], this._drawData.lines.values['fromFirstToFourth'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.moveTo(28, 5);
		this._ctx.lineTo(this._drawData.lines.values['fromFirstToSixth'][0], this._drawData.lines.values['fromFirstToSixth'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.moveTo(5, 16);
		this._ctx.lineTo(this._drawData.lines.values['fromFourthToFiveth'][0], this._drawData.lines.values['fromFourthToFiveth'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.moveTo(8, 14);
		this._ctx.lineTo(this._drawData.lines.values['fromFourthToSecond'][0], this._drawData.lines.values['fromFourthToSecond'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.moveTo(45, 16);
		this._ctx.lineTo(this._drawData.lines.values['fromSixthToSeventh'][0], this._drawData.lines.values['fromSixthToSeventh'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();		

		this._ctx.beginPath();
		this._ctx.moveTo(42, 14);
		this._ctx.lineTo(this._drawData.lines.values['fromSixthToSecond'][0], this._drawData.lines.values['fromSixthToSecond'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.moveTo(8, 36);
		this._ctx.lineTo(this._drawData.lines.values['fromFivethToThird'][0], this._drawData.lines.values['fromFivethToThird'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();		

		this._ctx.beginPath();
		this._ctx.moveTo(42, 36);
		this._ctx.lineTo(this._drawData.lines.values['fromSeventhToThird'][0], this._drawData.lines.values['fromSeventhToThird'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();

		this._ctx.beginPath();
		this._ctx.moveTo(25, 26);
		this._ctx.lineTo(this._drawData.lines.values['fromSecondToThird'][0], this._drawData.lines.values['fromSecondToThird'][1]);
		this._ctx.strokeStyle = 'rgb(255, 255, 255)';
		this._ctx.stroke();
	}


	_programmingLogo() {
		const LOGO = document.querySelector('.skills-row__header>.skills-logo>div');
		const TYPING_LINE = document.querySelector('.skills-logo__typingline');

		if (!LOGO) {
			return;
		}

		let inner = '</>';

		function type() {
			if (inner.length === 0) {
				return;
			}
			setTimeout(() => {
				LOGO.innerText += inner[0];
				TYPING_LINE.style.left = `${LOGO.getBoundingClientRect().width}px`;

				inner = inner.replace(inner[0], '');

				if (LOGO.innerText[1] === '/') {
					setTimeout(() => {
						LOGO.innerText = LOGO.innerText[0];
						TYPING_LINE.style.left = `${LOGO.getBoundingClientRect().width}px`;
						inner = '\\' + inner;
						type();
					}, Math.random() * (1000 - 750) + 750);
				} else {
					type();
				}
			}, 300);
		}

		type();
	}


	_sliderSwitchBacklight(event) {

		const SLIDER_UNDERLINE = document.querySelector('.skills-slider__underline'),
			  SLIDER_PARENT = document.querySelector('.skills-slider');


		if (event.target.classList[0] === 'examples') {


			event.target.style.color = 'white';

			const CHILD_WIDTH = event.target.getBoundingClientRect().width;
			const CHILD_LEFT = event.target.offsetLeft;

			SLIDER_UNDERLINE.style.width = `${CHILD_WIDTH}px`;
			SLIDER_UNDERLINE.style.left = `${CHILD_LEFT}px`;

			for (const child of SLIDER_PARENT.children) {
				if (event.target.classList[0] !== child.classList[0]) {
					child.style.color = 'rgb(150, 150, 150)';
				}
			}

		} else {
			for (const chapter of this._transitionData) {
				if (event.target.classList[0] === chapter.name) {

					event.target.style.color = 'white';

					const CHILD_WIDTH = event.target.getBoundingClientRect().width;
					const CHILD_LEFT = event.target.offsetLeft;

					SLIDER_UNDERLINE.style.width = `${CHILD_WIDTH}px`;
					SLIDER_UNDERLINE.style.left = `${CHILD_LEFT}px`;
				} else {
					for (const child of SLIDER_PARENT.children) {
						if (event.target.classList[0] !== child.classList[0]) {
							child.style.color = 'rgb(150, 150, 150)';
						}
					}
				}
			}
		}		
	}


	_transitionRow(event) {

		const SLIDER_PARENT = document.querySelector('.skills-slider');

		if (event.target.classList[0] === this.currentSlide.name || event.target.classList[0] === SLIDER_PARENT.classList[0]) {
			return;
		}

		this._drawingGraphicLogo = false;
		this._drawingModelingLogo = false;

		this.currentSlide.header.node = document.querySelector('.skills-row>.skills-row__header>h2');
		this.currentSlide.list.nodes = document.querySelectorAll('.skills-row>.skills-row__list>p');
		this.currentSlide.description.node = document.querySelector('.skills-row>.skills-row__header>p');
		this.currentSlide.logo.node = document.querySelector('.skills-row__header>.skills-logo');

		let	headerCurrent = this.currentSlide.header,
			listCurrent = this.currentSlide.list,
			logoCurrent = this.currentSlide.logo,
			descriptionCurrent = this.currentSlide.description;

		const WRAPPER = document.querySelector('.wrapper'),
			  WRAPPER_SKILLS = document.querySelector('.wrapper-skills'),
			  SKILLS_ROW = document.querySelector('.skills-row'),
			  EXAMPLES_ROW = document.querySelector('.examples-row');


		this._sliderSwitchBacklight(event);


		logoCurrent.animProperties.forEach(property => {
			logoCurrent.node.style[`${property.value}`] = property.min;
		});

		descriptionCurrent.animProperties.forEach(property => {
			descriptionCurrent.node.style[`${property.value}`] = property.min;
		});						

		headerCurrent.animProperties.forEach(property => {
			headerCurrent.node.style[`${property.value}`] = property.min;
		});

		listCurrent.animProperties.forEach(property => {
			listCurrent.nodes.forEach(paragraph => {
				paragraph.style[`${property.value}`] = property.min;
			});
		});

		if (event.target.classList[0] !== 'examples') {

			if (EXAMPLES_ROW.style.maxHeight === '100%') {

				WRAPPER.style.height = '100vh';
				WRAPPER_SKILLS.style.height = '100vh';
				document.body.style.height = '100%';

				SKILLS_ROW.style.maxHeight = '100%';
				SKILLS_ROW.style.marginTop = '100px';

				EXAMPLES_ROW.style.maxHeight = '0';
			}
		}

		headerCurrent.node.addEventListener('transitionend', (e) => {

			if (event.target.classList[0] === 'examples') {

				this.currentSlide = this._transitionData[3];

				if (EXAMPLES_ROW.style.maxHeight !== '100%') {
					SKILLS_ROW.style.maxHeight = '0';
					SKILLS_ROW.style.marginTop = '0';

					EXAMPLES_ROW.style.maxHeight = '100%';

					EXAMPLES_ROW.addEventListener('transitionend', () => {
						if (this.currentSlide.name === 'fake') {
							document.body.style.height = 'auto';
							WRAPPER_SKILLS.style.height = '100%';
							WRAPPER.style.height = '100%';
						}
					}, {once: true});
				}

			} else {
				for (const chapter of this._transitionData) {
					if (event.target.classList[0] === chapter.name) {
						this.currentSlide = chapter;
					}
				}
			}

			document.querySelector('.skills-row>.skills-row__header').innerHTML = this.currentSlide.logo.html + this.currentSlide.header.html + this.currentSlide.description.html;
			document.querySelector('.skills-row>.skills-row__list').innerHTML = this.currentSlide.list.html;

			this.currentSlide.header.node = document.querySelector('.skills-row>.skills-row__header>h2');
			this.currentSlide.list.nodes = document.querySelectorAll('.skills-row>.skills-row__list>p');
			this.currentSlide.description.node = document.querySelector('.skills-row>.skills-row__header>p');
			this.currentSlide.logo.node = document.querySelector('.skills-row__header>.skills-logo');

			headerCurrent = this.currentSlide.header;
			listCurrent = this.currentSlide.list;
			logoCurrent = this.currentSlide.logo;
			descriptionCurrent = this.currentSlide.description;

			logoCurrent.animProperties.forEach(property => {
				setTimeout(() => {
					logoCurrent.node.style[`${property.value}`] = property.max;
				}, 0);
			});

			descriptionCurrent.animProperties.forEach(property => {
				setTimeout(() => {
					descriptionCurrent.node.style[`${property.value}`] = property.max;
				}, 0);
			});

			headerCurrent.animProperties.forEach(property => {
				setTimeout(() => {
					headerCurrent.node.style[`${property.value}`] = property.max;
				}, 0);
			});

			listCurrent.animProperties.forEach(property => {
				listCurrent.nodes.forEach(paragraph => {
					setTimeout(() => {
						paragraph.style[`${property.value}`] = property.max;
					}, 0);
				});
			});

			logoCurrent.node.addEventListener('transitionend', () => {
				if (this.currentSlide.name === 'modeling') {
					this._modelingLogo();
				}
				if (this.currentSlide.name === 'programming') {
					this._programmingLogo();
				}
				if (this.currentSlide.name === 'graphic') {
					this._graphicLogo();
				}
			}, {once: true});				

		}, {once: true, capture: false});
	}


	_eventTouchStartSlider() {
		this._touchMoves = false;
	}

	_eventTouchMoveSlider() {
		this._touchMoves = true;
	}

	_eventTouchEndSlider(event) {
		if (this._touchMoves) {
			return;
		}

		this._transitionRow(event);
	}

	_eventClickSlider(event) {
         
		this._transitionRow(event);
	}


	_changeChapter() {
		this._touchMoves = false;

		const SLIDER_PARENT = document.querySelector('.skills-slider');

		const _transitionRow = this._transitionRow;

		if (referenceObject.isMobile) {
			SLIDER_PARENT.addEventListener('touchstart', () => {
				this._eventTouchStartSlider();
			});
			SLIDER_PARENT.addEventListener('touchmove', () => {
				this._eventTouchMoveSlider();
			});
			SLIDER_PARENT.addEventListener('touchend', (event) => {
				this._eventTouchEndSlider(event);
			});
		} else {
			SLIDER_PARENT.addEventListener('click', (event) => {
				this._eventClickSlider(event);
			});
		}
	}
}