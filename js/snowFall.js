import * as THREE from './libs/three.module.js';

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

export default class snowFall {
	constructor(params) {
		this._scene = params.scene;
		this._snowflakeTex = params.snowfleakTex;
		this._camera = params.camera;
		this._cub = params.cub;

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
        particleCount = 2000,
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
        

    for (let p = 0; p < particleCount; p++) {
      let pX = this._camera.position.x - 15 + Math.random() * (this._camera.position.x + 15 - (this._camera.position.x - 15)),
          pY = this._camera.position.y - 10 + Math.random() * (this._camera.position.y + 10 - (this._camera.position.y - 10)),
          pZ = this._camera.position.z - 15 + Math.random() * (this._camera.position.z + 15 - (this._camera.position.z - 15));
      position.push( pX, pY, pZ );
      size.push(0.2);
      colour.push(this._scene.fog.color.r, this._scene.fog.color.g, this._scene.fog.color.b, 1);
    }

    pGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
    pGeometry.setAttribute( 'size', new THREE.Float32BufferAttribute( size, 1 ) );
    pGeometry.setAttribute( 'colour', new THREE.Float32BufferAttribute( colour, 4 ) );
    this._snowFall = new THREE.Points(pGeometry, pMaterial);
    this._snowFall.frustumCulled = false;
    this._scene.add(this._snowFall);
	}

	Update(timeInSeconds) {

		let position = [],
        colour = [],
        size = [],
        pX,
        pY,
        pZ;

		let geometryAtr = this._snowFall.geometry.getAttribute( 'position' );
		for (let i = 0; i < geometryAtr.count; i++) {

			pX = geometryAtr.getX(i);
			pX = pX - this._camera.userData.oldPosition.x;
			pX = pX + this._camera.userData.newPosition.x;
			if (pX < (this._camera.userData.newPosition.x - 15)) {
				pX = (this._camera.userData.newPosition.x + 15);
			}
			pX -= 0.2;


			pY = geometryAtr.getY(i);
			pY = pY - this._camera.userData.oldPosition.y;
			pY = pY + this._camera.userData.newPosition.y;
			if (pY < (this._camera.userData.newPosition.y - 10)) {
				pY = (this._camera.userData.newPosition.y + 10);
			}
			pY -= 0.1;


			pZ = geometryAtr.getZ(i);
      pZ = pZ - this._camera.userData.oldPosition.z;
      pZ = pZ + this._camera.userData.newPosition.z;

			position.push( pX, pY, pZ);
      colour.push(this._scene.fog.color.r, this._scene.fog.color.g, this._scene.fog.color.b, 1);
      size.push(0.2);
		}

    if (!this._cub.model.userData.treePhenomena && !this._scene.userData.fogPhenomaEnd) {
      this._snowFall.geometry.setAttribute('colour', new THREE.Float32BufferAttribute( colour, 4));
    }
    this._snowFall.geometry.setAttribute('position', new THREE.Float32BufferAttribute( position, 3));
    this._snowFall.geometry.attributes.position.needsUpdate = true;
		this._snowFall.geometry.attributes.colour.needsUpdate = true;
	}
}