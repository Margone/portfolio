import * as THREE from './libs/three.module.js';
import {referenceObject} from './index.js';

export default class aboutContent {
	constructor() {
		this._Init();
	}click

	_Init() {

		const wrapper = document.querySelector('.wrapper');
		const wrapperAbout = document.querySelector('.wrapper-about');

		wrapper.style.height = 'auto';
		
		wrapperAbout.style.zIndex = 3;
		wrapperAbout.style.opacity = 1;

		this.sendMail();

		wrapperAbout.addEventListener('transitionend', () => {
			this._displayName();
			this._scrollToOneRowMain();
			this._scrollToTwoRowMain();
			this._scrollToBackgroundImage();
			this._scrollToContact();
		}, {once: true});
	}

	_canvasInit() {

		this._canvasAppears = true;

		this._toMidCheckmark = [80, 105];
		this._toTopLeftCheckmark = [100, 125];

		this._radiusInnerCircle = {
			value: 0,
			animDistance: 0
		};
		this._radiusOutterCircle = {
			value: 0,
			animDistance: 0
		};

		const CANVAS = document.getElementById('mail-success');

		this._ctx = CANVAS.getContext('2d');

		this._ctx.clearRect(0, 0, 200, 200);

		this._ctx.lineWidth = 5;
	}

	_canvasAnimAppears(timeInSeconds) {

		if (this._radiusInnerCircle.animDistance === 0) {
			this._radiusInnerCircle.value += timeInSeconds * 200;
			if (this._radiusInnerCircle.value > 75) {
				this._radiusInnerCircle.value = 75;
				this._radiusInnerCircle.animDistance = 50;
			}
		} else if (this._radiusInnerCircle.animDistance === 50) {
			if (this._radiusInnerCircle.value > 50) {
				this._radiusInnerCircle.value -= timeInSeconds * 200;
				if (this._radiusInnerCircle.value < 50) {
					this._radiusInnerCircle.value = 50;
					this._radiusInnerCircle.animDistance = 100;
				}
			}
		}


		if (this._radiusOutterCircle.animDistance === 0) {
			this._radiusOutterCircle.value += timeInSeconds * 200;
			if (this._radiusOutterCircle.value > 100) {
				this._radiusOutterCircle.value = 100;
				this._radiusOutterCircle.animDistance = 50;
			}
		} else if (this._radiusOutterCircle.animDistance === 50) {
			if (this._radiusOutterCircle.value > 75) {
				this._radiusOutterCircle.value -= timeInSeconds * 200;
				if (this._radiusOutterCircle.value < 75) {
					this._radiusOutterCircle.value = 75;
					this._radiusOutterCircle.animDistance = 100;
				}
			}			
		}


		if (this._toMidCheckmark[0] < 100) {
			this._toMidCheckmark[0] += timeInSeconds * 125 * 1.25;
			if (this._toMidCheckmark[0] > 100) {
				this._toMidCheckmark[0] = 100;
			}
		}

		if (this._toMidCheckmark[1] < 125) {
			this._toMidCheckmark[1] += timeInSeconds * 125 * 1.25;
			if (this._toMidCheckmark[1] > 125) {
				this._toMidCheckmark[1] = 125;
			}
		}


		if (this._toMidCheckmark[0] === 100 && this._toTopLeftCheckmark[0] < 130) {
			this._toTopLeftCheckmark[0] += timeInSeconds * 125;
			if (this._toTopLeftCheckmark[0] > 130) {
				this._toTopLeftCheckmark[0] = 130;
			}
		}

		if (this._toMidCheckmark[0] === 100 && this._toTopLeftCheckmark[1] > 75) {
			this._toTopLeftCheckmark[1] -= timeInSeconds * 125 * 1.665;
			if (this._toTopLeftCheckmark[1] < 75) {
				this._toTopLeftCheckmark[1] = 75;

				setTimeout(() => {
					this._canvasAppears = false;
				}, 1500);
			}			
		}

		this._ctx.clearRect(0, 0, 200, 200);

		this._ctx.beginPath();
		this._ctx.moveTo(100, 100);
		this._ctx.arc(100, 100, this._radiusOutterCircle.value, 0, 2 * Math.PI, false);
		this._ctx.fillStyle = 'rgb(225, 225, 225)';
		this._ctx.fill();

		this._ctx.beginPath();
		this._ctx.moveTo(100, 100);
		this._ctx.arc(100, 100, this._radiusInnerCircle.value, 0, 2 * Math.PI, false);
		this._ctx.fillStyle = 'rgb(255, 255, 255)';
		this._ctx.fill();

		this._ctx.beginPath();
		this._ctx.moveTo(80, 105);
		this._ctx.lineTo(this._toMidCheckmark[0], this._toMidCheckmark[1]);
		if (this._toMidCheckmark[0] === 100) {
			this._ctx.lineTo(this._toTopLeftCheckmark[0], this._toTopLeftCheckmark[1]);
		}
		this._ctx.strokeStyle = 'rgb(0, 200, 0)';
		this._ctx.stroke();
	}

