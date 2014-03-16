function gameCtrl($scope) {
  
  log.info("Initializing game window");
  $scope.game = new Game(1);
  
   /**
  $scope.moveLeft = function() {
    panda.isMoving = true;
    panda.isTurningLeft = true;
    panda.isTurningRight = false;
  };
  
  $scope.moveRight = function() {
    panda.isMoving = true;
    panda.isTurningRight = true;
    panda.isTurningLeft = false;
  };
  
  $scope.stopMove = function (){
    panda.isMoving = false;
    panda.isTurningLeft = false;
    panda.isTurningRight = false;
  };
  
  $scope.jump = function() {
    if (panda.isJumping) { return; }
    panda.startJump = true;
  }
  
  $scope.stopJump = function() {
    panda.stopJump = true;
  };
  */
}