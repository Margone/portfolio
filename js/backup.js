// import * as THREE from './libs/three.module.js';
// import {referenceObject, choiceWindow} from './index.js';
// import Skills from './skills.js';
// import gameReward from './gameReward.js';


// const _transitionParticlesVS = `
// uniform float pointMultiplier;

// attribute float size;
// attribute vec4 colour;

// varying vec4 vColour;

// void main() {
//   vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

//   gl_Position = projectionMatrix * mvPosition;
//   gl_PointSize = size * pointMultiplier / gl_Position.w;

//   vColour = colour;
// }`;

// const _transitionParticlesFS = `
// uniform sampler2D diffuseTexture;

// varying vec4 vColour;

// void main() {
//   gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColour;
// }`;

// const _IAmDuringWorkVS = `
// #include <skinning_pars_vertex>
// #include <uv_pars_vertex>
// varying vec4 vColour;
// uniform vec4 colour;
// uniform float size;
// uniform float scale;
// #include <common>
// #include <color_pars_vertex>
// #include <fog_pars_vertex>
// #include <morphtarget_pars_vertex>
// #include <logdepthbuf_pars_vertex>
// #include <clipping_planes_pars_vertex>
// void main() {
//   #include <uv_vertex>
//   vColour = colour;
//   #include <color_vertex>
//   #include <begin_vertex>
//   #include <skinbase_vertex>
//   #include <morphtarget_vertex>
//   #include <skinning_vertex>
//   #include <project_vertex>
//   gl_PointSize = size;
//   #ifdef USE_SIZEATTENUATION
//     bool isPerspective = isPerspectiveMatrix( projectionMatrix );
//     if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
//   #endif
//   #include <logdepthbuf_vertex>
//   #include <clipping_planes_vertex>
//   #include <worldpos_vertex>
//   #include <fog_vertex>
// }`;

// const _IAmDuringWorkFS = `
// #include <uv_pars_fragment>
// uniform sampler2D map;
// uniform vec4 colour;
// varying vec4 vColour;
// uniform vec3 diffuse;
// uniform float opacity;
// #include <common>
// #include <color_pars_fragment>
// #include <map_particle_pars_fragment>
// #include <fog_pars_fragment>
// #include <logdepthbuf_pars_fragment>
// #include <clipping_planes_pars_fragment>
// void main() {
//   #include <clipping_planes_fragment>
//   vec4 outgoingLight = vec4( 0.0 );
//   #ifdef USE_UV
//     vec4 diffuseColor = texture2D( map, vUv ) * vColour;
//   #else 
//     vec4 diffuseColor = texture2D( map, gl_PointCoord ) * vColour;
//   #endif
//   #include <logdepthbuf_fragment>
//   #include <map_particle_fragment>
//   #include <color_fragment>
//   #include <alphatest_fragment>
//   outgoingLight = diffuseColor.rgba;
//   gl_FragColor = vec4( outgoingLight.r, outgoingLight.g, outgoingLight.b, diffuseColor.a );
//   #include <tonemapping_fragment>
//   #include <encodings_fragment>
//   #include <fog_fragment>
//   #include <premultiplied_alpha_fragment>
// }`;

// export default class aboutTransitionSystem {
// 	constructor(params) {
// 		this._camera = params.camera;

//     this._camera.userData.right = false;
//     this._camera.userData.left = true;
//     this._camera.userData.extraTurn = 0;

// 		this._scene = params.scene;
// 		this._dataAttributes = params.dataAttributes;
//     this._this = params.this;

// 		this._Init();
// 	}

// 	_Init() {

//     this._initLight();

//     const wolfSpotlightOne = new THREE.SpotLight( 0xffffff, 3 );

//     wolfSpotlightOne.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightOne.position.y = 1;        

//     wolfSpotlightOne.target.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightOne.target.updateMatrixWorld();

//     wolfSpotlightOne.angle = 1;
//     wolfSpotlightOne.penumbra = 0;
//     wolfSpotlightOne.decay = 1;
//     wolfSpotlightOne.distance = 2;

//     this._scene.add(wolfSpotlightOne.target);
//     this._scene.add(wolfSpotlightOne);

//     const wolfSpotlightTwo = new THREE.SpotLight( 0xffffff, 1 );

//     wolfSpotlightTwo.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightTwo.position.x += 1;        

//     wolfSpotlightTwo.target.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightTwo.target.updateMatrixWorld();

//     wolfSpotlightTwo.angle = 1;
//     wolfSpotlightTwo.penumbra = 0;
//     wolfSpotlightTwo.decay = 1;
//     wolfSpotlightTwo.distance = 2;

//     this._scene.add(wolfSpotlightTwo.target);
//     this._scene.add(wolfSpotlightTwo);

