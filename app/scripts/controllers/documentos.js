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

        var bucketRecursive = function (n, actualBucket) {

            if (arrayFolders.length > 0) {     										// RECURSIVA FINAL
                									
				getBucketInfo(actualBucket)
				.then(function(response){
					
					arrayFolders = _.rest(arrayFolders);							// quita el path recien leido

					// añade los nuevos paths
					_.forEach(response.folder, function(folder) {
					  	arrayFolders.push(folder.path);
					  	folders.push({ path: folder.path, name: folder.name, nivel: n });
					});

					// añade los ficheros
					_.forEach(response.file, function(file) {
					  	files.push({ path: file.path, name: file.name, nivel: n });
					});		    

				 	bucketRecursive(n+1, arrayFolders[0]);                  		// RECURSIVA SIGUIENTE CASO
				})

            }
            else{ 
            	$scope.folders = folders;
            	$scope.files = files;
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
  		var folders = [];
  		var files = [];
  		arrayFolders.push(bucket_name);
  		console.debug("arrayFolders",arrayFolders);
        
        bucketRecursive(1, arrayFolders[0]);                            					//  RECURSIVA INICIAL






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
