'use strict';

describe('Controller: DocumentosCtrl', function () {

  // load the controller's module
  beforeEach(module('angularjsAuthTutorialApp'));

  var DocumentosCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocumentosCtrl = $controller('DocumentosCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
