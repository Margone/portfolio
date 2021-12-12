import * as THREE from './libs/three.module.js';
import {OBB} from './libs/OBB.js';

const _interactionVS = `
uniform float pointMultiplier;

attribute float size;
attribute vec4 colour;

varying vec4 vColour;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vColour = colour;
}`;


const _interactionFS = `
uniform sampler2D diffuseTexture;

varying vec4 vColour;

void main() {
  gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColour;
}`;

export default class interaction {

	constructor(params) {
		this._sounds = params.sounds;
		this._scene = params.scene;

		this._wolf = params.wolf;
		this._wolf.userData.obb = new OBB();

		this._arraysInteractionObjects = params.arraysInteractionObjects;

    this._geomOBB = new OBB();
    this._geomOBB.halfSize.copy(new THREE.Vector3(2.5, 2.5, 2.5));

    this._snowTex = params.snowTex;
    this._branchTexFull = params.branchTexFull;
    this._branchTexNotFull = params.branchTexNotFull;

    this._clock = new THREE.Clock();

    const uniforms = {
      diffuseTexture: {
          value: this._snowTex
      },
      pointMultiplier: {
          value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
      }
    };
    var sGeometry = new THREE.BufferGeometry(),
        sMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: _interactionVS,
          fragmentShader: _interactionFS,
          blending: THREE.NormalBlending,
          depthTest: true,
          depthWrite: false,
          vertexColors: true,
          transparent: true,
          vertexColors: true
      });
    sGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );
    sGeometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    sGeometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));

    this._points = new THREE.Points(sGeometry, sMaterial);
    this._points.frustumCulled = false;    
    this._scene.add(this._points);
    this._particles = [];
	}

	_createSnowCloud(branch) {
    branch.aabb.getCenter(branch.gPos);

    this._particles.push({
    	position: [branch.gPos.x, branch.gPos.y, branch.gPos.z],
    	life: 1,
    	colour: [0.96, 0.96, 0.96, 1]
    });
	}

	_updateParticles(timeInSeconds) {
		this._particles = this._particles.filter(elem => elem.life > 0);

		var position = [],
				colour = [],
				size = [];

		this._particles.forEach(particle => {
			particle.position[0] -= timeInSeconds;
			particle.position[1] -= 6 * timeInSeconds;
			particle.life -= 0.5 * timeInSeconds;
			particle.colour[3] = particle.life;

			position.push(...particle.position);
			size.push(8);
			colour.push(...particle.colour);
		});

		this._points.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
		this._points.geometry.setAttribute('colour', new THREE.Float32BufferAttribute(colour, 4));
		this._points.geometry.setAttribute('size', new THREE.Float32BufferAttribute(size, 1));

		this._points.geometry.attributes.colour.needsUpdate = true;
		this._points.geometry.attributes.position.needsUpdate = true;
		this._points.geometry.attributes.size.needsUpdate = true;
	}

  _interactionPines(pine, timeInSeconds) {

		pine.userData.arrayBrunchAABB.forEach(branch => {

			if (branch.turns) {
				branch.snowCoverTime = 0;
			}			

			if (this._wolf.userData.obb.intersectsBox3(branch.aabb) && (this._wolf.userData.obb.intersectsBox3(pine.userData.fullAABB)) && !branch.turned) {
				branch.initialQ.copy(branch.stepByStepQ);
				branch.stepByStepQ.copy(branch.stepByStepQ.slerp(branch.slerpQX, 2 * timeInSeconds));
				branch.object.quaternion.copy(branch.stepByStepQ);
				if (branch.snowCoverTime >= 30) {
					this._createSnowCloud(branch);
					this._sounds.snowCrumbling();
					branch.snowCoverTime = 0;
					branch.object.material.map = this._branchTexNotFull;
				}
				branch.turns = true;
				if (branch.stepByStepQ.equals(branch.initialQ)) {
					branch.turned = true;
					branch.turns = false;
				}
			}

			if ((branch.turns || branch.turned) && !(this._wolf.userData.obb.intersectsBox3(branch.aabb))) {
				branch.initialQ.copy(branch.stepByStepQ);
				branch.stepByStepQ.copy(branch.stepByStepQ.slerp(branch.slerpQN, 2 * timeInSeconds));
				branch.object.quaternion.copy(branch.stepByStepQ);
				if (branch.snowCoverTime >= 30) {
					this._createSnowCloud(branch);
					this._sounds.snowCrumbling();
					branch.object.material.map = this._branchTexNotFull;
				}
				branch.turned = false;
				branch.turns = true;
				if (branch.initialQ.equals(branch.stepByStepQ)) {
					branch.turns = false;
				}
			}

			if (!branch.turns && !branch.turned) {
				switch(true) {
					case(pine.userData.arrayBrunchAABB.indexOf(branch) >= 32):
						this._sinAnim = (( Math.sin( pine.userData.arrayBrunchAABB.indexOf(branch) * 0.1 + ( this._clock.getElapsedTime() * 3 ) ) * timeInSeconds * 15 )) * timeInSeconds;
						break;
					case(pine.userData.arrayBrunchAABB.indexOf(branch) >= 12):
						this._sinAnim = (( Math.sin( pine.userData.arrayBrunchAABB.indexOf(branch) * 0.1 + ( this._clock.getElapsedTime() * 3 ) ) * timeInSeconds * 4 )) * timeInSeconds;
						break;
					case(pine.userData.arrayBrunchAABB.indexOf(branch) >= 0):
						this._sinAnim = (( Math.sin( pine.userData.arrayBrunchAABB.indexOf(branch) * 0.1 + ( this._clock.getElapsedTime() * 3 ) ) * timeInSeconds * 1 )) * timeInSeconds;
						break;
				}
				branch.object.quaternion.copy(branch.slerpNZWind == 1 ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -this._sinAnim).multiply(branch.object.quaternion) : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), this._sinAnim).multiply(branch.object.quaternion));
				branch.object.quaternion.copy(branch.slerpNXWind == 1 ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -this._sinAnim).multiply(branch.object.quaternion) : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._sinAnim).multiply(branch.object.quaternion));				
			}

			if (!branch.turns && branch.snowCoverTime <= 30) {
				branch.snowCoverTime += timeInSeconds;
				if (branch.snowCoverTime >= 30) {
					branch.object.material.map = this._branchTexFull;
				}
			}
		});
	}

	_interactionBushes(bush, timeInSeconds) {

		bush.userData.arrayBrunchAABB.forEach(branch => {

			if (this._wolf.userData.obb.intersectsBox3(bush.userData.fullAABB) && !branch.turned) {
				branch.initialQ.copy(branch.stepByStepQ);
				branch.stepByStepQ.copy(branch.stepByStepQ.slerp(branch.slerpQX, 2 * timeInSeconds));
				branch.object.quaternion.copy(branch.stepByStepQ);
				if (!branch.bushRustling) {
					this._sounds.bushRustling();
					branch.bushRustling = true;
				}				
				branch.turns = true;
				if (branch.stepByStepQ.equals(branch.initialQ)) {
					branch.turned = true;
					branch.turns = false;
				}
			}

			if ((branch.turns || branch.turned) && !(this._wolf.userData.obb.intersectsBox3(bush.userData.fullAABB))) {
				branch.initialQ.copy(branch.stepByStepQ);
				branch.stepByStepQ.copy(branch.stepByStepQ.slerp(branch.slerpQN, 2 * timeInSeconds));
				branch.object.quaternion.copy(branch.stepByStepQ);
				branch.bushRustling = false;
				branch.turned = false;
				branch.turns = true;
				if (branch.initialQ.equals(branch.stepByStepQ)) {
					branch.turns = false;
				}
			}

			if (!branch.turns && !branch.turned) {
				switch(branch.resistance) {
					case('low'):
						this._sinAnim = (( Math.sin( bush.userData.arrayBrunchAABB.indexOf(branch) * 0.1 + ( this._clock.getElapsedTime() * 3 ) ) * timeInSeconds * 20 )) * timeInSeconds;
						break;
					case('medium'):
						this._sinAnim = (( Math.sin( bush.userData.arrayBrunchAABB.indexOf(branch) * 0.1 + ( this._clock.getElapsedTime() * 3 ) ) * timeInSeconds * 5 )) * timeInSeconds;
						break;
					case('high'):
						this._sinAnim = (( Math.sin( bush.userData.arrayBrunchAABB.indexOf(branch) * 0.1 + ( this._clock.getElapsedTime() * 3 ) ) * timeInSeconds * 2 )) * timeInSeconds;
						break;
				}
				branch.object.quaternion.copy(branch.slerpNZWind == 1 ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -this._sinAnim).multiply(branch.object.quaternion) : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), this._sinAnim).multiply(branch.object.quaternion));
			}
		});
	}

	Update(timeInSeconds) {

		this._wolf.userData.obb.copy( this._geomOBB );
		this._wolf.userData.obb.applyMatrix4( this._wolf.matrixWorld );
		this._wolf.userData.obb.halfSize.copy( this._geomOBB.halfSize );

		if (this._particles.length != 0) {
			this._updateParticles(timeInSeconds);
		}		

    this._arraysInteractionObjects.pines.forEach(pine => {
    	if (pine.userData.position.distanceTo(this._wolf.position) < 30) {
    		this._interactionPines(pine, timeInSeconds);
    	}
    });

    this._arraysInteractionObjects.bushes.forEach(bush => {
    	if (bush.userData.position.distanceTo(this._wolf.position) < 30) {
    		this._interactionBushes(bush, timeInSeconds);
    	}
    });
	}
}