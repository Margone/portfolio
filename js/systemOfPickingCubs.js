import * as THREE from './libs/three.module.js';
import {referenceObject} from './index.js';

export default class systemOfPickingCubs {
	constructor(params) {
		this._scene = params.scene;
		this._cubs = [params.cubOne, params.cubTwo, params.cubThree];
		this._wolf = params.wolf;
		this._sounds = params.sounds;
		this._camera = params.camera;
		this._phenomeTrees = params.phenomeTrees;
		this._arraysInteractionPines = params.arraysInteractionPines;
		this._arrayTreeObjects = params.arrayTreeObjects;
		this._tooltip = params.tooltip;

		this._Init(); 
	}

	_Init() {

		this._cubs.forEach(cub => {
			this._scene.add(cub.model);
			cub.model.userData.originQ = new THREE.Quaternion().copy(cub.model.quaternion);
		});

	    this._mixer = {};
	    this._animations = {
	    	firstCub: {

	    	},
	    	secondCub: {

	    	},
	    	thirdCub: {

	    	}
	    };
	    this._cubCarrying = false;
	    this._boneMouthPos = new THREE.Vector3();
	    this._boneMouthQ = new THREE.Quaternion();
	    this._boneMouth;
	    this._boneSpineQ = new THREE.Quaternion();
	    this._boneSpine;	    


	    this._wolf.children[0].traverse(bone => {
	      if (bone.name == 'lowerJaw') {
	        this._boneMouth = bone;
	      }
	      if (bone.name == 'spine001') {
	      	this._boneSpine = bone;
	      }
	    });


	    const _OnLoad = (animName, anim, cub) => {
	      const clip = anim;
	      const action = this._mixer[cub].clipAction(clip);
	      this._animations[cub][animName] = {
	        clip: clip,
	        action: action
	      };
	    };


	    this._mixer['firstCub'] = new THREE.AnimationMixer(this._cubs[0].model);
	    _OnLoad('poseSleepIdle', this._cubs[0].animations[0], 'firstCub');
	    _OnLoad('poseInterestAnim', this._cubs[0].animations[1], 'firstCub');
	    _OnLoad('poseInterestIdle', this._cubs[0].animations[2], 'firstCub');
	    _OnLoad('poseCarrying', this._cubs[0].animations[3], 'firstCub');

	    this._mixer['secondCub'] = new THREE.AnimationMixer(this._cubs[1].model);
	    _OnLoad('poseSleepIdle', this._cubs[1].animations[0], 'secondCub');
	    _OnLoad('poseInterestAnim', this._cubs[1].animations[1], 'secondCub');
	    _OnLoad('poseInterestIdle', this._cubs[1].animations[2], 'secondCub');
	    _OnLoad('poseCarrying', this._cubs[1].animations[3], 'secondCub');

	    this._mixer['thirdCub'] = new THREE.AnimationMixer(this._cubs[2].model);
	    _OnLoad('poseSleepIdle', this._cubs[2].animations[0], 'thirdCub');
	    _OnLoad('poseInterestAnim', this._cubs[2].animations[1], 'thirdCub');
	    _OnLoad('poseInterestIdle', this._cubs[2].animations[2], 'thirdCub');
	    _OnLoad('poseCarrying', this._cubs[2].animations[3], 'thirdCub');


	    for (let i = 0; i < this._cubs.length; i++) {

		    if (this._cubs[i].model.userData.atHome) {
		    	this._startCub = this._cubs[i];

		    	this._cubs[i].model.userData.wasDragged = true;

		    	this._velocity = new THREE.Vector3(0, 0, 0);
		    	this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -10.0);
		    	this._acceleration = new THREE.Vector3(1, 0.1, 60);

		    	this._timeEscaping = 0;

		    	this._cubs[i].model.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI));

		    	this._cubs[i].model.updateMatrix();
		    	this._cubs[i].model.updateMatrixWorld();
		    	
		    	_OnLoad('start', this._cubs[i].animations[4], this._cubs[i].model.name);

				this._animations[this._cubs[i].model.name]['start'].action.setLoop(THREE.LoopOnce, 1);
				this._animations[this._cubs[i].model.name]['start'].action.play();
				this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['start'];
				this._cubs[i].model.userData.curState.name = 'start';


				this._cubs[i].model.userData.prevState = this._cubs[i].model.userData.curState;
				this._cubs[i].model.userData.prevState.name = this._cubs[i].model.userData.curState.name;
				this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['poseSleepIdle'];
				this._cubs[i].model.userData.curState.name = 'poseSleepIdle';

