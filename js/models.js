/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Game - The class that controls the game
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Constructor
////////////////////////////////////////////////////////
function Game (level) {
  log.info("Setting up game parameters");
  
  this.stage = new PIXI.Stage(0x000000);
  this.renderer = new PIXI.autoDetectRenderer(800,600);
  $("#gameScene").append(this.renderer.view);
  this.actors = [];
  this.player = {};
  this.level = {};
  this.levelDataFromJSON = null;
  
  // Load the level
  ////////////////////
  this.loadLevelFile(level);
};
// Methods
////////////////////////////////////////////////////////
Game.prototype.loadLevelFile = function(level) {
  log.info("Loading level file");
  
  $.getJSON("../../levels/" + level + ".json").done(function(levelData){
    this.levelDataFromJSON = levelData;
    this.preloadLevelAssets();
  }.bind(this)).fail(function(){
    alert("Could not load level");
  });
};

Game.prototype.preloadLevelAssets = function() {
  log.info("Preloading assets");
  var assetsToLoad = [];
  
  // use this.levelDataFromJSON to extract preloadables;
  assetsToLoad.push(this.levelDataFromJSON.player.sprite);
  
  
  var loader = new PIXI.AssetLoader(assetsToLoad, true);
  
  loader.onComplete = this.initializeLevel.bind(this);
  loader.onprogress = this.progress.bind(this);
  loader.load();
};

Game.prototype.initializeLevel = function() {
  log.info("Initializing level");
  this.stage.setBackgroundColor(this.levelDataFromJSON.skyColor);
  this.player = new Player(this.levelDataFromJSON.player); 
  this.player.goto(1);
  this.stage.addChild(this.player);  
  this.startGame();
};

Game.prototype.progress = function (data) {
  
};

Game.prototype.startGame = function() {
  log.info("Starting game loop");
  requestAnimFrame(this.gameLoop.bind(this));
};

Game.prototype.gameLoop = function () {
  requestAnimFrame(this.gameLoop.bind(this));
  this.updateScene();
  this.renderer.render(this.stage);
}

Game.prototype.updateScene = function() {
  this.player.update();
  if (this.player.position.x < 100) {
    this.player.movementState = Player.MOVEMENTSTATES.RIGHT; 
  } 
  
  if (this.player.position.x > 700) {
    this.player.movementState = Player.MOVEMENTSTATES.LEFT; 
  } 
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Player - Player object
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Constructor - Inherits from SpriteAnimation class
////////////////////////////////////////////////////////
function Player(playerData)  {
  log.info("Creating new player");
  this._texture = new PIXI.Texture.fromFrame(playerData.sprite);
  PIXI.SpriteAnimation.call(this, this.texture, 10, 1, 2, true);
  this.scale.x = this.scale.y = 3;
  this.anchor = new PIXI.Point(0.5, 0.5);
  this.position.x = playerData.startPositionX;
  this.position.y = playerData.startPositionY;
  this.maxMovementSpeed = playerData.maxMovementSpeed;
  this.accT = new TransfereValues(playerData.acceleration);
  this._movementSpeed = 0;
  this.movementState = Player.MOVEMENTSTATES.LEFT;
}
Player.MOVEMENTSTATES = { STOPPING: 0, LEFT: 1, RIGHT: 2 };
Player.prototype.constructor = Player;
Player.prototype = Object.create(PIXI.SpriteAnimation.prototype);

// Methods
////////////////////////////////////////////////////////
Player.prototype.update = function() {
  this.handleMovement();
  PIXI.SpriteAnimation.prototype.update.bind(this).call();
};

Player.prototype.handleMovement = function() {
  switch(this.movementState)
  {
  case Player.MOVEMENTSTATES.LEFT:
      this.scale.x = -3;
      this.frameTime = 2 / Math.abs(this.accT.value);
      this.play();
      this.accT.decrease();
      
    break;
  case Player.MOVEMENTSTATES.RIGHT:
      this.scale.x = 3;
      this.frameTime = 2 / Math.abs(this.accT.value);
      this.play();
      this.accT.increase();
      
    break;
  case Player.MOVEMENTSTATES.STOPPING:
      this.stop();
      this.accT.zero();
      
    break;
  default:
    // Intentionally empty
  }
  this._movementSpeed = this.maxMovementSpeed * this.accT.value;
  this.position.x += this._movementSpeed;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// TransfereValue -- TODO concider adding exponential mode
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function TransfereValues( accConst ){
  this._transfereValue = 0;
  this._acc = Math.max(Math.min(accConst,0.25),0.001);
}

Object.defineProperty(TransfereValues.prototype, 'value', {
    get: function() {
          return this._transfereValue;
    }
});

TransfereValues.prototype.zero = function() {
    if (this._transfereValue == 0) { return; }
  
    var _transfereValue1 = this._transfereValue + this._acc;
    var _transfereValue2 = this._transfereValue - this._acc;
    if (Math.abs(_transfereValue1) < Math.abs(_transfereValue2)) {
      this._transfereValue = _transfereValue1
    } else {
      this._transfereValue = _transfereValue2 
    }
    if(this._transfereValue < _this._acc) {
      this._transfereValue = 0; 
    }
};

TransfereValues.prototype.increase = function() {
    if (this._transfereValue == 1.0) { return; }
    this._transfereValue += this._acc;
    this._transfereValue = Math.min(this._transfereValue, 1.0);
};

TransfereValues.prototype.decrease = function() {
    if (this._transfereValue == -1.0) { return; }
    this._transfereValue -= this._acc;
    this._transfereValue = Math.max(this._transfereValue, -1.0);
};