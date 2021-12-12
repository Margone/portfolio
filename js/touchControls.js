let touchOnRegion = false;

class BasicCharacterControllerTouch {
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
      shift: false
    };


    [...document.querySelectorAll('.rightAndleft')].forEach((item) => {
      item.addEventListener('touchstart', (event) => {
        
        switch(item.classList[0]) {
          case('icon-controls-up'):
            item.style.opacity = '1'; 
            this.keys.howl = true;
            break;
          case('icon-controls-right'):
            item.style.opacity = '1'; 
            this.keys.right = true;
            break;
          case('icon-controls-left'):
            item.style.opacity = '1'; 
            this.keys.left = true;
            break;
        }
      })


      item.addEventListener('touchend', (event) => {
        
        switch(item.classList[0]) {
          case('icon-controls-up'):
            item.style.opacity = '0.5';
            this.keys.howl = false;
            break;
          case('icon-controls-right'):
            item.style.opacity = '0.5';
            this.keys.right = false;
            break;
          case('icon-controls-left'):
            item.style.opacity = '0.5';
            this.keys.left = false;
            break;
        }
      })      
    })


    const setterHandlePosition = new TouchControls();


    [...document.querySelectorAll('.regionTouch')].forEach((item) => {
      item.addEventListener('touchstart', (event) => {
        
        let state = setterHandlePosition._position(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
        this.keys.forward = false;
        this.keys.left = false;
        this.keys.right = false;
        this.keys.backward = false;
        this.keys.shift = false;
        this.keys.howl = false;


        if (state[1]) {
          switch(state[0]) {
            case('forward'):
              this.keys.forward = true;
              break;
            case('forward and left'):
              this.keys.forward = true;
              this.keys.left = true;
              break;
            case('forward and right'):
              this.keys.forward = true;
              this.keys.right = true;
              break;
            case('backward'):
              this.keys.backward = true;
              break;
            case('backward and left'):
              this.keys.backward = true;
              this.keys.left = true;
              break;
            case('backward and right'):
              this.keys.backward = true;
              this.keys.right = true;
              break;
          }
          return;
        }


        switch(state[0]) {
          case('forward'):
            this.keys.forward = true;
            this.keys.shift = true;
            break;
          case('forward and left'):
            this.keys.forward = true;
            this.keys.left = true;
            this.keys.shift = true;
            break;
          case('forward and right'):
            this.keys.forward = true;
            this.keys.right = true;
            this.keys.shift = true;
            break;
          case('backward'):
            this.keys.backward = true;
            this.keys.shift = true;
            break;
          case('backward and left'):
            this.keys.backward = true;
            this.keys.left = true;
            this.keys.shift = true;
            break;
          case('backward and right'):
            this.keys.backward = true;
            this.keys.right = true;
            this.keys.shift = true;
            break;
        }
      }, false);


      item.addEventListener('touchmove', (event) => {
        
        let state = setterHandlePosition._position(event.targetTouches[0].pageX, event.targetTouches[0].pageY);
        this.keys.forward = false;
        this.keys.left = false;
        this.keys.right = false;
        this.keys.backward = false;
        this.keys.shift = false;


        if (state[1]) {
          switch(state[0]) {
            case('forward'):
              this.keys.forward = true;
              break;
            case('forward and left'):
              this.keys.forward = true;
              this.keys.left = true;
              break;
            case('forward and right'):
              this.keys.forward = true;
              this.keys.right = true;
              break;
            case('backward'):
              this.keys.backward = true;
              break;
            case('backward and left'):
              this.keys.backward = true;
              this.keys.left = true;
              break;
            case('backward and right'):
              this.keys.backward = true;
              this.keys.right = true;
              break;
          }
          return;
        }


        switch(state[0]) {
          case('forward'):
            this.keys.forward = true;
            this.keys.shift = true;
            break;
          case('forward and left'):
            this.keys.forward = true;
            this.keys.left = true;
            this.keys.shift = true;
            break;
          case('forward and right'):
            this.keys.forward = true;
            this.keys.right = true;
            this.keys.shift = true;
            break;
          case('backward'):
            this.keys.backward = true;
            this.keys.shift = true;
            break;
          case('backward and left'):
            this.keys.backward = true;
            this.keys.left = true;
            this.keys.shift = true;
            break;
          case('backward and right'):
            this.keys.backward = true;
            this.keys.right = true;
            this.keys.shift = true;
            break;
        }
      }, false);


      item.addEventListener('touchend', (event) => {
        
        setterHandlePosition.backup();
        this.keys.forward = false;
        this.keys.left = false;
        this.keys.right = false;
        this.keys.backward = false;
        this.keys.shift = false;
      }, false); 
    });      
  }
}


class canvasCircle {
  constructor() {
    this._init();
  }

