import * as THREE from './libs/three.module.js';
import {referenceObject, choiceWindow} from './index.js';
import {SceneCamera} from './systemOfCamera.js';

export default class exitScene {
	constructor(params) {
		this._scene = params.scene;
		this._sounds = params.sounds;
		this._wolf = params.wolf;
		this._tooltip = params.tooltip;

		this.camera = params.camera;
		this.target = params.target;

		this._Init();
	}

	_Init() {
		this._count = 0;
		this._timeExit = 0;
		this._volume = 1;

		this._exitMenu = false;

		this._exitPoint = new THREE.Vector3(-124, 0, 124);
	}

	exitAction() {
	    referenceObject.forGame.characterMovement = false;
	    referenceObject.forGame.thirdPersonCamera = false;
	    referenceObject.forGame.cameraPosition.copy(new THREE.Vector3(-188, 5, 188));
	    referenceObject.forGame.cameraLookat.copy(new THREE.Vector3(-189, 10, 189));
	    this._sceneCamera = new SceneCamera({
	      cameraPosition: referenceObject.forGame.cameraPosition,
	      cameraLookat: referenceObject.forGame.cameraLookat,
	      camera: this.camera,
	      target: this.target
	    });
	}

	Update(timeInSeconds) {
		if (this._exitMenu && this._tooltip._queue.length === 0) {
			if (this._timeExit < 2) {
				this._timeExit += timeInSeconds;
				if (this._scene.fog.density < 0.2) {
					this._scene.fog.density += timeInSeconds * 0.2;
				}
				this._volume -= timeInSeconds * 2.5;
				Howler.volume(this._volume);
				if (this._timeExit >= 2) {
					referenceObject.forGame.gameOut = true;
					Howler.volume(0);
					this._volume = 1;
				    this._wolf.userData.startGamePosition.set(-30.47327718198251, 1, 38.381676367239336);
				    this._wolf.position.set(-30.47327718198251, 1, 38.381676367239336);
				    this._wolf.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
				    this._wolf.updateMatrix();
				    this._wolf.updateMatrixWorld();
					this._timeExit = 0;
					this._wolfTeleport = 0;
					this._exitMenu = false;
					document.documentElement.style.overflowY = 'visible';
					document.querySelector('.container3d').style.opacity = 0;
					document.querySelector('.tooltips').style.opacity = 0;
					document.querySelector('.content-choice').style.opacity = 1;
					document.querySelector('.game-background div').style.opacity = 1;
					document.querySelector('.game-p1').style.opacity = 1;
					document.querySelector('.about').style.display = 'flex';
					new choiceWindow();
				}				
			}
		}

		if (this._count === 2) {
			if (this._scene.fog.density < 0.2) {
				this._scene.fog.density += timeInSeconds * 0.2;
			}
			if (this._timeExit < 2 && this._tooltip._queue.length === 0) {
				this._timeExit += timeInSeconds;
				this._volume -= timeInSeconds * 2.5;
				Howler.volume(this._volume);
				if (this._timeExit >= 2) {
					referenceObject.forGame.gameOut = true;
					this._count = 0;
					Howler.volume(0);
					this._volume = 1;
				    this._wolf.userData.startGamePosition.set(-30.47327718198251, 1, 38.381676367239336);
				    this._wolf.position.set(-30.47327718198251, 1, 38.381676367239336);
				    this._wolf.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
				    this._wolf.updateMatrix();
				    this._wolf.updateMatrixWorld();
					this._timeExit = 0;
					this._wolfTeleport = 0;
					document.documentElement.style.overflowY = 'visible';
					document.querySelector('.container3d').style.opacity = 0;
					document.querySelector('.tooltips').style.opacity = 0;
					document.querySelector('.content-choice').style.opacity = 1;
					document.querySelector('.game-background div').style.opacity = 1;
					document.querySelector('.game-p1').style.opacity = 1;
					document.querySelector('.about').style.display = 'flex';
					new choiceWindow();
					this._scene.fog.density = 0.2;
				}
			}
		}

		if (this._wolf.position.distanceTo(this._exitPoint) > 25 && this._count != 0) {
			this._count = 0;
		}

	    if (this._wolf.position.distanceTo(this._exitPoint) < 25 && this._count == 0) {
	    	this._count = 1;
	    	this._tooltip.exitScene();
	    }

	    if (this._wolf.position.distanceTo(this._exitPoint) < 25 && this._count == 1) {
	    	this._count = 2;
	    	this.exitAction();
	    }
	}
}