'use strict';

/**
 * @ngdoc function
 * @name angularjsAuthTutorialApp.controller:JrcCtrl
 * @description
 * # JrcCtrl
 * Controller of the angularjsAuthTutorialApp
 */
angular.module('angularjsAuthTutorialApp')
  .controller('JrcCtrl', function ($scope, dfapi) {
    
    $scope.rowCollection = [
        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
    ];


    dfapi.S3_bucketToJSON( bucket_name, 'Grupo_Panstar'); 			// bucket_name -> definido en la configuracion de app.js


  });