	_canvasAnimDisappears(timeInSeconds) {

		if (this._radiusInnerCircle.animDistance === 100) {
			this._radiusInnerCircle.value += timeInSeconds * 200;
			if (this._radiusInnerCircle.value > 75) {
				this._radiusInnerCircle.value = 75;
				this._radiusInnerCircle.animDistance = 50;
			}
		} else if (this._radiusInnerCircle.animDistance === 50) {
			if (this._radiusInnerCircle.value > 0) {
				this._radiusInnerCircle.value -= timeInSeconds * 200;
				if (this._radiusInnerCircle.value < 0) {
					this._radiusInnerCircle.value = 0;
					this._radiusInnerCircle.animDistance = 0;
				}
			}
		}


		if (this._radiusOutterCircle.animDistance === 100) {
			this._radiusOutterCircle.value += timeInSeconds * 200;
			if (this._radiusOutterCircle.value > 100) {
				this._radiusOutterCircle.value = 100;
				this._radiusOutterCircle.animDistance = 50;
			}
		} else if (this._radiusOutterCircle.animDistance === 50) {
			if (this._radiusOutterCircle.value > 0) {
				this._radiusOutterCircle.value -= timeInSeconds * 200;
				if (this._radiusOutterCircle.value < 0) {
					this._radiusOutterCircle.value = 0;
					this._radiusOutterCircle.animDistance = 0;
				}
			}			
		}

		if (this._toTopLeftCheckmark[0] > 100) {
			this._toTopLeftCheckmark[0] -= timeInSeconds * 125;
			if (this._toTopLeftCheckmark[0] < 100) {
				this._toTopLeftCheckmark[0] = 100;
			}
		}

		if (this._toTopLeftCheckmark[1] < 125) {
			this._toTopLeftCheckmark[1] += timeInSeconds * 125 * 1.665;
			if (this._toTopLeftCheckmark[1] > 125) {
				this._toTopLeftCheckmark[1] = 125;
			}
		}


		if (this._toTopLeftCheckmark[0] === 100 && this._toMidCheckmark[0] > 80) {
			this._toMidCheckmark[0] -= timeInSeconds * 125 * 1.25;
			if (this._toMidCheckmark[0] < 80) {
				this._toMidCheckmark[0] = 80;
			}
		}

		if (this._toTopLeftCheckmark[0] === 100 && this._toMidCheckmark[1] > 105) {
			this._toMidCheckmark[1] -= timeInSeconds * 125 * 1.25;
			if (this._toMidCheckmark[1] < 105) {
				this._toMidCheckmark[1] = 105;

				document.querySelector('.mail-success-popUP').style.display = 'none';
			}			
		}

		this._ctx.clearRect(0, 0, 200, 200);

		this._ctx.beginPath();
		this._ctx.moveTo(100, 100);
		this._ctx.arc(100, 100, this._radiusOutterCircle.value, 0, 2 * Math.PI, false);
		this._ctx.fillStyle = 'rgb(225, 225, 225)';
		this._ctx.fill();

		this._ctx.beginPath();
		this._ctx.moveTo(100, 100);
		this._ctx.arc(100, 100, this._radiusInnerCircle.value, 0, 2 * Math.PI, false);
		this._ctx.fillStyle = 'rgb(255, 255, 255)';
		this._ctx.fill();

		this._ctx.beginPath();
		this._ctx.moveTo(80, 105);
		this._ctx.lineTo(this._toMidCheckmark[0], this._toMidCheckmark[1]);
		if (this._toMidCheckmark[0] === 100) {
			this._ctx.lineTo(this._toTopLeftCheckmark[0], this._toTopLeftCheckmark[1]);
		}
		this._ctx.strokeStyle = 'rgb(0, 200, 0)';
		this._ctx.stroke();
	}

