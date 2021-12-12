import * as THREE from './libs/three.module.js';
import {referenceObject} from './index.js';

class Camera {
  constructor(params) {
    this._params = params;
    this._camera = params.camera;
    this._arrayMeshCollisionTerrain = params.arrayMeshCollisionTerrain;

    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();
  }

  _CalculateIdealOffset(distanceToWolf, target) {
    let idealOffset = new THREE.Vector3();
    idealOffset.copy(distanceToWolf);
    idealOffset.applyQuaternion(target.Rotation);
    idealOffset.add(target.Position);
    return idealOffset;
  }

  _CalculateIdealLookat(lookToWolf, target) {
    let idealLookat = new THREE.Vector3(0, 0, 0);
    idealLookat.copy(lookToWolf);
    idealLookat.applyQuaternion(target.Rotation);
    idealLookat.add(target.Position);
    return idealLookat;
  }
}


class PersonCamera extends Camera {
  constructor(parent) {
    super(parent);

    this._cameraPosition = parent.cameraPosition;
    this._cameraLookat = parent.cameraLookat;

    this._currentPosition.copy(this._camera.position);
    this._currentLookat.copy(this._cameraLookat);    

    this._rayConvex = new THREE.Ray();
  }

  Update(timeElapsed) {

    let distanceToWolf = new THREE.Vector3(0, 10, -20),
        lookToWolf;

    if (referenceObject.isMobile) {
      lookToWolf = new THREE.Vector3(0, 1, 10);
    } else {
      lookToWolf = new THREE.Vector3(0, 5, 10);
    }

    let target = this._params.target;

    let idealOffset = this._CalculateIdealOffset(distanceToWolf, target);
    let idealLookat = this._CalculateIdealLookat(lookToWolf, target);

    const t = 4.0 * timeElapsed;
    const oldPosition = new THREE.Vector3().copy(this._camera.position);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat, t);


    this._rayConvex.set(this._currentPosition, new THREE.Vector3(0, 1, 0));
    this._arrayMeshCollisionTerrain.forEach(obb => {
      if (obb.intersectsRay(this._rayConvex)) {
        distanceToWolf.set(distanceToWolf.x, distanceToWolf.y, distanceToWolf.z + 1);
        lookToWolf.set(lookToWolf.x, lookToWolf.y, lookToWolf.z - 0.5);
        function recursion(_currentPosition, _currentLookat, _rayConvex, _CalculateIdealOffset, _CalculateIdealLookat) {
          idealOffset = _CalculateIdealOffset(distanceToWolf, target);
          idealLookat = _CalculateIdealLookat(lookToWolf, target);
          _currentPosition.lerp(idealOffset, t);
          _currentLookat.lerp(idealLookat, t);
          _rayConvex.set(_currentPosition, new THREE.Vector3(0, 1, 0));
          if (obb.intersectsRay(_rayConvex)) {
            distanceToWolf.set(distanceToWolf.x, distanceToWolf.y, distanceToWolf.z + 1);
            lookToWolf.set(lookToWolf.x, lookToWolf.y, lookToWolf.z - 0.25);
            recursion(_currentPosition, _currentLookat, _rayConvex, _CalculateIdealOffset, _CalculateIdealLookat);
          }
          return [_currentPosition, _currentLookat];
        };
        let recursionReturn = recursion(this._currentPosition, this._currentLookat, this._rayConvex, this._CalculateIdealOffset, this._CalculateIdealLookat);
        this._currentPosition.copy(recursionReturn[0]);
        this._currentLookat.copy(recursionReturn[1]);
      }
      return;
    });

    this._camera.userData.oldPosition = oldPosition;
    this._camera.userData.newPosition = this._currentPosition;

    if (this._camera.userData.phenomena && this._camera.userData.phenomenaDuration <= 1.1) {

      if (this._camera.userData.phenomenaDuration >= 0.5) {
        this._currentLookat.add(new THREE.Vector3( Math.random() * (0.5 - (-0.5)) + (-0.5), Math.random() * (0.5 - (-0.5)) + (-0.5), 0 ));
      } else {
        this._currentLookat.add(new THREE.Vector3( Math.random() * (0.25 - (-0.25)) + (-0.25), Math.random() * (0.25 - (-0.25)) + (-0.25), 0 ));
      }

      this._camera.lookAt(this._currentLookat);
      this._camera.position.copy(this._currentPosition);

      this._camera.userData.phenomenaDuration += timeElapsed;
    } else {
      this._camera.position.copy(this._currentPosition);
      this._camera.lookAt(this._currentLookat);
    }
  }
}


class SceneCamera extends Camera {
  constructor(parent) {
    super(parent);
    this._cameraPosition = parent.cameraPosition;
    this._cameraLookat = parent.cameraLookat;
  }

  Update(timeElapsed) {
    let t;

    if (new THREE.Vector3(-188, 5, 188).equals(this._cameraPosition)) {
      t = 0.5 * timeElapsed;
    } else {
      t = 4.0 * timeElapsed;
    }
    const oldPosition = new THREE.Vector3().copy(this._camera.position);


    this._currentPosition.copy(this._camera.position);
    this._currentLookat.copy(this._cameraLookat);

    this._currentPosition.lerp(this._cameraPosition, t);
    this._currentLookat.lerp(this._cameraLookat, t);

    this._camera.userData.oldPosition = oldPosition;
    this._camera.userData.newPosition = this._currentPosition;

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }
}

export {
  Camera,
  PersonCamera,
  SceneCamera
}