				const mixer = this._mixer[this._cubs[i].model.name];
				const cub = this._cubs[i].model;

				function transitionListener() {
					cub.userData.curState.action.time = 0;
					cub.userData.curState.action.enabled = true;
					cub.userData.curState.action.setEffectiveTimeScale( 1 );
					cub.userData.curState.action.setEffectiveWeight( 1 );
					cub.userData.curState.action.crossFadeFrom( cub.userData.prevState.action, 1, true );
					cub.userData.curState.action.play();
					mixer.removeEventListener( 'finished', transitionListener);

					cub.userData.startGoingHome = false;
					cub.userData.wasDragged = false;

					cub.position.copy(cub.userData.homePoint);

					cub.updateMatrix();
					cub.updateMatrixWorld();
				}

				this._mixer[this._cubs[i].model.name].addEventListener( 'finished', transitionListener);	    	
		    } else {
		    	this._animations[this._cubs[i].model.name]['poseSleepIdle'].action.play();
		    	this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['poseSleepIdle'];
		    	this._cubs[i].model.userData.curState.name = 'poseSleepIdle';
		    }
	    }
	}

	_checkDistance(timeInSeconds) {

		for (let i = 0; i < this._cubs.length; i++) {

			if (this._cubs[i].model.userData.atHome && this._cubs[i].model.userData.startGoingHome) {

			    const velocity = this._velocity;
			    const frameDecceleration = new THREE.Vector3(
			        velocity.x * this._decceleration.x,
			        velocity.y * this._decceleration.y,
			        velocity.z * this._decceleration.z
			    );

				frameDecceleration.multiplyScalar(timeInSeconds);
    			frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));

				velocity.add(frameDecceleration);

				var acc = this._acceleration.clone();

				velocity.z += acc.z * timeInSeconds;

			    const forward = new THREE.Vector3(0, 0, -1);
			    forward.applyQuaternion(this._cubs[i].model.quaternion);
			    forward.normalize();
			    forward.multiplyScalar(velocity.z * timeInSeconds);

			    this._cubs[i].model.position.add(forward);
			    this._cubs[i].model.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(this._cubs[i].model.position, this._cubs[i].model.userData.homePoint, new THREE.Vector3(0,1,0)));

			    this._cubs[i].model.updateMatrix();
			    this._cubs[i].model.updateMatrixWorld();
			}

			if (this._cubs[i].model.userData.wasDragged) {
				continue;
			}

			const distanceToCub = this._wolf.position.distanceTo(this._cubs[i].model.position);

			switch(true) {
				case(distanceToCub < 3 && !this._cubCarrying && !this._cubs[i].model.userData.atHome):
					this._tooltip.setCountCubs(this._cubs[i]);

					this._wolf.userData.drags = true;

					this._cubCarrying = true;

					this._cubs[i].model.userData.wasDragged = true;
					this._cubs[i].model.userData.timeInterest = 0;

					this._cubs[i].model.userData.prevState = this._cubs[i].model.userData.curState;
					this._cubs[i].model.userData.prevState.name = this._cubs[i].model.userData.curState.name;
					this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['poseCarrying'];
					this._cubs[i].model.userData.curState.name = 'poseCarrying';

					this._cubs[i].model.userData.curState.action.time = 0;
					this._cubs[i].model.userData.curState.action.enabled = true;
					this._cubs[i].model.userData.curState.action.setEffectiveTimeScale( 1 );
					this._cubs[i].model.userData.curState.action.setEffectiveWeight( 1 );
					this._cubs[i].model.userData.curState.action.crossFadeFrom( this._cubs[i].model.userData.prevState.action, 0, true );
					this._cubs[i].model.userData.curState.action.play();


					this._sounds.Whine(distanceToCub);
					break;
				case(distanceToCub < 25 && this._cubs[i].model.userData.timeInterest >= 2):
					this._cubs[i].model.userData.prevState = this._cubs[i].model.userData.curState;
					this._cubs[i].model.userData.prevState.name = this._cubs[i].model.userData.curState.name;
					this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['poseInterestAnim'];
					this._cubs[i].model.userData.curState.name = 'poseInterestAnim';

					this._cubs[i].model.userData.curState.action.time = 0.0;
					this._cubs[i].model.userData.curState.action.enabled = true;
					this._cubs[i].model.userData.curState.action.setEffectiveTimeScale( 1 );
					this._cubs[i].model.userData.curState.action.setEffectiveWeight( 1 );
					this._cubs[i].model.userData.curState.action.crossFadeFrom( this._cubs[i].model.userData.prevState.action, 1, true );
					this._cubs[i].model.userData.curState.action.setLoop(THREE.LoopRepeat, 1);
					this._cubs[i].model.userData.curState.action.play();


					this._sounds.Whine(distanceToCub);


					this._cubs[i].model.userData.prevState = this._cubs[i].model.userData.curState;
					this._cubs[i].model.userData.prevState.name = this._cubs[i].model.userData.curState.name;
					this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['poseInterestIdle'];
					this._cubs[i].model.userData.curState.name = 'poseInterestIdle';

					const mixer = this._mixer[this._cubs[i].model.name];
					const animations = this._cubs[i].model.userData;

				    function transitionListener() {
						animations.curState.action.time = 0;
						animations.curState.action.enabled = true;
						animations.curState.action.setEffectiveTimeScale( 1 );
						animations.curState.action.setEffectiveWeight( 1 );
						animations.curState.action.crossFadeFrom( animations.prevState.action, 1, true );
						animations.curState.action.play();
						mixer.removeEventListener( 'finished', transitionListener);
				    }
				    this._mixer[this._cubs[i].model.name].addEventListener( 'finished', transitionListener);


					this._cubs[i].model.userData.timeInterest = 0;
					// squeak sound
					break;
				case(distanceToCub >= 25 && this._cubs[i].model.userData.timeInterest <= 2):
					this._cubs[i].model.userData.timeInterest += timeInSeconds;
					if (this._cubs[i].model.userData.timeInterest >= 2 && this._cubs[i].model.userData.curState.name != 'poseSleepIdle') {

						this._cubs[i].model.userData.prevState = this._cubs[i].model.userData.curState;
						this._cubs[i].model.userData.prevState.name = this._cubs[i].model.userData.curState.name;
						this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['poseInterestAnim'];
						this._cubs[i].model.userData.curState.name = 'poseInterestAnim';

					    if(this._cubs[i].model.userData.curState.action.time === 0) {
					        this._cubs[i].model.userData.curState.action.time = this._cubs[i].model.userData.curState.action.getClip().duration;
					    }						

						this._cubs[i].model.userData.curState.action.time = 0.0;
						this._cubs[i].model.userData.curState.action.enabled = true;
						this._cubs[i].model.userData.curState.action.setEffectiveTimeScale( 1 );
						this._cubs[i].model.userData.curState.action.setEffectiveWeight( 1 );
						this._cubs[i].model.userData.curState.action.crossFadeFrom( this._cubs[i].model.userData.prevState.action, 1, true );
						this._cubs[i].model.userData.curState.action.setLoop(THREE.LoopOnce, 1);
						this._cubs[i].model.userData.curState.action.timeScale = -1;
						this._cubs[i].model.userData.curState.action.play();

						this._cubs[i].model.userData.prevState = this._cubs[i].model.userData.curState;
						this._cubs[i].model.userData.prevState.name = this._cubs[i].model.userData.curState.name;
						this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['poseSleepIdle'];
						this._cubs[i].model.userData.curState.name = 'poseSleepIdle';

						const mixer = this._mixer[this._cubs[i].model.name];
						const animations = this._cubs[i].model.userData;

					    function transitionListenerReverse() {
				    		animations.curState.action.time = 0;
				    		animations.curState.action.enabled = true;					    	
							animations.curState.action.setEffectiveTimeScale( 1 );
							animations.curState.action.setEffectiveWeight( 1 );
							animations.curState.action.crossFadeFrom( animations.prevState.action, 1, true );
							animations.curState.action.play();
							mixer.removeEventListener( 'finished', transitionListener);
					    }
					    this._mixer[this._cubs[i].model.name].addEventListener( 'finished', transitionListenerReverse);						
					}
					break;
			}
		}
	}

	_Carrying(timeInSeconds, currentStateWolf) {
		for (let i = 0; i < this._cubs.length; i++) {


			if (this._cubs[i].model.userData.icePhenomena && referenceObject.forGame.iceFlooring && this._cubs[i].model.userData.wasDragged) {
				this._sounds.icePhenomena();
				this._cubs[i].model.userData.icePhenomena = false;
				this._camera.userData.phenomena = true;
				this._camera.userData.phenomenaDuration = 0;
			}

			if (this._cubs[i].model.userData.treePhenomena && this._cubs[i].model.userData.wasDragged) {
				setTimeout(() => {
					this._sounds.fallTree();
					this._scene.userData.fogHorizonColorLerp.copy(new THREE.Color(1, 1, 1));
					this._scene.userData.fogPhenoma = true;
				}, 3000);				
				this._sounds.treePhenomena();
				this._cubs[i].model.userData.treePhenomena = false;
				for (let i = 0; i < this._arraysInteractionPines.length; i++) {
					if (this._arraysInteractionPines[i].userData.fallTree) {
						this._arrayTreeObjects.splice(i, 1);
						this._arraysInteractionPines.splice(i, 1);
					}
				}

				this._scene.remove(this._phenomeTrees.tree);
				this._phenomeTrees.tree.traverse(mesh => {
					if (mesh.isMesh) {
						mesh.material.dispose();
						mesh.geometry.dispose();
					}
				});
				this._scene.add(this._phenomeTrees.fallTree);
			}			

			if (!this._cubs[i].model.userData.wasDragged || this._cubs[i].model.userData.atHome) {
				continue;
			}

			if (this._wolf.position.distanceTo(this._cubs[i].model.userData.homePoint) < 15) {

				switch(this._cubs[i].model.name) {
					case 'firstCub':
						referenceObject.data.cubOneTexture = this._cubs[i].model.children[this._cubs[i].model.children.length - 1].material.map;
						break;
					case 'secondCub':
						referenceObject.data.cubTwoTexture = this._cubs[i].model.children[this._cubs[i].model.children.length - 1].material.map;
						break;
				}

				referenceObject.countCubs += 1;

				if (referenceObject.countCubs === 3) {
					document.querySelectorAll('.game-target p').forEach(node => node.classList.add('_active'));
				}

				this._wolf.userData.drags = false;

				this._cubs[i].model.userData.prevState = this._cubs[i].model.userData.curState;
				this._cubs[i].model.userData.prevState.name = this._cubs[i].model.userData.curState.name;
				this._cubs[i].model.userData.curState = this._animations[this._cubs[i].model.name]['poseSleepIdle'];
				this._cubs[i].model.userData.curState.name = 'poseSleepIdle';

				this._cubs[i].model.userData.curState.action.time = 0;
				this._cubs[i].model.userData.curState.action.enabled = true;
				this._cubs[i].model.userData.curState.action.setEffectiveTimeScale( 1 );
				this._cubs[i].model.userData.curState.action.setEffectiveWeight( 1 );
				this._cubs[i].model.userData.curState.action.crossFadeFrom( this._cubs[i].model.userData.prevState.action, 0, true );
				this._cubs[i].model.userData.curState.action.play();

				this._sounds.Whine(0);

				this._cubs[i].model.position.copy(this._cubs[i].model.userData.homePoint);
				this._cubs[i].model.quaternion.copy(this._cubs[i].model.userData.originQ);

				this._cubs[i].model.updateMatrix();
				this._cubs[i].model.updateMatrixWorld();

				this._cubs[i].model.userData.wasDragged = false;
				this._cubs[i].model.userData.atHome = true;
				this._cubCarrying = false;
				return;
			}			

			this._boneMouth.getWorldPosition(this._boneMouthPos);
			this._boneSpine.getWorldQuaternion(this._boneSpineQ);

			this._cubs[i].model.position.set(this._boneMouthPos.x, this._boneMouthPos.y - 0.5, this._boneMouthPos.z);
			this._cubs[i].model.quaternion.copy(this._boneSpineQ);
			this._cubs[i].model.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI/2));
			this._cubs[i].model.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (-Math.PI/2) + 0.15));

			this._cubs[i].model.updateMatrix();
			this._cubs[i].model.updateMatrixWorld();
		}
	}

	Update(timeInSeconds, currentStateWolf) {
		if (!this._mixer) {
			return;
		}

		if (this._timeEscaping < 3.5) {
			this._timeEscaping += timeInSeconds;
			if (this._timeEscaping > 3.5) {
				this._timeEscaping = 3.5;
				this._startCub.model.userData.startGoingHome = true;
			}
		}

		for (let i in this._mixer) {
			this._mixer[i].update(timeInSeconds);
		}

		this._tooltip.showCountCubs(Math.min(...(this._cubs.filter(cub => cub.model.userData.atHome)).map(cub => this._wolf.position.distanceTo(cub.model.position))));

		if (this._cubCarrying) {
			this._Carrying(timeInSeconds, currentStateWolf);
		}

		this._checkDistance(timeInSeconds);
	}
}