	canvasUpdate(timeInSeconds) {

		if (!this._ctx) {
			return;
		}

		if (this._canvasAppears) {
			this._canvasAnimAppears(timeInSeconds);
		} else {
			this._canvasAnimDisappears(timeInSeconds);
		}
	}

	_displayName() {

		const picSpanOne = document.querySelector('.pic-span__one');
		const picSpanTwo = document.querySelector('.pic-span__two');

		picSpanOne.style.transform = 'translateX(0px)';
		picSpanTwo.style.transform = 'translateY(0px)';
	}

	_scrollToOneRowMain() {
		function oneRowTrigger() {
		  if (document.querySelector('.wrapper-about').style.display === 'none') {
		  	return;
		  }
		  const mainStartRow = document.querySelector('.main-row__start');
		  const startLine = document.querySelectorAll('.row-start__line>p');

		  const animPoint = window.innerHeight - mainStartRow.offsetHeight;
		  const scrollY = window.pageYOffset;

		  const countRowTrigger = mainStartRow.getBoundingClientRect().top + scrollY - animPoint;

		  let delay = 0;

		  if (scrollY > countRowTrigger) {
		    mainStartRow.style.opacity = 1;

		    startLine.forEach(elem => {
		      setTimeout(() => {
		        elem.style.width = '100%';
		      }, delay);
		      delay += 100;
		    });
		    document.removeEventListener('scroll', oneRowTrigger);
		  }  
		}

		document.addEventListener('scroll', oneRowTrigger);
	}

	_scrollToTwoRowMain() {
		function twoRowTrigger() {
		  if (document.querySelector('.wrapper-about').style.display === 'none') {
		  	return;
		  }
		  const mainFinalRow = document.querySelector('.main-row__final');

		  const animPoint = window.innerHeight - mainFinalRow.offsetHeight;
		  const scrollY = window.pageYOffset;

		  const countRowTrigger = mainFinalRow.getBoundingClientRect().top + (mainFinalRow.getBoundingClientRect().height * 0.5) + scrollY - animPoint;

		  if (scrollY > countRowTrigger) {

		    const mainFinalRowP = document.querySelectorAll('.main-row__final>p');

		    mainFinalRowP.forEach(p => {
		      p.style.transform = 'translateX(0px)';
		    });

		    document.removeEventListener('scroll', twoRowTrigger);
		  }  
		}

		document.addEventListener('scroll', twoRowTrigger);
	}

	_scrollToBackgroundImage() {
		function backgroundImageTrigger() {
		  if (document.querySelector('.wrapper-about').style.display === 'none') {
		  	return;
		  }
		  const footerTriangle = document.querySelector('.content-footer__row');

		  const animPoint = window.innerHeight - footerTriangle.offsetHeight;
		  const scrollY = window.pageYOffset;

		  const countRowTrigger = footerTriangle.getBoundingClientRect().top + (footerTriangle.getBoundingClientRect().height * 25) + scrollY - animPoint;

		  if (scrollY > countRowTrigger) {

		    const fixRowTwo = document.querySelector('.fix-rowTwo');

		    fixRowTwo.style.height = 100+'vh';
		    document.removeEventListener('scroll', backgroundImageTrigger);
		  }
		}

		document.addEventListener('scroll', backgroundImageTrigger);
	}

