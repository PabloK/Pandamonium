/////////////////////////////////////////////////////////////////////////////////////////////////////////
// App - Initializes angular support aplication
/////////////////////////////////////////////////////////////////////////////////////////////////////////
'use strict';
log.info("Intializing angular");

var App = angular.module('pandamonium', 
                         ['ngRoute',
                          'ui.keypress',
                          'filters',
                          'ui.bootstrap.tooltip']).
    config(['$routeProvider', function($routeProvider) {
$routeProvider
  .when('/game', {templateUrl: '../templates/game.html', controller: 'gameCtrl'})
  .when('/settings', {templateUrl: '../templates/settings.html', controller: 'settingsCtrl'})
  .otherwise({redirectTo: '/game'});
}]);

App.run(function($rootScope,$q) { 
  
    log.info("Initializing local language");
    $rootScope.languageLoaded = false;
  
    $rootScope.language = LANGUAGE;
    $rootScope.$watch('language', function() {
      
      $rootScope.languageLoaded = false;
      log.info("Requesting language file");
      var scope = $rootScope;
      $.getJSON("../../_locales/" + $rootScope.language + "/messages.json").done(function(data){
        scope.locales = data;
        scope.languageLoaded = true;
      }).fail(function(data){
        console.log(data);
        console.log("error");
      });
      
    }, true);
  
  
    
  
  
    log.info("Initializing rootscope localization function");
    $rootScope.lz = function (string) {
        if (!$rootScope.languageLoaded) {return null;}
        if (typeof $rootScope.locales[string] === 'undefined') {return null;}
        if (typeof $rootScope.locales[string]['message'] === 'undefined') {return null;}
        return $rootScope.locales[string]['message'];
    };
});