//     const wolfSpotlightThree = new THREE.SpotLight( 0xffffff, 1 );

//     wolfSpotlightThree.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightThree.position.x -= 1;        

//     wolfSpotlightThree.target.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightThree.target.updateMatrixWorld();

//     wolfSpotlightThree.angle = 1;
//     wolfSpotlightThree.penumbra = 0;
//     wolfSpotlightThree.decay = 1;
//     wolfSpotlightThree.distance = 2;

//     this._scene.add(wolfSpotlightThree.target);
//     this._scene.add(wolfSpotlightThree);

//     const wolfSpotlightFour = new THREE.SpotLight( 0xffffff, 1 );

//     wolfSpotlightFour.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightFour.position.y = -1;        

//     wolfSpotlightFour.target.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightFour.target.updateMatrixWorld();

//     wolfSpotlightFour.angle = 1;
//     wolfSpotlightFour.penumbra = 0;
//     wolfSpotlightFour.decay = 1;
//     wolfSpotlightFour.distance = 2;

//     this._scene.add(wolfSpotlightFour.target);
//     this._scene.add(wolfSpotlightFour);

//     const wolfSpotlightFive = new THREE.SpotLight( 0xffffff, 1 );

//     wolfSpotlightFive.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightFive.position.z += 1;        

//     wolfSpotlightFive.target.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightFive.target.updateMatrixWorld();

//     wolfSpotlightFive.angle = 1;
//     wolfSpotlightFive.penumbra = 0;
//     wolfSpotlightFive.decay = 1;
//     wolfSpotlightFive.distance = 2;

//     this._scene.add(wolfSpotlightFive.target);
//     this._scene.add(wolfSpotlightFive);

//     const wolfSpotlightSix = new THREE.SpotLight( 0xffffff, 1 );

//     wolfSpotlightSix.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightSix.position.z -= 1;        

//     wolfSpotlightSix.target.position.copy(new THREE.Vector3(2, 0, 3.65));
//     wolfSpotlightSix.target.updateMatrixWorld();

//     wolfSpotlightSix.angle = 1;
//     wolfSpotlightSix.penumbra = 0;
//     wolfSpotlightSix.decay = 1;
//     wolfSpotlightSix.distance = 2;

//     this._scene.add(wolfSpotlightSix.target);
//     this._scene.add(wolfSpotlightSix); 


//     const uniforms = {
//       diffuseTexture: {
//           value: referenceObject.data.snowfleak
//       },
//       pointMultiplier: {
//           value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
//       }
//     };
//     let pGeometry = new THREE.BufferGeometry(),
//         pMaterial = new THREE.ShaderMaterial({
//           uniforms: uniforms,
//           vertexShader: _transitionParticlesVS,
//           fragmentShader: _transitionParticlesFS,
//           blending: THREE.NormalBlending,
//           depthTest: true,
//           depthWrite: false,
//           transparent: true,
//           vertexColors: true
//         });

//     this._arrayScatteredPositions = [];
//     this._arrayPositions = [];

//     const mePositionAttribute = this._dataAttributes.me.position; 

//     for (let i = 0; i < mePositionAttribute.count; i++) {

//       this._arrayPositions.push(new THREE.Vector3(mePositionAttribute.getX(i), mePositionAttribute.getY(i), mePositionAttribute.getZ(i)));

//       const scatterPositionX = mePositionAttribute.getX(i) + Number((Math.random() * (5 - -5) + -5).toFixed(1));
//       const scatterPositionY = mePositionAttribute.getY(i) + Number((Math.random() * (5 - -5) + -5).toFixed(1));
//       const scatterPositionZ = mePositionAttribute.getZ(i) + Number((Math.random() * (5 - -5) + -5).toFixed(1));

//       this._arrayScatteredPositions.push(new THREE.Vector3( scatterPositionX, scatterPositionY, scatterPositionZ ));
//     }


//     pGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );
//     pGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( [], 1 ) );
//     pGeometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( [], 3 ) );

//     this._staticParticlesPosition = [];
//     this._staticParticlesColour = [];
//     this._staticParticlesSize = [];

//     this._points = new THREE.Points(pGeometry, pMaterial);
//     this._points.frustumCulled = false;

//     this._scene.add(this._points);  

//     referenceObject.forAbout.cameraLookat.copy(this._points.position);
//     this._cameraLookat = new THREE.Vector3().copy(this._points.position);
//     this._currentLookat = new THREE.Vector3().copy(this._cameraLookat);

//     this._points.geometry.attributes.position.needsUpdate = true;
//     this._points.geometry.attributes.size.needsUpdate = true;
//     this._points.geometry.attributes.colour.needsUpdate = true;

