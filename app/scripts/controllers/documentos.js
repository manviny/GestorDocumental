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
 			facturas: ["cliente", "asunto", "año", "trimestre", "documento"], 
 			gastos: ["cliente", "asunto", "documento"],
 			intervenciones: ["cliente", "tipo", "fecha"] 
 		};

  		$scope.folders = [];							// carpetas de S3
  		$scope.files = [];								// ficheros de S3

  		var arrayFolders = [];							// contenedor temporal de todos los paths
  		var folders = [];								// contenedor temporal de folders
  		var files = [];									// contenedor temporal de ficheros


 		// Crea botones de tipos de documentos
 		$scope.horasLibres = {};
		Object.keys(colTitles).forEach(function(key) { $scope.horasLibres[key] = false; }); 		
  		


  		// Selecciona un solo elemento de botones de tipos de documentos
		$scope.selectModelo = function(tipo) {
			Object.keys(colTitles).forEach(function(key) { $scope.horasLibres[key] = false; }); 
			$scope.horasLibres[tipo] = true;
			$scope.tableTitles = colTitles[tipo];

			$scope.folders = [];  $scope.files = []; folders = []; files = [];				// borra datos de la tabla
			arrayFolders.push(bucket_name);
			bucketRecursive(1, arrayFolders[0], tipo);                            					//  RECURSIVA INICIAL
		}



  		/**
  		 * Crea Rows a partir de paths
  		 */
  		var creaRows = function (folders, files, tipo) {
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
  console.debug("FFFFFF", colTitles[tipo][0]); 
console.debug("ddddd",colTitles[tipo]);
				
				var este = {};
				colTitles[tipo].forEach(function(col, index){
					console.debug("indes",index);
					var temp = colTitles[tipo][index];
					este[temp] = arrayFiles[index];
					$scope.rowCollection.push(este[temp])
				})
  				// var temp = colTitles[tipo][0];
  				// var temp1 = colTitles[tipo][1];
  				// var este = {};
  				// este[temp] = arrayFiles[0];
  				// este[temp1] = arrayFiles[1];
  				console.debug("este",este);
  				// var el1[temp] =  arrayFiles[0] ;  
  				// colTitles[tipo][0]= '33'; 
  				// el1.push(colTitles);
  				// console.debug("el1",el1);
  				
  				// $scope.rowCollection = este; 
  				// $scope.rowCollection.push( { 
  				// 	este, 
  				// 	tipo: arrayFiles[1], 
  				// 	anyo: arrayFiles[2], 
  				// 	trimestre: arrayFiles[3], 
  				// 	documento: arrayFiles[4] 
  				// });  				

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

        var bucketRecursive = function (n, actualBucket, tipo) {

            if (arrayFolders.length > 0) {     										// RECURSIVA FINAL
                									
				getBucketInfo(actualBucket)
				.then(function(response){
					
					arrayFolders = _.rest(arrayFolders);							// quita el path recien leido

					// añade los nuevos paths si son del tipo seleccionado [factura | gasto | intervencion ]
					_.forEach(response.folder, function(folder) {
					  	arrayFolders.push(folder.path);
					  	if(folder.path.indexOf(tipo) > -1) folders.push({ path: folder.path, name: folder.name, nivel: n });
					});

					// añade los ficheros si son del tipo seleccionado [factura | gasto | intervencion ]
					_.forEach(response.file, function(file) {
						if(file.path.indexOf(tipo) > -1) files.push({ path: file.path, name: file.name, nivel: n });
					});		    

				 	bucketRecursive(n+1, arrayFolders[0], tipo);                  		// RECURSIVA SIGUIENTE CASO
				})

            }
            else{ 
            	$scope.folders = folders;
            	$scope.files = files;
            	creaRows(folders, files, tipo);
              	return;
            }
        }



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