  _init() {
    this._ctx;
    let wrapper = document.querySelector('.wrapper');
    wrapper.insertAdjacentHTML('afterbegin', `
    <div class="touch-row">
      <div class="icon-controls-up rightAndleft">
        <img src="./icons/howl.svg" alt="howl">
      </div> 
      <div class="icon-controls-left rightAndleft"></div>        
      <canvas id="touchCircle" class='regionTouch' width="101" height="101"></canvas>
      <div class="icon-controls-right rightAndleft"></div>
      <div class="touch-row_handle regionTouch">
        <div class="handle-around icon-controls-paw">
        </div>
      </div>
    </div>
    `);

    document.querySelector('.touch-row').classList.toggle('_active');

    this._ctx = document.getElementById('touchCircle').getContext('2d');
    this._angle = 0;
    this._rotate = 0;
  }

  Touch(timeElapsed, shift) {

    if (shift) {
      this._rotate += timeElapsed * 3.0;
    } else {
      this._rotate += timeElapsed;
    }


    let angle = this._angle + timeElapsed;


    if (angle >= 0.7) {
      this._ctx.clearRect(0,0,100,100);

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 50, (Math.PI * 2), -(Math.PI / 2), true);
      this._ctx.stroke();
      this._ctx.closePath();    

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 47, (Math.PI / 6) + this._rotate, (Math.PI / 6)  + this._rotate + this._angle, false);
      this._ctx.stroke();
      this._ctx.closePath();

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 47, (( 2 * Math.PI) / 3) + this._rotate, (( 2 * Math.PI) / 3) + this._rotate + this._angle, false);
      this._ctx.stroke();
      this._ctx.closePath();

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 47, (( 7 * Math.PI) / 6) + this._rotate, (( 7 * Math.PI) / 6) + this._rotate + this._angle, false);
      this._ctx.stroke();
      this._ctx.closePath();

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 47, (( 5 * Math.PI) / 3) + this._rotate, (( 5 * Math.PI) / 3) + this._rotate + this._angle, false);
      this._ctx.stroke();
      this._ctx.closePath();
      return;
    }


    this._angle += timeElapsed;

    this._ctx.clearRect(0,0,100,100);

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 50, (Math.PI * 2), -(Math.PI / 2), true);
    this._ctx.stroke();
    this._ctx.closePath();    

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 47, (Math.PI / 6) + this._rotate, (Math.PI / 6)  + this._rotate + this._angle, false);
    this._ctx.stroke();
    this._ctx.closePath();

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 47, (( 2 * Math.PI) / 3) + this._rotate, (( 2 * Math.PI) / 3) + this._rotate + this._angle, false);
    this._ctx.stroke();
    this._ctx.closePath();

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 47, (( 7 * Math.PI) / 6) + this._rotate, (( 7 * Math.PI) / 6) + this._rotate + this._angle, false);
    this._ctx.stroke();
    this._ctx.closePath();

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 47, (( 5 * Math.PI) / 3) + this._rotate, (( 5 * Math.PI) / 3) + this._rotate + this._angle, false);
    this._ctx.stroke();
    this._ctx.closePath();
  }

  NoTouch(timeElapsed, shift) {

    this._rotate -= timeElapsed;


    let angle = this._angle - timeElapsed;


    if (angle < 0) {
      this._ctx.clearRect(0,0,100,100);
      
      this._ctx.beginPath();
      this._ctx.arc(50, 50, 50, (Math.PI * 2), -(Math.PI / 2), true);
      this._ctx.stroke();
      this._ctx.closePath();

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 47, Math.PI / 6, Math.PI / 6, false);
      this._ctx.stroke();
      this._ctx.closePath();

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 47, ( 2 * Math.PI) / 3, ( 2 * Math.PI) / 3, false);
      this._ctx.stroke();
      this._ctx.closePath();

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 47, ( 7 * Math.PI) / 6, ( 7 * Math.PI) / 6, false);
      this._ctx.stroke();
      this._ctx.closePath();

      this._ctx.beginPath();
      this._ctx.arc(50, 50, 47, ( 5 * Math.PI) / 3, ( 5 * Math.PI) / 3, false);
      this._ctx.stroke();
      this._ctx.closePath();      
      return;
    }


    this._angle -= timeElapsed;

    this._ctx.clearRect(0,0,100,100);
    
    this._ctx.beginPath();
    this._ctx.arc(50, 50, 50, (Math.PI * 2), -(Math.PI / 2), true);
    this._ctx.stroke();
    this._ctx.closePath();

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 47, (Math.PI / 6) + this._rotate, (Math.PI / 6) + this._rotate + this._angle, false);
    this._ctx.stroke();
    this._ctx.closePath();

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 47, (( 2 * Math.PI) / 3) + this._rotate, (( 2 * Math.PI) / 3) + this._rotate + this._angle, false);
    this._ctx.stroke();
    this._ctx.closePath();

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 47, (( 7 * Math.PI) / 6) + this._rotate, (( 7 * Math.PI) / 6) + this._rotate + this._angle, false);
    this._ctx.stroke();
    this._ctx.closePath();

    this._ctx.beginPath();
    this._ctx.arc(50, 50, 47, (( 5 * Math.PI) / 3) + this._rotate, (( 5 * Math.PI) / 3) + this._rotate + this._angle, false);
    this._ctx.stroke();
    this._ctx.closePath();
  }
}


