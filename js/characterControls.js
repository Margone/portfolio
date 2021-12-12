import * as THREE from './libs/three.module.js';
import {referenceObject} from './index.js';

class BasicCharacterControllerProxy {
  constructor(animations, wolf) {
    this._animations = animations;
    this.wolf = wolf;
  }

  get animations() {
    return this._animations;
  }
};


export default class BasicCharacterController {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {

    this._floor = params.floor;
    this._position = new THREE.Vector3();

    this.wolf = params.models.wolf;
    this._sounds = params.sounds;
    this._scene = params.scene;
    this._turn;
    this._slidingTime = 0;
    this._rayConvex = new THREE.Ray();
    this._arrayTreeObjects = params.arrayTreeObjects;
    this._arrayConvexHull = params.arrayConvexHull;
    this._arrayMeshConvexHull = params.arrayMeshConvexHull;
    this._arrayCubsObjects = params.arrayCubsObjects;
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -10.0);
    this._acceleration = new THREE.Vector3(1, 0.1, 50);
    this._velocity = new THREE.Vector3(0, 0, 0);
    this._oldPosition = new THREE.Vector3();

    this.animations = {};
    this.stateMachine = new CharacterFSM(new BasicCharacterControllerProxy(this.animations, this.wolf.model));
    this.LoadCharacter();
    if (referenceObject.isMobile) {
      const BasicCharacterControllerTouch = params.BasicCharacterControllerTouch;
      this.input = new BasicCharacterControllerTouch();
      return;
    }
    this.input = new BasicCharacterControllerInput();
  }

  LoadCharacter() {

    this._scene.add(this.wolf.model);

    this._mixer = new THREE.AnimationMixer(this.wolf.model);
    const _OnLoad = (animName, anim) => {
      const clip = anim;
      const action = this._mixer.clipAction(clip);
      this.animations[animName] = {
        clip: clip,
        action: action
      };
    };
    _OnLoad('walk', this.wolf.animations[3]);
    _OnLoad('run', this.wolf.animations[1]);
    _OnLoad('idle', this.wolf.animations[0]);
    _OnLoad('wakeUp', this.wolf.animations[2]);
    this.stateMachine.SetState('wakeUp');
  }

  get Character() {
    return this.wolf.model;
  }

  get Position() {
    return this._position;
  }

  get Rotation() {
    if (!this.wolf) {
      return new THREE.Quaternion();
    }
    return this.wolf.model.quaternion;
  }

  DistanceToBrush(controlObject, obb, direction) {
    let raycasterDirect = new THREE.Raycaster();
    let rayDirect = new THREE.Ray();
    const brush = this._arrayMeshConvexHull[this._arrayConvexHull.indexOf(obb)];
    brush.updateMatrixWorld();
    raycasterDirect.set(controlObject.position, direction);
    let pointOnBrush = raycasterDirect.intersectObject(brush, true)[0];
    if (pointOnBrush) {
      rayDirect.set(controlObject.position, direction);
      return rayDirect.distanceToPoint(pointOnBrush.point);
    }
    return false;
  }

  intersectFloor(object3d) {

    let fakePos = new THREE.Vector3().copy(object3d.position);
    fakePos.y += 1;
    let raycaster = new THREE.Raycaster();
    raycaster.set(fakePos, new THREE.Vector3(0, -1, 0));
    const intersects = raycaster.intersectObjects(this._floor);
    if (intersects[0]) {
      object3d.position.y = intersects[0].point.y + 0.08;
      intersects[0].object.name == 'snow' ? referenceObject.forGame.iceFlooring = false : referenceObject.forGame.iceFlooring = true;
      return;
    }
    object3d.position.y = this._floor[0].position.y + 0.08;
    referenceObject.forGame.iceFlooring = false;
  }

  slidingAlongConvex(controlObject, timeInSeconds, oldDirect, obb, velocity) {

    if (this.input.keys.forward) {

      this.A = new THREE.Vector3(0, 1, 0);
      let quaternionLeft = new THREE.Quaternion().setFromAxisAngle(this.A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
      let quaternionRight = new THREE.Quaternion().setFromAxisAngle(this.A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
      let controlObject_backup;


      let L = controlObject.quaternion.clone();
      L.multiply(quaternionLeft);
      controlObject_backup = controlObject.quaternion.clone();
      controlObject.quaternion.copy(L);
      const forward = new THREE.Vector3(0, 0, 1);
      forward.applyQuaternion(controlObject.quaternion);
      forward.normalize();
      forward.multiplyScalar(velocity.z * timeInSeconds);
      const newDirect = this.DistanceToBrush(controlObject, obb, forward);


      if (newDirect === false || oldDirect === false) {
        if (this._turn == 'left') {
          controlObject.updateMatrix();
          controlObject.updateMatrixWorld();
          return;          
        }
        controlObject.quaternion.copy(controlObject_backup);
        this.R = controlObject.quaternion.clone();
        this.R.multiply(quaternionRight);    
        controlObject.quaternion.copy(this.R);
        controlObject.updateMatrix();
        controlObject.updateMatrixWorld();
        return;
      }
      if (newDirect > oldDirect) {
        this._turn = 'left';
        controlObject.updateMatrix();
        controlObject.updateMatrixWorld();
        return;
      }
      this._turn = 'right';
      controlObject.quaternion.copy(controlObject_backup);
      this.R = controlObject.quaternion.clone();
      this.R.multiply(quaternionRight);    
      controlObject.quaternion.copy(this.R);
      controlObject.updateMatrix();
      controlObject.updateMatrixWorld();
    }  
  }

  rotationCharacter(timeInSeconds) {
    if (this.input.keys.left && !(this.stateMachine.currentState.Name === 'howl')) {
      if (this.input.keys.shift && this.input.keys.forward) {
        this.A.set(0, 1, 0);
        this.Q.setFromAxisAngle(this.A, 4.0 * Math.PI * timeInSeconds * (this._acceleration.y + 0.08));
        this.R.multiply(this.Q);

        this.wolf.model.quaternion.copy(this.R);

        this.wolf.model.updateMatrix();
        this.wolf.model.updateMatrixWorld();
      } else {
        this.A.set(0, 1, 0);
        this.Q.setFromAxisAngle(this.A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
        this.R.multiply(this.Q);

        this.wolf.model.quaternion.copy(this.R);

        this.wolf.model.updateMatrix();
        this.wolf.model.updateMatrixWorld();     
      }
    }
    if (this.input.keys.right && !(this.stateMachine.currentState.Name === 'howl')) {
      if (this.input.keys.shift && this.input.keys.forward) {
        this.A.set(0, 1, 0);
        this.Q.setFromAxisAngle(this.A, 4.0 * -Math.PI * timeInSeconds * (this._acceleration.y + 0.08));
        this.R.multiply(this.Q);

        this.wolf.model.quaternion.copy(this.R);

        this.wolf.model.updateMatrix();
        this.wolf.model.updateMatrixWorld();
      } else {
        this.A.set(0, 1, 0);
        this.Q.setFromAxisAngle(this.A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
        this.R.multiply(this.Q);

        this.wolf.model.quaternion.copy(this.R);

        this.wolf.model.updateMatrix();
        this.wolf.model.updateMatrixWorld();
      }
    }
  }

  _Sounds() {
    if (this.stateMachine._timeIdle > 6 && referenceObject.forGame.iceFlooring) {
      this._sounds.iceCrackle();
      this.stateMachine._timeIdle = 0;
    }

    if (this.stateMachine._whineToReady) {
      this._sounds.Howl();
      this.stateMachine._whineToReady = false;
      setTimeout(() => {
        this._sounds.Whine(Math.min(...this._arrayCubsObjects.map(cub => this.wolf.model.position.distanceTo(cub.model.position))));
      }, 3500);
    }    
  }

  Update(timeInSeconds) {


    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }

    if (!this.wolf || referenceObject.forGame.characterMovement === false) {
      return;
    }
    this.stateMachine.Update(timeInSeconds, this.input);

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(Math.abs(frameDecceleration.z), Math.abs(velocity.z));


    if (referenceObject.forGame.iceFlooring && this.input.keys.shift && this.input.keys.forward) {
      this._slidingTime = 1;
    }

    if ((this.input.keys.backward || (this.input.keys.forward && !this.input.keys.shift)) && this._slidingTime > 0 && this.stateMachine._timeWalk > 0.25) {
      this._slidingTime = 0;
    }    

    if (this._slidingTime > 0 && referenceObject.forGame.iceFlooring) {
      velocity.add(new THREE.Vector3(frameDecceleration.x, frameDecceleration.y, frameDecceleration.z + this._slidingTime ));
      this._slidingTime -= 0.5 * timeInSeconds;
    } else {
      velocity.add(frameDecceleration);
    }


    this._oldPosition.copy(this.wolf.model.position);
    this.Q = new THREE.Quaternion();
    this.A = new THREE.Vector3();
    this.R = this.wolf.model.quaternion.clone();


    let acc = this._acceleration.clone();
    if (this.input.keys.shift && !this.input.keys.backward) {
      acc.multiplyScalar(4.0);
    }


    if (this.input.keys.forward && this.stateMachine.currentState.Name !== 'howl') {
      velocity.z += acc.z * timeInSeconds;
    }
    if (this.input.keys.backward && this.stateMachine.currentState.Name !== 'howl') {
      velocity.z -= acc.z * timeInSeconds;
    }

    this.rotationCharacter(timeInSeconds);

    this.intersectFloor(this.wolf.model);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(this.wolf.model.quaternion);
    forward.normalize();
    forward.multiplyScalar(velocity.z * timeInSeconds);

    this.wolf.model.position.add(forward);

	  this.wolf.model.updateMatrix();
	  this.wolf.model.updateMatrixWorld();

    this._position.copy(this.wolf.model.position);

    this._rayConvex.set(this.wolf.model.position, new THREE.Vector3(0, -1, 0));

    this._arrayConvexHull.forEach(obb => {
      if (obb.intersectsRay(this._rayConvex)) {
        this.wolf.model.position.sub(forward);
        const oldDirect = this.DistanceToBrush(this.wolf.model, obb, forward);
        this.slidingAlongConvex(this.wolf.model, timeInSeconds, oldDirect, obb, velocity);
      }
    });

    this._Sounds();
  }
};


class BasicCharacterControllerInput {
  constructor() {
    this._Init();    
  }

  _Init() {

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      howl: false,
      shift: false,
      pause: false
    };
    document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
    document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
  }

  _onKeyDown(event) {
    switch (event.keyCode) {
      case 87: // w
        this.keys.forward = true;
        break;
      case 65: // a
        this.keys.left = true;
        break;
      case 83: // s
        this.keys.backward = true;
        break;
      case 68: // d
        this.keys.right = true;
        break;
      case 72: // howl
        this.keys.howl = true;
        break;
      case 80:
        this.keys.pause = true;
        break;
      case 16: // SHIFT
        this.keys.shift = true;
        break;
    }
  }

  _onKeyUp(event) {
    switch(event.keyCode) {
      case 87: // w
        this.keys.forward = false;
        break;
      case 65: // a
        this.keys.left = false;
        break;
      case 83: // s
        this.keys.backward = false;
        break;
      case 68: // d
        this.keys.right = false;
        break;
      case 72: // howl
        this.keys.howl = false;
        break;
      case 80:
        this.keys.pause = false;
        break;
      case 16: // SHIFT
        this.keys.shift = false;
        break;
    }
  }
};


class FiniteStateMachine {
  constructor() {
    this._states = {};
    this.currentState = null;
  }

  _AddState(name, type) {
    this._states[name] = type;
  }

  SetState(name) {
    const prevState = this.currentState;
    
    if (prevState) {
      if (prevState.Name == name) {
        return;
      }
      prevState.Exit();
    }

    const state = new this._states[name](this);

    this.currentState = state;
    state.Enter(prevState);
  }

  Update(timeElapsed, input) {
    if (this.currentState) {
      this.currentState.Update(timeElapsed, input);
    }
  }
};


class CharacterFSM extends FiniteStateMachine {
  constructor(proxy) {
    super();
    this._proxy = proxy;
    this._Init();
  }

  _Init() {
    this._AddState('idle', IdleState);
    this._AddState('walk', WalkState);
    this._AddState('run', RunState);
    this._AddState('wakeUp', WakeUp);
    this._AddState('turnRight', TurnRight);
    this._AddState('turnLeft', TurnLeft);
    this._AddState('howl', Howl);

    this._neckTurnBack = true;
    this._neckBone = this._proxy.wolf.children[0].children[3].children[2].children[0];
    this._neckUpQ = new THREE.Quaternion().copy(this._neckBone.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.6)));
    this._neckDownQ = new THREE.Quaternion().copy(this._neckBone.quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0.6)));
    this._neckStepQ = new THREE.Quaternion().copy(this._neckBone.quaternion);
    this._neckInitialQ = new THREE.Quaternion().copy(this._neckBone.quaternion);
    this._neckTestQ = new THREE.Quaternion();
    this._howlDuring = 3.6;

    this._timeIdle = 0;
    this._timeWalk = 0;

    this._turnBack = true;
    this._turnInitial = new THREE.Quaternion().copy(this._proxy.wolf.children[0].children[3].quaternion);
    this._slerpQR = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0.6);
    this._slerpQL = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.6);
    this._slerpQN = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), 0);
    this._stepByStepQ = new THREE.Quaternion();
  }
};


