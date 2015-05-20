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


	/**
	 * CONFIGURACION
	 */

	var folders = [];							// carpetas de S3
	var files = [];								// ficheros de S3
	var arrayFolders = [];						// contenedor temporal de todos los paths
	var rowCollection = [];





	var S3getFolder = function(bucket, path, $q, DreamFactory){


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


  		/**
  		 * One bucket info, files and folders
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
  		 * Crea Rows a partir de paths
  		 */
  		var pathsToArrays = function (folders, files, tipo) {
  			var arrayFolder = [];
  			var arrayFiles = [];

  			rowCollection = [];

      		/**
      		 * paths de ficheros a arrays (el último elemento es contiene datos -> nombre del fichero)
      		 */
  			_.forEach(files, function(file) {
    			arrayFiles = file.path.split('/');				// convierte el path en un array
				rowCollection.push(arrayFiles)
  			});

  			
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

					  	// COGE folders QUE TENGAN ES SU PATH EL TIPO INDICADO
					  	if(folder.path.indexOf(tipo) > -1) folders.push({ path: folder.path, name: folder.name });
					});

					// añade los ficheros si son del tipo seleccionado [factura | gasto | intervencion ]
					_.forEach(response.file, function(file) {

						// COGE files QUE TENGAN ES SU PATH EL TIPO INDICADO
						if(file.path.indexOf(tipo) > -1) files.push({ path: file.path, name: file.name });
					});		    

				 	bucketRecursive(n+1, arrayFolders[0], tipo);                  		// RECURSIVA SIGUIENTE CASO
				})

            }
            else{ 

            	// pathsToArrays(folders, files, tipo);
            	console.debug("tipo",tipo);
            	console.debug("folders",folders);
            	console.debug("files",files);
            	

              	return ;
            }
        }


        /**
         * Convierte un bucket completo recursivamente a JSON
         * @param {[type]} bucket [nombre del bucket deseado]
         * @param {[type]} tipo   [debe contenerlo en la ruta del bucket]
         */
		var S3_bucketToJSON = function (bucket, tipo) {

			if(_.isUndefined(tipo)) tipo = '/';						// si no se indica tipo se devolveran todos los datos del bucket
			// inicializa
			folders = []; 
			files = [];	// borra datos de la tabla

			arrayFolders.push(bucket);
			bucketRecursive(1, arrayFolders[0], tipo); 


		}

    // Public API here

    return {
        S3getFolder: S3getFolder,
        S3_bucketToJSON, S3_bucketToJSON 						// convierte toda la estructura de un bucket de S3 a  json          
    };  

  });