//     this._data = {
//       scenes: {
//         me: {
//           position: new THREE.Vector3().copy(this._points.position),
//           attributes: this._dataAttributes.me,
//           name: 'me'
//         },
//         IAmDuringWork: {
//           position: new THREE.Vector3(-2, -2, 5),
//           attributes: this._dataAttributes.IAmDuringWork,
//           name: 'IAmDuringWork'
//         },
//         wolf: {
//           position: new THREE.Vector3(2, 0, 3.65),
//           name: 'wolf'
//         }
//       }
//     }

//     let planeMaterial = new THREE.MeshPhongMaterial( { color: '#0f0f0f' } );

//     let planeGeometry = new THREE.PlaneGeometry( 10, 10 );

//     let mesh = new THREE.Mesh( planeGeometry, planeMaterial );
//     mesh.position.set( -2, -2.4, 5 );
//     mesh.rotation.x = - Math.PI * 0.5;
//     this._scene.add( mesh );

//     this._data.currentScene = this._data.scenes.me;


//     this._particles = [];

//     this._currentParticleCount = 0;

//     if (window.innerWidth <= 600) {
//       this._wideScreen = false;
//     } else {
//       this._wideScreen = true;
//     }

//     const BURGER_MENU = document.querySelector('.transition-menu');

//     let clickOrTouch;

//     if (referenceObject.isMobile) {
//       clickOrTouch = 'touchend';
//     } else {
//       clickOrTouch = 'click';
//     }

//     BURGER_MENU.addEventListener(`${clickOrTouch}`, () => {

//       if (document.querySelector('.chapter-editor').children[1].classList.contains('icon-lock') && referenceObject.data.wolf) {
//         document.querySelector('.chapter-editor').children[1].classList.remove('icon-lock');
//       }

//       BURGER_MENU.classList.toggle('_active');
//       document.querySelector('.list-chapters-about').classList.toggle('_lock');
//     });

//     document.querySelector('.list-chapters-about').addEventListener(`${clickOrTouch}`, (event) => {

//       let target = event.target;

//       const WRAPPER = document.querySelector('.wrapper'),
//             WRAPPER_EDITOR = document.querySelector('.wrapper-editor'),
//             WRAPPER_ABOUT = document.querySelector('.wrapper-about'),
//             WRAPPER_SKILLS = document.querySelector('.wrapper-skills');

//       if (!target.classList.contains('list-chapters__chapter')) {
//         target = event.target.parentNode;
//       }

