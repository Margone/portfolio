let THREE,
    aboutData,
    aboutTransitionSystem,
    aboutContent,
    Skills,
    DRACOLoader,
    GLTFLoader,
    Stats,
    ConvexHull,
    Sounds,
    gameData,
    systemOfExhalations,
    Camera,
    PersonCamera,
    SceneCamera,
    stepSystem,
    BasicCharacterControllerTouch,
    canvasCircle,
    TouchControls,
    touchOnRegion,
    interaction,
    pawScene,
    systemOfPickingCubs,
    snowFall,
    snowFallProgress,
    Tooltips,
    exitScene,
    BasicCharacterController,
    GUI,
    BufferGeometryUtils,
    audioPlayer;


let referenceObject = {
  isMobile: /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent),
  generateWorld: 0,
  countCubs: 1,
  data: {},
  forGame: {
    thirdPersonCamera: false,
    characterMovement: false,
    waningFog: false,
    iceFlooring: false,
    modelsLoaded: false,
    countModelsLoad: 0,
    gameOut: false
  },
  forAbout: {
    modelsLoaded: false,
    countModelsLoad: 0,
    gameOut: false,
  }
}


class CharacterControllerDemo {
  constructor(result) {
    this._howlerVolume = 0;
    Howler.volume(this._howlerVolume);

    document.querySelector('.wrapper').insertAdjacentHTML('afterbegin', `
    <div class="container3d"></div>
    `);

    this._renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    if (referenceObject.isMobile) {
      this._renderer.setPixelRatio(1.2);
    } else {
      this._renderer.setPixelRatio(window.devicePixelRatio);
    }
    this._renderer.shadowMap.enabled = false;
    this._renderer.shadowMapAutoUpdate = false;
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.querySelector('.container3d').appendChild(this._renderer.domElement);

    this.scene = new THREE.Scene();


    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 65);

    this.snowfleak = result;

    this._snowFallProgress = new snowFallProgress({
      scene: this.scene,
      camera: this.camera,
      snowfleakTex: this.snowfleak
    });

    this._RAF();

