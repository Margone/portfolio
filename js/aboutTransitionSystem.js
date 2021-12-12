import * as THREE from './libs/three.module.js';
import {referenceObject, choiceWindow} from './index.js';
import Skills from './skills.js';
import gameReward from './gameReward.js';
// import {GUI} from './libs/dat.gui.module.js';


const _transitionParticlesVS = `
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

const _transitionParticlesFS = `
uniform sampler2D diffuseTexture;

varying vec4 vColour;

void main() {
  gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColour;
}`;

const _IAmDuringWorkVS = `
#include <skinning_pars_vertex>
#include <uv_pars_vertex>
varying vec4 vColour;
uniform vec4 colour;
uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
  #include <uv_vertex>
  vColour = colour;
  #include <color_vertex>
  #include <begin_vertex>
  #include <skinbase_vertex>
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <project_vertex>
  gl_PointSize = size;
  #ifdef USE_SIZEATTENUATION
    bool isPerspective = isPerspectiveMatrix( projectionMatrix );
    if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
  #endif
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>
  #include <worldpos_vertex>
  #include <fog_vertex>
}`;

const _IAmDuringWorkFS = `
#include <uv_pars_fragment>
uniform sampler2D map;
uniform vec4 colour;
varying vec4 vColour;
uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
  #include <clipping_planes_fragment>
  vec4 outgoingLight = vec4( 0.0 );
  #ifdef USE_UV
    vec4 diffuseColor = texture2D( map, vUv ) * vColour;
  #else 
    vec4 diffuseColor = texture2D( map, gl_PointCoord ) * vColour;
  #endif
  #include <logdepthbuf_fragment>
  #include <map_particle_fragment>
  #include <color_fragment>
  #include <alphatest_fragment>
  outgoingLight = diffuseColor.rgba;
  gl_FragColor = vec4( outgoingLight.r, outgoingLight.g, outgoingLight.b, diffuseColor.a );
  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>
  #include <premultiplied_alpha_fragment>
}`;

export default class aboutTransitionSystem {
	constructor(params) {
		this._camera = params.camera;

    this._camera.userData.right = false;
    this._camera.userData.left = true;
    this._camera.userData.extraTurn = 0;

		this._scene = params.scene;
		this._dataAttributes = params.dataAttributes;
    this._this = params.this;

		this._Init();
	}

  // _buildGui() {

  //   let gui = new GUI();

  //   let _wolfSpotlightOne = this._wolfSpotlightOne;

  //   const params = {
  //     intensity: this._wolfSpotlightOne.intensity,
  //     distance: this._wolfSpotlightOne.distance,
  //     angle: this._wolfSpotlightOne.angle,
  //     penumbra: this._wolfSpotlightOne.penumbra,
  //     decay: this._wolfSpotlightOne.decay,
  //     focus: this._wolfSpotlightOne.shadow.focus
  //   };

  //   gui.add( params, 'intensity', 0, 10 ).onChange( function ( val ) {

  //   _wolfSpotlightOne.intensity = val;

  //   } );


  //   gui.add( params, 'distance', 0, 10 ).onChange( function ( val ) {

  //   _wolfSpotlightOne.distance = val;

  //   } );

  //   gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {

  //   _wolfSpotlightOne.angle = val;

  //   } );

  //   gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {

  //   _wolfSpotlightOne.penumbra = val;

  //   } );

  //   gui.add( params, 'decay', 0, 2 ).onChange( function ( val ) {

  //   _wolfSpotlightOne.decay = val;

  //   } );

  //   gui.add( params, 'focus', 0, 1 ).onChange( function ( val ) {

  //   _wolfSpotlightOne.shadow.focus = val;

  //   } );

  //   gui.open();

  // }

	_Init() {

    this._initLight();

    this._wolfSpotlightOne = new THREE.SpotLight( 0xffffff, 0 );
    this._wolfSpotlightOne.castShadow = false;
    this._wolfSpotlightOne.visible = false;

    this._wolfSpotlightOne.position.copy(this._camera.position);

    this._wolfSpotlightOne.target.position.copy(new THREE.Vector3(2, 0, 3.65));
    this._wolfSpotlightOne.target.updateMatrixWorld();

    this._wolfSpotlightOne.angle = 1;
    this._wolfSpotlightOne.penumbra = 0;
    this._wolfSpotlightOne.decay = 0.45;
    this._wolfSpotlightOne.distance = 4;

    this._scene.add(this._wolfSpotlightOne.target);
    this._scene.add(this._wolfSpotlightOne);


    this._wolfSpotlightTwo = new THREE.SpotLight( 0xffffff, 0 );
    this._wolfSpotlightTwo.castShadow = false;
    this._wolfSpotlightOne.visible = false;

    this._wolfSpotlightTwo.position.copy(new THREE.Vector3(2, 0, 3.65));
    this._wolfSpotlightTwo.position.z += 1;        

    this._wolfSpotlightTwo.target.position.copy(new THREE.Vector3(2, 0, 3.65));
    this._wolfSpotlightTwo.target.updateMatrixWorld();

    this._wolfSpotlightTwo.angle = 1;
    this._wolfSpotlightTwo.penumbra = 0;
    this._wolfSpotlightTwo.decay = 1;
    this._wolfSpotlightTwo.distance = 2;

    this._scene.add(this._wolfSpotlightTwo.target);
    this._scene.add(this._wolfSpotlightTwo);

    // this._buildGui();

    const uniforms = {
      diffuseTexture: {
          value: referenceObject.data.snowfleak
      },
      pointMultiplier: {
          value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
      }
    };
    let pGeometry = new THREE.BufferGeometry(),
        pMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: _transitionParticlesVS,
          fragmentShader: _transitionParticlesFS,
          blending: THREE.NormalBlending,
          depthTest: true,
          depthWrite: false,
          transparent: true,
          vertexColors: true
        });

    this._arrayScatteredPositions = [];
    this._arrayPositions = [];

    const mePositionAttribute = this._dataAttributes.me.position; 

    for (let i = 0; i < mePositionAttribute.count; i++) {

      this._arrayPositions.push(new THREE.Vector3(mePositionAttribute.getX(i), mePositionAttribute.getY(i), mePositionAttribute.getZ(i)));

      const scatterPositionX = mePositionAttribute.getX(i) + Number((Math.random() * (5 - -5) + -5).toFixed(1));
      const scatterPositionY = mePositionAttribute.getY(i) + Number((Math.random() * (5 - -5) + -5).toFixed(1));
      const scatterPositionZ = mePositionAttribute.getZ(i) + Number((Math.random() * (5 - -5) + -5).toFixed(1));

      this._arrayScatteredPositions.push(new THREE.Vector3( scatterPositionX, scatterPositionY, scatterPositionZ ));
    }


    pGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );
    pGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( [], 1 ) );
    pGeometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( [], 3 ) );

    this._staticParticlesPosition = [];
    this._staticParticlesColour = [];
    this._staticParticlesSize = [];

    this._points = new THREE.Points(pGeometry, pMaterial);
    this._points.matrixAutoUpdate = false;
    this._points.frustumCulled = false;

    this._scene.add(this._points);  

    referenceObject.forAbout.cameraLookat.copy(this._points.position);
    this._cameraLookat = new THREE.Vector3().copy(this._points.position);
    this._currentLookat = new THREE.Vector3().copy(this._cameraLookat);

    this._points.geometry.attributes.position.needsUpdate = true;
    this._points.geometry.attributes.size.needsUpdate = true;
    this._points.geometry.attributes.colour.needsUpdate = true;

    this._data = {
      scenes: {
        me: {
          position: new THREE.Vector3().copy(this._points.position),
          attributes: this._dataAttributes.me,
          name: 'me'
        },
        IAmDuringWork: {
          position: new THREE.Vector3(-2, -2, 5),
          attributes: this._dataAttributes.IAmDuringWork,
          name: 'IAmDuringWork'
        },
        wolf: {
          position: new THREE.Vector3(2, 0, 3.65),
          name: 'wolf'
        }
      }
    }

    this._data.currentScene = this._data.scenes.me;

    this._particles = [];

    this._currentParticleCount = 0;

    if (window.innerWidth <= 600) {
      this._wideScreen = false;
    } else {
      this._wideScreen = true;
    }

    this._burgerMenUEvent();

    this._chapterListEvent();
	}


  _transitionBetweenChapters() {

    let target = event.target;

    const WRAPPER = document.querySelector('.wrapper'),
          WRAPPER_EDITOR = document.querySelector('.wrapper-editor'),
          WRAPPER_ABOUT = document.querySelector('.wrapper-about'),
          WRAPPER_SKILLS = document.querySelector('.wrapper-skills');

    if (!target.classList.contains('list-chapters__chapter')) {
      target = event.target.parentNode;
    }

    switch(target.classList[1]) {
      case 'chapter-artist':
        if (this._data.currentScene.name === 'me') {
          return;
        }
        this._spotLightDynamic.intensity = 0;
        this._spotLightDynamic.visible = false;
        window.scrollTo(0, 0);
        if (this._data.currentScene.name === 'IAmDuringWork') {
          WRAPPER_SKILLS.style.opacity = 0;
          WRAPPER_ABOUT.style.display = 'block';
          WRAPPER_SKILLS.addEventListener('transitionend', () => {
            WRAPPER_SKILLS.style.zIndex = -1;
            WRAPPER_SKILLS.style.display = 'none';
            WRAPPER.style.height = 'auto';
            WRAPPER_ABOUT.style.zIndex = 3;
            WRAPPER_ABOUT.style.opacity = 1;
          }, {once: true});
        }
        if (this._data.currentScene.name === 'wolf') {
          this._wolfSpotlightOne.visible = false;
          this._wolfSpotlightOne.intensity = 0;
          this._wolfSpotlightTwo.visible = false;
          this._wolfSpotlightTwo.intensity = 0;
          WRAPPER_EDITOR.style.height = '0';
          WRAPPER_ABOUT.style.display = 'block';
          WRAPPER_EDITOR.addEventListener('transitionend', () => {
            WRAPPER_EDITOR.style.zIndex = '-1';
            WRAPPER.style.height = 'auto';
            WRAPPER_ABOUT.style.zIndex = 3;
            WRAPPER_ABOUT.style.opacity = 1;
          }, {once: true});
        }
        this._data.currentScene = this._data.scenes.me;
        break;
      case 'chapter-skills':
        if (this._data.currentScene.name === 'IAmDuringWork') {
          return;
        }
        this._spotLightDynamic.visible = true;
        if (this._data.currentScene.name === 'me') {
          WRAPPER_ABOUT.style.opacity = '0';
          WRAPPER_SKILLS.style.display = 'flex';
          WRAPPER_ABOUT.addEventListener('transitionend', () => {
            WRAPPER_ABOUT.style.zIndex = '-1';
            WRAPPER_ABOUT.style.display = 'none';
            if (this.Skills.currentSlide.name === 'fake') {
              WRAPPER.style.height = '100%';
            } else {
              WRAPPER.style.height = '100vh';
            }
            WRAPPER_SKILLS.style.zIndex = 3;
            WRAPPER_SKILLS.style.opacity = 1;              
          }, {once: true});
        }
        if (this._data.currentScene.name === 'wolf') {
          this._wolfSpotlightOne.visible = false;
          this._wolfSpotlightOne.intensity = 0;
          this._wolfSpotlightTwo.visible = false;
          this._wolfSpotlightTwo.intensity = 0;
          WRAPPER_EDITOR.style.height = '0';
          WRAPPER_SKILLS.style.display = 'flex';
          WRAPPER_EDITOR.addEventListener('transitionend', () => {
            WRAPPER_EDITOR.style.zIndex = '-1';
            if (this.Skills.currentSlide.name === 'fake') {
              document.body.style.height = 'auto';
              WRAPPER.style.height = '100%';
            } else {
              WRAPPER.style.height = '100vh';
            }
            WRAPPER_SKILLS.style.zIndex = 3;
            WRAPPER_SKILLS.style.opacity = 1;
          }, {once: true});
        }          
        this._data.currentScene = this._data.scenes.IAmDuringWork;
        break;
      case 'chapter-editor':
        if (this._data.currentScene.name === 'wolf') {
          return;
        }
        if (!referenceObject.data.wolf) {
          const CLARIFICATION = document.querySelector('.icon-lock__clarification');
          if (!CLARIFICATION.classList.contains('_active')) {
            CLARIFICATION.classList.toggle('_active');
            setTimeout(() => {
              CLARIFICATION.classList.toggle('_active');
            }, 2500);
          }
          return;
        }
        if (this.gameReward) {
          this.gameReward.checkTexture();
        }
        window.scrollTo(0, 0);
        this._wolfSpotlightOne.visible = true;
        this._wolfSpotlightOne.intensity = 1;
        this._wolfSpotlightTwo.visible = true;
        this._wolfSpotlightTwo.intensity = 1;
        if (this._data.currentScene.name === 'IAmDuringWork') {
          document.body.style.height = '100%';
          WRAPPER_SKILLS.style.opacity = 0;
          WRAPPER_SKILLS.addEventListener('transitionend', () => {
            this._spotLightDynamic.intensity = 0;
            this._spotLightDynamic.visible = false;
            WRAPPER_SKILLS.style.zIndex = -1;
            WRAPPER_SKILLS.style.display = 'none';
            WRAPPER.style.height = '100%';
            WRAPPER_EDITOR.style.zIndex = '3';
            WRAPPER_EDITOR.style.height = '100%';
          }, {once: true});
        }
        if (this._data.currentScene.name === 'me') {
          WRAPPER_ABOUT.style.opacity = '0';
          WRAPPER_ABOUT.addEventListener('transitionend', () => {
            WRAPPER_ABOUT.style.zIndex = '-1';
            WRAPPER_ABOUT.style.display = 'none';
            WRAPPER.style.height = '100%';
            WRAPPER_EDITOR.style.zIndex = '3';
            WRAPPER_EDITOR.style.height = '100%';
          }, {once: true});           
        }
        this._data.currentScene = this._data.scenes.wolf;
        if (referenceObject.data.wolf && referenceObject.data.wolf.model.userData.startGamePosition.x === -30.47327718198251) {
          this._scene.add(referenceObject.data.wolf.model);
          referenceObject.data.wolf.model.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
          referenceObject.data.wolf.model.scale.set(1, 1, 1);
          referenceObject.data.wolf.model.position.copy(this._data.currentScene.position);
          referenceObject.data.wolf.model.updateMatrix();
          referenceObject.data.wolf.model.updateMatrixWorld();
        }
        break;
      case 'exit':
        if (this._data.currentScene.name === 'me') {
          document.querySelector('.about').style.zIndex = 4;
          document.querySelector('.about-background').style.zIndex = 1;
          document.querySelector('.about-background').style.opacity = 1;
          document.querySelector('.about-background').addEventListener('transitionend', () => {
            WRAPPER_ABOUT.style.opacity = '0';
            WRAPPER_ABOUT.style.zIndex = '-1';
            WRAPPER_ABOUT.style.display = 'none';
            WRAPPER.style.height = '100vh';
            document.querySelector('.container3dAbout').style.opacity = 0;
            document.querySelector('.tooltips').style.zIndex = 4;
            document.querySelector('.about-p1').style.opacity = 1;
            document.querySelector('.about-p1').style.zIndex = 2;
            document.querySelector('.game').style.opacity = 1;
            referenceObject.forAbout.gameOut = true;
            if (referenceObject.data.wolf && referenceObject.data.wolf.model.position.x === 2) {
              referenceObject.data.wolf.model.userData.gameScene.add(referenceObject.data.wolf.model);
              referenceObject.data.wolf.model.scale.set(5, 5, 5);
              referenceObject.data.wolf.model.position.copy(referenceObject.data.wolf.model.userData.startGamePosition);
              referenceObject.data.wolf.model.updateMatrix();
              referenceObject.data.wolf.model.updateMatrixWorld();
            }
            new choiceWindow();
          }, {once: true});
        }
        if (this._data.currentScene.name === 'IAmDuringWork') {
          document.querySelector('.about').style.zIndex = 4;
          document.querySelector('.about-background').style.zIndex = 1;
          document.querySelector('.about-background').style.opacity = 1;
          document.querySelector('.about-background').addEventListener('transitionend', () => {
            this._spotLightDynamic.visible = false;
            WRAPPER_SKILLS.style.opacity = 0;
            WRAPPER_SKILLS.style.zIndex = -1;
            WRAPPER_SKILLS.style.display = 'none';
            WRAPPER.style.height = '100vh';
            document.querySelector('.container3dAbout').style.opacity = 0;
            document.querySelector('.tooltips').style.zIndex = 4;
            document.querySelector('.about-p1').style.opacity = 1;
            document.querySelector('.about-p1').style.zIndex = 2;
            document.querySelector('.game').style.opacity = 1;
            referenceObject.forAbout.gameOut = true;
            if (referenceObject.data.wolf && referenceObject.data.wolf.model.position.x === 2) {
              referenceObject.data.wolf.model.userData.gameScene.add(referenceObject.data.wolf.model);
              referenceObject.data.wolf.model.scale.set(5, 5, 5);
              referenceObject.data.wolf.model.position.copy(referenceObject.data.wolf.model.userData.startGamePosition);
              referenceObject.data.wolf.model.updateMatrix();
              referenceObject.data.wolf.model.updateMatrixWorld();
            }
            new choiceWindow();
          }, {once: true});
        }
        if (this._data.currentScene.name === 'wolf') {
          this._wolfSpotlightOne.visible = false;
          this._wolfSpotlightOne.intensity = 0;
          this._wolfSpotlightTwo.visible = false;
          this._wolfSpotlightTwo.intensity = 0;
          document.querySelector('.about').style.zIndex = 4;
          document.querySelector('.about-background').style.zIndex = 1;
          document.querySelector('.about-background').style.opacity = 1;
          document.querySelector('.about-background').addEventListener('transitionend', () => {
            WRAPPER_EDITOR.style.height = '0';
            WRAPPER_EDITOR.style.zIndex = '-1';
            WRAPPER.style.height = '100vh';
            document.querySelector('.container3dAbout').style.opacity = 0;
            document.querySelector('.tooltips').style.zIndex = 4;
            document.querySelector('.about-p1').style.opacity = 1;
            document.querySelector('.about-p1').style.zIndex = 2;
            document.querySelector('.game').style.opacity = 1;
            referenceObject.forAbout.gameOut = true;
            if (referenceObject.data.wolf && referenceObject.data.wolf.model.position.x === 2) {
              referenceObject.data.wolf.model.userData.gameScene.add(referenceObject.data.wolf.model);
              referenceObject.data.wolf.model.scale.set(5, 5, 5);
              referenceObject.data.wolf.model.position.copy(referenceObject.data.wolf.model.userData.startGamePosition);
              referenceObject.data.wolf.model.updateMatrix();
              referenceObject.data.wolf.model.updateMatrixWorld();
            }
            new choiceWindow();
          }, {once: true});
        }
        this._data.currentScene = this._data.scenes.me;
        document.body.style.height = '100%';
        break;
    }

    const BURGER_MENU = document.querySelector('.transition-menu');

    BURGER_MENU.classList.toggle('_active');
    document.querySelector('.list-chapters-about').classList.toggle('_lock');

    const pastPosition = new THREE.Vector3().copy(this._data.currentScene.position);

    this._arrayPositions = [];

    if (this._data.currentScene.name == 'IAmDuringWork' && !this._data.scenes.IAmDuringWork.mixer) {

      this.Skills = new Skills();

      this._data.scenes.IAmDuringWork.mixer = this._dataAttributes.IAmDuringWork.mixer;
      this._data.scenes.IAmDuringWork.animations = this._dataAttributes.IAmDuringWork.animations;
    }

    if (this._data.currentScene.name == 'wolf' && referenceObject.data.wolf.model && !this._data.scenes.wolf.model) {

      this._data.scenes.wolf.mixer = referenceObject.data.wolf.model.userData.editorMixer;
      this._data.scenes.wolf.animations = referenceObject.data.wolf.animations;

      this._data.scenes.wolf.model = referenceObject.data.wolf.model;

      this.gameReward = new gameReward({
        currentScene: this._data.currentScene,
        timeInSeconds: this.timeInSeconds,
        wolf: this._data.scenes.wolf.model
      });                                       
    }

    // if (this._data.currentScene.name === 'wolf' && !this._dataAttributes.wolf.model) {
    //   positionAttribute = this._data.currentScene.attributes.position;
    // } else {
    //   positionAttribute = this._data.currentScene.attributes.position;
    // }

    let positionAttribute = this._data.currentScene.attributes;

    if (positionAttribute && this._data.currentScene.name !== 'wolf') {

      positionAttribute = positionAttribute.position;

      if (this._data.currentScene.name === 'IAmDuringWork') {
        for (let i = 0; i < positionAttribute.count; i++) {

          this._arrayPositions.push(new THREE.Vector3(positionAttribute.getX(i), positionAttribute.getY(i), positionAttribute.getZ(i)).add(this._data.currentScene.position));
        }
      } else {
        for (let i = 0; i < positionAttribute.count; i++) {

          this._arrayPositions.push(new THREE.Vector3(positionAttribute.getX(i), positionAttribute.getY(i), positionAttribute.getZ(i)).add(this._data.currentScene.position));
        }
      }
    }


    referenceObject.forAbout.cameraLookat.copy(this._data.currentScene.position);
    this._cameraLookat.copy(referenceObject.forAbout.cameraLookat);
    this._transitionParticlesTime = 0;

    const position = [],
          colour = [],
          size = [];

    for (let i = 0; i < this._particles.length; i++) {
      if (this._arrayPositions[i] === undefined) {
        continue;
      }

      this._particles[i].position.copy(this._arrayPositions[i]);

      position.push(this._particles[i].position.x, this._particles[i].position.y, this._particles[i].position.z);

      colour.push(1, 1, 1, this._particles[i].alpha);

      size[i] = 0.015;
    }

    this._points.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
    this._points.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( size, 1 ) );
    this._points.geometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( colour, 4 ) );

    this._points.geometry.attributes.position.needsUpdate = true;
    this._points.geometry.attributes.size.needsUpdate = true;
    this._points.geometry.attributes.colour.needsUpdate = true;
  }


  _eventTouchStart() {
    this.touchMoves = false;
  }

  _eventTouchMove() {
    this.touchMoves = true;
  }

  _eventTouchEnd(event) {
    if (this.touchMoves) {
      return;
    }

    this._transitionBetweenChapters();
  }

  _eventClick(event) {

    this._transitionBetweenChapters();
  }


  _chapterListEvent() {

    const _transitionBetweenChapters = this._transitionBetweenChapters;

    this.touchMoves = false;

    if (referenceObject.isMobile) {
      document.querySelector('.list-chapters-about').addEventListener('touchstart', () => {
        this._eventTouchStart();
      });
      document.querySelector('.list-chapters-about').addEventListener('touchmove', () => {
        this._eventTouchMove();
      });
      document.querySelector('.list-chapters-about').addEventListener('touchend', (event) => {
        this._eventTouchEnd(event);
      });
    } else {
      document.querySelector('.list-chapters-about').addEventListener('click', (event) => {
        this._eventClick(event);
      });
    }
  }


  _burgerMenUEvent() {
    const BURGER_MENU = document.querySelector('.transition-menu');

    this.touchMoves = false;

    function _eventTouchStart(event) {
      this.touchMoves = false;
    }

    function _eventTouchMove(event) {
      this.touchMoves = true;
    }

    function _eventTouchEnd(event) {
      if (this.touchMoves) {
        return;
      }

      if (document.querySelector('.chapter-editor').children[1].classList.contains('icon-lock') && referenceObject.data.wolf) {
        document.querySelector('.chapter-editor').children[1].classList.remove('icon-lock');
      }

      BURGER_MENU.classList.toggle('_active');
      document.querySelector('.list-chapters-about').classList.toggle('_lock');
    }

    function _eventClick(event) {

      if (document.querySelector('.chapter-editor').children[1].classList.contains('icon-lock') && referenceObject.data.wolf) {
        document.querySelector('.chapter-editor').children[1].classList.remove('icon-lock');
      }

      BURGER_MENU.classList.toggle('_active');
      document.querySelector('.list-chapters-about').classList.toggle('_lock');                  
    }

    if (referenceObject.isMobile) {
      BURGER_MENU.addEventListener('touchstart', _eventTouchStart);
      BURGER_MENU.addEventListener('touchmove', _eventTouchMove);
      BURGER_MENU.addEventListener('touchend', _eventTouchEnd);
    } else {
      BURGER_MENU.addEventListener('click', _eventClick);
    }
  }


  objectsLoad() {
    for (const variable in this._this.models.technologies.list) {
      this._scene.add(this._this.models.technologies.list[variable]);
      this._this.models.technologies.list[variable].visible = false;
    }

    this._data.scenes.IAmDuringWork.model = this._dataAttributes.IAmDuringWork.model;
    this._scene.add(this._data.scenes.IAmDuringWork.model);
    this._data.scenes.IAmDuringWork.model.position.add(this._data.scenes.IAmDuringWork.position);

    this._data.scenes.IAmDuringWork.model.traverse(function(object) {
      let mesh = object;

      if( mesh.isMesh) {

        mesh.material.visible = false;     

        let points = new THREE.Points(
          mesh.geometry,
          new THREE.ShaderMaterial({
            vertexShader: _IAmDuringWorkVS,
            fragmentShader: _IAmDuringWorkFS,
            blending: THREE.NormalBlending,
            depthTest: true,
            depthWrite: false,
            transparent: true,
            vertexColors: true
          })
        );
        // just pretend to be a skinned mesh
        points.isSkinnedMesh = true;
        points.bindMatrix = mesh.bindMatrix;
        points.bindMatrixInverse = mesh.bindMatrixInverse;
        points.skeleton = mesh.skeleton;
        points.frustumCulled = false;

        points.material.onBeforeCompile = function(hack) {

          hack.uniforms.map = { value: referenceObject.data.snowfleak };
          hack.uniforms.colour = { value: new THREE.Vector4(0.6, 0.26, 0.92, 0.0) };
          hack.uniforms.size = { value: 5.0 };           

          points.userData.shader = hack;
        };
        mesh.add(points);
      }
    })
  }


  _initLight() {

    this._spotLightDynamic = new THREE.SpotLight( 0xffffff, 1 );
    this._spotLightDynamic.castShadow = false;

    if (window.innerWidth <= 600) {
      this._spotLightDynamic.position.set(-1, 3, 4);
      this._spotLightDynamic.target.position.set(-1, -2, 4);
    } else {
      this._spotLightDynamic.position.set(0, 0, 0);
    }

    this._spotLightDynamic.angle = 0.075;
    this._spotLightDynamic.penumbra = 1;
    this._spotLightDynamic.decay = 2;
    this._spotLightDynamic.distance = 15;

    this._spotLightDynamic.userData.intensity = 1;
    this._spotLightDynamic.userData.decay = true;
    this._spotLightDynamic.userData.index = 0;

    this._spotLightDynamic.target.updateMatrixWorld();

    this._scene.add(this._spotLightDynamic.target);
    this._scene.add(this._spotLightDynamic);

  }


  _initLightWidescreenUpdate(timeInSeconds) {
    if (this._spotLightDynamic.userData.index === 10) {
      this._spotLightDynamic.userData.index = 0;
    } 


    if (this._spotLightDynamic.userData.decay) {
      this._spotLightDynamic.intensity -= timeInSeconds * 2;
      if (this._spotLightDynamic.intensity < 0) {

        this._spotLightDynamic.userData.decay = false;

        this._spotLightDynamic.intensity = 0;

        let index = 0;

        for (const variable in this._this.models.technologies.list) {
          this._this.models.technologies.list[variable].visible = false;
          if (index === this._spotLightDynamic.userData.index) {

            this._this.models.technologies.list[variable].visible = true;

            this._spotLightDynamic.position.copy(this._this.models.technologies.list[variable].position);
            this._spotLightDynamic.position.y += 5;

            this._spotLightDynamic.target.position.copy(this._this.models.technologies.list[variable].position);

          }
          index += 1;
        }

        this._spotLightDynamic.userData.index += 1;
      }
    } else if (!this._spotLightDynamic.userData.decay && this._data.currentScene.name === 'IAmDuringWork') {
      this._spotLightDynamic.intensity += timeInSeconds * 2;
      if (this._spotLightDynamic.intensity > 2) {

        this._spotLightDynamic.userData.decay = true;

        this._spotLightDynamic.intensity = 2;
      }
    }
  }

  _initLightNarrowScreenUpdate(timeInSeconds) {
    if (this._spotLightDynamic.userData.index === 10) {
      this._spotLightDynamic.userData.index = 0;
    } 


    if (this._spotLightDynamic.userData.decay) {
      this._spotLightDynamic.intensity -= timeInSeconds * 2;
      if (this._spotLightDynamic.intensity < 0) {

        this._spotLightDynamic.userData.decay = false;

        this._spotLightDynamic.intensity = 0;

        let index = 0;

        for (const variable in this._this.models.technologies.list) {
          if (index === this._spotLightDynamic.userData.index) {

            this._this.models.technologies.ex = this._this.models.technologies.current;
            this._this.models.technologies.current = this._this.models.technologies.list[variable];

            this._this.models.technologies.ex.visible = false;
            this._this.models.technologies.list[variable].visible = true;
          }
          index += 1;
        }

        this._spotLightDynamic.userData.index += 1;
      }
    } else if (!this._spotLightDynamic.userData.decay && this._data.currentScene.name === 'IAmDuringWork') {
      this._spotLightDynamic.intensity += timeInSeconds * 2;
      if (this._spotLightDynamic.intensity > 2) {

        this._spotLightDynamic.userData.decay = true;

        this._spotLightDynamic.intensity = 2;
      }
    }
  }


  _Camera(timeInSeconds) {

    switch(this._data.currentScene.name) {
      case 'wolf':

        this._currentLookat.lerp(this._cameraLookat, timeInSeconds * 2);
        this._camera.lookAt(this._currentLookat);

        break;
      case 'me':

        if (this._camera.userData.right) {
          this._camera.userData.extraTurn += timeInSeconds * 0.08;

          if (this._camera.userData.extraTurn > 0.25) {

            this._camera.userData.extraTurn = 0.25;

            this._camera.userData.right = false;
            this._camera.userData.left = true;
          }

        } else {
          this._camera.userData.extraTurn -= timeInSeconds * 0.08;

          if (this._camera.userData.extraTurn < -0.25) {

            this._camera.userData.extraTurn = -0.25;

            this._camera.userData.right = true;
            this._camera.userData.left = false;
          }

        }

        this._currentLookat.lerp(new THREE.Vector3().copy(this._cameraLookat).add(new THREE.Vector3(this._camera.userData.extraTurn, 0, 0)), timeInSeconds * 2);
        this._camera.lookAt(this._currentLookat);

        break;
      case 'IAmDuringWork':

        this._currentLookat.lerp(this._cameraLookat, timeInSeconds * 2);
        this._camera.lookAt(this._currentLookat);

        break;
    }
  }


  _updatingNumberOfParticlesOnStart(particleCount) {
    if (((particleCount - this._particles.length) != 0) && !referenceObject.forAbout.modelsLoaded) {
      for (; this._currentParticleCount < particleCount; this._currentParticleCount++) {
        this._particles.push({
          position: this._arrayScatteredPositions[this._currentParticleCount],
          alpha: Number((Math.random() * (-1 - -0.25) + -0.25).toFixed(1))
        });
      }

      if (this._particles.length === this._arrayPositions.length) {
        setTimeout(() => {
          referenceObject.forAbout.modelsLoaded = true;
        }, 5000);
      }
    }
  }


  _updatingNumberOfParticlesAfterStart(timeInSeconds) {
    if (((this._arrayPositions.length - this._currentParticleCount) !== 0) && referenceObject.forAbout.modelsLoaded) {
      if (Math.sign(this._arrayPositions.length - this._currentParticleCount) === 1) {
        const position = [],
              colour = [],
              size = [];
        for (let i = 0; i < this._particles.length; i++) {
          position.push(this._particles[i].position.x, this._particles[i].position.y, this._particles[i].position.z);
          colour.push(1, 1, 1, 1);
          size.push(0.015);
        }
        for (; this._currentParticleCount < this._arrayPositions.length; this._currentParticleCount++) {
          this._particles.push({
            position: new THREE.Vector3(
              this._arrayPositions[this._currentParticleCount].x,
              this._arrayPositions[this._currentParticleCount].y,
              this._arrayPositions[this._currentParticleCount].z
            ),
            alpha: 1
          });
          position.push(this._arrayPositions[this._currentParticleCount].x, this._arrayPositions[this._currentParticleCount].y, this._arrayPositions[this._currentParticleCount].z);
          colour.push(1, 1, 1, 1);
          size.push(0.015);
        }
        this._points.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
        this._points.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( size, 1 ) );
        this._points.geometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( colour, 4 ) );

        this._points.geometry.attributes.position.needsUpdate = true;
        this._points.geometry.attributes.size.needsUpdate = true;
        this._points.geometry.attributes.colour.needsUpdate = true;

      } else {
        const position = [],
              colour = [],
              size = [];
        for (let i = this._particles.length - 1; i > 0; i--) {
          if (!this._arrayPositions[i]) {
            if (this._particles[i].alpha > 0) {
              this._particles[i].alpha -= timeInSeconds * 4;
              if (this._particles[i].alpha < 0) {
                this._particles.pop();
                this._currentParticleCount--;
              }
            }
          }
        }
        for (let i = 0; i < this._particles.length; i++) {
          position.push(this._particles[i].position.x, this._particles[i].position.y, this._particles[i].position.z);
          colour.push(1, 1, 1, 1);
          size.push(0.015);
        }
        this._points.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
        this._points.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( size, 1 ) );
        this._points.geometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( colour, 4 ) );

        this._points.geometry.attributes.position.needsUpdate = true;
        this._points.geometry.attributes.size.needsUpdate = true;
        this._points.geometry.attributes.colour.needsUpdate = true;
      }
    }
  }


  _wolfAnimUpdate(timeInSeconds) {

    if (!this._data.scenes.wolf.model) {
      return;
    }
    if (this._data.currentScene.name === 'wolf' && referenceObject.data.wolf.model.userData.editorMixer) {
      referenceObject.data.wolf.model.userData.editorMixer.update(timeInSeconds);
    }   
  }


  _iAmDuringWorkShaderUpdate(timeInSeconds) {

    if (!this._data.scenes.IAmDuringWork.model) {
      return;
    }
    
    let shaderColour = this._data.scenes.IAmDuringWork.model.children[1].children[0].userData.shader.uniforms.colour.value;

    if (this._data.currentScene.name == 'IAmDuringWork') {
      this._data.currentScene.mixer.update(timeInSeconds);

      if (shaderColour.w < 1) {
        shaderColour.w += timeInSeconds * 0.5;
        if (shaderColour.w > 1) {
          shaderColour.w = 1;
        }
      }
    } else {

      if (shaderColour.w > 0) {
        shaderColour.w -= timeInSeconds * 4;
        if (shaderColour.w < 0) {
          shaderColour.w = 0;
        }
      }
    }
  }


	Update(timeInSeconds, particleCount) {
    if (!this.timeInSeconds) {
      this.timeInSeconds = timeInSeconds;
    }

    if (this._transitionParticlesTime < 2) {
      this._transitionParticlesTime += timeInSeconds;
      if (this._transitionParticlesTime >= 2) {
        this._transitionParticlesTime = 2;
      }
    }

    this._updatingNumberOfParticlesOnStart(particleCount);

    this._updatingNumberOfParticlesAfterStart(timeInSeconds);

    this._iAmDuringWorkShaderUpdate(timeInSeconds);

    this._wolfAnimUpdate(timeInSeconds);

    if (!referenceObject.forAbout.modelsLoaded) {
      const position = [],
            colour = [],
            size = [];

      if (this._transitionParticlesTime !== 2) {
        for (let i = 0; i < this._particles.length; i++) {
          if (this._arrayPositions[i] === undefined) {
            continue;
          }

          if (this._particles[i].alpha < 1) {
            this._particles[i].alpha += timeInSeconds;
            if (this._particles[i].alpha > 1) {
              this._particles[i].alpha = 1;
            }
          }

          if (this._particles[i].alpha > 0 && this._arrayPositions[i]) {
            this._particles[i].position.copy(this._particles[i].position.lerp(this._arrayPositions[i], Math.random() * (timeInSeconds * 6 - timeInSeconds) + timeInSeconds));
          }

          position.push(this._particles[i].position.x, this._particles[i].position.y, this._particles[i].position.z);

          colour.push(1, 1, 1, this._particles[i].alpha);

          size[i] = 0.015;
        }

        this._points.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
        this._points.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( size, 1 ) );
        this._points.geometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( colour, 4 ) );

        this._points.geometry.attributes.position.needsUpdate = true;
        this._points.geometry.attributes.size.needsUpdate = true;
        this._points.geometry.attributes.colour.needsUpdate = true;
      }
    }

    if (referenceObject.forAbout.countModelsLoad != 100) {
      return;
    }

    this._Camera(timeInSeconds);

    if (this.gameReward) {
      this.gameReward.Update(timeInSeconds);
    }

    if (this.Skills) {
      if (this.Skills._drawingGraphicLogo) {
        this.Skills.graphicLogoUpdate(timeInSeconds);
      }
      if (this.Skills._drawingModelingLogo) {
        this.Skills.modelingLogoUpdate(timeInSeconds);
      }
    }

    if (this._spotLightDynamic) {

      if (this._wideScreen) {
        this._initLightWidescreenUpdate(timeInSeconds);
      } else {
        this._initLightNarrowScreenUpdate(timeInSeconds);
      }
    }
	}
}