//       switch(target.classList[1]) {
//         case 'chapter-artist':
//           if (this._data.currentScene.name === 'me') {
//             return;
//           }
//           window.scrollTo(0, 0);
//           if (this._data.currentScene.name === 'IAmDuringWork') {
//             WRAPPER_SKILLS.style.opacity = 0;
//             WRAPPER_ABOUT.style.display = 'block';
//             WRAPPER_SKILLS.addEventListener('transitionend', () => {
//               WRAPPER_SKILLS.style.zIndex = -1;
//               WRAPPER_SKILLS.style.display = 'none';
//               WRAPPER.style.height = 'auto';
//               WRAPPER_ABOUT.style.zIndex = 3;
//               WRAPPER_ABOUT.style.opacity = 1;
//             }, {once: true});
//           }
//           if (this._data.currentScene.name === 'wolf') {
//             WRAPPER_EDITOR.style.height = '0';
//             WRAPPER_ABOUT.style.display = 'block';
//             WRAPPER_EDITOR.addEventListener('transitionend', () => {
//               WRAPPER_EDITOR.style.zIndex = '-1';
//               WRAPPER.style.height = 'auto';
//               WRAPPER_ABOUT.style.zIndex = 3;
//               WRAPPER_ABOUT.style.opacity = 1;
//             }, {once: true});
//           }
//           this._data.currentScene = this._data.scenes.me;
//           break;
//         case 'chapter-skills':
//           if (this._data.currentScene.name === 'IAmDuringWork') {
//             return;
//           }
//           if (this._data.currentScene.name === 'me') {
//             WRAPPER_ABOUT.style.opacity = '0';
//             WRAPPER_SKILLS.style.display = 'flex';
//             WRAPPER_ABOUT.addEventListener('transitionend', () => {
//               WRAPPER_ABOUT.style.zIndex = '-1';
//               WRAPPER_ABOUT.style.display = 'none';
//               if (this.Skills._rowStart.name === 'fake') {
//                 WRAPPER.style.height = '100%';
//               } else {
//                 WRAPPER.style.height = '100vh';
//               }
//               WRAPPER_SKILLS.style.zIndex = 3;
//               WRAPPER_SKILLS.style.opacity = 1;              
//             }, {once: true});
//           }
//           if (this._data.currentScene.name === 'wolf') {
//             WRAPPER_EDITOR.style.height = '0';
//             WRAPPER_SKILLS.style.display = 'flex';
//             WRAPPER_EDITOR.addEventListener('transitionend', () => {
//               WRAPPER_EDITOR.style.zIndex = '-1';
//               if (this.Skills._rowStart.name === 'fake') {
//                 WRAPPER.style.height = '100%';
//               } else {
//                 WRAPPER.style.height = '100vh';
//               }
//               WRAPPER_SKILLS.style.zIndex = 3;
//               WRAPPER_SKILLS.style.opacity = 1;
//             }, {once: true});
//           }          
//           this._data.currentScene = this._data.scenes.IAmDuringWork;
//           break;
//         case 'chapter-editor':
//           if (this._data.currentScene.name === 'wolf') {
//             return;
//           }
//           if (!referenceObject.data.wolf) {
//             const CLARIFICATION = document.querySelector('.icon-lock__clarification');
//             if (!CLARIFICATION.classList.contains('_active')) {
//               CLARIFICATION.classList.toggle('_active');
//               setTimeout(() => {
//                 CLARIFICATION.classList.toggle('_active');
//               }, 2500);
//             }
//             return;
//           }
//           if (this.gameReward) {
//             this.gameReward.checkTexture();
//           }
//           if (this._data.currentScene.name === 'IAmDuringWork') {
//             WRAPPER_SKILLS.style.opacity = 0;
//             WRAPPER_SKILLS.addEventListener('transitionend', () => {
//               WRAPPER_SKILLS.style.zIndex = -1;
//               WRAPPER_SKILLS.style.display = 'none';
//               WRAPPER.style.height = '100vh';
//               WRAPPER_EDITOR.style.zIndex = '3';
//               WRAPPER_EDITOR.style.height = '100%';
//             }, {once: true});
//           }
//           if (this._data.currentScene.name === 'me') {
//             WRAPPER_ABOUT.style.opacity = '0';
//             WRAPPER_ABOUT.addEventListener('transitionend', () => {
//               WRAPPER_ABOUT.style.zIndex = '-1';
//               WRAPPER_ABOUT.style.display = 'none';
//               WRAPPER.style.height = '100vh';
//               WRAPPER_EDITOR.style.zIndex = '3';
//               WRAPPER_EDITOR.style.height = '100%';
//             }, {once: true});           
//           }
//           this._data.currentScene = this._data.scenes.wolf;
//           if (referenceObject.data.wolf && referenceObject.data.wolf.model.userData.startGamePosition.x === -30.47327718198251) {
//             this._scene.add(referenceObject.data.wolf.model);
//             referenceObject.data.wolf.model.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
//             referenceObject.data.wolf.model.scale.set(1, 1, 1);
//             referenceObject.data.wolf.model.position.copy(this._data.currentScene.position);
//             referenceObject.data.wolf.model.updateMatrix();
//             referenceObject.data.wolf.model.updateMatrixWorld();
//           }
//           break;
//         case 'exit':
//           if (this._data.currentScene.name === 'me') {
//             document.querySelector('.about').style.zIndex = 4;
//             document.querySelector('.about-background').style.zIndex = 1;
//             document.querySelector('.about-background').style.opacity = 1;
//             document.querySelector('.about-background').addEventListener('transitionend', () => {
//               WRAPPER_ABOUT.style.opacity = '0';
//               WRAPPER_ABOUT.style.zIndex = '-1';
//               WRAPPER_ABOUT.style.display = 'none';
//               WRAPPER.style.height = '100vh';
//               document.querySelector('.container3dAbout').style.opacity = 0;
//               document.querySelector('.tooltips').style.zIndex = 4;
//               document.querySelector('.about-p1').style.opacity = 1;
//               document.querySelector('.about-p1').style.zIndex = 2;
//               document.querySelector('.game').style.opacity = 1;
//               referenceObject.forAbout.gameOut = true;
//               if (referenceObject.data.wolf && referenceObject.data.wolf.model.position.x === 2) {
//                 referenceObject.data.wolf.model.userData.gameScene.add(referenceObject.data.wolf.model);
//                 referenceObject.data.wolf.model.scale.set(5, 5, 5);
//                 referenceObject.data.wolf.model.position.copy(referenceObject.data.wolf.model.userData.startGamePosition);
//                 referenceObject.data.wolf.model.updateMatrix();
//                 referenceObject.data.wolf.model.updateMatrixWorld();
//               }
//               new choiceWindow();
//             }, {once: true});
//           }
//           if (this._data.currentScene.name === 'IAmDuringWork') {
//             document.querySelector('.about').style.zIndex = 4;
//             document.querySelector('.about-background').style.zIndex = 1;
//             document.querySelector('.about-background').style.opacity = 1;
//             document.querySelector('.about-background').addEventListener('transitionend', () => {
//               WRAPPER_SKILLS.style.opacity = 0;
//               WRAPPER_SKILLS.style.zIndex = -1;
//               WRAPPER_SKILLS.style.display = 'none';
//               WRAPPER.style.height = '100vh';
//               document.querySelector('.container3dAbout').style.opacity = 0;
//               document.querySelector('.tooltips').style.zIndex = 4;
//               document.querySelector('.about-p1').style.opacity = 1;
//               document.querySelector('.about-p1').style.zIndex = 2;
//               document.querySelector('.game').style.opacity = 1;
//               referenceObject.forAbout.gameOut = true;
//               if (referenceObject.data.wolf && referenceObject.data.wolf.model.position.x === 2) {
//                 referenceObject.data.wolf.model.userData.gameScene.add(referenceObject.data.wolf.model);
//                 referenceObject.data.wolf.model.scale.set(5, 5, 5);
//                 referenceObject.data.wolf.model.position.copy(referenceObject.data.wolf.model.userData.startGamePosition);
//                 referenceObject.data.wolf.model.updateMatrix();
//                 referenceObject.data.wolf.model.updateMatrixWorld();
//               }
//               new choiceWindow();
//             }, {once: true});
//           }
//           if (this._data.currentScene.name === 'wolf') {
//             document.querySelector('.about').style.zIndex = 4;
//             document.querySelector('.about-background').style.zIndex = 1;
//             document.querySelector('.about-background').style.opacity = 1;
//             document.querySelector('.about-background').addEventListener('transitionend', () => {
//               WRAPPER_EDITOR.style.height = '0';
//               WRAPPER_EDITOR.style.zIndex = '-1';
//               WRAPPER.style.height = '100vh';
//               document.querySelector('.container3dAbout').style.opacity = 0;
//               document.querySelector('.tooltips').style.zIndex = 4;
//               document.querySelector('.about-p1').style.opacity = 1;
//               document.querySelector('.about-p1').style.zIndex = 2;
//               document.querySelector('.game').style.opacity = 1;
//               referenceObject.forAbout.gameOut = true;
//               if (referenceObject.data.wolf && referenceObject.data.wolf.model.position.x === 2) {
//                 referenceObject.data.wolf.model.userData.gameScene.add(referenceObject.data.wolf.model);
//                 referenceObject.data.wolf.model.scale.set(5, 5, 5);
//                 referenceObject.data.wolf.model.position.copy(referenceObject.data.wolf.model.userData.startGamePosition);
//                 referenceObject.data.wolf.model.updateMatrix();
//                 referenceObject.data.wolf.model.updateMatrixWorld();
//               }
//               new choiceWindow();
//             }, {once: true});
//           }
//           this._data.currentScene = this._data.scenes.me;
//           document.body.style.height = '100%';
//           break;
//       }