class State {
  constructor(parent) {
    this._parent = parent;
  }

  Enter() {}
  Exit() {}
  Update() {}
};

class WakeUp extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'wakeUp';
  }

  Enter() {
    const parent = this._parent;
    const curAction = this._parent._proxy.animations['wakeUp'].action;
    curAction.setLoop(THREE.LoopOnce, 1);
    curAction.play();
    curAction._mixer.addEventListener( 'finished', function( e ) {
      parent.SetState('idle');
      document.querySelector('.game-pop-up').classList.toggle('_active');
      if (referenceObject.isMobile) {
        document.querySelector('.game-pop-up__pc').style.display = 'none';
      } else {
        document.querySelector('.game-pop-up__mobile').style.display = 'none';
      }
      referenceObject.forGame.thirdPersonCamera = true;
      referenceObject.forGame.characterMovement = true;
    });
  }
}


class Howl extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'howl';
  }

  // Во время отсчета задать один кватернион, после истечения времени дать доступ для изначального кватерниона
  Enter(prevState) {
    this._parent._howlDuring = 0;

    if (this._parent._neckTurnBack) {
      this._parent._neckTurnBack = false;
    }    

    if (!this._parent._whineToReady) {
      this._parent._whineToReady = true;
    }
    const idleAction = this._parent._proxy.animations['idle'].action;
    if (prevState) {
      if (prevState.Name.charAt(0) == 'i') {
        return;
      }

      if (prevState.Name.charAt(0) == 't') {
        this._parent._stepByStepQ.copy(this._parent._slerpQN);
        var prevAction = this._parent._proxy.animations['walk'].action;
      } else {
        var prevAction = this._parent._proxy.animations[prevState.Name].action;
      }

      idleAction.enabled = true;

      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  Update(timeElapsed, input) {
    if (input.keys.pause) {
      const POPUP_MENU = document.querySelector('.game-pop-up');

      if (!POPUP_MENU.classList.contains('_active')) {
        POPUP_MENU.classList.add('_active');
      }
    }
    if (this._parent._howlDuring <= 3.5) {
      this._parent._neckStepQ.slerp(this._parent._neckUpQ, timeElapsed * 2);
      this._parent._neckBone.quaternion.copy(this._parent._neckStepQ);
      this._parent._howlDuring += timeElapsed;
      return;
    }

    this._parent.SetState('idle');
  }
}


class TurnLeft extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'turnLeft';
  }

  Enter(prevState) {
    this._parent._proxy.wolf.children[0].children[3].children[2].children[0].quaternion.copy(this._parent._neckStepQ);
    this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
    const curAction = this._parent._proxy.animations['walk'].action;
    if (prevState) {
      const prevAction = this._parent._proxy.animations[prevState.Name].action;

      curAction.enabled = true;

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
    this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input.keys.pause) {
      const POPUP_MENU = document.querySelector('.game-pop-up');

      if (!POPUP_MENU.classList.contains('_active')) {
        POPUP_MENU.classList.add('_active');
      }
    }
    if (input.keys.howl && this._parent._neckTurnBack && !this._parent._proxy.wolf.userData.drags) {
      this._parent.SetState('howl');
      return;
    }
    if (!this._parent._neckTurnBack) {
      this._parent._neckInitialQ.copy(this._parent._neckStepQ);
      this._parent._neckStepQ.slerp(this._parent._neckDownQ, timeElapsed * 2);
      this._parent._neckBone.quaternion.copy(this._parent._neckStepQ);
      if (this._parent._neckInitialQ.equals(this._parent._neckBone.quaternion)) {
        this._parent._neckTurnBack = true;
      }
    }    
    if (input.keys.left) {
      if (input.keys.right) {
        this._parent.SetState('idle');
      }      
      if (input.keys.forward || input.keys.backward) {
        this._parent.SetState('walk');
        if (input.keys.shift) {
          this._parent.SetState('run');
        }
      }
      this._parent._stepByStepQ.copy(this._parent._stepByStepQ.slerp(this._parent._slerpQL, 2 * timeElapsed));
      this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
      if (this._parent._turnBack) {
        this._parent._turnBack = false;
      }
      return;
    }
    this._parent.SetState('idle');
    // this._parent._proxy.wolf.children[0].children[3].quaternion.slerp(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.5));
    // this._parent._proxy.animations.idle.action._mixer._root.children[0].children[3].children[2].quaternion.slerp(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -0.05));
  }
}