    window.addEventListener('resize', () => {
      this._renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = this._renderer.domElement.clientWidth / this._renderer.domElement.clientHeight;
      this.camera.updateProjectionMatrix();
    }, false);    
  }


  _Initialize(result) {

    this._renderer.alpha = false;
    this._globalPos = new THREE.Vector3();
    this._arrayLandscapeBrush = [];
    this._shaders = [];
    this._totalTime = 0;
    this._menuTimer = 0;
    this._startCallMenu = false;

    this._snowFallProgress.remove();

    this.models;
    this.textures;
    this.branchTexFull;
    this.branchTexNotFull;
    this.arrayConvexHull = [];
    this.arrayMeshConvexHull = [];
    this.arrayMeshCollisionTerrain = [];
    this.arrayTreeObjects = [];
    this.arraysInteractionObjects = {
      pines: [],
      bushes: []
    };
    this.phenomeTrees = {};
    this.floor = [];

    this.scene.background = 'white';


    this.camera.userData.phenomena = false;
    this.camera.userData.phenomenaDuration = 1.1;


    const _ModifyShader = (s) => {
      this._shaders.push(s);
      s.uniforms.time = {value: 0.0};
      s.uniforms.fogNoiseFreq = {value: 0.0096};
      s.uniforms.fogNoiseImpact = {value: 0.75};
      s.uniforms.fogNoiseSpeed = {value: 0.05};
      s.uniforms.fogColorNear = {value: new THREE.Color(0.68, 0.8, 1)};
      s.uniforms.forHorizonColor = {value: new THREE.Color(1, 1, 1)};
      s.uniforms.forHorizonColorLerp = {value: new THREE.Color(1, 0.14, 0)};
    }
    // new THREE.Color(0.98, 0.38, 0.37) красный цвет

    this._previousRAF = null;


    this.models = result.models;
    this.textures = result.textures;
    this.sounds = result.audio;

    this._geometriesRocks = [];
    this._materialRocks = new THREE.MeshStandardMaterial();
    this._materialRocks.color = new THREE.Color(1, 1, 1);
    this._materialRocks.map = this.textures.rock;

    this._geometriesPines = [];
    this._materialPines = new THREE.MeshStandardMaterial();
    this._materialPines.color = new THREE.Color(1, 1, 1);
    this._materialPines.map = this.textures.trunk;

    this._geometriesBushes = [];
    this._materialBushes = new THREE.MeshStandardMaterial();
    this._materialBushes.color = new THREE.Color(0.012983034364879131, 0.006512091029435396, 0);

    this.textures.snowfleak = this.snowfleak;

    this.branchTexFull = this.textures.branches.full;
    this.branchTexNotFull = this.textures.branches.notFull;


    this.models.paw.model.children[this.models.paw.model.children.length - 1].material.onBeforeCompile = _ModifyShader;

    this.models.cubOne.model.children[this.models.cubOne.model.children.length - 1].material.onBeforeCompile = _ModifyShader;
    this.models.cubTwo.model.children[this.models.cubTwo.model.children.length - 1].material.onBeforeCompile = _ModifyShader;
    this.models.cubThree.model.children[this.models.cubThree.model.children.length - 1].material.onBeforeCompile = _ModifyShader;


    this.models.bushes.forEach(bush => {
      bush.children.forEach(stuff => {
        if (stuff.name.charAt(0) === 'b') {
          stuff.material.onBeforeCompile = _ModifyShader;
        }

        if (stuff.name.charAt(0) === 't') {
          stuff.updateMatrix();
          stuff.updateMatrixWorld();
          this._geometriesBushes.push(stuff.geometry.clone().applyMatrix4(stuff.matrixWorld));
          stuff.geometry.dispose();
          stuff.material.dispose();
          bush.children.splice(bush.children.indexOf(stuff), 1);
        }
      });
      this.scene.add(bush);

      this.arraysInteractionObjects.bushes.push(bush);
    });

    const bushesGeom = BufferGeometryUtils.mergeBufferGeometries(this._geometriesBushes);
    const bushesMesh = new THREE.Mesh(bushesGeom, this._materialBushes);
    bushesMesh.material.onBeforeCompile = _ModifyShader;

    this.scene.add(bushesMesh);

    this.models.pines.forEach(pine => {
      if (pine.userData.fallTree) {
        pine.children.forEach(stuff => {
          this._convexHull = new ConvexHull();
          this._convexHull.setFromObject(stuff);
          if (stuff.name.charAt(0) === 'l') {
            this.arrayConvexHull.push(this._convexHull);
            this.arrayMeshConvexHull.push(stuff);
            this.arrayMeshCollisionTerrain.push(this._convexHull);
            stuff.material = new THREE.MeshStandardMaterial({
              alphaTest: 0.5,
              map: this.textures.trunk
            });
          }
          if (stuff.name.charAt(0) === 't') {
            this.arrayMeshCollisionTerrain.push(this._convexHull);
            stuff.material = new THREE.MeshStandardMaterial({
              alphaTest: 0.5,
              map: this.textures.trunk
            });
          }
          stuff.material.onBeforeCompile = _ModifyShader;
        });

        this.arrayTreeObjects.push(pine);
        this.arraysInteractionObjects.pines.push(pine);

        pine.updateMatrix();
        pine.updateMatrixWorld();

        this.scene.add(pine);

        this.phenomeTrees.tree = pine;

        pine.userData.fallTree.children.forEach(stuff => {
          stuff.material.onBeforeCompile = _ModifyShader;
          switch(stuff.name.charAt(0)) {
            case 'l':
              this._convexHull = new ConvexHull();
              this._convexHull.setFromObject(stuff);
              this.arrayConvexHull.push(this._convexHull);
              this.arrayMeshConvexHull.push(stuff);
              this.arrayMeshCollisionTerrain.push(this._convexHull);
              break;
          }
        });

        pine.userData.fallTree.updateMatrix();
        pine.userData.fallTree.updateMatrixWorld();

        this.phenomeTrees.fallTree = pine.userData.fallTree;
      } else {
        pine.children.forEach(stuff => {
          this._convexHull = new ConvexHull();
          this._convexHull.setFromObject(stuff);
          if (stuff.name.charAt(0) === 'l') {
            this.arrayConvexHull.push(this._convexHull);
            this.arrayMeshConvexHull.push(stuff);
            this.arrayMeshCollisionTerrain.push(this._convexHull);
            this._geometriesPines.push(stuff.geometry.clone().applyMatrix4(stuff.matrixWorld));
            stuff.geometry.dispose();
            stuff.material.dispose();
            pine.children.splice(pine.children.indexOf(stuff), 1);
          }
          if (stuff.name.charAt(0) === 't') {
            this.arrayMeshCollisionTerrain.push(this._convexHull);
            this._geometriesPines.push(stuff.geometry.clone().applyMatrix4(stuff.matrixWorld));
            stuff.geometry.dispose();
            stuff.material.dispose();
            pine.children.splice(pine.children.indexOf(stuff), 1);
          }
          if (stuff.name.charAt(0) === 'b') {
            stuff.material.onBeforeCompile = _ModifyShader;
          } 
        });

        this.scene.add(pine);

        this.arrayTreeObjects.push(pine);
        this.arraysInteractionObjects.pines.push(pine);
      }
    });

    const pinesGeom = BufferGeometryUtils.mergeBufferGeometries(this._geometriesPines);
    const pinesMesh = new THREE.Mesh(pinesGeom, this._materialPines);
    pinesMesh.material.onBeforeCompile = _ModifyShader;

    this.scene.add(pinesMesh);

    this.models.pebbles.forEach(pebble => {

      pebble.traverse(child => {
        if (child.isMesh) {

          this._geometriesRocks.push(child.geometry.clone().applyMatrix4(child.matrixWorld));
        }
      });
    });

    this.models.rocks.forEach(rock => {

      this._convexHull = new ConvexHull();
      this._convexHull.setFromObject(rock);

      this.arrayConvexHull.push(this._convexHull);
      this.arrayMeshConvexHull.push(rock);
      this.arrayMeshCollisionTerrain.push(this._convexHull);

      this._geometriesRocks.push(rock.geometry.clone().applyMatrix4(rock.matrix));
    });

    this._materialRocks.map = this.textures.rock;


    let ambientLight = new THREE.AmbientLight( 0xffffff );
    this.scene.add(ambientLight);


    this.models.landscape.model.children.forEach(brush => {
      brush.matrixAutoUpdate = false;
      brush.material.metalness = 0;
      brush.updateMatrix();
      brush.updateMatrixWorld();

      let totalGeom,
          combineMesh;

      switch (brush.name.charAt(0)) {
        case 'c':
          this._convexHull = new ConvexHull();
          this._convexHull.setFromObject(brush);
          this.arrayConvexHull.push(this._convexHull);
          this.arrayMeshConvexHull.push(brush);
          this.arrayMeshCollisionTerrain.push(this._convexHull);
          this._arrayLandscapeBrush.push(brush);
          this._geometriesRocks.push(brush.geometry.clone().applyMatrix4(brush.matrixWorld));
          brush.geometry.dispose();
          brush.material.dispose();
          break;
        case 'a':
          this._arrayLandscapeBrush.push(brush);
          this._geometriesRocks.push(brush.geometry.clone().applyMatrix4(brush.matrixWorld));
          brush.geometry.dispose();
          brush.material.dispose();
          break;
        case 'o':
          totalGeom = BufferGeometryUtils.mergeBufferGeometries([brush.geometry.clone().applyMatrix4(brush.matrixWorld)]);
          combineMesh = new THREE.Mesh(totalGeom, brush.material.clone());
          combineMesh.material.onBeforeCompile = _ModifyShader;
          this.scene.add(combineMesh);
          brush.geometry.dispose();
          brush.material.dispose();
          break;
        case 's':
          this.floor.push(brush);
          totalGeom = BufferGeometryUtils.mergeBufferGeometries([brush.geometry.clone().applyMatrix4(brush.matrixWorld)]);
          combineMesh = new THREE.Mesh(totalGeom, brush.material.clone());
          combineMesh.material.onBeforeCompile = _ModifyShader;
          this.scene.add(combineMesh);
          brush.geometry.dispose();
          brush.material.dispose();
          break;
        case 'i':
          this._arrayLandscapeBrush.push(brush);
          this.floor.push(brush);
          totalGeom = BufferGeometryUtils.mergeBufferGeometries([brush.geometry.clone().applyMatrix4(brush.matrixWorld)]);
          combineMesh = new THREE.Mesh(totalGeom, brush.material.clone());
          combineMesh.material.onBeforeCompile = _ModifyShader;
          this.scene.add(combineMesh);
          brush.geometry.dispose();
          brush.material.dispose();
          break;
      }

      brush.updateMatrix();
      brush.updateMatrixWorld();
    });


    const totalGeom = BufferGeometryUtils.mergeBufferGeometries(this._geometriesRocks);
    const combineMesh = new THREE.Mesh(totalGeom, this._materialRocks);
    combineMesh.material.onBeforeCompile = _ModifyShader;

    this.scene.add(combineMesh);

    this.scene.fog = new THREE.FogExp2(new THREE.Color(1, 1, 1), 0.1);
    this.scene.userData.fogHorizonColor = new THREE.Color(1, 1, 1);
    this.scene.userData.fogHorizonColorLerp = new THREE.Color(0.98, 0.38, 0.37);
    this.scene.userData.fogTestColor = new THREE.Color();
    this.scene.userData.fogPhenomaEnd = false;
    this.scene.userData.fogPhenoma = false;

    this._LaunchClasses();

    referenceObject.forGame.modelsLoaded = true;
    referenceObject.forGame.waningFog = true;
    this.models.wolf.model.userData.gameScene = this.scene;
    referenceObject.data.wolf = this.models.wolf;

    if (referenceObject.isMobile) {
      document.querySelector('.game-pop-up__close').addEventListener('touchstart', () => {
        document.querySelector('.game-pop-up').classList.toggle('_active');
        console.log('mgm');
        document.querySelector('.touch-row').classList.toggle('_active');
      });
      document.querySelector('.game-pop-up-exit-mobile').addEventListener('touchstart', () => {
        document.querySelector('.game-pop-up').classList.toggle('_active');
        this._exitScene._exitMenu = true;
      });
    } else {
      document.querySelector('.game-pop-up__close').addEventListener('click', () => {
        document.querySelector('.game-pop-up').classList.toggle('_active');
      });

      document.querySelector('.game-pop-up-exit-pc').addEventListener('click', () => {
        document.querySelector('.game-pop-up').classList.toggle('_active');
        this._exitScene._exitMenu = true;
      });
    }

    document.querySelector('.container3d').children[0].addEventListener('touchstart', () => {
      this._startCallMenu = true;
    });

    document.querySelector('.container3d').children[0].addEventListener('touchend', () => {
      this._menuTimer = 0;
      this._startCallMenu = false;
    });

    document.querySelector('.container3d').children[0].addEventListener('touchmove', () => {
      this._menuTimer = 0;
      this._startCallMenu = false;
    });

    // this._stats = new Stats();
    // this._stats.showPanel(0);
    // document.body.appendChild(this._stats.dom);
  }


  _LaunchClasses() {
    if (referenceObject.isMobile) {
      this._canvasContext = new canvasCircle();
    }
    this.controls = new BasicCharacterController({
      camera: this.camera,
      scene: this.scene,
      floor: this.floor,
      arrayTreeObjects: this.arrayTreeObjects,
      arrayConvexHull: this.arrayConvexHull,
      arrayMeshConvexHull: this.arrayMeshConvexHull,
      models: this.models,
      arrayCubsObjects: [this.models.cubOne, this.models.cubTwo, this.models.cubThree],     
      sounds: audioPlayer,
      BasicCharacterControllerTouch: BasicCharacterControllerTouch
    });

    if (window.innerWidth > 635) {
      referenceObject.forGame.cameraPosition.copy(new THREE.Vector3(this.controls.Character.position.x - 8, this.controls.Character.position.y + 7, this.controls.Character.position.z + 15));
      referenceObject.forGame.cameraLookat.copy(new THREE.Vector3(this.controls.Character.position.x, this.controls.Character.position.y + 5, this.controls.Character.position.z));
    } else if (window.innerWidth > 319) {
      referenceObject.forGame.cameraPosition.copy(new THREE.Vector3(this.controls.Character.position.x - 8, this.controls.Character.position.y + 8, this.controls.Character.position.z + 20));
      referenceObject.forGame.cameraLookat.copy(new THREE.Vector3(this.controls.Character.position.x - 4, this.controls.Character.position.y + 5, this.controls.Character.position.z));
    }


    this.camera.position.copy(referenceObject.forGame.cameraPosition);
    this.camera.lookAt(referenceObject.forGame.cameraLookat.x, referenceObject.forGame.cameraLookat.y, referenceObject.forGame.cameraLookat.z);    


    this._interactionObjects = new interaction({
      wolf: this.controls.Character,
      arraysInteractionObjects: this.arraysInteractionObjects,
      snowTex: this.textures.footprint,
      scene: this.scene,
      branchTexFull: this.textures.branches.full,
      branchTexNotFull: this.textures.branches.notFull,
      sounds: audioPlayer
    });
    this._snowFall = new snowFall({
      scene: this.scene,
      snowfleakTex: this.textures.snowfleak,
      camera: this.camera,
      cub: this.models.cubTwo
    });
    this._sceneCamera = new SceneCamera({
      cameraPosition: referenceObject.forGame.cameraPosition,
      cameraLookat: referenceObject.forGame.cameraLookat,
      camera: this.camera,
      target: this.controls,
    });
    this._personCamera = new PersonCamera({
      cameraPosition: referenceObject.forGame.cameraPosition,
      cameraLookat: referenceObject.forGame.cameraLookat,      
      camera: this.camera,
      target: this.controls,
      arrayMeshCollisionTerrain: this.arrayMeshCollisionTerrain,
    });
    this.tooltips = new Tooltips();
    this._pawScene = new pawScene({
      sounds: audioPlayer,
      models: this.models,
      target: this.controls,
      scene: this.scene,
      camera: this.camera,
      textures: this.textures,
      tooltip: this.tooltips
    });
    this._stepSystem = new stepSystem({
      character: this.controls.Character,
      soundSteps: audioPlayer,
      floor: this.floor,
      footprintTex: this.textures.footprint,
      pawTrailTex: this.textures.pawTrail,
      scene: this.scene
    });
    this._systemOfExhalations = new systemOfExhalations({
      cloudTex: this.textures.footprint,
      wolf: this.controls.Character,
      scene: this.scene,
      target: this.controls.stateMachine
    });
    this._systemOfPickingCubs = new systemOfPickingCubs({
      cubOne: this.models.cubOne,
      cubTwo: this.models.cubTwo,
      cubThree: this.models.cubThree,
      scene: this.scene,
      wolf: this.controls.Character,
      sounds: audioPlayer,
      camera: this.camera,
      phenomeTrees: this.phenomeTrees,
      arraysInteractionPines: this.arraysInteractionObjects.pines,
      arrayTreeObjects: this.arrayTreeObjects,
      tooltip: this.tooltips
    });
    this._exitScene = new exitScene({
      camera: this.camera,
      wolf: this.controls.Character,
      target: this.controls,
      sounds: this.sounds,
      tooltip: this.tooltips,
      scene: this.scene
    });
    // document.addEventListener('click', () => {
    //   console.log(this._renderer.info);
    // });
  }


  _RAF() {
    requestAnimationFrame((t) => {


      if (referenceObject.forGame.gameOut) {
        this._RAF();
        this._howlerVolume = 0;
        this._previousRAF = t;
        return;
      }

      this._RAF();

      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._renderer.render(this.scene, this.camera);

      if (referenceObject.forGame.modelsLoaded) {
        if (this._howlerVolume < 1) {
          this._howlerVolume += ((t - this._previousRAF) * 0.001) * 0.15;
          Howler.volume(this._howlerVolume);
        }
        // this._stats.begin();
        this._UpdateUpdates(t - this._previousRAF);
        // this._stats.end();
      } else {
        if (referenceObject.forGame.countModelsLoad === 0) {
          this._snowFallProgress.Update(100, Number((t - this._previousRAF) * 0.001));
        } else {
          this._snowFallProgress.Update(20 * Math.round(referenceObject.forGame.countModelsLoad), Number((t - this._previousRAF) * 0.001));
        }
      }


      this._previousRAF = t;
    });
  } 


  _UpdateUpdates(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;
    if (Number(timeElapsedS.toFixed(4)) > 0.0167) {
      return;
    }

    if (this._startCallMenu && this._menuTimer < 0.5) {
      this._menuTimer += timeElapsedS;
      if (this._menuTimer > 0.5) {
        const POPUP_MENU = document.querySelector('.game-pop-up');

        if (!POPUP_MENU.classList.contains('_active')) {
          POPUP_MENU.classList.add('_active');
        }

        document.querySelector('.touch-row').classList.toggle('_active');

        this._menuTimer = 0.5;
        this._startCallMenu = false;
      }
    }

    if (this.controls) {
      this.controls.Update(timeElapsedS);
    }
    this._interactionObjects.Update(timeElapsedS);
    if (referenceObject.isMobile) {
      if (touchOnRegion) {
        this._canvasContext.Touch(timeElapsedS, this.controls.input.keys.shift);
      } else {
        this._canvasContext.NoTouch(timeElapsedS, this.controls.input.keys.shift);
      }
    }
    if (referenceObject.forGame.thirdPersonCamera) {
      this._personCamera.Update(timeElapsedS);
    } else {
      this._sceneCamera.Update(timeElapsedS);
    }
    this._snowFall.Update(timeElapsedS);
    this._pawScene.Update(timeElapsedS);
    this._stepSystem.Update(timeElapsedS, this.controls.stateMachine.currentState.Name);
    this._systemOfExhalations.Update(timeElapsedS, this.controls.stateMachine.currentState.Name);
    this._systemOfPickingCubs.Update(timeElapsedS, this.controls.stateMachine.currentState.Name);
    this.tooltips.Update(timeElapsedS);
    this._exitScene.Update(timeElapsedS);

    if (referenceObject.forGame.waningFog && this.scene.fog.density > 0.04) {
      this.scene.fog.density -= 0.001;
    }

    this._totalTime += timeElapsed;
    this._shaders.forEach(s => {    
      s.uniforms.time.value = this._totalTime;
    });

    if (!this.models.cubTwo.model.userData.treePhenomena && !this.scene.userData.fogPhenomaEnd) {
      if (!this.scene.userData.fogPhenoma) {
        this.scene.userData.fogHorizonColor.lerp(this.scene.userData.fogHorizonColorLerp, timeElapsedS);
        this.scene.fog.color.copy(this.scene.userData.fogHorizonColor);
        this.scene.background = this.scene.userData.fogHorizonColor;
      } else {
        this.scene.userData.fogTestColor.copy(this.scene.userData.fogHorizonColor);
        this.scene.userData.fogHorizonColor.lerp(this.scene.userData.fogHorizonColorLerp, timeElapsedS);
        if (this.scene.userData.fogTestColor.equals(this.scene.userData.fogHorizonColor)) {
          this.scene.userData.fogPhenomaEnd = true;
        }
        this.scene.fog.color.copy(this.scene.userData.fogHorizonColor);
        this.scene.background = this.scene.userData.fogHorizonColor;
      }
    }
  }
}