//       BURGER_MENU.classList.toggle('_active');
//       document.querySelector('.list-chapters-about').classList.toggle('_lock');

//       const pastPosition = new THREE.Vector3().copy(this._data.currentScene.position);

//       this._arrayScatteredPositions = [];
//       this._arrayPositions = [];


//       if (this._data.currentScene.name == 'IAmDuringWork' && !this._data.scenes.IAmDuringWork.mixer) {

//         this.Skills = new Skills();

//         this._data.scenes.IAmDuringWork.mixer = this._dataAttributes.IAmDuringWork.mixer;
//         this._data.scenes.IAmDuringWork.animations = this._dataAttributes.IAmDuringWork.animations;
//       }

//       if (this._data.currentScene.name == 'wolf' && referenceObject.data.wolf.model && !this._data.scenes.wolf.model) {

//         this._data.scenes.wolf.mixer = referenceObject.data.wolf.model.userData.editorMixer;
//         this._data.scenes.wolf.animations = referenceObject.data.wolf.animations;

//         this._data.scenes.wolf.model = referenceObject.data.wolf.model;

//         this.gameReward = new gameReward({
//           currentScene: this._data.currentScene,
//           timeInSeconds: this.timeInSeconds,
//           wolf: this._data.scenes.wolf.model
//         });                                       
//       }

//       // if (this._data.currentScene.name === 'wolf' && !this._dataAttributes.wolf.model) {
//       //   positionAttribute = this._data.currentScene.attributes.position;
//       // } else {
//       //   positionAttribute = this._data.currentScene.attributes.position;
//       // }

//       let positionAttribute = this._data.currentScene.attributes;

//       if (positionAttribute && this._data.currentScene.name !== 'wolf') {

//         positionAttribute = positionAttribute.position;

//         for (let i = 0; i < positionAttribute.count; i++) {

//           const scatterPositionX = this._data.currentScene.position.x + Math.round((Math.random() * (1 - -1) + -1));
//           const scatterPositionY = this._data.currentScene.position.y + Math.round((Math.random() * (1 - -1) + -1));
//           const scatterPositionZ = this._data.currentScene.position.z + Math.round((Math.random() * (1 - -1) + -1));

