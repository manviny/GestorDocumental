'use strict';

/**
 * @ngdoc service
 * @name angularjsAuthTutorialApp.dfapi
 * @description
 * # dfapi
 * Service in the angularjsAuthTutorialApp.
 */
angular.module('angularjsAuthTutorialApp')
  .service('dfapi', function (DreamFactory, $http, $q, $rootScope) {

	// wait for API to be ready
	$rootScope.$on('api:ready', function(event) {
		console.debug('API cargada');
	
	});

	var S3getFolder = function(bucket, path){


       	var deferred = $q.defer(); 
	     // DreamFactory.api.S3.getContainer({container:'lamemoriagrafica/lallosaderanes/imagenes/Els+banys'},
	     DreamFactory.api.S3.getFolder({
	     	container: bucket,
	     	folder_path: path
	     },
	     // Success function
	      function(result) { deferred.resolve(result.file); },
	     // Error function
	     function(reject) { deferred.reject(reject) });	

	     return deferred.promise;	
	}


    // Public API here

    return {
        S3getFolder: S3getFolder              
    };  

  });
