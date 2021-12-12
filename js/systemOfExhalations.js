import * as THREE from './libs/three.module.js';

const _exhalationsVS = `
uniform float pointMultiplier;

attribute float size;
attribute float angle;
attribute vec4 colour;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = size * pointMultiplier / gl_Position.w;

  vAngle = vec2(cos(angle), sin(angle));
  vColour = colour;
}`;

const _exhalationsFS = `
uniform sampler2D diffuseTexture;

varying vec4 vColour;
varying vec2 vAngle;

void main() {
  vec2 coords = (gl_PointCoord - 0.5) * mat2(vAngle.x, vAngle.y, -vAngle.y, vAngle.x) + 0.5;
  gl_FragColor = texture2D(diffuseTexture, coords) * vColour;
}`;

export default class systemOfExhalations {
  constructor(params) {
    this._runningTime = 0;
    this._numberOfExhalations = 4;
    this._wolf = params.wolf;
    this._scene = params.scene;
    this._cloudTex = params.cloudTex;
    this._boneMouthPos = new THREE.Vector3();

    this._wolf.children[0].traverse(bone => {
      if (bone.name == 'lowerJaw') {
        this._boneMouth = bone;
      }
    })

    const uniforms = {
      diffuseTexture: {
          value: this._cloudTex
      },
      pointMultiplier: {
          value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
      }
    };
    let eGeometry = new THREE.BufferGeometry(),
        eMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: _exhalationsVS,
          fragmentShader: _exhalationsFS,
          blending: THREE.NormalBlending,
          depthTest: true,
          depthWrite: false,
          vertexColors: true,
          transparent: true,
          vertexColors: true
        });

    eGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );
    eGeometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    eGeometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));
    eGeometry.setAttribute('angle', new THREE.Float32BufferAttribute([], 1));

    this._points = new THREE.Points(eGeometry, eMaterial);
    this._points.frustumCulled = false;
    this._scene.add(this._points);
    this._particles = [];  
  }


  Update(timeInSeconds, currentStateCharacter) {
    if (this._particles.length != 0) {

      this._particles = this._particles.filter(elem => elem.life > 0);

      let position = [],
          size = [],
          colour = [],
          angle = [];

      this._particles.forEach(particle => {
        particle.position[0] -= 2 * timeInSeconds;
        particle.life -= 0.5 * timeInSeconds;
        particle.size += timeInSeconds;
        particle.angle -= 2 * timeInSeconds;
        particle.colour[3] = particle.life;

        position.push(...particle.position);
        size.push(particle.size);
        angle.push(particle.angle);
        colour.push(...particle.colour);
      });

      this._points.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
      this._points.geometry.setAttribute('size', new THREE.Float32BufferAttribute( size, 1));
      this._points.geometry.setAttribute('colour', new THREE.Float32BufferAttribute( colour, 4));
      this._points.geometry.setAttribute('angle', new THREE.Float32BufferAttribute( angle, 1));

      this._points.geometry.attributes.colour.needsUpdate = true;
      this._points.geometry.attributes.angle.needsUpdate = true;
      this._points.geometry.attributes.size.needsUpdate = true;
      this._points.geometry.attributes.position.needsUpdate = true;
    }

    if (currentStateCharacter == 'run') {
      this._runningTime += timeInSeconds;
      if (this._runningTime >= 10) {
        this._numberOfExhalations = 0;
      }
      return;
    }

    if (this._runningTime != 0) {
      this._runningTime = 0;
    }    

    if (this._numberOfExhalations >= 3) {
      return;
    }

    if (this._particles.length == 1) {
      return;
    }

    this._boneMouth.getWorldPosition(this._boneMouthPos);

    this._particles.push({
      position: [this._boneMouthPos.x, this._boneMouthPos.y, this._boneMouthPos.z],
      life: 1,
      angle: Math.random() * 2.0 * Math.PI,
      size: 0.5,
      colour: [0.9, 0.9, 0.9, 1]
    });

    this._numberOfExhalations += 1;
  }
}