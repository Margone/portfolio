import * as THREE from './libs/three.module.js';
import {GLTFLoader} from './libs/GLTFLoader.js';
import {DRACOLoader} from './libs/DRACOLoader.js';
import {referenceObject} from './index.js';


export default class Models {
  constructor() {
  }


  Init() {
    

    this.models = {
      wolf: {

      },
      technologies: {
        list: {

        }
      }
    };
    this.images = {

    };
    this.textures = {
    };
    this.audio = {
    }
       

    this._dracoLoader = new DRACOLoader();
    this._dracoLoader.setDecoderPath('../js/libs/draco/');
    this._dracoLoader.setDecoderConfig({ type: 'js' });
    this._dracoLoader.preload();
    this._gltfLoader = new GLTFLoader();
    this._gltfLoader.setDRACOLoader(this._dracoLoader);


    let arrayPromises = [],
        technologiesPositions;

    if (window.innerWidth <= 600) {
      technologiesPositions = [
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1, -2, 4)
      ];      
    } else {
      technologiesPositions = [
        new THREE.Vector3(-2, -2, 6.5),
        new THREE.Vector3(-1.3, -2, 6.4),
        new THREE.Vector3(-0.75, -2, 5.6),
        new THREE.Vector3(-0.5, -2, 4.75),
        new THREE.Vector3(-1, -2, 4),
        new THREE.Vector3(-1.75, -2, 3.5),
        new THREE.Vector3(-2.75, -2, 3.6),
        new THREE.Vector3(-3.25, -2, 4.25),
        new THREE.Vector3(-4, -2, 5.25),
        new THREE.Vector3(-3, -2, 6.75)
      ];
    }

    arrayPromises.push(
      this._LoadModel('../models/dracoModels/IAmDuringWorkDraco.glb').then(result => {
        this.models.IAmDuringWork = {
          model: result.scene,
          animations: result.animations
        };
      }),

      this._LoadModel('../models/dracoModels/technologiesDraco.glb').then(result => {
        for (let i = 0; i < result.scene.children.length; i++) {

          const MESH = result.scene.children[i];

          MESH.position.copy(technologiesPositions[i]);

          if (window.innerWidth <= 600) {
            MESH.visible = false;
          }

          MESH.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(MESH.position, new THREE.Vector3(0, 0.75, 3.65), new THREE.Vector3(0, 1, 0)));

          if ((window.innerWidth <= 600) && i === 0) {
            this.models.technologies.ex = result.scene.children[9];
            this.models.technologies.current = result.scene.children[0];
          }          

          this.models.technologies.list[`${MESH.name}`] = MESH;
        }
      })      
    );

    arrayPromises.push(
      new Promise(resolve => {
        const meEdit = new Image();

        meEdit.src = '../pictures/meEdit.jpg';

        meEdit.addEventListener('load', () => {
          document.querySelector('.fix-pic_framework').replaceChild(meEdit, document.querySelector('.fix-pic_framework>img'));
          resolve();
        });
      }),
      new Promise(resolve => {
        const telegramMess = new Image();

        telegramMess.src = '../pictures/telegramtest.png';

        telegramMess.addEventListener('load', () => {
          document.querySelector('.telegram-logo').parentNode.replaceChild(telegramMess, document.querySelector('.telegram-logo'));
          telegramMess.classList.add('messenger-logo');
          telegramMess.classList.add('telegram-logo');
          resolve();
        });
      }),
      new Promise(resolve => {
        const InstagramMess = new Image();

        InstagramMess.src = '../pictures/instagramtest.png';

        InstagramMess.addEventListener('load', () => {
          document.querySelector('.instagram-logo').parentNode.replaceChild(InstagramMess, document.querySelector('.instagram-logo'));
          InstagramMess.classList.add('messenger-logo');
          InstagramMess.classList.add('instagram-logo');
          resolve();
        });
      }),
      new Promise(resolve => {
        const sketchfabMess = new Image();

        sketchfabMess.src = '../pictures/sketchfabContact.png';

        sketchfabMess.addEventListener('load', () => {
          document.querySelector('.sketchfab-logo').parentNode.replaceChild(sketchfabMess, document.querySelector('.sketchfab-logo'));
          sketchfabMess.classList.add('messenger-logo');
          sketchfabMess.classList.add('sketchfab-logo');
          resolve();
        });
      }),
      new Promise(resolve => {
        const pointer = new Image();

        pointer.src = '../pictures/pointer.png';

        pointer.addEventListener('load', () => {
          document.querySelector('.rotate-popup-row').replaceChild(pointer, document.querySelector('.rotate-popup-row>img'));
          resolve();
        });
      }),
      new Promise(resolve => {
        const sketchfabExample = new Image();

        sketchfabExample.src = '../pictures/sketchfabExamples.jpg';

        sketchfabExample.addEventListener('load', () => {
          document.querySelector('.sketchfab').replaceChild(sketchfabExample, document.querySelector('.sketchfab>img'));
          resolve();
        });
      }),
      new Promise(resolve => {
        const fdn = new Image();

        fdn.src = '../pictures/fdn.jpg';

        fdn.addEventListener('load', () => {
          document.querySelector('.fdn').replaceChild(fdn, document.querySelector('.fdn>img'));
          resolve();
        });
      })
    )

    let progress = 0;

    arrayPromises.forEach(promise => promise.then(() => progress++));

    const progressInterval = setInterval(() => {
      if (((progress / arrayPromises.length * 100) + 1) != 100) {
        referenceObject.forAbout.countModelsLoad += 1;
      }
      if ((progress / arrayPromises.length * 100) == 100) {
        referenceObject.forAbout.countModelsLoad = progress / arrayPromises.length * 100;
        clearInterval(progressInterval);
      }
    }, 100);
    
    return this;
  }

  LoadTexture(url) {
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