class aboutClass {
  constructor(result) {
    
    document.querySelector('.wrapper').insertAdjacentHTML('afterbegin', `
    <div class="container3dAbout"></div>
    `);

    this._workPlaceData = result.scene.children;

    this.dataAttributes = {
      me: {

      },
      IAmDuringWork: {

      },
      wolf: {

      }
    }

    this._renderer = new THREE.WebGLRenderer({antialias: false});
    this._renderer.setSize(window.innerWidth, window.innerHeight);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.shadowMapAutoUpdate = false;
    this._renderer.shadowMap.enabled = false;
    this._renderer.outputEncoding = THREE.sRGBEncoding;
    document.querySelector('.container3dAbout').appendChild(this._renderer.domElement);

    // document.addEventListener('click', () => {
    //   console.log(this._renderer.info);
    // });


    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth/window.innerHeight, 0.1, 10);
    this.camera.position.set(0, 0.75, 3.65);
    this.camera.lookAt(0, 0, 0);

    this._meData();

    this.models;

    this._aboutTransitionSystem = new aboutTransitionSystem({
      camera: this.camera,
      scene: this.scene,
      dataAttributes: this.dataAttributes,
      this: this
    });
    

    // this._stats = new Stats();
    // this._stats.showPanel(0);
    // document.body.appendChild(this._stats.dom);


