import * as THREE from './libs/three.module.js';
import {referenceObject} from './index.js';
import {SceneCamera} from './systemOfCamera.js';

const _pawSceneVS = `
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


const _pawSceneFS = `
uniform sampler2D diffuseTexture;

varying vec4 vColour;

void main() {
  gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColour;
}`;

export default class pawScene {
  constructor(params) {
    this._sounds = params.sounds;
    this._models = params.models;
    this._scene = params.scene;
    this._textures = params.textures;
    this._tooltip = params.tooltip;

    this.target = params.target;
    this.camera = params.camera;

    this._Init();
  }

  _Init() {

    const uniforms = {
      diffuseTexture: {
          value: this._textures.footprint
      },
      pointMultiplier: {
          value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
      }
    };
    const sGeometry = new THREE.BufferGeometry(),
          sMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: _pawSceneVS,
            fragmentShader: _pawSceneFS,
            blending: THREE.NormalBlending,
            depthTest: true,
            depthWrite: false,
            vertexColors: true,
            transparent: true,
            vertexColors: true
    });

    sGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );
    sGeometry.setAttribute('colour', new THREE.Float32BufferAttribute( [], 4));
    sGeometry.setAttribute('size', new THREE.Float32BufferAttribute( [], 1));
    this._points = new THREE.Points(sGeometry, sMaterial);
    this._points.frustumCulled = false;    
    this._scene.add(this._points);
    this._particles = [];
    this._gPosBone = new THREE.Vector3();


    this._paw = this._models.paw;
    this._paw.model.userData.coverSnow = true;
    this._paw.model.userData.timeCoverSnow = 20.1;

    this._mixer = {};
    this._animations = {};


    const _OnLoad = (animName, anim) => {
      const clip = anim;
      const action = this._mixer['paw'].clipAction(clip);
      this._animations[animName] = {
        clip: clip,
        action: action
      };
    };


    this._mixer['paw'] = new THREE.AnimationMixer(this._paw.model);
    _OnLoad('awakenIdle', this._paw.animations[0]);
    _OnLoad('awake', this._paw.animations[1]);
    _OnLoad('sleepIdle', this._paw.animations[2]);
    this._scene.add(this._paw.model);


    this._animations['sleepIdle'].action.reset();
    this._animations['sleepIdle'].action.play();    


    this._count = 0;
  }


  _pawAction() {

    this.target.Character.position.set(-30.47327718198251, 1, 38.381676367239336);
    this.target.Character.rotation.set(3.141592653589793, -0.10049050120149422, 3.141592653589793);
    this.target.Character.updateMatrix();
    this.target.Character.updateMatrixWorld();
    referenceObject.forGame.characterMovement = false;
    referenceObject.forGame.cameraPosition.copy(new THREE.Vector3(-23.00553221363325, 8.200000000000014, -49.13779741185351));
    referenceObject.forGame.cameraLookat.copy(new THREE.Vector3(-53.39696421547264, 2.2, -85.30728959629565));
    referenceObject.forGame.thirdPersonCamera = false;
    this._sceneCamera = new SceneCamera({
      cameraPosition: referenceObject.forGame.cameraPosition,
      cameraLookat: referenceObject.forGame.cameraLookat,
      camera: this.camera,
      target: this.target
    });
    this._mixer['paw'].stopAllAction();
    this._animations['awake'].action.setLoop(THREE.LoopOnce, 1);
    this._animations['awake'].action.play();
    this._paw.model.userData.timeCoverSnow = 0;
    this._sounds.Paw();


    setTimeout(() => {
      this._paw.model.children[this._models.paw.model.children.length - 1].material.map = this._textures.paw.notCovered;
      if (this._paw.model.userData.coverSnow) {
        this.createParticles();
        this._sounds.snowCrumbling();
      }
    }, 1000);
    var mixer = this._mixer;
    var animations = this._animations;


    function transitionListener(e) {
      mixer['paw'].stopAllAction();
      animations['awakenIdle'].action.play();
      mixer['paw'].removeEventListener( 'finished', transitionListener);
    }
    this._mixer['paw'].addEventListener( 'finished', transitionListener);


    this._count = 1;


    setTimeout(() => {
      this._count = 0;
      referenceObject.forGame.characterMovement = true;
      referenceObject.forGame.thirdPersonCamera = true;
      this._mixer['paw'].stopAllAction();
      this._animations['sleepIdle'].action.play();
      this._paw.model.userData.coverSnow = false;
    }, 3000);    
  }


  createParticles() {
    for (let i = 0; i < this._paw.model.children.length - 2; i++) {

      this._paw.model.children[i].getWorldPosition(this._gPosBone);

      this._particles.push({
        position: [this._gPosBone.x, this._gPosBone.y, this._gPosBone.z],
        colour: [0.96, 0.96, 0.96, 1],
        life: 1
      });
    }
  }


  _updateParticles(timeInSeconds) {
    this._particles = this._particles.filter(elem => elem.life > 0);

    var position = [],
        size = [],
        colour = [];

    this._particles.forEach(particle => {
      particle.life -= 0.5 * timeInSeconds;
      particle.position[1] -= 6 * timeInSeconds;
      particle.colour[3] = particle.life;

      position.push(...particle.position);
      size.push(6);
      colour.push(...particle.colour);
    });

    this._points.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ));
    this._points.geometry.setAttribute('colour', new THREE.Float32BufferAttribute( colour, 4));
    this._points.geometry.setAttribute('size', new THREE.Float32BufferAttribute( size, 1));

    this._points.geometry.attributes.colour.needsUpdate = true;
    this._points.geometry.attributes.position.needsUpdate = true;
    this._points.geometry.attributes.size.needsUpdate = true;
  }


  Update(timeInSeconds) {
    if (this.target.Character == undefined) {
      return;
    }


    if (this.target.Character.position.distanceTo(this._paw.model.position) < 25 && this._count == 0) {
      this._tooltip.pawScene();
      this._pawAction();
    }

    if (this._particles.length != 0) {
      this._updateParticles(timeInSeconds);
    }


    if (this._paw.model.userData.timeCoverSnow <= 20 && !this._paw.model.userData.coverSnow) {
      this._paw.model.userData.timeCoverSnow += timeInSeconds;
      if (this._paw.model.userData.timeCoverSnow >= 20) {
        this._paw.model.children[this._models.paw.model.children.length - 1].material.map = this._textures.paw.covered;
        this._paw.model.userData.coverSnow = true;
      }
    }


    if ( this._mixer ) {
      for (let i in this._mixer) {
        this._mixer[i].update(timeInSeconds);
      }
    } 
  }
}