	_scrollToContact() {
		function contactTrigger() {
		  if (document.querySelector('.wrapper-about').style.display === 'none') {
		  	return;
		  }
		  const contactMeH = document.querySelector('.contact-me');
		  const formField = document.querySelectorAll('.form-field');
		  const wayContactH = document.querySelector('.ways-to-contact__mail>h2');
		  const divAnim = document.querySelector('.contact-div__anim');
		  const wayContactMessengers = document.querySelector('.way-contact__wrapper');

		  const animPoint = window.innerHeight - contactMeH.offsetHeight;
		  const scrollY = window.pageYOffset;

		  const countRowTrigger = contactMeH.getBoundingClientRect().top + (contactMeH.getBoundingClientRect().height * 2) + scrollY - animPoint;
		  if (scrollY > countRowTrigger) {

		    divAnim.style.left = 0;
		    divAnim.addEventListener('transitionend', () => {
		      wayContactMessengers.style.opacity = 1;
		      divAnim.style.width = 0;
		      divAnim.addEventListener('transitionend', () => {
		        divAnim.style.display = 'none';
		      }, {once: true});
		    }, {once: true});

		    formField.forEach(input => {
		      input.style.transform = 'scaleX(1.0)';
		    });

		    wayContactH.style.transform = 'scaleX(1.0)';

		    document.removeEventListener('scroll', contactTrigger);
		  }
		}

		document.addEventListener('scroll', contactTrigger);		
	}

	sendMail() {
		const form = document.querySelector('.footer-form');
		const firstName = document.querySelector('.form-firstName');
		const lastName = document.querySelector('.form-lastName');
		const email = document.querySelector('.footer-form__email');
		const message = document.querySelector('.footer-form__message');
		const formPopup = document.querySelector('.footer-form__popup');

		const THIS = this;

		let event;

		if (referenceObject.isMobile) {
			event = 'touchstart';
		} else {
			event = 'click';
		}

		const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		function invalidForm(text, input) {

		  formPopup.style.display = 'flex';
		  formPopup.children[1].innerHTML = text;
		  formPopup.style.top = 80 + input.getBoundingClientRect().height + 25 + input.offsetTop + 'px';
		  formPopup.style.left = input.offsetLeft + 'px';

		  if (input.classList.contains('footer-form__message')) {
			formPopup.style.background = 'white';
			formPopup.children[0].style.borderBottom = '20px solid white';
			formPopup.children[1].style.color = 'black';
		  } else {
			formPopup.style.background = '#8a1ea4';
			formPopup.children[0].style.borderBottom = '20px solid #8a1ea4';
			formPopup.children[1].style.color = 'white';
		  }

		  input.style.boxShadow = '0px 0px 0px 2px red';
		  
		  window.addEventListener(`${event}`, () => {
		    formPopup.style.display = 'none';
		    input.style.boxShadow = 'none';
		  }, {once: true});
		}

		function validForm(e) {

		  e.preventDefault();

		  const SUBMIT = document.querySelector('.footer-form__button');

		  SUBMIT.style.transform = 'scale(0.75)';

		  SUBMIT.addEventListener('transitionend', () => {
		  	SUBMIT.style.transform = 'scale(1.0)';
		  }, {once: true});

		  const xhr = new XMLHttpRequest();

		  const formData = new FormData(document.forms.footerForm);
		  xhr.open('POST', '../valid_form.php');

		  xhr.addEventListener('load', (response) => {
		      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
		      	if (response.target.response === '') {
		      		document.querySelector('.mail-success-popUP').style.display = 'flex';
		      		THIS._canvasInit();
					return;
		      	}
				const RESPONSE = JSON.parse(response.target.response);
				invalidForm(RESPONSE.errorText, document.querySelector(`${RESPONSE.node}`));
		      } else {
		      	alert('Something wrong');
		      }
		  });

		  xhr.send(formData);
		}

		form.addEventListener( 'submit', validForm );		
	}
}