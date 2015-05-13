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


  		/**
  		 * CONFIGURACION
  		 */
 		var colTitles = { 
 			facturas: ["cliente", "tipo", "año", "trimestre", "documento"], 
 			intervenciones: ["cliente", "tipo", "fecha"], 
 			gastos: ["cliente", "tipo"] 
 		};

 		// Crea botones de tipos de documentos
 		$scope.horasLibres = {};
		Object.keys(colTitles).forEach(function(key) { $scope.horasLibres[key] = false; }); 		
  		
  		// Selecciona un solo elemento de botones de tipos de documentos
		$scope.selectModelo = function(index) {
			Object.keys(colTitles).forEach(function(key) { $scope.horasLibres[key] = false; }); 
			$scope.horasLibres[index] = true;
			$scope.tableTitles = colTitles[index];
		}

  		/**
  		 * Crea Rows a partir de paths
  		 */
  		var creaRows = function (folders, files) {
  			var arrayFolder = [];
  			var arrayFiles = [];

  			$scope.rowCollection = [];

  			// Si el último elemento es una cadena vacia -> folder
  			// _.forEach(folders, function(folder) {
  			// 	console.debug("FOLDER", folder.path.split('/'));
  			// 	arrayFolder = folder.path.split('/');
  			// 	console.debug("arrayFolder",arrayFolder[0]);
  		
  			// 	$scope.rowCollection.push( { 
  			// 		cliente: arrayFolder[0], 
  			// 		tipo: arrayFolder[1], 
  			// 		anyo: arrayFolder[2], 
  			// 		trimestre: arrayFolder[3], 
  			// 		documento: arrayFolder[4] 
  			// 	});
  	
  			// });

      	Object.keys(colTitles).forEach(function(key) {
      		console.debug("Objeto",key);  // facturas | recibos
      		console.debug("Objeto datos",colTitles[key]);  // ["cliente","tipo"]  
		});
      		console.debug("___Object.keys(colTitles)____",Object.keys(colTitles)[0]);  //   primera llave del Objeto




  			// Si el último elemento es contiene datos -> nombre del fichero
  			_.forEach(files, function(file) {

  				arrayFiles = file.path.split('/');				// convierte el path en un array

  				$scope.rowCollection.push( { 
  					cliente: arrayFiles[0], 
  					tipo: arrayFiles[1], 
  					anyo: arrayFiles[2], 
  					trimestre: arrayFiles[3], 
  					documento: arrayFiles[4] 
  				});  				

  			});
  			console.debug("$scope.rowCollection",$scope.rowCollection);
		}



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
            	creaRows(folders, files);
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