    this._previousRAF = null;
    this._RAF();


    window.addEventListener('resize', () => {
      this._renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = this._renderer.domElement.clientWidth / this._renderer.domElement.clientHeight;
      this.camera.updateProjectionMatrix();
    }, false);
  }


  _bufferPosition(model) {
    if (model.isMesh || model.type === 'SkinnedMesh') {

      const bufferAttribute = model.geometry.attributes['position'];

      this._count += bufferAttribute.array.length;

      for (let i = 0; i < bufferAttribute.array.length; i++) {
        this._buffer.push(bufferAttribute.array[i]);
      }
    }
  }


  _Initialize(result) {

    this.models = result.models;
    this.textures = result.textures;

    this._IAmDuringWorkData();
    this._aboutTransitionSystem.objectsLoad();

    setTimeout(() => {
      document.querySelector('.transition-menu').style.height = '25px';
      this._aboutContent = new aboutContent();
    }, 3000);
  }


  _meData() {

    this._buffer = [];
    this._count = 0;

    this._workPlaceData.forEach(model => {

      if (model.isMesh) {
        model.matrixAutoUpdate = false;
        model.updateMatrix();
        model.updateMatrixWorld();

        model.geometry.getAttribute("position").needsUpdate = true;
        model.geometry.applyMatrix4(model.matrixWorld);

        this._bufferPosition(model);
      }
    });

    const floatArray = new Float32Array(this._count);
    floatArray.set(this._buffer, 0);

    const position = new THREE.BufferAttribute( floatArray, 3 );

    this.dataAttributes.me.position = position;
  }


  _OnLoad(animName, anim, model, mixer) {
    const clip = anim;
    const action = mixer.clipAction(clip);
    return {
      clip: clip,
      action: action
    };
  };  


  _IAmDuringWorkData() {

    this._size = [];
    this._colour = [];
    this._buffer = [];
    this._count = 0

    let mixer;
    let animations = [];

    this.models.IAmDuringWork.model.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -1);

    for (let i = 0; i < this.models.IAmDuringWork.model.children.length; i++) {
      const model = this.models.IAmDuringWork.model.children[i];

      model.userData.IAmDuringWork = true;

      if (model.type === 'Object3D') {


        mixer = new THREE.AnimationMixer(model);
        animations[0] = this._OnLoad('idle', this.models.IAmDuringWork.animations[0], 'IAmDuringWork', mixer);

        animations[0].action.play();

        model.traverse(child => {
          if (child.type === 'SkinnedMesh') {

            this.dataAttributes.IAmDuringWork.model = child.parent;
          }
        });
      }

      if (model.type === 'Mesh') {

        model.matrixAutoUpdate = false;
        model.updateMatrix();
        model.updateMatrixWorld();

        model.geometry.applyMatrix4(model.matrixWorld);

        this._bufferPosition(model);
      }
    }

    const floatArray = new Float32Array(this._count);
    floatArray.set(this._buffer, 0);

    const position = new THREE.BufferAttribute( floatArray, 3 );

    this.dataAttributes.IAmDuringWork.position = position;
    this.dataAttributes.IAmDuringWork.mixer = mixer;
    this.dataAttributes.IAmDuringWork.animations = animations;
  }

  _RAF() {
    requestAnimationFrame((t) => {

      if (referenceObject.forAbout.gameOut) {
        this._RAF();
        this._previousRAF = t;
        return;
      }

      this._RAF();

      if (this._previousRAF === null) {
        this._previousRAF = t;
      }

      this._renderer.render(this.scene, this.camera);

      // this._stats.begin();
      this._UpdateUpdates(t - this._previousRAF);
      // this._stats.end();
      this._aboutTransitionSystem.Update(Number((t - this._previousRAF) * 0.001), Math.round(this.dataAttributes.me.position.count * (referenceObject.forAbout.countModelsLoad / 100)));

      this._previousRAF = t;      
    });
  } 


  _UpdateUpdates(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;

    if (Number(timeElapsedS.toFixed(4)) > 0.0167) {
      return;
    }

    if (this._aboutContent) {
      this._aboutContent.canvasUpdate(timeElapsedS);
    }
  }
}