class TurnRight extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'turnRight';
  }

  Enter(prevState) {
    this._parent._proxy.wolf.children[0].children[3].children[2].children[0].quaternion.copy(this._parent._neckStepQ);
    this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
    const curAction = this._parent._proxy.animations['walk'].action;
    if (prevState) {
      const prevAction = this._parent._proxy.animations[prevState.Name].action;

      curAction.enabled = true;

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input.keys.pause) {
      const POPUP_MENU = document.querySelector('.game-pop-up');

      if (!POPUP_MENU.classList.contains('_active')) {
        POPUP_MENU.classList.add('_active');
      }
    }
    if (input.keys.howl && this._parent._neckTurnBack && !this._parent._proxy.wolf.userData.drags) {
      this._parent.SetState('howl');
      return;
    }
    if (!this._parent._neckTurnBack) {
      this._parent._neckInitialQ.copy(this._parent._neckStepQ);
      this._parent._neckStepQ.slerp(this._parent._neckDownQ, timeElapsed * 2);
      this._parent._neckBone.quaternion.copy(this._parent._neckStepQ);
      if (this._parent._neckInitialQ.equals(this._parent._neckBone.quaternion)) {
        this._parent._neckTurnBack = true;
      }
    }    
    if (input.keys.right) {
      if (input.keys.left) {
        this._parent.SetState('idle');
      }
      if (input.keys.forward || input.keys.backward) {
        this._parent.SetState('walk');
        if (input.keys.shift) {
          this._parent.SetState('run');
        }
      }
      this._parent._stepByStepQ.copy(this._parent._stepByStepQ.slerp(this._parent._slerpQR, 2 * timeElapsed));
      this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
      if (this._parent._turnBack) {
        this._parent._turnBack = false;
      }
      return;
    }
    this._parent.SetState('idle');
  }
}


