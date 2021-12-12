import * as THREE from './libs/three.module.js';
import {referenceObject} from './index.js';

const _snowFallVS = `
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

const _snowFallFS = `
uniform sampler2D diffuseTexture;

varying vec4 vColour;

void main() {
  gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColour;
}`;

export default class snowFallProgress {
	constructor(params) {
		this._scene = params.scene;
		this._snowflakeTex = params.snowfleakTex;
		this._camera = params.camera;
    
		this._Init();
	}

	_Init() {
    const uniforms = {
      diffuseTexture: {
          value: this._snowflakeTex
      },
      pointMultiplier: {
          value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
      }
    };
    let position = [],
        colour = [],
        size = [],
        particleCount = 0,
        pGeometry = new THREE.BufferGeometry(),
        pMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: _snowFallVS,
          fragmentShader: _snowFallFS,
          blending: THREE.NormalBlending,
          depthTest: true,
          depthWrite: false,
          vertexColors: true,
          transparent: true,
          vertexColors: true
        });

    this._particles = [];
    this._angle = 0;

    // this._fovHorizont = Math.round(this._camera.aspect * this._camera.fov / 2) / 1.5;

    for (let p = 0; p < particleCount; p++) {
      let pX = this._camera.position.x - this._fovHorizont + Math.random() * (this._camera.position.x + this._fovHorizont - (this._camera.position.x - this._fovHorizont)),
          pY = this._camera.position.y - 10 + Math.random() * (this._camera.position.y + 10 - (this._camera.position.y - 10)),
          pZ = this._camera.position.z - 15 + Math.random() * (this._camera.position.z - 10 - (this._camera.position.z - 15));
      position.push( pX, pY, pZ );
      size.push(0.3);
      colour.push(1, 1, 1, 0);

      this._particles.push({
        alpha: 0
      });
    }

    pGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
    pGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( size, 1 ) );
    pGeometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( colour, 4 ) );

    this._snowFall = new THREE.Points(pGeometry, pMaterial);
    this._snowFall.frustumCulled = false;
    this._scene.add(this._snowFall);

    this._snowFall.geometry.attributes.position.needsUpdate = true;
    this._snowFall.geometry.attributes.size.needsUpdate = true;
    this._snowFall.geometry.attributes.colour.needsUpdate = true;

    if (referenceObject.isMobile) {
      document.addEventListener('touchmove', (event) => {
        this._eventTouchMove(event);
      });
      document.addEventListener('touchstart', (event) => {
        this._eventTouchStart(event);
      });
    } else {
      document.addEventListener('mousemove', (event) => {
        this._eventMouseMove(event);
      });
    }
	}

  _eventTouchStart(event) {
    this._angle = (Math.atan2((event.touches[0].pageX - (window.screen.width / 2)), event.touches[0].pageY)) / 10;
    this._angleSign = Math.sign(this._angle);
  }

  _eventTouchMove(event) {
    this._angle = (Math.atan2((event.changedTouches[event.changedTouches.length - 1].pageX - (window.screen.width / 2)), event.changedTouches[event.changedTouches.length - 1].pageY)) / 10;
    this._angleSign = Math.sign(this._angle);
  }

  _eventMouseMove(event) {
    this._angle = (Math.atan2((event.pageX - (window.screen.width / 2)), event.pageY)) / 10;
    this._angleSign = Math.sign(this._angle);
  }

  remove() {
      document.removeEventListener('touchmove', (event) => {
        this._eventTouchMove(event);
      });
      document.removeEventListener('touchstart', (event) => {
        this._eventTouchStart(event);
      });
      document.removeEventListener('mousemove', (event) => {
        this._eventMouseMove(event);
      });
    this._scene.remove(this._snowFall);
  }

	Update(particleCount, timeInSeconds) {

		let position = [],
        colour = [],
        size = [],
        particleNewCount = (particleCount - this._particles.length),
        pX,
        pY,
        pZ;

    let geometryAtr = this._snowFall.geometry.getAttribute('position');
		for (let i = 0; i < geometryAtr.count; i++) {

			pX = geometryAtr.getX(i);
      if (this._angleSign == -1) {
        if (pX < (this._camera.position.x - 25)) {
          pX = (this._camera.position.x + 25);
        }
        pX += this._angle;
      }
      if (this._angleSign == 1) {
        if (pX > (this._camera.position.x + 25)) {
          pX = (this._camera.position.x - 25);
        }
        pX += this._angle;
      }

			pY = geometryAtr.getY(i);
			if (pY < (this._camera.position.y - 10)) {
				pY = (this._camera.position.y + 10);
			}
			pY -= 0.1;

      pZ = geometryAtr.getZ(i);


      if (this._particles[i].alpha < 1) {
        this._particles[i].alpha += timeInSeconds;
      }
      if (this._particles[i].alpha > 1) {
        this._particles[i].alpha = 1;
      }


      position.push(pX, pY, pZ);
      // position.push(this._particles[i].position[0], this._particles[i].position[1], this._particles[i].position[2]);
      colour.push(1, 1, 1, this._particles[i].alpha);
      size.push(0.3);
		}

    while (particleNewCount > 0) {
      particleNewCount -= 1;

      pX = this._camera.position.x - 25 + Math.random() * (this._camera.position.x + 25 - (this._camera.position.x - 25));
      pY = this._camera.position.y - 10 + Math.random() * (this._camera.position.y + 10 - (this._camera.position.y - 10));
      pZ = this._camera.position.z - 20 + Math.random() * (this._camera.position.z - -10 - (this._camera.position.z - 20));

      position.push(pX, pY, pZ);
      colour.push(1, 1, 1, 0);
      size.push(0.3);

      this._particles.push({
        alpha: 0
      });
    }      

    this._snowFall.geometry.setAttribute('colour', new THREE.Float32BufferAttribute( colour, 4));
    this._snowFall.geometry.setAttribute( 'size', new THREE.Float32BufferAttribute( size, 1 ) );
    this._snowFall.geometry.setAttribute('position', new THREE.Float32BufferAttribute( position, 3));
    this._snowFall.geometry.attributes.position.needsUpdate = true;
    this._snowFall.geometry.attributes.size.needsUpdate = true;
		this._snowFall.geometry.attributes.colour.needsUpdate = true;
	}
}