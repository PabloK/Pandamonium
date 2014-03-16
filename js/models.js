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
  this.objects = [];
  this.actors = [];
  this.player = {};
  this.level = {};
  this.levelDataFromJSON = null;
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
  console.log(this.player);
  this.startGame();
};

Game.prototype.progress = function (data) {
  console.log(data);
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
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Player - Player actor
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function Player(playerData)  {
  log.info("Creating new player");
  this._texture = new PIXI.Texture.fromFrame(playerData.sprite);
  PIXI.SpriteAnimation.call(this, this.texture, 10, 1, 30, true);
  this.scale.x = this.scale.y = 3;
  this.position.x = playerData.startPositionX;
  this.position.y = playerData.startPositionY;
}
Player.prototype.constructor = Player;
Player.prototype = Object.create(PIXI.SpriteAnimation.prototype);