class WalkState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'walk';
  }

  Enter(prevState) {
    this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
    this._parent._proxy.wolf.children[0].children[3].children[2].children[0].quaternion.copy(this._parent._neckStepQ);

    const curAction = this._parent._proxy.animations['walk'].action;
    if (prevState && !(prevState.Name.charAt(0) == 't')) {
      const prevAction = this._parent._proxy.animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'run') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      this._parent._stepByStepQ.copy(this._parent._slerpQN);
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input.keys.pause) {
      const POPUP_MENU = document.querySelector('.game-pop-up');

      if (!POPUP_MENU.classList.contains('_active')) {
        POPUP_MENU.classList.add('_active');
      }
    }
    if (input.keys.howl && this._parent._neckTurnBack && !this._parent._proxy.wolf.userData.drags) {
      this._parent.SetState('howl');
      return;
    }
    if (!this._parent._neckTurnBack) {
      this._parent._neckInitialQ.copy(this._parent._neckStepQ);
      this._parent._neckStepQ.slerp(this._parent._neckDownQ, timeElapsed * 2);
      this._parent._neckBone.quaternion.copy(this._parent._neckStepQ);
      if (this._parent._neckInitialQ.equals(this._parent._neckBone.quaternion)) {
        this._parent._neckTurnBack = true;
      }
    }    
    if (input.keys.forward && input.keys.backward) {
      this._parent._timeWalk = 0;
      this._parent.SetState('idle');
    }    
    if (input.keys.forward || input.keys.backward) {
      if (input.keys.shift && input.keys.forward) {
        this._parent._timeWalk = 0;
        this._parent.SetState('run');
      }
      this._parent._timeWalk += timeElapsed;
      return;
    }

    this._parent._timeWalk = 0;
    this._parent.SetState('idle');
  }
};


