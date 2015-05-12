'use strict';

/**
 * @ngdoc function
 * @name angularjsAuthTutorialApp.controller:DocumentosCtrl
 * @description
 * # DocumentosCtrl
 * Controller of the angularjsAuthTutorialApp
 */
angular.module('angularjsAuthTutorialApp')
  .controller('DocumentosCtrl', function ($scope, dfapi, $q, DreamFactory) {
    $scope.rowCollection = [
        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
    ];
    $scope.rowCollection2 = [
        {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
        {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
        {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
    ];



  		/**
  		 * One bucket info
  		 */
  		
  		var getBucketInfo = function (bucket_name) {
  			console.debug("NOMBRE",bucket_name);
			var deferred = $q.defer();
		     DreamFactory.api.S3.getContainer({
		     	container: bucket_name,
		     	include_files: true
		     },
		     // Success function
		      function(result) { 
		      	console.debug("RESULTADO",result);
		      	deferred.resolve(result);
		      },
		     // Error function
		     function(reject) { console.debug("Reject",reject); deferred.reject('Greeting'); });
		     return deferred.promise
		}



		/**
		 * Inicializa variables
		 * @type {Array}
		 */

        var bucketRecursive = function (actualBucket) {
        	// console.debug(arrayFolders, arrayFolders.length);
            // console.debug("SIZE",arrayFolders.length);
            if (arrayFolders.length > 0) {     										// RECURSIVA FINAL
                									
				getBucketInfo(actualBucket)
				.then(function(response){
					actualBucket = arrayFolders[0].path;

				    arrayFolders = _.rest(arrayFolders);
				    arrayFolders.push(response.folder);
				    arrayFolders = _.flatten(arrayFolders,true);
				    
					$scope.folders.push(response.folder);
					$scope.files.push(response.file);

				 	bucketRecursive(actualBucket);                  				// RECURSIVA SIGUIENTE CASO
    
				})

            }
            else{ 

              return;
 
            }
        }

        /**
         * Inicia la carga de documentos
         * @type {Array}
         */
  		$scope.folders = [];
  		$scope.files = [];

  		var arrayFolders = [];
  		arrayFolders.push({path:bucket_name});
  		console.debug("arrayFolders",arrayFolders);
        
        bucketRecursive(arrayFolders[0].path);                            					//  RECURSIVA INICIAL






  		/**
  		 * All buckets
  		 */
  		
	     // DreamFactory.api.S3.getContainers({
	     // 	// container: bucket,
	     // 	// folder_path: path
	     // },
	     // // Success function
	     //  function(result) { console.debug("Success",result); },
	     // // Error function
	     // function(reject) { console.debug("Success",reject); });	




  });