class choiceWindow {
  constructor() {
    const aboutWindow = document.querySelector('.about');
    const gameWindow = document.querySelector('.game');

    const startAbout = this._startAbout;
    const startAboutAgain = this._startAboutAgain;

    const startGame = this._startGame;
    const startGameAgain = this._startGameAgain;

    document.querySelector('.transition-menu').style.height = '0';

    aboutWindow.classList.add('about-hover');
    gameWindow.classList.add('game-hover');

    aboutWindow.style.width = '100%';
    gameWindow.style.width = '100%';

    aboutWindow.style.cursor = 'pointer';
    gameWindow.style.cursor = 'pointer';

    if (referenceObject.data.wolf) {
      this._wolfData();
    }

    function definition(event) {

      if (!event) {
        return;
      }

      if (event.target) {
        event = event.target;
      }
      if (event.isEqualNode(aboutWindow)) {
        if (!referenceObject.forAbout.modelsLoaded) {
          if (referenceObject.isMobile) {
            window.removeEventListener('touchstart', _eventTouchStart);
            window.removeEventListener('touchmove', _eventTouchMove);
            window.removeEventListener('touchend', _eventTouchEnd, {capture: true});
          } else {
            window.removeEventListener('click', _eventClick, {capture: true});
          }
          startAbout();
        } else {
          if (referenceObject.isMobile) {
            window.removeEventListener('touchstart', _eventTouchStart);
            window.removeEventListener('touchmove', _eventTouchMove);
            window.removeEventListener('touchend', _eventTouchEnd, {capture: true});
          } else {
            window.removeEventListener('click', _eventClick, {capture: true});
          }
          startAboutAgain();
        }
        return;
      } else if (event.isEqualNode(gameWindow)) {
        if (!referenceObject.forGame.modelsLoaded) {
          if (referenceObject.isMobile) {
            window.removeEventListener('touchstart', _eventTouchStart);
            window.removeEventListener('touchmove', _eventTouchMove);
            window.removeEventListener('touchend', _eventTouchEnd, {capture: true});
          } else {
            window.removeEventListener('click', _eventClick, {capture: true});
          }
          startGame();
        } else {
          if (referenceObject.isMobile) {
            window.removeEventListener('touchstart', _eventTouchStart);
            window.removeEventListener('touchmove', _eventTouchMove);
            window.removeEventListener('touchend', _eventTouchEnd, {capture: true});
          } else {
            window.removeEventListener('click', _eventClick, {capture: true});
          }
          startGameAgain();
        }
        return;
      } else {
        definition(event.parentNode);
      }
    }

    let touchMoves = false;

    function _eventTouchStart() {
      touchMoves = false;
    }

    function _eventTouchMove() {
      touchMoves = true;
    }

    function _eventTouchEnd(event) {
      if (touchMoves) {
        return;
      }
      definition(event);
    }

    function _eventClick(event) {
      
      definition(event);                 
    }

    if (referenceObject.isMobile) {
      window.addEventListener('touchstart', _eventTouchStart);
      window.addEventListener('touchmove', _eventTouchMove);
      window.addEventListener('touchend', _eventTouchEnd, {capture: true});
    } else {
      window.addEventListener('click', _eventClick, {capture: true});
    }
  }