class RunState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'run';
  }

  Enter(prevState) {
    this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
    this._parent._proxy.wolf.children[0].children[3].children[2].children[0].quaternion.copy(this._parent._neckStepQ);

    const curAction = this._parent._proxy.animations['run'].action;
    if (prevState) {

      if (prevState.Name.charAt(0) == 't') {
        this._parent._stepByStepQ.copy(this._parent._slerpQN);
      }

      const prevAction = this._parent._proxy.animations[prevState.Name].action;

      curAction.enabled = true;

      if (prevState.Name == 'walk') {
        const ratio = curAction.getClip().duration / prevAction.getClip().duration;
        curAction.time = prevAction.time * ratio;
      } else {
        curAction.time = 0.0;
        curAction.setEffectiveTimeScale(1.0);
        curAction.setEffectiveWeight(1.0);
      }

      curAction.crossFadeFrom(prevAction, 0.5, true);
      curAction.play();
    } else {
      curAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input.keys.pause) {
      const POPUP_MENU = document.querySelector('.game-pop-up');

      if (!POPUP_MENU.classList.contains('_active')) {
        POPUP_MENU.classList.add('_active');
      }
    }
    if (input.keys.howl && this._parent._neckTurnBack && !this._parent._proxy.wolf.userData.drags) {
      this._parent.SetState('howl');
      return;
    }
    if (!this._parent._neckTurnBack) {
      this._parent._neckInitialQ.copy(this._parent._neckStepQ);
      this._parent._neckStepQ.slerp(this._parent._neckDownQ, timeElapsed * 2);
      this._parent._neckBone.quaternion.copy(this._parent._neckStepQ);
      if (this._parent._neckInitialQ.equals(this._parent._neckBone.quaternion)) {
        this._parent._neckTurnBack = true;
      }
    }    
    if (input.keys.forward && input.keys.backward) {
      this._parent.SetState('idle');
    }
    if (input.keys.forward) {
      if (!input.keys.shift) {
        this._parent.SetState('walk');
      }
      return;
    }
    this._parent.SetState('idle');
  }
};


