'use strict';

/**
 * @ngdoc function
 * @name angularjsAuthTutorialApp.controller:BasedatosCtrl
 * @description
 * # BasedatosCtrl
 * Controller of the angularjsAuthTutorialApp
 */
angular.module('angularjsAuthTutorialApp')
  .controller('BasedatosCtrl', function ($scope, dfapi) {


  	/**	
  	*  Genera la BD de Grupo_Panstar
  	*/

	// dfapi.S3_bucketToJSON( bucket_name, 'Grupo_Panstar'); 
    // dfapi.S3_bucketToJSON( bucket_name, 'Palomillas');				// busca que el documento o ruta contenga 'vigilancia'
    dfapi.getBuckets()
    .then(function(response){
    	$scope.buckets = response.resource;
    	console.debug(response);
    });
  

    $scope.rowCollection = [
        {tblName: 'Laurent', tblDate: new Date('1987-05-21')},
        {tblName: 'Blandine', tblDate:  new Date('1987-04-25')},
        {tblName: 'Francoise', tblDate:  new Date('1955-08-27')}
    ];

    $scope.predicates = ['firstName', 'lastName', 'birthDate', 'balance', 'email'];
    $scope.selectedPredicate = $scope.predicates[0];


  });