  _wolfData() {

    let mixer;
    let animation;

    function OnLoad(animName, anim, model, mixer) {
      const clip = anim;
      const action = mixer.clipAction(clip);
      return {
        clip: clip,
        action: action
      };
    }; 

    const model = referenceObject.data.wolf.model;
    model.userData.wolf = true;

    mixer = new THREE.AnimationMixer(model);

    animation = OnLoad('idle', referenceObject.data.wolf.animations[3], 'wolf', mixer);

    animation.action.play();

    referenceObject.data.wolf.model.userData.editorMixer = mixer;
  }


  _startAboutAgain() {
    const aboutBackground = document.querySelector('.about-background');
    const gameWindow = document.querySelector('.game');
    const aboutWindow = document.querySelector('.about');
    const aboutP1 = document.querySelector('.about-p1');

    gameWindow.style.width = '0%';
    aboutWindow.style.width = '100%';

    aboutWindow.classList.remove('about-hover');
    aboutWindow.style.cursor = 'default';

    aboutP1.style.opacity = 0;

    document.querySelector('.tooltips').style.zIndex = 0;

    gameWindow.addEventListener('transitionend', () => {
      aboutP1.style.zIndex = 2;
      gameWindow.style.opacity = 0;

      aboutBackground.style.opacity = 0;
      document.querySelector('.container3dAbout').style.opacity = 1;
      document.querySelector('.wrapper-about').style.display = 'block';
      aboutBackground.addEventListener('transitionend', () => {
        aboutWindow.style.zIndex = 2;
        aboutBackground.style.zIndex = 2;
        document.querySelector('.wrapper').style.height = 'auto';
        document.querySelector('.wrapper-about').style.zIndex = 3;
        document.querySelector('.wrapper-about').style.opacity = 1;
        document.querySelector('.transition-menu').style.height = '25px';
      }, {once: true});
      referenceObject.forAbout.gameOut = false;
    }, {once: true});
  }

