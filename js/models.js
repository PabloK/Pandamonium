/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Game - The class that controls the game
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Constructor
////////////////////////////////////////////////////////
function Game (level) {
  this.stage = new PIXI.Stage(0x66FF99);
  this.renderer = new PIXI.autoDetectRenderer(800,600);
  $("#gameScene").append(this.renderer.view);
  this.objects = [];
  this.actors = [];
  this.player = {};
  this.level = {};
  this.loadLevel(level);
};
// Methods
////////////////////////////////////////////////////////
Game.prototype.loadLevel = function(level) {
  var self = this;
  $.getJSON("../../levels/" + level + ".json").done(function(levelData){
    self.initializeLevel(levelData);
    
    function gameLoop() {
        requestAnimFrame(gameLoop);
        self.updateScene();
        self.renderer.render(self.stage);
    };
    
    log.info("Starting game loop");
    requestAnimFrame(gameLoop);
  }).fail(function(){
    alert("Could not load level");
  });
};

Game.prototype.initializeLevel = function(levelData) {
  this.player = new Player(levelData.player);  
  this.stage.addChild(this.player);
};

Game.prototype.updateScene = function() {
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Player - Player actor
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function Player(playerData)  {
  this.texture = PIXI.Texture.fromImage(playerData.texture);
  PIXI.Sprite.call(this, this.texture);
  this.position.x = playerData.startPositionX;
  this.position.y = playerData.startPositionY;
}
Player.prototype.constructor = Player;
Player.prototype = Object.create(PIXI.Sprite.prototype);