//           this._arrayScatteredPositions.push(new THREE.Vector3(scatterPositionX, scatterPositionY, scatterPositionZ));

//           this._arrayPositions.push(new THREE.Vector3(positionAttribute.getX(i), positionAttribute.getY(i), positionAttribute.getZ(i)).add(this._data.currentScene.position));
//         }
//       }


//       referenceObject.forAbout.cameraLookat.copy(this._data.currentScene.position);
//       this._cameraLookat.copy(referenceObject.forAbout.cameraLookat);
//       this._transitionParticlesTime = 0;
//     });
// 	}


//   objectsLoad() {
//     for (const variable in this._this.models.technologies.list) {
//       this._scene.add(this._this.models.technologies.list[variable]);
//       this._this.models.technologies.list[variable].visible = false;
//     }

//     this._data.scenes.IAmDuringWork.model = this._dataAttributes.IAmDuringWork.model;
//     this._scene.add(this._data.scenes.IAmDuringWork.model);
//     this._data.scenes.IAmDuringWork.model.position.add(this._data.scenes.IAmDuringWork.position);

//     this._data.scenes.IAmDuringWork.model.traverse(function(object) {
//       let mesh = object;

//       if( mesh.isMesh) {

//         mesh.material.visible = false;     

//         let points = new THREE.Points(
//           mesh.geometry,
//           new THREE.ShaderMaterial({
//             vertexShader: _IAmDuringWorkVS,
//             fragmentShader: _IAmDuringWorkFS,
//             blending: THREE.NormalBlending,
//             depthTest: true,
//             depthWrite: false,
//             transparent: true,
//             vertexColors: true
//           })
//         );
//         // just pretend to be a skinned mesh
//         points.isSkinnedMesh = true;
//         points.bindMatrix = mesh.bindMatrix;
//         points.bindMatrixInverse = mesh.bindMatrixInverse;
//         points.skeleton = mesh.skeleton;
//         points.frustumCulled = false;

//         points.material.onBeforeCompile = function(hack) {

//           hack.uniforms.map = { value: referenceObject.data.snowfleak };
//           hack.uniforms.colour = { value: new THREE.Vector4(0.6, 0.26, 0.92, 0.0) };
//           hack.uniforms.size = { value: 5.0 };           

//           points.userData.shader = hack;
//         };
//         mesh.add(points);
//       }
//     })
//   }


//   _initLight() {

//     this._spotLightDynamic = new THREE.SpotLight( 0xffffff, 0 );

//     if (window.innerWidth <= 600) {
//       this._spotLightDynamic.position.set(-1, 3, 4);
//       this._spotLightDynamic.target.position.set(-1, -2, 4);
//     } else {
//       this._spotLightDynamic.position.set(0, 0, 0);
//     }

//     this._spotLightDynamic.shadow.mapSize.width = 1024;
//     this._spotLightDynamic.shadow.mapSize.height = 1024;
//     this._spotLightDynamic.shadow.camera.near = 10;
//     this._spotLightDynamic.shadow.camera.far = 100;
//     this._spotLightDynamic.shadow.focus = 1;

//     this._spotLightDynamic.angle = 0.075;
//     this._spotLightDynamic.penumbra = 1;
//     this._spotLightDynamic.decay = 2;
//     this._spotLightDynamic.distance = 15;

//     this._spotLightDynamic.userData.intensity = 0;
//     this._spotLightDynamic.userData.decay = false;
//     this._spotLightDynamic.userData.index = 0;

//     this._spotLightDynamic.target.updateMatrixWorld();

//     this._scene.add(this._spotLightDynamic.target);
//     this._scene.add(this._spotLightDynamic);

//   }


//   _initLightWidescreenUpdate(timeInSeconds) {
//     if (this._spotLightDynamic.userData.index === 10) {
//       this._spotLightDynamic.userData.index = 0;
//     } 


//     if (this._spotLightDynamic.userData.decay) {
//       this._spotLightDynamic.intensity -= timeInSeconds * 2;
//       if (this._spotLightDynamic.intensity < 0) {

//         this._spotLightDynamic.userData.decay = false;

//         this._spotLightDynamic.intensity = 0;

//         let index = 0;

//         for (const variable in this._this.models.technologies.list) {
//           this._this.models.technologies.list[variable].visible = false;
//           if (index === this._spotLightDynamic.userData.index) {

//             this._this.models.technologies.list[variable].visible = true;

//             this._spotLightDynamic.position.copy(this._this.models.technologies.list[variable].position);
//             this._spotLightDynamic.position.y += 5;

//             this._spotLightDynamic.target.position.copy(this._this.models.technologies.list[variable].position);

//           }
//           index += 1;
//         }

