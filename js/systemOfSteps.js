import * as THREE from './libs/three.module.js';
import {referenceObject} from './index.js';

const _stepsVS = `
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

const _stepsFS = `
uniform sampler2D diffuseTexture;

varying vec4 vColour;

void main() {
  gl_FragColor = texture2D(diffuseTexture, gl_PointCoord) * vColour;
}`;

export default class  stepSystem {
  constructor(params) {
    this._wolf = params.character;
    this._soundSteps = params.soundSteps;
    this._floor = params.floor;
    this._footprintTex = params.footprintTex;
    this._pawTrailTex = params.pawTrailTex;
    this._scene = params.scene;
    this._Init();
  }


  _Init() {

    const uniforms = {
      diffuseTexture: {
          value: this._footprintTex
      },
      pointMultiplier: {
          value: window.innerHeight / (2.0 * Math.tan(0.5 * 60.0 * Math.PI / 180.0))
      }
    };
    let fGeometry = new THREE.BufferGeometry(),
        fMaterial = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: _stepsVS,
          fragmentShader: _stepsFS,
          blending: THREE.NormalBlending,
          depthTest: true,
          depthWrite: false,
          vertexColors: true,
          transparent: true, // Изменить rgb на rgba при помощи шейдера и цвет на синеватый (чтобы не сливалось со снегом)
          vertexColors: true
        });

    fGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( [], 3 ) );
    fGeometry.setAttribute('colour', new THREE.Float32BufferAttribute([], 4));
    fGeometry.setAttribute('size', new THREE.Float32BufferAttribute([], 1));

    this._points = new THREE.Points(fGeometry, fMaterial);
    this._points.frustumCulled = false;
    this._scene.add(this._points);
    this._particles = [];
    this._trails = [];

    this._raycaster = new THREE.Raycaster();

    this._pawPosition = new THREE.Vector3();
    this._wolfPosition = new THREE.Vector3();

    this._frontRight;
    this._frontLeft;
    this._backRight;
    this._backLeft;

    this._wolf.children[0].traverse(bone => {
        switch(bone.name) {
          case('frontRPaw003'):
            this._frontRight = bone;
            break;
          case('frontLPaw003'):
            this._frontLeft = bone;
            break;
          case('backRPaw003'):
            this._backRight = bone;
            break;
          case('backLPaw003'):
            this._backLeft = bone;
            break;
        }
    })

    this._paws = {
      walk: [{
        bone: this._frontRight,
        maxPoint: 0.6,
        minPoint: 0.08,
        isTouched: false
      },
      {
        bone: this._frontLeft,
        maxPoint: 0.6,
        minPoint: 0.09,
        isTouched: false
      },
      {
        bone: this._backRight,
        maxPoint: 0.5,
        minPoint: 0.04,
        isTouched: false
      },
      {
        bone: this._backLeft,
        maxPoint: 0.5,
        minPoint: 0.04,
        isTouched: false
      }],
      run: [{
        bone: this._frontRight,
        maxPoint: 0.63,
        minPoint: 0.092,
        isTouched: false
      },
      {
        bone: this._frontLeft,
        maxPoint: 0.69,
        minPoint: 0.092,
        isTouched: false
      },
      {
        bone: this._backRight,
        maxPoint: 1.3,
        minPoint: 0.04,
        isTouched: false
      },
      {
        bone: this._backLeft,
        maxPoint: 1.2,
        minPoint: 0.05,
        isTouched: false
      }],
      turn: [{
        bone: this._frontRight,
        maxPoint: 0.6,
        minPoint: 0.26,
        isTouched: false
      },
      {
        bone: this._frontLeft,
        maxPoint: 0.6,
        minPoint: 0.33,
        isTouched: false
      },
      {
        bone: this._backRight,
        maxPoint: 0.5,
        minPoint: 0.04,
        isTouched: false
      },
      {
        bone: this._backLeft,
        maxPoint: 0.5,
        minPoint: 0.04,
        isTouched: false
      }],         
    }
  }

  _snowClouds(bonePos, currentStateCharacter) {

    this._particles.push({
      position: [bonePos.x, bonePos.y + 0.2, bonePos.z],
      colour: [0.9, 0.9, 0.9, 1],
      size: currentStateCharacter == 'run' ? 1.5 : 1,
      life: 1
    });
  }

  Update(timeInSeconds, currentStateCharacter) {

    if (this._trails.length !== 0) {

      for (let i = 0; i < this._trails.length; i++) {
        const TRAIL = this._trails[i];

        TRAIL.life -= timeInSeconds;

        if (TRAIL.life <= 0) {
          TRAIL.plane.removeFromParent();
          this._trails.splice(i, 1);
        }
      }
    }

    if (this._particles.length != 0) {
      this._particles = this._particles.filter(elem => elem.life > 0);

      let position = [],
          colour = [],
          size = [];

      this._particles.forEach(particle => {
        particle.life -= 4 * timeInSeconds;
        particle.colour[3] = particle.life;

        position.push(...particle.position);
        colour.push(...particle.colour);
        size.push(particle.size);
      });

      this._points.geometry.setAttribute('position', new THREE.Float32BufferAttribute( position, 3));
      this._points.geometry.setAttribute('colour', new THREE.Float32BufferAttribute( colour, 4));
      this._points.geometry.setAttribute('size', new THREE.Float32BufferAttribute( size, 1));

      this._points.geometry.attributes.position.needsUpdate = true;
      this._points.geometry.attributes.colour.needsUpdate = true;
      this._points.geometry.attributes.size.needsUpdate = true;
    }

    if (referenceObject.forGame.characterMovement == false || (currentStateCharacter == 'idle')) {
      return;
    }

    // this._paws.run[3].bone.getWorldPosition(this._pawPosition);
    // this._wolf.getWorldPosition(this._wolfPosition);

    // if ((this._pawPosition.y - this._wolfPosition.y) < this._paws.run[3].minPoint) {
    //   console.log(this._pawPosition.y - this._wolfPosition.y);
    // }

    switch (currentStateCharacter) {
      case('walk'):
        this._paws.walk.forEach((paw) => {   

          paw.bone.getWorldPosition(this._pawPosition);
          this._wolf.getWorldPosition(this._wolfPosition);

          if ((this._pawPosition.y - this._wolfPosition.y) < paw.minPoint && paw.isTouched == false) {
            this._soundSteps.Step('walk');
            paw.isTouched = true;
            if (!referenceObject.forGame.iceFlooring) {
              this._snowClouds(this._pawPosition, currentStateCharacter);
              this._trails.push({
                life: 15,
                plane: new THREE.Mesh( new THREE.PlaneGeometry( 0.25, 0.4 ), new THREE.MeshBasicMaterial({map: this._pawTrailTex, transparent: true, side: THREE.BackSide}) )
              });
              this._scene.add(this._trails[this._trails.length - 1].plane);
              this._raycaster.set(new THREE.Vector3(this._pawPosition.x, this._pawPosition.y + 1, this._pawPosition.z), new THREE.Vector3(0, -1, 0));
              const raycast = this._raycaster.intersectObjects(this._floor)[0];
              this._trails[this._trails.length - 1].plane.position.set(raycast.point.x, raycast.point.y + 0.01, raycast.point.z);
              this._trails[this._trails.length - 1].plane.quaternion.copy(this._wolf.quaternion);
              this._trails[this._trails.length - 1].plane.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2));
            }
          } else if ((this._pawPosition.y - this._wolfPosition.y) > paw.maxPoint && paw.isTouched == true) {
            paw.isTouched = false;
          }
        })
        break;
      case('run'):

        this._paws.run.forEach((paw) => {

          paw.bone.getWorldPosition(this._pawPosition);
          this._wolf.getWorldPosition(this._wolfPosition);

          if ((this._pawPosition.y - this._wolfPosition.y) < paw.minPoint && paw.isTouched == false) {
            this._soundSteps.Step('run');
            paw.isTouched = true;
            if (!referenceObject.forGame.iceFlooring) {
              this._snowClouds(this._pawPosition, currentStateCharacter);
              this._trails.push({
                life: 15,
                plane: new THREE.Mesh( new THREE.PlaneGeometry( 0.25, 0.4 ), new THREE.MeshBasicMaterial({map: this._pawTrailTex, transparent: true, side: THREE.BackSide}) )
              });
              this._scene.add(this._trails[this._trails.length - 1].plane);
              this._raycaster.set(new THREE.Vector3(this._pawPosition.x, this._pawPosition.y + 1, this._pawPosition.z), new THREE.Vector3(0, -1, 0));
              const raycast = this._raycaster.intersectObjects(this._floor)[0];
              this._trails[this._trails.length - 1].plane.position.set(raycast.point.x, raycast.point.y + 0.01, raycast.point.z);
              this._trails[this._trails.length - 1].plane.quaternion.copy(this._wolf.quaternion);
              this._trails[this._trails.length - 1].plane.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2));
            }
          } else if ((this._pawPosition.y - this._wolfPosition.y) > paw.maxPoint && paw.isTouched == true) {
            paw.isTouched = false;
          }
        })
        break;
      case('turnRight'):  
        this._paws.turn.forEach((paw) => {

          paw.bone.getWorldPosition(this._pawPosition);
          this._wolf.getWorldPosition(this._wolfPosition);

          if ((this._pawPosition.y - this._wolfPosition.y) < paw.minPoint && paw.isTouched == false) {
            this._soundSteps.Step('turnRight');
            paw.isTouched = true;
            if (!referenceObject.forGame.iceFlooring) {
              this._snowClouds(this._pawPosition, currentStateCharacter);
              this._trails.push({
                life: 15,
                plane: new THREE.Mesh( new THREE.PlaneGeometry( 0.25, 0.4 ), new THREE.MeshBasicMaterial({map: this._pawTrailTex, transparent: true, side: THREE.BackSide}) )
              });
              this._scene.add(this._trails[this._trails.length - 1].plane);
              this._raycaster.set(new THREE.Vector3(this._pawPosition.x, this._pawPosition.y + 1, this._pawPosition.z), new THREE.Vector3(0, -1, 0));
              const raycast = this._raycaster.intersectObjects(this._floor)[0];
              this._trails[this._trails.length - 1].plane.position.set(raycast.point.x, raycast.point.y + 0.01, raycast.point.z);
              this._trails[this._trails.length - 1].plane.quaternion.copy(this._wolf.quaternion);
              this._trails[this._trails.length - 1].plane.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2));
            }
          } else if ((this._pawPosition.y - this._wolfPosition.y) > paw.maxPoint && paw.isTouched == true) {
            paw.isTouched = false;
          }
        })
        break;
      case('turnLeft'):
        this._paws.turn.forEach((paw) => {

          paw.bone.getWorldPosition(this._pawPosition);
          this._wolf.getWorldPosition(this._wolfPosition);

          if ((this._pawPosition.y - this._wolfPosition.y) < paw.minPoint && paw.isTouched == false) {
            this._soundSteps.Step('turnLeft');
            paw.isTouched = true;
            if (!referenceObject.forGame.iceFlooring) {
              this._snowClouds(this._pawPosition, currentStateCharacter);
              this._trails.push({
                life: 15,
                plane: new THREE.Mesh( new THREE.PlaneGeometry( 0.25, 0.4 ), new THREE.MeshBasicMaterial({map: this._pawTrailTex, transparent: true, side: THREE.BackSide}) )
              });
              this._scene.add(this._trails[this._trails.length - 1].plane);
              this._raycaster.set(new THREE.Vector3(this._pawPosition.x, this._pawPosition.y + 1, this._pawPosition.z), new THREE.Vector3(0, -1, 0));
              const raycast = this._raycaster.intersectObjects(this._floor)[0];
              this._trails[this._trails.length - 1].plane.position.set(raycast.point.x, raycast.point.y + 0.01, raycast.point.z);
              this._trails[this._trails.length - 1].plane.quaternion.copy(this._wolf.quaternion);
              this._trails[this._trails.length - 1].plane.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI/2));
            }
          } else if ((this._pawPosition.y - this._wolfPosition.y) > paw.maxPoint && paw.isTouched == true) {
            paw.isTouched = false;
          }
        })
        break;
    }
  }
}