class TouchControls {
  constructor() {
    this._init();
  }

  _init() {
    this._circle = document.querySelector('#touchCircle');
    this._handle = document.querySelector('.touch-row_handle');
    this._rightControl = document.querySelector('.icon-controls-right');
    this._leftControl = document.querySelector('.icon-controls-left');
    this._upControl = document.querySelector('.icon-controls-up');

    this._circleData = {};
    this._handleData = {};

    this._circleData.width = this._circle.offsetWidth;
    this._circleData.height = this._circle.offsetHeight;
    this._circleData.position = {
      top: this._circle.offsetTop,
      left: this._circle.offsetLeft
    };
    this._circleData.offset = {
      top: this._circle.getBoundingClientRect().top + pageYOffset,
      left: this._circle.getBoundingClientRect().left + pageXOffset
    }
    this._circleData.radius = this._circleData.width / 2;
    this._circleData.centerX = this._circleData.position.left + this._circleData.radius;
    this._circleData.centerY = this._circleData.position.top + this._circleData.radius;


    this._handleData.width = this._handle.offsetWidth;
    this._handleData.height = this._handle.offsetHeigth;
    this._handleData.radius = this._handleData.width / 2;


    this._circleData.radius = this._circleData.width / 2 - this._handleData.radius + 25;

    document.querySelector('.touch-row').classList.toggle('_active');
  }


  _position(pageX, pageY) {
    if (touchOnRegion == false) {

      this._rightControl.style.opacity = 0;
      this._leftControl.style.opacity = 0;
      this._upControl.style.opacity = 0;
      this._rightControl.style.filter = 'blur(2px)';
      this._leftControl.style.filter = 'blur(2px)';
      this._upControl.style.filter = 'blur(2px)';


      this._leftControl.addEventListener('transitionend', this._visibility, false);

      touchOnRegion = true;
    }

    let newTop = (pageY - this._circleData.offset.top);
    let newLeft = (pageX - this._circleData.offset.left);
    let distance = Math.pow(this._circleData.centerX - newLeft, 2) + Math.pow(this._circleData.centerY - newTop, 2);
    let walk = true;
    let state;


    if (distance >= Math.pow(this._circleData.radius, 2)) {


      let angle = Math.atan2((newTop - this._circleData.centerY), (newLeft - this._circleData.centerX));
      newLeft = (Math.cos(angle) * this._circleData.radius) + this._circleData.centerX;
      newTop = (Math.sin(angle) * this._circleData.radius) + this._circleData.centerY;
      walk = false;
      this._handle.style.color = 'rgb(220,20,60)';

      switch(true) {
        case(-2.1 <= angle && angle <= -1.1):
          state = 'forward';
          break;
        case(1.1 <= angle && angle <= 2.1):
          state = 'backward';
          break;
        case(-1.1 <= angle && angle <= 0):
          state = 'forward and right';
          break;
        case(-2.1 >= angle && angle <= Math.PI):
          state = 'forward and left';
          break;
        case(0 <= angle && angle <= 1.1):
          state = 'backward and left';
          break;
        default:
          state = 'backward and right';
          break;
      }     
    }
    if (distance < Math.pow(this._circleData.radius, 2)) {


      this._handle.style.color = 'rgb(255,69,0)';
      let angle = Math.atan2((newTop - this._circleData.centerY), (newLeft - this._circleData.centerX));     


      switch(true) {
        case(-2.1 <= angle && angle <= -1.1):
          state = 'forward';
          break;
        case(1.1 <= angle && angle <= 2.1):
          state = 'backward';
          break;
        case(-1.1 <= angle && angle <= 0):
          state = 'forward and right';
          break;
        case(-2.1 >= angle && angle <= Math.PI):
          state = 'forward and left';
          break;
        case(0 <= angle && angle <= 1.1):
          state = 'backward and left';
          break;
        default:
          state = 'backward and right';
          break;
      }
    }


    newTop = Math.round(newTop * 10) / 10;
    newLeft = Math.round(newLeft * 10) / 10;
    this._handle.style.top = newTop - this._handleData.radius + 'px';
    this._handle.style.left = newLeft - this._handleData.radius + 'px';


    return [state, walk];
  }

  backup() {
    this._leftControl.removeEventListener('transitionend', this._visibility, false);

    this._handle.style.color = 'black';

    this._rightControl.style.visibility = 'visible';
    this._leftControl.style.visibility = 'visible';
    this._upControl.style.visibility = 'visible';
    this._rightControl.style.opacity = 0.5;
    this._leftControl.style.opacity = 0.5;
    this._upControl.style.opacity = 0.5;
    this._rightControl.style.filter = 'blur(0px)';
    this._leftControl.style.filter = 'blur(0px)';
    this._upControl.style.filter = 'blur(0px)';

    touchOnRegion = false;

    this._handle.style.top = '35px';
    this._handle.style.left = '40px';
  }
}


export {
  BasicCharacterControllerTouch,
  canvasCircle,
  TouchControls,
  touchOnRegion
}