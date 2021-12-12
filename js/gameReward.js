import * as THREE from './libs/three.module.js';
import {referenceObject} from './index.js';

export default class gameReward {
	constructor(params) {

		this._currentScene = params.currentScene;
		this._timeInSeconds = params.timeInSeconds;
		this._wolf = params.wolf;

		this.Init();
	}

	Init() {

		const WRAPPER_EDITOR = document.querySelector('.wrapper-editor'),
			 		ROTATE_ROW = document.querySelector('.rotate-popup-row');

		this.checkTexture();

		this._wolfAnimScale = false;
		this._wolfAnimScaleToMax = false;


		this._mane;
		this._wool;

		this._wolf.traverse((child) => {
			if (child.isMesh && child.name === 'Wolf2_fur__fella3_jpg_001_0') {
				this._mane = child;
			}
			if (child.isMesh && child.name === 'Wolf1_Material__wolf_col_tga_0001') {
				this._wool = child;
			}
 		});


		WRAPPER_EDITOR.addEventListener('transitionend', () => {
			setTimeout(() => {
				ROTATE_ROW.style.opacity = '0';
				ROTATE_ROW.addEventListener('transitionend', () => {
					ROTATE_ROW.style.display = 'none';
					WRAPPER_EDITOR.style.justifyContent = 'flex-end';
				});
			}, 3000);
		}, {once: true});

		this._rotateWolf();

		document.querySelector('.editor-row__color').addEventListener('input', (event) => {
			this._mane.material.color = new THREE.Color( event.target.value );
		});

    let event;

    if (referenceObject.isMobile) {
      event = 'touchend';
    } else {
      event = 'click';
    }

		document.querySelector('.editor-row__wool').addEventListener(`${event}`, (event) => {
			this._changeTexture(event);
		});
	}


	checkTexture() {

		const textureDarkBlock = document.querySelector('.texture-dark'),
			  textureRegularBlock = document.querySelector('.texture-regular'),
			  textureLightBlock = document.querySelector('.texture-light');

		if (referenceObject.data.cubOneTexture) {
			this.darkTexture = true;
			if (textureDarkBlock.classList.contains('icon-lock')) {
				textureDarkBlock.classList.remove('icon-lock');
			}
		} else {
			this.darkTexture = false;
		}
		this.regularTexture = true;
		if (referenceObject.data.cubTwoTexture) {
			this.lightTexture = true;
			if (textureLightBlock.classList.contains('icon-lock')) {
				textureLightBlock.classList.remove('icon-lock');
			}
		} else {
			this.lightTexture = false;
		}		
	}


	_changeTexture(event) {

		switch(event.target.classList[1]) {
			case 'texture-dark':
				if (!this.darkTexture) {
					return;
				}
				this._wool.material.map = referenceObject.data.cubOneTexture;
				this._wolfAnimScale = true;
				this._wolfAnimScaleToMax = true;
				event.target.style.transform = 'scale(0.75)';
				break;
			case 'texture-regular':
				if (!this.regularTexture) {
					return;
				}
				this._wool.material.map = referenceObject.data.cubThreeTexture;
				this._wolfAnimScale = true;
				this._wolfAnimScaleToMax = true;
				event.target.style.transform = 'scale(0.75)';
				break;
			case 'texture-light':
				if (!this.lightTexture) {
					return;
				}			
				this._wool.material.map = referenceObject.data.cubTwoTexture;
				this._wolfAnimScale = true;
				this._wolfAnimScaleToMax = true;
				event.target.style.transform = 'scale(0.75)';
				break;
		}

		event.target.addEventListener('transitionend', () => {
			event.target.style.transform = 'scale(1.0)';
		}, {once: true});		
	}


	_rotateWolf() {
        let moved = false;
        let mousePageX;

        if (referenceObject.isMobile) {

          document.querySelector('.wrapper-editor').addEventListener('touchmove', (event) => {
          	if (!this._currentScene.name === 'wolf' || referenceObject.forAbout.gameOut) {
          		return;
          	}

            if (mousePageX < event.touches[0].pageX) {
              this._wolf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._timeInSeconds * 0.2));
            } else {
              this._wolf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -this._timeInSeconds * 0.2));
            }

            this._wolf.updateMatrix();
            this._wolf.updateMatrixWorld();

            mousePageX = event.touches[0].pageX;
          }); 
        } else {
          document.querySelector('.wrapper-editor').addEventListener('mousedown', () => {
          	if (!this._currentScene.name === 'wolf' || referenceObject.forAbout.gameOut) {
          		return;
          	}
            moved = true;
          });

          document.querySelector('.wrapper-editor').addEventListener('mousemove', (event) => {
            if (!moved || !this._currentScene.name === 'wolf' || referenceObject.forAbout.gameOut) {
              return;
            }

            if (mousePageX < event.pageX) {
              this._wolf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._timeInSeconds * 0.5));
            } else {
              this._wolf.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -this._timeInSeconds * 0.5));
            }

            this._wolf.updateMatrix();
            this._wolf.updateMatrixWorld();

            mousePageX = event.pageX;
          });

          document.querySelector('.wrapper-editor').addEventListener('mouseup', () => {
            moved = false;
          });
        }
	}


	Update(timeInSeconds) {
		if (this._wolfAnimScale) {
			if (this._wolfAnimScaleToMax) {
				this._wolf.scale.x += timeInSeconds * 1.5;
				this._wolf.scale.y += timeInSeconds * 1.5;
				this._wolf.scale.z += timeInSeconds * 1.5;
				if (this._wolf.scale.x >= 1.2) {
					this._wolfAnimScaleToMax = false;
				}
				this._wolf.updateMatrix();
				this._wolf.updateMatrixWorld();
			} else {
				this._wolf.scale.x -= timeInSeconds * 1.5;
				this._wolf.scale.y -= timeInSeconds * 1.5;
				this._wolf.scale.z -= timeInSeconds * 1.5;
				if (this._wolf.scale.x <= 1) {
					this._wolf.scale.set(1, 1, 1);
					this._wolfAnimScale = false;
				}
				this._wolf.updateMatrix();
				this._wolf.updateMatrixWorld();
			}
		}
	}
}