  _startAbout() {
    const aboutBackground = document.querySelector('.about-background');
    const gameWindow = document.querySelector('.game');
    const aboutWindow = document.querySelector('.about');
    const aboutP1 = document.querySelector('.about-p1');
    const aboutProgress = document.querySelector('.about-progress');
    const loadingSpinner = document.querySelector('.about-loading-spinner');

    gameWindow.style.width = '0%';
    aboutWindow.style.width = '100%';

    aboutWindow.classList.remove('about-hover');
    aboutWindow.style.cursor = 'default';

    aboutP1.style.opacity = 0;

    document.querySelector('.tooltips').style.zIndex = 0;

    gameWindow.addEventListener('transitionend', async () => {

      const spinnerTimeOut = setTimeout(function() {
        loadingSpinner.classList.toggle('_active');
      }, 3000);

      const arrayImport = [
        import('./libs/three.module.js'),
        import('./aboutData.js'),
        import('./aboutTransitionSystem.js'),
        import('./aboutContent.js'),
        import('./skills.js'),
        import('./libs/DRACOLoader.js'),
        import('./libs/GLTFLoader.js'),
        import('./libs/Stats.js')
      ];
      console.log(arrayImport);
      let allPromises = await Promise.all(arrayImport)
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.log(error);
      });

      THREE = allPromises[0];
      aboutData = allPromises[1].default;
      aboutTransitionSystem = allPromises[2].default;
      aboutContent = allPromises[3].default;
      Skills = allPromises[4].default;
      DRACOLoader = allPromises[5].DRACOLoader;
      GLTFLoader = allPromises[6].GLTFLoader;
      Stats = allPromises[7].default;

      referenceObject.forAbout.cameraLookat = new THREE.Vector3();

      aboutP1.style.zIndex = 2;
      gameWindow.style.opacity = 0;

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('../js/libs/draco/');
      dracoLoader.setDecoderConfig({ type: 'js' });
      dracoLoader.preload();
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      new Promise(resolve => gltfLoader.load('../models/dracoModels/meDraco.glb', resolve)).then(result => {

        const meModel = result;
        if (!referenceObject.data.snowfleak) {
          new Promise(resolve => {

            new THREE.TextureLoader().load( '../pictures/snow.png', resolve );
          }).then((result) => {

            aboutBackground.style.opacity = 0;
            aboutBackground.addEventListener('transitionend', () => {

              aboutWindow.style.zIndex = 2;
              aboutBackground.style.zIndex = -1;
            }, {once: true});

            referenceObject.data.snowfleak = result;
            aboutProgress.style.opacity = 1;

            const modelsThis = new aboutData().Init();
            const fuck = new aboutClass(meModel);

            clearTimeout(spinnerTimeOut);

            if (loadingSpinner.classList.contains('_active')) {
              loadingSpinner.classList.toggle('_active');
            }

            const progressInterval = setInterval(() => {
              document.querySelector('.about-progress_bar div').style.width = referenceObject.forAbout.countModelsLoad + '%';
              if (referenceObject.forAbout.countModelsLoad === 100) {
                aboutProgress.style.opacity = 0;
                aboutProgress.addEventListener('transitionend', () => {aboutProgress.style.zIndex = 2;}, {once: true});
                fuck._Initialize(modelsThis);
                clearInterval(progressInterval);
              }
            }, 100);
          });
        } else {
          aboutBackground.style.opacity = 0;
          aboutBackground.addEventListener('transitionend', () => {
            aboutBackground.style.zIndex = 2;
          }, {once: true});
          aboutProgress.style.opacity = 1;  

          const modelsThis = new aboutData().Init();
          const fuck = new aboutClass(meModel);

          clearTimeout(spinnerTimeOut);

          if (loadingSpinner.classList.contains('_active')) {
            loadingSpinner.classList.toggle('_active');
          }

          const progressInterval = setInterval(() => {
            document.querySelector('.about-progress_bar div').style.width = referenceObject.forAbout.countModelsLoad + '%';
            if (referenceObject.forAbout.countModelsLoad === 100) {
              aboutProgress.style.opacity = 0;
              aboutProgress.addEventListener('transitionend', () => {aboutProgress.style.zIndex = 2;}, {once: true});
              fuck._Initialize(modelsThis);
              clearInterval(progressInterval);
            }
          }, 100);
        }
      });
    }, {once: true});    
  }

  _startGameAgain() {
    const aboutWindow = document.querySelector('.about');
    const gameWindow = document.querySelector('.game');
    const gameP1 = document.querySelector('.game-p1');

    document.documentElement.style.overflowY = 'hidden';
    document.querySelector('.wrapper').style.height = '100%';

    aboutWindow.style.width = '0%';
    gameWindow.style.width = '100%';

    gameP1.style.opacity = 0;

    aboutWindow.addEventListener('transitionend', () => {
      document.querySelector('.content-choice').style.opacity = 0;

      document.querySelector('.content-choice').addEventListener('transitionend', () => {
        referenceObject.forGame.gameOut = false;
        referenceObject.forGame.characterMovement = true;
        referenceObject.forGame.thirdPersonCamera = true;
        document.querySelector('.container3d').style.opacity = 1;
        document.querySelector('.tooltips').style.opacity = 1;
        if (referenceObject.isMobile) {
          document.querySelector('.touch-row').classList.toggle('_active');
        }
      }, {once: true});
    }, {once: true});
  }

  _startGame() {
    const gameBackgroundDiv = document.querySelector('.game-background div');
    const aboutWindow = document.querySelector('.about');
    const gameWindow = document.querySelector('.game');
    const gameP1 = document.querySelector('.game-p1');
    const loadingSpinner = document.querySelector('.game-loading-spinner');

    document.documentElement.style.overflowY = 'hidden';
    document.querySelector('.wrapper').style.height = '100%';

    const img = new Image();

    aboutWindow.style.width = '0%';

    gameWindow.classList.remove('game-hover');
    gameWindow.style.cursor = 'default';

    gameP1.style.opacity = 0;

    aboutWindow.addEventListener('transitionend', async () => {
      aboutWindow.style.opacity = 0;

      const spinnerTimeOut = setTimeout(function() {
        loadingSpinner.classList.toggle('_active');
      }, 3000);

      const arrayImport = [
        import('./libs/three.module.js'),
        import('./libs/ConvexHull.js'),
        import('./sounds.js'),
        import('./gameData.js'),
        import('./systemOfExhalations.js'),
        import('./libs/DRACOLoader.js'),
        import('./libs/GLTFLoader.js'),
        import('./libs/Stats.js'),
        import('./systemOfCamera.js'),
        import('./systemOfSteps.js'),
        import('./touchControls.js'),
        import('./interactionObjects.js'),
        import('./pawScene.js'),
        import('./systemOfPickingCubs.js'),
        import('./snowFall.js'),
        import('./snowFallProgress.js'),
        import('./tooltips.js'),
        import('./exitScene.js'),
        import('./characterControls.js'),
        import('./libs/BufferGeometryUtils.js'),
        import('./systemOfFog.js'),
        import('./libs/howler.core.js')
        // import('./libs/dat.gui.module.js')
      ];

      let allPromises = await Promise.all(arrayImport);

      THREE = allPromises[0];
      ConvexHull = allPromises[1].ConvexHull;
      Sounds = allPromises[2].default;
      gameData = allPromises[3].default;
      systemOfExhalations = allPromises[4].default;
      DRACOLoader = allPromises[5].DRACOLoader;
      GLTFLoader = allPromises[6].GLTFLoader;
      Stats = allPromises[7].default;
      Camera = allPromises[8].Camera;
      PersonCamera = allPromises[8].PersonCamera;
      SceneCamera = allPromises[8].SceneCamera;
      stepSystem = allPromises[9].default;
      BasicCharacterControllerTouch = allPromises[10].BasicCharacterControllerTouch;
      canvasCircle = allPromises[10].canvasCircle;
      TouchControls = allPromises[10].TouchControls;
      touchOnRegion = allPromises[10].touchOnRegion;
      interaction = allPromises[11].default;
      pawScene = allPromises[12].default;
      systemOfPickingCubs = allPromises[13].default;
      snowFall = allPromises[14].default;
      snowFallProgress = allPromises[15].default;
      Tooltips = allPromises[16].default;
      exitScene = allPromises[17].default;
      BasicCharacterController = allPromises[18].default;
      BufferGeometryUtils = allPromises[19].BufferGeometryUtils;



      referenceObject.forGame.cameraLookat = new THREE.Vector3();
      referenceObject.forGame.cameraPosition = new THREE.Vector3();

      img.src = '../pictures/game.jpg';

      img.addEventListener('load', () => {
        if (!referenceObject.data.snowfleak) {
          new Promise(resolve => {
            new THREE.TextureLoader().load( '../pictures/snow.png', resolve );
          }).then((result) => {

            referenceObject.data.snowfleak = result;

            document.querySelector('.game-background').appendChild( img );

            gameBackgroundDiv.style.opacity = 0;

            const gameProgress = document.querySelector('.game-progress');
            gameProgress.style.opacity = 1;

            const modelsThis = new gameData().Init();
            const characterControllerDemo = new CharacterControllerDemo(result);

            clearTimeout(spinnerTimeOut);

            if (loadingSpinner.classList.contains('_active')) {
              loadingSpinner.classList.toggle('_active');
            }

            const progressInterval = setInterval(() => {
              document.querySelector('.game-progress_bar div').style.width = referenceObject.forGame.countModelsLoad + '%';
              // console.log(20 * Math.round(referenceObject.forGame.countModelsLoad));
              if (referenceObject.forGame.countModelsLoad === 100) {
                audioPlayer = new Sounds({sounds: modelsThis.audio});

                document.querySelector('.game-progress_bar').style.opacity = 0;
                if (referenceObject.isMobile) {
                  document.querySelector('.game-progress_p p').innerHTML = 'Tap on screen';
                } else {
                  document.querySelector('.game-progress_p p').innerHTML = 'Click on screen';
                }
                document.querySelector('.game-progress_p').style.opacity = 1;

                let touchMoves = false;

                function _eventTouchStart(event) {
                  touchMoves = false;
                }

                function _eventTouchMove(event) {
                  touchMoves = true;
                }

                function _eventTouchEnd(event) {
                  if (touchMoves) {
                    return;
                  }

                  window.removeEventListener('touchstart', _eventTouchStart);
                  window.removeEventListener('touchmove', _eventTouchMove);
                  window.removeEventListener('touchend', _eventTouchEnd);

                  gameProgress.remove();
                  document.querySelector('.content-choice').style.opacity = 0;

                  setTimeout(() => {

                    characterControllerDemo._Initialize(modelsThis);
                    img.remove();
                    aboutWindow.style.opacity = 1;
                  }, 1000);
                }

                function _eventClick(event) {
                  window.removeEventListener('click', _eventClick);

                  gameProgress.remove();
                  document.querySelector('.content-choice').style.opacity = 0;

                  setTimeout(() => {

                    characterControllerDemo._Initialize(modelsThis);
                    img.remove();
                    aboutWindow.style.opacity = 1;
                  }, 1000);                  
                }

                if (referenceObject.isMobile) {
                  window.addEventListener('touchstart', _eventTouchStart);
                  window.addEventListener('touchmove', _eventTouchMove);
                  window.addEventListener('touchend', _eventTouchEnd);
                } else {
                  window.addEventListener('click', _eventClick);
                }

                clearInterval(progressInterval);
              }
            }, 100);
          });
        } else {
          document.querySelector('.game-background').appendChild( img );

          gameBackgroundDiv.style.opacity = 0;

          const gameProgress = document.querySelector('.game-progress');
          gameProgress.style.opacity = 1;

          const modelsThis = new gameData().Init();
          const characterControllerDemo = new CharacterControllerDemo(referenceObject.data.snowfleak);

          clearTimeout(spinnerTimeOut);

          if (loadingSpinner.classList.contains('_active')) {
            loadingSpinner.classList.toggle('_active');
          }

          const progressInterval = setInterval(() => {
            document.querySelector('.game-progress_bar div').style.width = referenceObject.forGame.countModelsLoad + '%';

            if (referenceObject.forGame.countModelsLoad === 100) {

              audioPlayer = new Sounds({sounds: modelsThis.audio});

              document.querySelector('.game-progress_bar').style.opacity = 0;

              if (referenceObject.isMobile) {
                document.querySelector('.game-progress_p p').innerHTML = 'Tap on screen';
              } else {
                document.querySelector('.game-progress_p p').innerHTML = 'Click on screen';
              }

              document.querySelector('.game-progress_p').style.opacity = 1;

              let touchMoves = false;

              function _eventTouchStart(event) {
                touchMoves = false;
              }

              function _eventTouchMove(event) {
                touchMoves = true;
              }

              function _eventTouchEnd(event) {
                if (touchMoves) {
                  return;
                }

                window.removeEventListener('touchstart', _eventTouchStart);
                window.removeEventListener('touchmove', _eventTouchMove);
                window.removeEventListener('touchend', _eventTouchEnd);

                gameProgress.remove();
                document.querySelector('.content-choice').style.opacity = 0;

                setTimeout(() => {

                  characterControllerDemo._Initialize(modelsThis);
                  img.remove();
                  aboutWindow.style.opacity = 1;
                }, 1000);
              }

              function _eventClick(event) {
                window.removeEventListener('click', _eventClick);

                gameProgress.remove();
                document.querySelector('.content-choice').style.opacity = 0;

                setTimeout(() => {

                  characterControllerDemo._Initialize(modelsThis);
                  img.remove();
                  aboutWindow.style.opacity = 1;
                }, 1000);                  
              }

              if (referenceObject.isMobile) {
                window.addEventListener('touchstart', _eventTouchStart);
                window.addEventListener('touchmove', _eventTouchMove);
                window.addEventListener('touchend', _eventTouchEnd);
              } else {
                window.addEventListener('click', _eventClick);
              }

              clearInterval(progressInterval);
            }
          }, 100);          
        }
      }, {once: true});
    }, {once: true});    
  }
}


