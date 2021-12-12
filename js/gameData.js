import * as THREE from './libs/three.module.js';
import {GLTFLoader} from './libs/GLTFLoader.js';
import {DRACOLoader} from './libs/DRACOLoader.js';
import {SkeletonUtils} from './libs/SkeletonUtils.js';
import {referenceObject} from './index.js';


export default class Models {
  constructor() {
  }


  Init() {
    

    this.models = {
      landscape: {},
      paw: {},
      eagle: {},
      wolf: {},
      wolfClone: {},
      cubOne: {
        animations: []
      },
      cubTwo: {
        animations: []
      },
      cubThree: {
        animations: []
      },
      tree: {},
      fallTree: {},
      pines: [],
      bushes: [],
      pebbles: [],
      rocks: []
    };
    this.textures = {
      sky: {},
      normals: {},
      branches: {},
      cub: {},
      paw: {}
    };
    this.audio = {
      steps: {
        ice: [],
        snow: []
      },
      environments: {
        crackleIce: []
      },
      interactions: {
        snowCrumbling: [],
        bushRustling: []
      },
      whines: [],
      phenomenas: {}
    }


    this._dracoLoader = new DRACOLoader();
    this._dracoLoader.setDecoderPath('../js/libs/draco/');
    this._dracoLoader.setDecoderConfig({ type: 'js' });
    this._dracoLoader.preload();
    this._gltfLoader = new GLTFLoader();
    this._gltfLoader.setDRACOLoader(this._dracoLoader);


    let arrayPromises = [];


    arrayPromises.push(this._LoadModel('../models/dracoModels/landscapeDraco.glb').then(result => {
      this.models.landscape.model = result.scene;
      this.models.landscape.animations = result.scene.animations;
    }),
    this._LoadModel('../models/dracoModels/pawDraco.glb').then(result => {
      this.models.paw.model = result.scene.children[0];
      this.models.paw.animations = result.animations;
    }),
    this._LoadModel('../models/dracoModels/cubDraco.glb').then(result => {

      result.scene.children[0].userData.wasDragged = false;
      result.scene.children[0].userData.timeInterest = 2.1;

      this.models.cubOne.model = SkeletonUtils.clone(result.scene.children[0]);
      this.models.cubOne.model.children[this.models.cubOne.model.children.length - 1].material = result.scene.children[0].children[result.scene.children[0].children.length - 1].material.clone();
      this.models.cubOne.animations.push(
        result.animations[5],
        result.animations[1],
        result.animations[2],
        result.animations[0],
        result.animations[10]
      );

      this.models.cubTwo.model = SkeletonUtils.clone(result.scene.children[0]);
      this.models.cubTwo.model.children[this.models.cubTwo.model.children.length - 1].material = result.scene.children[0].children[result.scene.children[0].children.length - 1].material.clone();
      this.models.cubTwo.animations.push(
        result.animations[6],
        result.animations[3],
        result.animations[4],
        result.animations[0],
        result.animations[10]
      );

      this.models.cubThree.model = SkeletonUtils.clone(result.scene.children[0]);
      this.models.cubThree.model.children[this.models.cubThree.model.children.length - 1].material = result.scene.children[0].children[result.scene.children[0].children.length - 1].material.clone();
      this.models.cubThree.animations.push(
        result.animations[7],
        result.animations[8],
        result.animations[9],
        result.animations[0],
        result.animations[10]
      );
    }),
    this._LoadModel('../models/dracoModels/wolfDraco.glb').then(result => {
      this.models.wolf.model = result.scene.children[0];
      this.models.wolf.animations = result.animations;

      this.models.wolf.model.userData.startGamePosition = new THREE.Vector3();
    }),
    this._LoadModel('../models/dracoModels/rockOneDraco.glb').then(result => {
      this.models.rockOne = result.scene.children[0];
    }),
    this._LoadModel('../models/dracoModels/rockTwoDraco.glb').then(result => {
      this.models.rockTwo = result.scene.children[0];
    }),
    this._LoadModel('../models/dracoModels/rockThreeDraco.glb').then(result => {
      this.models.rockThree = result.scene.children[0];
    }),
    this._LoadModel('../models/dracoModels/rockFourDraco.glb').then(result => {
      this.models.rockFour = result.scene.children[0];
    }),
    this._LoadModel('../models/dracoModels/rockFiveDraco.glb').then(result => {
      this.models.rockFive = result.scene.children[0];
    }),
    this._LoadModel('../models/dracoModels/pebbleOneDraco.glb').then(result => {
      this.models.pebbleOne = result.scene;
    }),
    this._LoadModel('../models/dracoModels/pebbleTwoDraco.glb').then(result => {
      this.models.pebbleTwo = result.scene;
    }),
    this._LoadModel('../models/dracoModels/pebbleThreeDraco.glb').then(result => {
      this.models.pebbleThree = result.scene;
    }),
    this._LoadModel('../models/dracoModels/bushOneDraco.glb').then(result => {
      this.models.bushOne = result.scene;
    }),
    this._LoadModel('../models/dracoModels/bushTwoDraco.glb').then(result => {
      this.models.bushTwo = result.scene;
    }),
    this._LoadModel('../models/dracoModels/bushThreeDraco.glb').then(result => {
      this.models.bushThree = result.scene;
    }),
    this._LoadModel('../models/dracoModels/fallTreeDraco.glb').then(result => {
      this.models.fallTree.model = result.scene;
    }),
    this._LoadModel('../models/dracoModels/treeDraco.glb').then(result => {
      this.models.tree.model = result.scene;
    }));


    arrayPromises.push(
    this._LoadTexture('../pictures/footprint.png').then(result => {
      this.textures.footprint = result;
    }),
    this._LoadTexture('../pictures/pawTrailtest.png').then(result => {
      this.textures.pawTrail = result;
    }),
    this._LoadTexture('../pictures/branch.jpg').then(result => {
      result.flipY = false;
      this.textures.branches.full = result;
    }),
    this._LoadTexture('../pictures/cubTexOnetest.jpg').then(result => {
      result.flipY = false;
      result.encoding = 3001;
      result.wrapT = 1000;
      result.wrapS = 1000;
      this.textures.cub.cubOne = result;
    }),
    this._LoadTexture('../pictures/cubTexTwotest.jpg').then(result => {
      result.flipY = false;
      result.encoding = 3001;
      result.wrapT = 1000;
      result.wrapS = 1000;
      this.textures.cub.cubTwo = result;
    }),
    this._LoadTexture('../pictures/cubTexThreetest.jpg').then(result => {
      result.flipY = false;
      result.encoding = 3001;
      result.wrapT = 1000;
      result.wrapS = 1000;
      this.textures.cub.cubThree = result;
      referenceObject.data.cubThreeTexture = result;
    }),
    this._LoadTexture('../pictures/rockTextest.jpg').then(result => {
      result.flipY = false;
      this.textures.rock = result;
    }),
    this._LoadTexture('../pictures/pawNotCovered.jpg').then(result => {
      result.flipY = false;
      this.textures.paw.notCovered = result;
    }),
    this._LoadTexture('../pictures/pawCovered.jpg').then(result => {
      result.flipY = false;
      this.textures.paw.covered = result;
    }),
    this._LoadTexture('../pictures/trunk.jpg').then(result => {
      result.flipY = false;
      this.textures.trunk = result;
    }),
    this._LoadTexture('../pictures/branchSmallCover.jpg').then(result => {
      result.flipY = false;
      this.textures.branches.notFull = result;
    }));

    if (referenceObject.isMobile) {
      arrayPromises.push(
        new Promise(resolve => {
          const touchControls = new Image();

          touchControls.src = '../pictures/touchControls.png';

          touchControls.addEventListener('load', () => {
            document.querySelector('.game-controls-icon-mobile-movement').parentNode.replaceChild(touchControls, document.querySelector('.game-controls-icon-mobile-movement'));
            touchControls.classList.add('game-controls-icon-mobile-movement');
            resolve();
          });
        }),
        new Promise(resolve => {
          const rotateControls = new Image();

          rotateControls.src = '../pictures/rotateControls.png';

          rotateControls.addEventListener('load', () => {
            document.querySelector('.game-controls-icon-mobile-rotate').parentNode.replaceChild(rotateControls, document.querySelector('.game-controls-icon-mobile-rotate'));
            rotateControls.classList.add('game-controls-icon-mobile-rotate');
            resolve();
          });
        }),
        new Promise(resolve => {
          const howl = new Image();

          howl.src = '../icons/howl.svg';

          howl.addEventListener('load', () => {
            document.querySelector('.game-controls-icon-mobile-howl').parentNode.replaceChild(howl, document.querySelector('.game-controls-icon-mobile-howl'));
            howl.classList.add('game-controls-icon-mobile-howl');
            resolve();
          });
        })
      );
    } else {
      arrayPromises.push(
        new Promise(resolve => {
          const keysWASD = new Image();

          keysWASD.src = '../pictures/keysWASD.png';

          keysWASD.addEventListener('load', () => {
            document.querySelector('.game-controls-icon-pc-movement-and-rotate').parentNode.replaceChild(keysWASD, document.querySelector('.game-controls-icon-pc-movement-and-rotate'));
            keysWASD.classList.add('game-controls-icon-pc-movement-and-rotate');
            resolve();
          });
        }),
        new Promise(resolve => {
          const keysSHIFT = new Image();

          keysSHIFT.src = '../pictures/keysSHIFT.png';

          keysSHIFT.addEventListener('load', () => {
            document.querySelector('.game-controls-icon-pc-run').parentNode.replaceChild(keysSHIFT, document.querySelector('.game-controls-icon-pc-run'));
            keysSHIFT.classList.add('game-controls-icon-pc-run');
            resolve();
          });
        }),
        new Promise(resolve => {
          const keysH = new Image();

          keysH.src = '../pictures/keysH.png';

          keysH.addEventListener('load', () => {
            document.querySelector('.game-controls-icon-pc-howl').parentNode.replaceChild(keysH, document.querySelector('.game-controls-icon-pc-howl'));
            keysH.classList.add('game-controls-icon-pc-howl');
            resolve();
          });
        }),
        new Promise(resolve => {
          const keysP = new Image();

          keysP.src = '../pictures/keysP.png';

          keysP.addEventListener('load', () => {
            document.querySelector('.game-controls-icon-pc-pause').parentNode.replaceChild(keysP, document.querySelector('.game-controls-icon-pc-pause'));
            keysP.classList.add('game-controls-icon-pc-pause');
            resolve();
          });
        })
      );
    }


    arrayPromises.push(
      new Promise(resolve => {
        this.audio.paw = new Howl({
          src: '../sounds/paw.mp3'
        }).on('load', resolve);
      }),
      new Promise(resolve => {
        this.audio.fallTree = new Howl({
          src: '../sounds/fallTree.mp3'
        }).on('load', resolve);
      }),      
      new Promise(resolve => {
        this.audio.howl = new Howl({
          src: '../sounds/howl.mp3'
        }).on('load', resolve);
      }),      
      new Promise(resolve => {
        this.audio.phenomenas.ice = new Howl({
          src: '../sounds/somethingHitIce.mp3'
        }).on('load', resolve);
      }),
      new Promise(resolve => {
        this.audio.phenomenas.tree = new Howl({
          src: '../sounds/somethingRoaring.mp3'
        }).on('load', resolve);
      }),
      new Promise(resolve => {
        this.audio.interactions.bushRustling.push(new Howl({
          src: '../sounds/bushOne.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.interactions.bushRustling.push(new Howl({
          src: '../sounds/bushTwo.mp3'
        }).on('load', resolve));
      }),            
      new Promise(resolve => {
        this.audio.whines.push(new Howl({
          src: '../sounds/whinesOne.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.whines.push(new Howl({
          src: '../sounds/whinesTwo.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.whines.push(new Howl({
          src: '../sounds/whinesThree.mp3'
        }).on('load', resolve));
      }),                  
      new Promise(resolve => {
        this.audio.environments.crackleIce.push(new Howl({
          src: '../sounds/iceCrackleOne.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.environments.crackleIce.push(new Howl({
          src: '../sounds/iceCrackleTwo.mp3'
        }).on('load', resolve));
      }),            
      new Promise(resolve => {
        this.audio.interactions.snowCrumbling.push(new Howl({
          src: '../sounds/snowCrumblingOne.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.interactions.snowCrumbling.push(new Howl({
          src: '../sounds/snowCrumblingTwo.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.interactions.snowCrumbling.push(new Howl({
          src: '../sounds/snowCrumblingThree.mp3'
        }).on('load', resolve));
      }),            
      new Promise(resolve => {
        this.audio.steps.ice.push(new Howl({
          src: '../sounds/iceStepOne.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.steps.ice.push(new Howl({
          src: '../sounds/iceStepTwo.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.steps.ice.push(new Howl({
          src: '../sounds/iceStepThree.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.steps.ice.push(new Howl({
          src: '../sounds/iceStepFour.mp3'
        }).on('load', resolve));
      }),                
      new Promise(resolve => {
        this.audio.steps.snow.push(new Howl({
          src: '../sounds/snowStepOne.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.steps.snow.push(new Howl({
          src: '../sounds/snowStepTwo.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.steps.snow.push(new Howl({
          src: '../sounds/snowStepThree.mp3'
        }).on('load', resolve));
      }),
      new Promise(resolve => {
        this.audio.steps.snow.push(new Howl({
          src: '../sounds/snowStepFour.mp3'
        }).on('load', resolve));
      }),             
      new Promise(resolve => {
        this.audio.environments.wind = new Howl({
          src: '../sounds/wind.mp3'
        }).on('load', resolve);
      })
    );

    let progress = 0;

    arrayPromises.forEach(promise => promise.then(() => progress++));

    const progressInterval = setInterval(() => {
      referenceObject.forGame.countModelsLoad = progress / arrayPromises.length * 100;
      if ((progress / arrayPromises.length * 100) === 100) {
        clearInterval(progressInterval);
      }
    }, 100);
    
    Promise.all(arrayPromises).then(() => {

      this.textures.rock.encoding = 3001;
      this.textures.rock.wrapS = 1000;
      this.textures.rock.wrapT = 1000;


      this.textures.paw.covered.encoding = 3001;
      this.textures.paw.covered.wrapS = 1000;
      this.textures.paw.covered.wrapT = 1000;


      this.textures.trunk.encoding = 3001;
      this.textures.trunk.wrapS = 1000;
      this.textures.trunk.wrapT = 1000;


      this.models.cubOne.model.userData.atHome = false;
      this.models.cubOne.model.userData.icePhenomena = true;

      this.models.cubTwo.model.userData.atHome = false;
      this.models.cubTwo.model.userData.treePhenomena = true;

      this.models.cubThree.model.userData.atHome = false;

      this.models.cubOne.model.matrixAutoUpdate = false;
      this.models.cubTwo.model.matrixAutoUpdate = false;
      this.models.cubThree.model.matrixAutoUpdate = false;

      this.models.cubOne.model.children[this.models.cubOne.model.children.length - 1].material.alphaTest = 0.5;
      this.models.cubOne.model.children[this.models.cubOne.model.children.length - 1].material.map = this.textures.cub.cubOne;
      this.models.cubOne.model.children[this.models.cubOne.model.children.length - 1].material.color = new THREE.Color(1, 1, 1);

      this.models.cubTwo.model.children[this.models.cubTwo.model.children.length - 1].material.alphaTest = 0.5;
      this.models.cubTwo.model.children[this.models.cubTwo.model.children.length - 1].material.map = this.textures.cub.cubTwo;
      this.models.cubTwo.model.children[this.models.cubTwo.model.children.length - 1].material.color = new THREE.Color(1, 1, 1);

      this.models.cubThree.model.children[this.models.cubThree.model.children.length - 1].material.alphaTest = 0.5;
      this.models.cubThree.model.children[this.models.cubThree.model.children.length - 1].material.map = this.textures.cub.cubThree;
      this.models.cubThree.model.children[this.models.cubThree.model.children.length - 1].material.color = new THREE.Color(1, 1, 1);     

      this.models.wolf.model.traverse(child => {
        if (child.isMesh && child.name === 'Wolf1_Material__wolf_col_tga_0001') {
          this.models.wolf.model.children[this.models.wolf.model.children.indexOf(child)].material.map = this.textures.cub.cubThree;
        }
      });

      this.models.cubOne.model.name = 'firstCub';
      this.models.cubTwo.model.name = 'secondCub';
      this.models.cubThree.model.name = 'thirdCub';


      this.models.paw.model.matrixAutoUpdate = false;
      this.models.paw.model.children[this.models.paw.model.children.length - 1].material.map = this.textures.paw.covered;
      this.models.paw.model.children[this.models.paw.model.children.length - 1].material.color = new THREE.Color(1, 1, 1);


      this.models.landscape.model.matrixAutoUpdate = false;


      this.models.wolf.model.matrixAutoUpdate = false;
      this.models.wolf.model.userData.drags = false;


      this.models.tree.model.matrixAutoUpdate = false;
      this.models.fallTree.model.matrixAutoUpdate = false;


      this.models.rockOne.matrixAutoUpdate = false;
      this.models.rockOne.material.color = new THREE.Color(1, 1, 1);
      this.models.rockOne.material.map = this.textures.rock;

      this.models.rockTwo.matrixAutoUpdate = false;
      this.models.rockTwo.material.color = new THREE.Color(1, 1, 1);
      this.models.rockTwo.material.map = this.textures.rock;

      this.models.rockTwo.matrixAutoUpdate = false;
      this.models.rockTwo.material.color = new THREE.Color(1, 1, 1);
      this.models.rockTwo.material.map = this.textures.rock;

      this.models.rockThree.matrixAutoUpdate = false;
      this.models.rockThree.material.color = new THREE.Color(1, 1, 1);
      this.models.rockThree.material.map = this.textures.rock;

      this.models.rockFour.matrixAutoUpdate = false;
      this.models.rockFour.material.color = new THREE.Color(1, 1, 1);
      this.models.rockFour.material.map = this.textures.rock;

      this.models.rockFive.matrixAutoUpdate = false;
      this.models.rockFive.material.color = new THREE.Color(1, 1, 1);
      this.models.rockFive.material.map = this.textures.rock;


      this.models.pebbleOne.children.forEach(brush => {
        brush.matrixAutoUpdate = false;
      });

      this.models.pebbleTwo.children.forEach(brush => {
        brush.matrixAutoUpdate = false;
      });

      this.models.pebbleThree.children.forEach(brush => {
        brush.matrixAutoUpdate = false;
      });


      this.models.bushOne.matrixAutoUpdate = false;

      this.models.bushTwo.matrixAutoUpdate = false;

      this.models.bushThree.matrixAutoUpdate = false;

      this.models.paw.model.scale.set(3, 3, 3);
      this.models.paw.model.position.set(-40, 0.45, -70);
      this.models.paw.model.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * -1.2));

      this.models.landscape.model.scale.set(10, 10, 10);

      let pinesProperties,
          pebblesProperties,
          bushesProperties,
          rocksProperties;

      switch(referenceObject.generateWorld) {
        case 0:
          this.models.wolf.model.scale.set(5, 5, 5);
          this.models.wolf.model.position.set(136, 0, -126);
          this.models.wolf.model.quaternion.set(0, 0.8862160572885877, 0, -0.4632721660146136);                    

          this.models.cubOne.model.position.set(-50, 0, 68);
          this.models.cubOne.model.scale.set(2.5, 2.5, 2.5);

          this.models.cubTwo.model.position.set(76, 0, -11);
          this.models.cubTwo.model.scale.set(2.5, 2.5, 2.5);

          this.models.cubThree.model.scale.set(2.5, 2.5, 2.5);

          this.models.cubOne.model.userData.homePoint = new THREE.Vector3(119, 0, -139);
          this.models.cubTwo.model.userData.homePoint = new THREE.Vector3(123.75, 0, -141.25);
          this.models.cubThree.model.userData.homePoint = new THREE.Vector3();

          pinesProperties = [
            {
              position: [-51, 0, 10],
              scale: [1.75, 1.75, 1.75]
            },
            {
              position: [138, 0.25, 88],
              scale: [1.25, 1.25, 1.25]
            },
            {
              position: [107, 0, 61],
              scale: [1.2, 1.2, 1.2]
            },
            {
              position: [59, 0.15, -38],
              scale: [1.5, 1.5, 1.5]
            },
            {
              position: [95, 0, 73],
              scale: [1, 1, 1],
              fallTree: true
            },
            {
              position: [115, 0, 88],
              scale: [1, 1, 1]
            },
            {
              position: [131, 0, 100],
              scale: [1.8, 1.8, 1.8]
            },
            {
              position: [-38, 0.25, 13],
              scale: [0.9, 0.9, 0.9]
            },
            {
              position: [-134, 0.15, 106],
              scale: [1.5, 1.5, 1.5]
            },
            {
              position: [128, 0.25, 83],
              scale: [0.6, 0.6, 0.6]
            },
            {
              position: [-64.59320820701465, 0, -78.77182026404718],
              scale: [1, 1, 1]
            },
            {
              position: [112, 0, 121],
              scale: [1.5, 1.5, 1.5]
            }            
          ];

          pinesProperties.forEach(property => {

            let pine = this.models.tree.model.clone();

            pine.matrixAutoUpdate = false;

            pine.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            pine.position.set(property.position[0], property.position[1], property.position[2]);
            pine.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            pine.updateMatrix();
            pine.updateMatrixWorld();

            pine.userData.fullAABB = new THREE.Box3().setFromObject(pine);
            pine.userData.arrayBrunchAABB = [];

            pine.traverse(stuff => {
              if (stuff.name.charAt(0) === 'l') {
                stuff.updateMatrix();
                stuff.updateMatrixWorld();
              }              
              if (stuff.name.charAt(0) === 't') {
                stuff.updateMatrix();
                stuff.updateMatrixWorld();
              }
              if (stuff.name.charAt(0) === 'b') {
                stuff.material = new THREE.MeshStandardMaterial({
                  alphaTest: 0.5,
                  map: this.textures.branches.full,
                  side: THREE.DoubleSide
                });
                stuff.material.map.encoding = 3001;
                pine.userData.arrayBrunchAABB.push({
                  aabb: new THREE.Box3().setFromObject(stuff),
                  turned: false,
                  slerpQX: Number(stuff.name.slice(-3)) <= 5 ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.2).multiply(stuff.quaternion) : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.2).multiply(stuff.quaternion),
                  slerpQN: new THREE.Quaternion().copy(stuff.quaternion),
                  stepByStepQ: new THREE.Quaternion().copy(stuff.quaternion),
                  initialQ: new THREE.Quaternion().copy(stuff.quaternion),
                  object: stuff,
                  turns: false,
                  wind: false,
                  snowCoverTime: 30.1,
                  gPos: new THREE.Vector3(),
                  slerpNZWind: Math.round(Math.random()),
                  slerpNXWind: Math.round(Math.random()),
                  bushRustling: false
                });
              }
            });

            if (property.fallTree) {
              pine.userData.fallTree = this.models.fallTree.model.clone();
              pine.userData.fallTree.userData.fallTree = true;

              pine.userData.fallTree.matrixAutoUpdate = false;

              pine.userData.fallTree.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
              pine.userData.fallTree.position.set(property.position[0], property.position[1], property.position[2]);
              pine.userData.fallTree.scale.set(property.scale[0], property.scale[1], property.scale[2]);
              pine.userData.fallTree.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

              pine.userData.fallTree.traverse(stuff => {
                if (stuff.name.charAt(0) === 'l') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.trunk
                  });
                }              
                if (stuff.name.charAt(0) === 't') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.trunk
                  });
                }                
                if (stuff.name.charAt(0) === 'b') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.branches.notFull,
                    side: THREE.DoubleSide
                  });
                  stuff.material.map.encoding = 3001;
                }
              })

              pine.userData.fallTree.updateMatrix();
              pine.userData.fallTree.updateMatrixWorld();          
            }            

            this.models.pines.push(pine);
          });


          bushesProperties = [
            {
              resistance: 'low',
              position: [23.61987114951385, 0, -48.67679778846685],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [14.635108612345906, -1, -44.729315006517034],
              scale: [7, 7, 7],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'medium',
              position: [14.266597394381716, 0, -49.17345883375304],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'low',
              position: [11.62444220180033, 0, -40.799441324005095],
              scale: [4, 4, 4],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [18.35903660034408, 0, -47.9199092799412],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [9.680223993551081, 0, -46.15247384088343],
              scale: [5, 5, 5],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [77, 0, -11],
              scale: [8, 8, 8],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'high',
              position: [69, 0, -126],
              scale: [4.5, 4.5, 4.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [71, 0, -127],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [66, 0, -139],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'low',
              position: [142, 0, -111],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [155, 0, -117],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [150, 0, -113],
              scale: [4.5, 4.5, 4.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [152, 0, -116],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [143, 0.25, -138],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [53, 0.25, 103],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [64, 0, 122],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [60, 0, 108],
              scale: [2.5, 2.5, 2.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [117, 0, 98],
              scale: [7.5, 7.5, 7.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [108, 0, 104],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'high',
              position: [-38, 0, 61],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [-34, 0, 68],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [-123, 0, 154],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            }            
          ]

          bushesProperties.forEach(property => {

            let bush = property.model;

            bush.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            bush.position.set(property.position[0], property.position[1], property.position[2]);
            bush.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            bush.updateMatrix();
            bush.updateMatrixWorld();

            bush.userData.fullAABB = new THREE.Box3().setFromObject(bush);
            bush.userData.arrayBrunchAABB = [];
            
            bush.traverse(stuff => {
              if (!stuff.isGroup) {
                if (stuff.name.charAt(0) === 'b') {
                  bush.userData.arrayBrunchAABB.push({
                    turned: false,
                    slerpQX: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (Math.round(Math.random()) === 1 ? 0.3 : -0.3)).multiply(bush.children[1].quaternion),
                    slerpQN: new THREE.Quaternion().copy(stuff.quaternion),
                    stepByStepQ: new THREE.Quaternion().copy(stuff.quaternion),
                    initialQ: new THREE.Quaternion().copy(stuff.quaternion),
                    turns: false,
                    object: stuff,
                    slerpNZWind: Math.round(Math.random()),
                    slerpNXWind: Math.round(Math.random()),
                    resistance: property.resistance
                  });
                } else {

                  stuff.updateMatrix();
                  stuff.updateMatrixWorld();
                }
              }
            });

            this.models.bushes.push(bush);
          });


          pebblesProperties = [
            {
              position: [123, 0, -143],
              scale: [3, 3, 3],
              model: this.models.pebbleOne.clone()
            },
            {
              position: [118, 0, -142],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone(),
              angleQ: Math.PI * 1.3
            },
            {
              position: [114, 0, -136],
              scale: [2.75, 2.75, 2.75],
              model: this.models.pebbleOne.clone(),
              angleQ: -Math.PI * 0.2
            },
            {
              position: [78, 0, -138],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [153, 0, -117],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [55, 0, 94],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [55, 0, 123],
              scale: [3, 3, 3],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [59, 0, 110],
              scale: [3, 3, 3],
              model: this.models.pebbleOne.clone()
            },
            {
              position: [69, 0, 119],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-44, 0, 14],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [15, 0, -46],
              scale: [2, 2, 2],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [-26, 0, -67],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [-55, 0, -67],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-44, 0, -76],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleOne.clone()
            },            
          ]

          pebblesProperties.forEach(property => {

            let pebble = property.model;

            pebble.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            pebble.position.set(property.position[0], property.position[1], property.position[2]);
            pebble.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            if (property.angleQ) {
              pebble.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), property.angleQ);
            }

            pebble.updateMatrix();
            pebble.updateMatrixWorld();

            pebble.traverse(child => {
              if (child.isMesh) {

                child.updateMatrix();
                child.updateMatrixWorld();
              }
            });

            this.models.pebbles.push(pebble);
          });


          rocksProperties = [
            {
              position: [this.models.wolf.model.position.x - 15, 6, this.models.wolf.model.position.z],
              scale: [8, 8, 8],
              model: this.models.rockOne.clone()
            },
            {
              position: [40, 5, -20],
              scale: [10, 8, 34],
              model: this.models.rockTwo.clone()
            },
            {
              position: [66, 0, -132],
              scale: [6, 6, 6],
              model: this.models.rockThree.clone()
            },
            {
              position: [-43, 0, 69],
              scale: [7, 7, 7],
              model: this.models.rockFour.clone()
            },
            {
              position: [-131, 1, 157],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [150, 1.25, -135],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [145, 0, -105],
              scale: [5, 5, 5],
              model: this.models.rockFour.clone()
            },
            {
              position: [69, 0, 127],
              scale: [5, 5, 5],
              model: this.models.rockFour.clone()
            },
            {
              position: [60, 1.25, 101],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [115, 3, 103],
              scale: [4, 4, 4],
              model: this.models.rockOne.clone()
            }            
          ]

          rocksProperties.forEach(property => {

            let rock = property.model;

            rock.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            rock.position.set(property.position[0], property.position[1], property.position[2]);
            rock.scale.set(property.scale[0], property.scale[1], property.scale[2]);
            
            rock.updateMatrix();
            rock.updateMatrixWorld();

            this.models.rocks.push(rock);
          });


          this.models.startCub = this.models.cubThree;
          this.models.startCub.model.userData.atHome = true;
          this.models.startCub.model.position.set(this.models.wolf.model.position.x - 5, 0, this.models.wolf.model.position.z - 4);
          this.models.startCub.model.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(this.models.startCub.model.position.x, this.models.startCub.model.position.y, this.models.startCub.model.position.z), new THREE.Vector3(this.models.wolf.model.position.x, this.models.wolf.model.position.y, this.models.wolf.model.position.z), new THREE.Vector3(0,1,0)));
          this.models.startCub.model.userData.homePoint.set(this.models.wolf.model.position.x - 19, 0, this.models.wolf.model.position.z - 7);

          break;
        case 1:

          this.models.wolf.model.scale.set(5, 5, 5);
          this.models.wolf.model.position.set(64, 1, -17);
          this.models.wolf.model.quaternion.set(0, 0.8862160572885877, 0, -0.4632721660146136);

          this.models.cubOne.model.position.set(-44, 0, 71);
          this.models.cubOne.model.scale.set(2.5, 2.5, 2.5);

          this.models.cubTwo.model.position.set(67.8, 0.95, -108);
          this.models.cubTwo.model.scale.set(2.5, 2.5, 2.5);
          this.models.cubTwo.model.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.7);

          this.models.cubThree.model.scale.set(2.5, 2.5, 2.5);

          this.models.cubOne.model.userData.homePoint = new THREE.Vector3(44, 0, -27);
          this.models.cubTwo.model.userData.homePoint = new THREE.Vector3(45, 0, -21.9);
          this.models.cubThree.model.userData.homePoint = new THREE.Vector3();

          pinesProperties = [
            {
              position: [-134, 0.15, 106],
              scale: [1.75, 1.75, 1.75]
            },
            {
              position: [135, 0.25, -42],
              scale: [1.25, 1.25, 1.25]
            },
            {
              position: [147, 0, -136],
              scale: [1.2, 1.2, 1.2]
            },
            {
              position: [47, 0.15, -31],
              scale: [1.5, 1.5, 1.5]
            },
            {
              position: [130, 0, -62],
              scale: [1.6, 1.6, 1.6],
              fallTree: true
            },
            {
              position: [114, 0, -132],
              scale: [1, 1, 1]
            },
            {
              position: [130, 0, -148],
              scale: [1.8, 1.8, 1.8]
            },
            {
              position: [137, 0.25, -138],
              scale: [0.9, 0.9, 0.9]
            },
            {
              position: [108, 0.15, -145],
              scale: [1.5, 1.5, 1.5]
            },
            {
              position: [104, 0.25, -130],
              scale: [0.6, 0.6, 0.6]
            },
            {
              position: [-64.59320820701465, 0, -78.77182026404718],
              scale: [1, 1, 1]
            },
            {
              position: [-54, 0, 60],
              scale: [1.5, 1.5, 1.5]
            }            
          ];

          pinesProperties.forEach(property => {

            let pine = this.models.tree.model.clone();

            pine.matrixAutoUpdate = false;

            pine.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            pine.position.set(property.position[0], property.position[1], property.position[2]);
            pine.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            pine.updateMatrix();
            pine.updateMatrixWorld();

            pine.userData.fullAABB = new THREE.Box3().setFromObject(pine);
            pine.userData.arrayBrunchAABB = [];

            pine.children.forEach(stuff => {
              if (stuff.name.charAt(0) === 'l') {
                stuff.material = new THREE.MeshStandardMaterial({
                  alphaTest: 0.5,
                  map: this.textures.trunk
                });
              }              
              if (stuff.name.charAt(0) === 't') {
                stuff.material = new THREE.MeshStandardMaterial({
                  alphaTest: 0.5,
                  map: this.textures.trunk
                });
              }
              if (stuff.name.charAt(0) === 'b') {
                stuff.material = new THREE.MeshStandardMaterial({
                  alphaTest: 0.5,
                  map: this.textures.branches.full,
                  side: THREE.DoubleSide
                });
                stuff.material.map.encoding = 3001;
                pine.userData.arrayBrunchAABB.push({
                  aabb: new THREE.Box3().setFromObject(stuff),
                  turned: false,
                  slerpQX: Number(stuff.name.slice(-3)) <= 5 ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.2).multiply(stuff.quaternion) : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.2).multiply(stuff.quaternion),
                  slerpQN: new THREE.Quaternion().copy(stuff.quaternion),
                  stepByStepQ: new THREE.Quaternion().copy(stuff.quaternion),
                  initialQ: new THREE.Quaternion().copy(stuff.quaternion),
                  object: stuff,
                  turns: false,
                  wind: false,
                  snowCoverTime: 30.1,
                  gPos: new THREE.Vector3(),
                  slerpNZWind: Math.round(Math.random()),
                  slerpNXWind: Math.round(Math.random()),
                  bushRustling: false
                });
              }
            });            

            if (property.fallTree) {

              pine.userData.fallTree = this.models.fallTree.model.clone();
              pine.userData.fallTree.userData.fallTree = true;

              pine.userData.fallTree.matrixAutoUpdate = false;

              pine.userData.fallTree.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
              pine.userData.fallTree.position.set(property.position[0], property.position[1], property.position[2]);
              pine.userData.fallTree.scale.set(property.scale[0], property.scale[1], property.scale[2]);
              pine.userData.fallTree.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);

              pine.userData.fallTree.children.forEach(stuff => {
                if (stuff.name.charAt(0) === 'l') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.trunk
                  });
                }              
                if (stuff.name.charAt(0) === 't') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.trunk
                  });
                }                
                if (stuff.name.charAt(0) === 'b') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.branches.notFull,
                    side: THREE.DoubleSide
                  });
                  stuff.material.map.encoding = 3001;
                }
              })

              pine.userData.fallTree.updateMatrix();
              pine.userData.fallTree.updateMatrixWorld();              
            }

            this.models.pines.push(pine);
          });


          bushesProperties = [
            {
              resistance: 'low',
              position: [-46, 0, 12],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [-38, -1, 12],
              scale: [7, 7, 7],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'medium',
              position: [105, 0, -106],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'low',
              position: [109, 0, -106],
              scale: [4, 4, 4],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [116, 0, -119],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [40, 0, -20],
              scale: [5, 5, 5],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [68, 0.95, -107.6],
              scale: [8, 8, 8],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'high',
              position: [62, 0, 100],
              scale: [4.5, 4.5, 4.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [65, 0, 98],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [50, 0, 95],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'low',
              position: [70, 0, 129],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [73, 0, 123],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [65, 0, 116],
              scale: [4.5, 4.5, 4.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [68, 0, 113],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [64, 0.25, 113],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [115, 0.25, 94],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [120, 0, 89],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [113, 0, 115],
              scale: [2.5, 2.5, 2.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [121, 0, 103],
              scale: [7.5, 7.5, 7.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [123, 0, 110],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'high',
              position: [40, 0, -26],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [55, 0, -13],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [56, 0, -29],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            }            
          ]

          bushesProperties.forEach(property => {

            let bush = property.model;

            bush.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            bush.position.set(property.position[0], property.position[1], property.position[2]);
            bush.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            bush.updateMatrix();
            bush.updateMatrixWorld();

            bush.userData.fullAABB = new THREE.Box3().setFromObject(bush);
            bush.userData.arrayBrunchAABB = [];
            
            bush.traverse(stuff => {
              if (stuff.name.charAt(0) === 'b') {
                bush.userData.arrayBrunchAABB.push({
                  turned: false,
                  slerpQX: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (Math.round(Math.random()) === 1 ? 0.3 : -0.3)).multiply(bush.children[1].quaternion),
                  slerpQN: new THREE.Quaternion().copy(stuff.quaternion),
                  stepByStepQ: new THREE.Quaternion().copy(stuff.quaternion),
                  initialQ: new THREE.Quaternion().copy(stuff.quaternion),
                  turns: false,
                  object: stuff,
                  slerpNZWind: Math.round(Math.random()),
                  slerpNXWind: Math.round(Math.random()),
                  resistance: property.resistance
                });
              }
            });

            this.models.bushes.push(bush);
          });


          pebblesProperties = [
            {
              position: [67, 0.6, -152],
              scale: [3, 3, 3],
              model: this.models.pebbleOne.clone()
            },
            {
              position: [64, 0.2, -128],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone(),
              angleQ: Math.PI * 1.3
            },
            {
              position: [56, 0, -140],
              scale: [2.75, 2.75, 2.75],
              model: this.models.pebbleOne.clone(),
              angleQ: -Math.PI * 0.2
            },
            {
              position: [137, 0.1, -130],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [118, 0, -107],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [113, 0, 101],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [62, 0, 107],
              scale: [3, 3, 3],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [65, 0, 123],
              scale: [3, 3, 3],
              model: this.models.pebbleOne.clone()
            },
            {
              position: [-97, 0.35, 10],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-90, 0, 27],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-107, 0, 44],
              scale: [2, 2, 2],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [-26, 0, -67],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [-55, 0, -67],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-44, 0, -76],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleOne.clone()
            },            
          ]

          pebblesProperties.forEach(property => {

            let pebble = property.model;

            pebble.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            pebble.position.set(property.position[0], property.position[1], property.position[2]);
            pebble.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            if (property.angleQ) {
              pebble.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), property.angleQ);
            }
            
            pebble.children.forEach(brush => {
              brush.updateMatrix();
              brush.updateMatrixWorld();
            });

            this.models.pebbles.push(pebble);
          });


          rocksProperties = [
            {
              position: [this.models.wolf.model.position.x - 15, 6, this.models.wolf.model.position.z],
              scale: [8, 8, 8],
              model: this.models.rockOne.clone()
            },
            {
              position: [84, 5, -126],
              scale: [10, 5, 24],
              model: this.models.rockTwo.clone(),
              angleQ: Math.PI
            },
            {
              position: [-38, 0, 68],
              scale: [6, 6, 6],
              model: this.models.rockThree.clone()
            },
            {
              position: [109, 0, -115],
              scale: [7, 7, 7],
              model: this.models.rockFour.clone()
            },
            {
              position: [-131, 1, 157],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [58, 1.25, 96],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [76, 0, 129],
              scale: [5, 5, 5],
              model: this.models.rockFour.clone()
            },
            {
              position: [118, 0, 110],
              scale: [5, 5, 5],
              model: this.models.rockFour.clone()
            },
            {
              position: [123, 1.25, 95],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [-43, 0, 9],
              scale: [4, 4, 4],
              model: this.models.rockFour.clone()
            }            
          ]

          rocksProperties.forEach(property => {

            let rock = property.model;

            rock.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            rock.position.set(property.position[0], property.position[1], property.position[2]);
            rock.scale.set(property.scale[0], property.scale[1], property.scale[2]);
            
            if (property.angleQ) {
              rock.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), property.angleQ);
            }

            rock.updateMatrix();
            rock.updateMatrixWorld();

            this.models.rocks.push(rock);
          });


          this.models.startCub = this.models.cubThree;
          this.models.startCub.model.userData.atHome = true;
          this.models.startCub.model.position.set(this.models.wolf.model.position.x - 5, 0, this.models.wolf.model.position.z - 4);
          this.models.startCub.model.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(this.models.startCub.model.position.x, 1, this.models.startCub.model.position.z), new THREE.Vector3(this.models.wolf.model.position.x, this.models.wolf.model.position.y, this.models.wolf.model.position.z), new THREE.Vector3(0,1,0)));
          this.models.startCub.model.userData.homePoint.set(this.models.wolf.model.position.x - 19, 0, this.models.wolf.model.position.z - 7);

          break;
        case 2:

          this.models.wolf.model.scale.set(5, 5, 5);
          this.models.wolf.model.position.set(60, 1, 108);
          // 60, 1, 108
          this.models.wolf.model.quaternion.set(0, 0.8862160572885877, 0, -0.4632721660146136);                    

          this.models.cubOne.model.position.set(-44, 0, 8);
          this.models.cubOne.model.scale.set(2.5, 2.5, 2.5);
          this.models.cubOne.model.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.5);

          this.models.cubTwo.model.position.set(165.5, 0.2, -121.5);
          this.models.cubTwo.model.scale.set(2.5, 2.5, 2.5);
          this.models.cubTwo.model.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.6);

          this.models.cubThree.model.scale.set(2.5, 2.5, 2.5);

          this.models.cubOne.model.userData.homePoint = new THREE.Vector3(45, 0, 98);
          this.models.cubTwo.model.userData.homePoint = new THREE.Vector3(44.1, 0, 103.7);
          this.models.cubThree.model.userData.homePoint = new THREE.Vector3();

          pinesProperties = [
            {
              position: [75, 0.15, -146],
              scale: [1.75, 1.75, 1.75]
            },
            {
              position: [68, 0.25, -39],
              scale: [1.25, 1.25, 1.25]
            },
            {
              position: [72, 0, -27],
              scale: [1.2, 1.2, 1.2]
            },
            {
              position: [59, 0.15, -27],
              scale: [1.5, 1.5, 1.5]
            },
            {
              position: [135, 0, 10],
              scale: [1.6, 1.6, 1.6],
              fallTree: true
            },
            {
              position: [-16, 0, -50],
              scale: [1, 1, 1]
            },
            {
              position: [45, 0, 0],
              scale: [1.8, 1.8, 1.8]
            },
            {
              position: [69, 0.25, -11],
              scale: [0.9, 0.9, 0.9]
            },
            {
              position: [59, 0.15, -8],
              scale: [1.5, 1.5, 1.5]
            },
            {
              position: [132, 0.25, 26],
              scale: [0.6, 0.6, 0.6]
            },
            {
              position: [-64.59320820701465, 0, -78.77182026404718],
              scale: [1, 1, 1]
            },
            {
              position: [-134, 0.15, 106],
              scale: [1.5, 1.5, 1.5]
            }            
          ];

          pinesProperties.forEach(property => {

            let pine = this.models.tree.model.clone();

            pine.matrixAutoUpdate = false;

            pine.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            pine.position.set(property.position[0], property.position[1], property.position[2]);
            pine.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            pine.updateMatrix();
            pine.updateMatrixWorld();

            pine.userData.fullAABB = new THREE.Box3().setFromObject(pine);
            pine.userData.arrayBrunchAABB = [];

            pine.children.forEach(stuff => {
              if (stuff.name.charAt(0) === 'l') {
                stuff.material = new THREE.MeshStandardMaterial({
                  alphaTest: 0.5,
                  map: this.textures.trunk
                });
              }              
              if (stuff.name.charAt(0) === 't') {
                stuff.material = new THREE.MeshStandardMaterial({
                  alphaTest: 0.5,
                  map: this.textures.trunk
                });
              }
              if (stuff.name.charAt(0) === 'b') {
                stuff.material = new THREE.MeshStandardMaterial({
                  alphaTest: 0.5,
                  map: this.textures.branches.full,
                  side: THREE.DoubleSide
                });
                stuff.material.map.encoding = 3001;
                pine.userData.arrayBrunchAABB.push({
                  aabb: new THREE.Box3().setFromObject(stuff),
                  turned: false,
                  slerpQX: Number(stuff.name.slice(-3)) <= 5 ? new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.2).multiply(stuff.quaternion) : new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.2).multiply(stuff.quaternion),
                  slerpQN: new THREE.Quaternion().copy(stuff.quaternion),
                  stepByStepQ: new THREE.Quaternion().copy(stuff.quaternion),
                  initialQ: new THREE.Quaternion().copy(stuff.quaternion),
                  object: stuff,
                  turns: false,
                  wind: false,
                  snowCoverTime: 30.1,
                  gPos: new THREE.Vector3(),
                  slerpNZWind: Math.round(Math.random()),
                  slerpNXWind: Math.round(Math.random()),
                  bushRustling: false
                });
              }
            });            

            if (property.fallTree) {

              pine.userData.fallTree = this.models.fallTree.model.clone();
              pine.userData.fallTree.userData.fallTree = true;

              pine.userData.fallTree.matrixAutoUpdate = false;

              pine.userData.fallTree.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
              pine.userData.fallTree.position.set(property.position[0], property.position[1], property.position[2]);
              pine.userData.fallTree.scale.set(property.scale[0], property.scale[1], property.scale[2]);
              pine.userData.fallTree.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 1.5);

              pine.userData.fallTree.children.forEach(stuff => {
                if (stuff.name.charAt(0) === 'l') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.trunk
                  });
                }              
                if (stuff.name.charAt(0) === 't') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.trunk
                  });
                }                
                if (stuff.name.charAt(0) === 'b') {
                  stuff.material = new THREE.MeshStandardMaterial({
                    alphaTest: 0.5,
                    map: this.textures.branches.notFull,
                    side: THREE.DoubleSide
                  });
                  stuff.material.map.encoding = 3001;
                }
              })

              pine.userData.fallTree.updateMatrix();
              pine.userData.fallTree.updateMatrixWorld();              
            }

            this.models.pines.push(pine);
          });


          bushesProperties = [
            {
              resistance: 'low',
              position: [97, 0, -138],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [102, -1, -143],
              scale: [7, 7, 7],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'medium',
              position: [126, 0, -143],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'low',
              position: [74, 0, -127],
              scale: [4, 4, 4],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [118, 0, 106],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [116, 0, 111],
              scale: [5, 5, 5],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [112, 0, 109],
              scale: [8, 8, 8],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'high',
              position: [112, 0, 104],
              scale: [4.5, 4.5, 4.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [-22, 0, 46],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [-33, 0, 39],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'low',
              position: [-36, 0, 13],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [-44, 0, 19],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [-57, 0, 4],
              scale: [4.5, 4.5, 4.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [-37, 0, 25],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [-36, 0.25, 49],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [-59, 0.25, 74],
              scale: [6, 6, 6],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'high',
              position: [-44, 0, 64],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [-59, 0, 67],
              scale: [2.5, 2.5, 2.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [46, 0, 93],
              scale: [7.5, 7.5, 7.5],
              model: this.models.bushThree.clone()
            },
            {
              resistance: 'high',
              position: [124, 0, 109],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'high',
              position: [137, 0, 21],
              scale: [5.5, 5.5, 5.5],
              model: this.models.bushTwo.clone()
            },
            {
              resistance: 'low',
              position: [51, 0, 95],
              scale: [3, 3, 3],
              model: this.models.bushOne.clone()
            },
            {
              resistance: 'medium',
              position: [59, 0, -16],
              scale: [6.5, 6.5, 6.5],
              model: this.models.bushThree.clone()
            }            
          ]

          bushesProperties.forEach(property => {

            let bush = property.model;

            bush.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            bush.position.set(property.position[0], property.position[1], property.position[2]);
            bush.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            bush.updateMatrix();
            bush.updateMatrixWorld();

            bush.userData.fullAABB = new THREE.Box3().setFromObject(bush);
            bush.userData.arrayBrunchAABB = [];
            
            bush.traverse(stuff => {
              if (stuff.name.charAt(0) === 'b') {
                bush.userData.arrayBrunchAABB.push({
                  turned: false,
                  slerpQX: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), (Math.round(Math.random()) === 1 ? 0.3 : -0.3)).multiply(bush.children[1].quaternion),
                  slerpQN: new THREE.Quaternion().copy(stuff.quaternion),
                  stepByStepQ: new THREE.Quaternion().copy(stuff.quaternion),
                  initialQ: new THREE.Quaternion().copy(stuff.quaternion),
                  turns: false,
                  object: stuff,
                  slerpNZWind: Math.round(Math.random()),
                  slerpNXWind: Math.round(Math.random()),
                  resistance: property.resistance
                });
              }
            });

            this.models.bushes.push(bush);
          });


          pebblesProperties = [
            {
              position: [167, 0.2, -122],
              scale: [3, 3, 3],
              model: this.models.pebbleOne.clone(),
              angleQ: Math.PI * 1.5
            },
            {
              position: [155, 0.15, -134],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone(),
              angleQ: Math.PI * 1.3
            },
            {
              position: [127, 0.3, -149],
              scale: [2.75, 2.75, 2.75],
              model: this.models.pebbleOne.clone(),
              angleQ: -Math.PI * 0.2
            },
            {
              position: [-37, 0, 27],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [-41, 0, 54],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-56, 0, 6],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-59, 0, 70],
              scale: [3, 3, 3],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [-20, 0, 45],
              scale: [3, 3, 3],
              model: this.models.pebbleOne.clone()
            },
            {
              position: [114, 0.15, 110],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [120, 0.15, 109],
              scale: [2.5, 2.5, 2.5],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [49, 0, 95],
              scale: [2, 2, 2],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-26, 0, -67],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleThree.clone()
            },
            {
              position: [-55, 0, -67],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleTwo.clone()
            },
            {
              position: [-44, 0, -76],
              scale: [5.5, 5.5, 5.5],
              model: this.models.pebbleOne.clone()
            }
          ]

          pebblesProperties.forEach(property => {

            let pebble = property.model;

            pebble.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            pebble.position.set(property.position[0], property.position[1], property.position[2]);
            pebble.scale.set(property.scale[0], property.scale[1], property.scale[2]);

            if (property.angleQ) {
              pebble.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), property.angleQ);
            }
            
            pebble.children.forEach(brush => {
              brush.updateMatrix();
              brush.updateMatrixWorld();
            });

            this.models.pebbles.push(pebble);
          });


          rocksProperties = [
            {
              position: [this.models.wolf.model.position.x - 15, 6, this.models.wolf.model.position.z],
              scale: [8, 8, 8],
              model: this.models.rockOne.clone()
            },
            {
              position: [141, 4, -118],
              scale: [10, 5, 24],
              model: this.models.rockTwo.clone(),
              angleQ: Math.PI * 1.2
            },
            {
              position: [115, 0, -139],
              scale: [6, 6, 6],
              model: this.models.rockThree.clone()
            },
            {
              position: [96, 0, -147],
              scale: [7, 7, 7],
              model: this.models.rockFour.clone()
            },
            {
              position: [69, 1, -130],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [-32, 1.25, 46],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [-43, 0, 13],
              scale: [5, 5, 5],
              model: this.models.rockFour.clone()
            },
            {
              position: [-50, 0, 65],
              scale: [5, 5, 5],
              model: this.models.rockFour.clone()
            },
            {
              position: [33, 1.25, 93],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            },
            {
              position: [-131, 1, 157],
              scale: [5, 5, 5],
              model: this.models.rockFive.clone()
            }
          ]

          rocksProperties.forEach(property => {

            let rock = property.model;

            rock.userData.position = new THREE.Vector3(property.position[0], property.position[1], property.position[2]);
            rock.position.set(property.position[0], property.position[1], property.position[2]);
            rock.scale.set(property.scale[0], property.scale[1], property.scale[2]);
            
            if (property.angleQ) {
              rock.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), property.angleQ);
            }

            rock.updateMatrix();
            rock.updateMatrixWorld();

            this.models.rocks.push(rock);
          });


          this.models.startCub = this.models.cubThree;
          this.models.startCub.model.userData.atHome = true;
          this.models.startCub.model.position.set(this.models.wolf.model.position.x - 5, 0, this.models.wolf.model.position.z - 4);
          this.models.startCub.model.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(new THREE.Vector3(this.models.startCub.model.position.x, 1, this.models.startCub.model.position.z), new THREE.Vector3(this.models.wolf.model.position.x, this.models.wolf.model.position.y, this.models.wolf.model.position.z), new THREE.Vector3(0,1,0)));
          this.models.startCub.model.userData.homePoint.set(this.models.wolf.model.position.x - 19, 0, this.models.wolf.model.position.z - 7);        

          break;
      }

      this.models.cubOne.model.updateMatrix();
      this.models.cubOne.model.updateMatrixWorld();

      this.models.cubTwo.model.updateMatrix();
      this.models.cubTwo.model.updateMatrixWorld();

      this.models.cubThree.model.updateMatrix();
      this.models.cubThree.model.updateMatrixWorld();

      this.models.paw.model.updateMatrix();
      this.models.paw.model.updateMatrixWorld();

      this.models.landscape.model.updateMatrix();
      this.models.landscape.model.updateMatrixWorld();

      this.models.wolf.model.updateMatrix();
      this.models.wolf.model.updateMatrixWorld();
    })
    return this;
  }

  _LoadTexture(url) {
    return new Promise(resolve => {
      new THREE.TextureLoader().load( url, resolve );
    });
  }


  _LoadModel(url) {
    return new Promise(resolve => {
      this._gltfLoader.load(url, resolve);
    });
  }
}