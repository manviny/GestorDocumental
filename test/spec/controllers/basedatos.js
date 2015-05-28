'use strict';

describe('Controller: BasedatosCtrl', function () {

  // load the controller's module
  beforeEach(module('angularjsAuthTutorialApp'));

  var BasedatosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BasedatosCtrl = $controller('BasedatosCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
