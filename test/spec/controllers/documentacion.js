'use strict';

describe('Controller: DocumentacionCtrl', function () {

  // load the controller's module
  beforeEach(module('angularjsAuthTutorialApp'));

  var DocumentacionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocumentacionCtrl = $controller('DocumentacionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