function choiceDocument() {
  new choiceWindow();
  
  window.removeEventListener('load', choiceDocument, false);
}
window.addEventListener('load', choiceDocument, false);

// function validBraces(braces){
//   if (braces.length === 0) {
//     return false;
//   }
//   const countOpenSquareBracket = braces.match(/\[/g);
//   const countCloseSquareBracket = braces.match(/\]/g);
//   const countOpenBrace = braces.match(/\{/g);
//   const countCloseBrace = braces.match(/\}/g);
//   const countOpenBracket = braces.match(/\(/g);
//   const countCloseBracket = braces.match(/\)/g);
  
  
//   if (countOpenSquareBracket) {
//     if (!countCloseSquareBracket) {
//       return false;
//     }
//     if (countOpenSquareBracket.length !== countCloseSquareBracket.length) {
//       return false;
//     }
//   }
//   if (countCloseSquareBracket) {
//     if (!countOpenSquareBracket) {
//       return false;
//     }
//     if (countCloseSquareBracket.length !== countOpenSquareBracket.length) {
//       return false;
//     }
//   }
  

//   if (countOpenBrace) {
//     if (!countCloseBrace) {
//       return false;
//     }
//     if (countOpenBrace.length !== countCloseBrace.length) {
//       return false;
//     }
//   }
//   if (countCloseBrace) {
//     if (!countOpenBrace) {
//       return false;
//     }
//     if (countCloseBrace.length !== countOpenBrace.length) {
//       return false;
//     }
//   }
  

//   if (countOpenBracket) {
//     if (!countCloseBracket) {
//       return false;
//     }
//     if (countOpenBracket.length !== countCloseBracket.length) {
//       return false;
//     }
//   }
//   if (countCloseBracket) {
//     if (!countOpenBracket) {
//       return false;
//     }
//     if (countCloseBracket.length !== countOpenBracket.length) {
//       return false;
//     }
//   }
  
  
//   for(let i = 0; i<braces.length; i++) {
//     const litter = braces[i];
//     switch(litter) {
//       case'(':
//         if ((braces.indexOf(')', i) - i) === 1) {
//           continue;
//         }
//         if (braces.indexOf(')', i) !== -1) {
//           if ((braces.indexOf(')', i) - 1) % 2 === 0) {
//             continue;
//           }
//         }
//         console.log(braces.indexOf(')', i) - 1);
//         return false;
//         break;
//       case'[':
//         if ((braces.indexOf(']', i) - i) === 1) {
//           continue;
//         }
//         if (braces.indexOf(']', i) !== -1) {
//           if ((braces.indexOf(']', i) - 1) % 2 === 0) {
//             continue;
//           }
//         }
//         return false;
//         break;
//       case'{':
//         if ((braces.indexOf('}', i) - i) === 1) {
//           continue;
//         }
//         if (braces.indexOf('}', i) !== -1) {
//           if ((braces.indexOf('}', i) - 1) % 2 === 0) {
//             continue;
//           }
//         }
//         return false;
//         break;
//     }
//   }
//   return true;
// }

// console.log(validBraces('(({{[[]]}}))'));

// Правильно определять пару скобок

// Проходить по каждым парным скобкам и проверять, есть ли внутри них еще скобки
// false если внутри пары скобок нечетное количество скобок
// искать от открывающей скобки закрытую и проверять количество скобок внутри

export {referenceObject, choiceWindow};