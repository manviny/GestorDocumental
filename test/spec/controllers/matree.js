'use strict';

describe('Controller: MatreeCtrl', function () {

  // load the controller's module
  beforeEach(module('angularjsAuthTutorialApp'));

  var MatreeCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MatreeCtrl = $controller('MatreeCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MatreeCtrl.awesomeThings.length).toBe(3);
  });
});