//         this._spotLightDynamic.userData.index += 1;
//       }
//     } else if (!this._spotLightDynamic.userData.decay && this._data.currentScene.name === 'IAmDuringWork') {
//       this._spotLightDynamic.intensity += timeInSeconds * 2;
//       if (this._spotLightDynamic.intensity > 2) {

//         this._spotLightDynamic.userData.decay = true;

//         this._spotLightDynamic.intensity = 2;
//       }
//     }
//   }

//   _initLightNarrowScreenUpdate(timeInSeconds) {
//     if (this._spotLightDynamic.userData.index === 10) {
//       this._spotLightDynamic.userData.index = 0;
//     } 


//     if (this._spotLightDynamic.userData.decay) {
//       this._spotLightDynamic.intensity -= timeInSeconds * 2;
//       if (this._spotLightDynamic.intensity < 0) {

//         this._spotLightDynamic.userData.decay = false;

//         this._spotLightDynamic.intensity = 0;

//         let index = 0;

//         for (const variable in this._this.models.technologies.list) {
//           if (index === this._spotLightDynamic.userData.index) {

//             this._this.models.technologies.ex = this._this.models.technologies.current;
//             this._this.models.technologies.current = this._this.models.technologies.list[variable];

//             this._this.models.technologies.ex.visible = false;
//             this._this.models.technologies.list[variable].visible = true;
//           }
//           index += 1;
//         }

//         this._spotLightDynamic.userData.index += 1;
//       }
//     } else if (!this._spotLightDynamic.userData.decay && this._data.currentScene.name === 'IAmDuringWork') {
//       this._spotLightDynamic.intensity += timeInSeconds * 2;
//       if (this._spotLightDynamic.intensity > 2) {

//         this._spotLightDynamic.userData.decay = true;

//         this._spotLightDynamic.intensity = 2;
//       }
//     }
//   }


//   _Camera(timeInSeconds) {

//     switch(this._data.currentScene.name) {
//       case 'wolf':

//         this._currentLookat.lerp(this._cameraLookat, timeInSeconds * 2);
//         this._camera.lookAt(this._currentLookat);

//         break;
//       case 'me':

//         if (this._camera.userData.right) {
//           this._camera.userData.extraTurn += timeInSeconds * 0.08;

//           if (this._camera.userData.extraTurn > 0.25) {

//             this._camera.userData.extraTurn = 0.25;

//             this._camera.userData.right = false;
//             this._camera.userData.left = true;
//           }

//         } else {
//           this._camera.userData.extraTurn -= timeInSeconds * 0.08;

//           if (this._camera.userData.extraTurn < -0.25) {

//             this._camera.userData.extraTurn = -0.25;

//             this._camera.userData.right = true;
//             this._camera.userData.left = false;
//           }

//         }

//         this._currentLookat.lerp(new THREE.Vector3().copy(this._cameraLookat).add(new THREE.Vector3(this._camera.userData.extraTurn, 0, 0)), timeInSeconds * 2);
//         this._camera.lookAt(this._currentLookat);

//         break;
//       case 'IAmDuringWork':

//         this._currentLookat.lerp(this._cameraLookat, timeInSeconds * 2);
//         this._camera.lookAt(this._currentLookat);

//         break;
//     }
//   }


//   _updatingNumberOfParticlesOnStart(particleCount) {
//     if (((particleCount - this._particles.length) != 0) && !referenceObject.forAbout.modelsLoaded) {
//       for (; this._currentParticleCount < particleCount; this._currentParticleCount++) {
//         this._particles.push({
//           position: this._arrayScatteredPositions[this._currentParticleCount],
//           alpha: Number((Math.random() * (-1 - -0.25) + -0.25).toFixed(1))
//         });
//       }

//       if (this._particles.length == this._arrayPositions.length) {
//         referenceObject.forAbout.modelsLoaded = true;
//       }
//     }
//   }


//   _updatingNumberOfParticlesAfterStart(timeInSeconds) {
//     if (((this._arrayPositions.length - this._currentParticleCount) != 0) && referenceObject.forAbout.modelsLoaded) {
//       if (Math.sign(this._arrayPositions.length - this._currentParticleCount) == 1) {
//         for (; this._currentParticleCount < this._arrayPositions.length; this._currentParticleCount++) {
//           this._particles.push({
//             position: new THREE.Vector3(
//               this._arrayScatteredPositions[this._currentParticleCount].x,
//               this._arrayScatteredPositions[this._currentParticleCount].y,
//               this._arrayScatteredPositions[this._currentParticleCount].z
//             ),
//             alpha: Number((Math.random() * (-0.25 - -0.05) + -0.05).toFixed(1))
//           });
//         }
//       } else {
//         for (let i = this._particles.length - 1; i > 0; i--) {
//           const particle = this._particles[i];