class IdleState extends State {
  constructor(parent) {
    super(parent);
  }

  get Name() {
    return 'idle';
  }

  Enter(prevState) {
    this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
    this._parent._proxy.wolf.children[0].children[3].children[2].children[0].quaternion.copy(this._parent._neckStepQ);

    const idleAction = this._parent._proxy.animations['idle'].action;
    if (prevState) {
      if (prevState.Name.charAt(0) == 't') {
        const prevAction = this._parent._proxy.animations['walk'].action;
        idleAction.time = 0.0;
        idleAction.enabled = true;
        idleAction.setEffectiveTimeScale(1.0);
        idleAction.setEffectiveWeight(1.0);
        idleAction.crossFadeFrom(prevAction, 0.5, true);
        idleAction.play();
        return;
      }
      if (prevState.Name.charAt(0) == 'h') {
        return;
      }      
      const prevAction = this._parent._proxy.animations[prevState.Name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  Exit() {
  }

  Update(timeElapsed, input) {
    if (input.keys.pause) {
      const POPUP_MENU = document.querySelector('.game-pop-up');

      if (!POPUP_MENU.classList.contains('_active')) {
        POPUP_MENU.classList.add('_active');
      }
    }
    if (input.keys.howl && this._parent._neckTurnBack && !this._parent._proxy.wolf.userData.drags) {
      this._parent.SetState('howl');
      return;
    }
    if (!this._parent._neckTurnBack) {
      this._parent._neckInitialQ.copy(this._parent._neckStepQ);
      this._parent._neckStepQ.slerp(this._parent._neckDownQ, timeElapsed * 2);
      this._parent._neckBone.quaternion.copy(this._parent._neckStepQ);
      if (this._parent._neckInitialQ.equals(this._parent._neckBone.quaternion)) {
        this._parent._neckTurnBack = true;
      }
    }
    if (!this._parent._turnBack) {
      this._parent._turnInitial.copy(this._parent._stepByStepQ);
      this._parent._stepByStepQ.copy(this._parent._stepByStepQ.slerp(this._parent._slerpQN, 3 * timeElapsed));
      this._parent._proxy.wolf.children[0].children[3].quaternion.copy(this._parent._stepByStepQ);
      if (this._parent._turnInitial.equals(this._parent._stepByStepQ)) {
        this._parent._turnBack = true;
      }
    }
    if (input.keys.forward || input.keys.backward) {
      if (input.keys.forward && input.keys.backward) {
        this._parent._timeIdle += timeElapsed;
        return;
      }
      this._parent._timeIdle = 0;
      this._parent.SetState('walk');
    } else if (input.keys.right) {
      if (input.keys.left) {
        this._parent._timeIdle += timeElapsed;
        return;
      }
      this._parent._timeIdle = 0;
      this._parent.SetState('turnRight');
    } else if (input.keys.left) {
      if (input.keys.right) {
        this._parent._timeIdle += timeElapsed;
        return;
      }
      this._parent._timeIdle = 0;
      this._parent.SetState('turnLeft');
    }
    this._parent._timeIdle += timeElapsed;
  }
};