/**
 * Created by beenotung on 12/31/15.
 */
angular.module('starter.services')

  .factory('singletonService', function () {
    return {
      chance:new Chance()
    };
  })