//           if (!this._arrayPositions[i]) {
//             if (particle.alpha > 0) {
//               particle.alpha -= timeInSeconds * 4;
//               particle.position.copy(particle.position.lerp(new THREE.Vector3().copy(this._data.currentScene.position).add(new THREE.Vector3(
//                 Math.random() * (0.25 - 0) + 0,
//                 Math.random() * (0.25 - 0) + 0,
//                 Math.random() * (0.25 - 0) + 0
//               )), Math.random() * (timeInSeconds * 6 - timeInSeconds) + timeInSeconds));
//               if (particle.alpha < 0) {
//                 this._particles.pop();
//                 this._currentParticleCount--;
//               }
//             }
//           }
//         }
//       }
//     }
//   }


//   _wolfAnimUpdate(timeInSeconds) {

//     if (!this._data.scenes.wolf.model) {
//       return;
//     }
//     if (this._data.currentScene.name === 'wolf' && referenceObject.data.wolf.model.userData.editorMixer) {
//       referenceObject.data.wolf.model.userData.editorMixer.update(timeInSeconds);
//     }   
//   }


//   _iAmDuringWorkShaderUpdate(timeInSeconds) {

//     if (!this._data.scenes.IAmDuringWork.model) {
//       return;
//     }
    
//     let shaderColour = this._data.scenes.IAmDuringWork.model.children[1].children[0].userData.shader.uniforms.colour.value;

//     if (this._data.currentScene.name == 'IAmDuringWork') {
//       this._data.currentScene.mixer.update(timeInSeconds);

//       if (shaderColour.w < 1) {
//         shaderColour.w += timeInSeconds * 0.5;
//         if (shaderColour.w > 1) {
//           shaderColour.w = 1;
//         }
//       }
//     } else {

//       if (shaderColour.w > 0) {
//         shaderColour.w -= timeInSeconds * 4;
//         if (shaderColour.w < 0) {
//           shaderColour.w = 0;
//         }
//       }
//     }
//   }


// 	Update(timeInSeconds, particleCount) {
//     if (!this.timeInSeconds) {
//       this.timeInSeconds = timeInSeconds;
//     }

//     if (this._transitionParticlesTime < 2) {
//       this._transitionParticlesTime += timeInSeconds;
//       if (this._transitionParticlesTime >= 2) {
//         this._transitionParticlesTime = 2;
//       }
//     }

//     this._updatingNumberOfParticlesOnStart(particleCount);

//     this._updatingNumberOfParticlesAfterStart(timeInSeconds);

//     this._iAmDuringWorkShaderUpdate(timeInSeconds);

//     this._wolfAnimUpdate(timeInSeconds);

//     const position = [],
//           colour = [],
//           size = [];

//     if (this._transitionParticlesTime !== 2) {
//       for (let i = 0; i < this._particles.length; i++) {
//         if (this._arrayPositions[i] === undefined) {
//           continue;
//         }

//         if (this._particles[i].alpha < 1) {
//           this._particles[i].alpha += timeInSeconds;
//           if (this._particles[i].alpha > 1) {
//             this._particles[i].alpha = 1;
//           }
//         }

//         if (this._particles[i].alpha > 0 && this._arrayPositions[i]) {
//           this._particles[i].position.copy(this._particles[i].position.lerp(this._arrayPositions[i], Math.random() * (timeInSeconds * 6 - timeInSeconds) + timeInSeconds));
//         }

//         position.push(this._particles[i].position.x, this._particles[i].position.y, this._particles[i].position.z);

//         colour.push(1, 1, 1, this._particles[i].alpha);

//         size[i] = 0.01;
//       }

//       this._points.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
//       this._points.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( size, 1 ) );
//       this._points.geometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( colour, 4 ) );

//       this._points.geometry.attributes.position.needsUpdate = true;
//       this._points.geometry.attributes.size.needsUpdate = true;
//       this._points.geometry.attributes.colour.needsUpdate = true;
//     }

//     if (referenceObject.forAbout.countModelsLoad != 100) {
//       return;
//     }

//     this._Camera(timeInSeconds);

//     if (this.gameReward) {
//       this.gameReward.Update(timeInSeconds);
//     }

//     if (this.Skills) {
//       if (this.Skills._drawingGraphicLogo) {
//         this.Skills.graphicLogoUpdate(timeInSeconds);
//       }
//       if (this.Skills._drawingModelingLogo) {
//         this.Skills.modelingLogoUpdate(timeInSeconds);
//       }
//     }

//     if (this._spotLightDynamic) {

//       if (this._wideScreen) {
//         this._initLightWidescreenUpdate(timeInSeconds);
//       } else {
//         this._initLightNarrowScreenUpdate(timeInSeconds);
//       }
//     }
// 	}
// }