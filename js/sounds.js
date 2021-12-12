import {referenceObject} from './index.js';


export default class Sound {
  constructor(params) {
    this._sounds = params.sounds;
    
    this._Loop();
  }

  _Loop() {

    this._sounds.environments.wind.volume(100);
    this._sounds.environments.wind.loop(true);
    this._sounds.environments.wind.play();
  }

  fallTree() {
    this._sounds.fallTree.volume(0.25);
    this._sounds.fallTree.loop(false);
    this._sounds.fallTree.play();    
  }

  icePhenomena() {
    this._sounds.phenomenas.ice.volume(0.75);
    this._sounds.phenomenas.ice.loop(false);
    this._sounds.phenomenas.ice.play();
  }

  treePhenomena() {
    this._sounds.phenomenas.tree.volume(0.25);
    this._sounds.phenomenas.tree.loop(false);
    this._sounds.phenomenas.tree.play();
  }

  snowCrumbling() {
    let randomNumberSound = Math.round( Math.random() * (2 - 0) + 0 );
    let arraySrc = this._sounds.interactions.snowCrumbling;

    arraySrc[randomNumberSound].loop(false);
    arraySrc[randomNumberSound].volume(0.05);
    arraySrc[randomNumberSound].play();      
  }

  bushRustling() {
    let randomNumberSound = Math.round( Math.random() * (1 - 0) + 0 );
    let arraySrc = this._sounds.interactions.bushRustling;

    arraySrc[randomNumberSound].loop(false);
    arraySrc[randomNumberSound].volume(0.005);
    arraySrc[randomNumberSound].play();     
  }

  Step(state) {
  	let randomNumberSound = Math.round( Math.random() * (3 - 0) + 0 );
  	let arraySrc;
  	if (referenceObject.forGame.iceFlooring) {
  		arraySrc = this._sounds.steps.ice;
  	} else {
  		arraySrc = this._sounds.steps.snow;
  	}

    arraySrc[randomNumberSound].loop(false);
    arraySrc[randomNumberSound].volume(0.05);
    arraySrc[randomNumberSound].rate(state == 'run' ? 1.5 : 1.0);
    arraySrc[randomNumberSound].play();
  }

  Whine(distanceToCub) {
    if (distanceToCub >= 45) {
      return;
    }

    let randomNumberSound = Math.round( Math.random() * (2 - 0) + 0 );
    let arraySrc = this._sounds.whines;

    arraySrc[randomNumberSound].loop(false);
    switch(true) {
      case distanceToCub < 25:
        arraySrc[randomNumberSound].volume(0.09);
        break;
      case distanceToCub < 45:
        arraySrc[randomNumberSound].volume(0.025);
        break;
    }

    arraySrc[randomNumberSound].play();
  }

  Howl() {
    this._sounds.howl.volume(0.5);
    this._sounds.howl.loop(false);
    this._sounds.howl.play();
  }

  Paw() {
    this._sounds.paw.volume(0.5);
    this._sounds.paw.loop(false);
    this._sounds.paw.play();
  }  

  iceCrackle() {
    let randomNumberSound = Math.round( Math.random() );
    let randomNumberVolume = ( Math.round(  Math.random() * (9 - 1) + 1  ) ) / 50;
    let arraySrc = this._sounds.environments.crackleIce;

    arraySrc[randomNumberSound].loop(false);
    arraySrc[randomNumberSound].volume(randomNumberVolume);
    arraySrc[randomNumberSound].play();
  }
}
