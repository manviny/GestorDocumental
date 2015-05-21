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

  	// Genera la BD de Grupo_Panstar
	// dfapi.S3_bucketToJSON( bucket_name, 'Grupo_Panstar'); 
    dfapi.S3_bucketToJSON( bucket_name, 'Palomillas');				// busca que el documento o ruta contenga 'vigilancia'
  });
