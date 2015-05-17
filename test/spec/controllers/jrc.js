'use strict';

describe('Controller: JrcCtrl', function () {

  // load the controller's module
  beforeEach(module('angularjsAuthTutorialApp'));

  var JrcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JrcCtrl = $controller('JrcCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
