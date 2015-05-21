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
	 * 
	 */

	var folders = [];							// carpetas de S3
	var files = [];								// ficheros de S3
	var arrayFolders = [];						// contenedor temporal de todos los paths
	
	// GLOBALES
	$rootScope.rowCollection = [];



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
		      	// console.debug("RESULTADO",result);
		      	deferred.resolve(result);
		      },
		     // Error function
		     function(reject) { console.debug("Reject",reject); deferred.reject('Greeting'); });
		     return deferred.promise
		}


		/**
		 * Writes file to S3 bucket
		 * @param {[type]} bucket_name [description]  jrcnaturalsystems
		 * @param {[type]} name        path+folder of file  _DB/hola.json
		 * @param {[type]} content     content of file  '{"name": "","path": "","content_type": "","metadata": [ ""]}'
		 */
  		var setFileToBucket = function (bucket_name, name, content) {

		     DreamFactory.api.S3.createFile({
		     	container: bucket_name,
		     	file_path: bucket_BD + '/' + name + '.json', 
		     	body: content
		     },
		     // Success function
		      function(result) { 
		      	console.debug("RESULTADO",result);
		      },
		     // Error function
		     function(reject) { console.debug("Reject",reject);  });

		}

		/**
		 * Writes file to S3 bucket
		 * @param {[type]} bucket_name [description]  jrcnaturalsystems
		 * @param {[type]} name        path+folder of file  _DB/hola.json
		 * @param {[type]} content     content of file  '{"name": "","path": "","content_type": "","metadata": [ ""]}'
		 */
  		var getFileFromBucket = function (bucket_name, name) {
			var deferred = $q.defer();
		     DreamFactory.api.S3.getFile({
		     	container: bucket_name,
		     	file_path: bucket_BD + '/' + name + '.json'
		     },
		     // Success function
		      function(result) { 
		      	deferred.resolve(result);
		      },
		     // Error function
		     function(reject) { deferred.reject('No se pudo'); });
 			return deferred.promise
		}


		/**
		 * [Convierte los paths de folders y files a objetos con los nombres 'names']
		 * @param  {[type]} names   ["cliente", "asunto", "año", "trimestre", "documento"]
		 * @param  {[type]} folders all folder paths
		 * @param  {[type]} files   all files paths
		 * @return {[type]}         [description]
		 */
  		var pathsToObject = function (names, folders, files) {
  			console.debug("tt",names);
  			var arrayFolder = [];
  			var arrayFiles = [];

  			$rootScope.rowCollection = [];

      		/**
      		 * Crea Objeto con nombre de cabecera y dato 
      		 * {"Orden":"jrcnaturalsystems","Grupo":"Grupo_Panstar","Empresa":"PNM_Panamar","Tipo Documento":"01-Registro","Año":"2015","Fecha registro":"150114","Documento":"PNM-Panamar_#007-Cucas_Planos-Puntos-Control.pdf"}
      		 */
			_.forEach(files, function(file) {
				arrayFiles = file.path.split('/');				// convierte el path en un array
  				// 1.- este objetos 
    			var este = {};
    			names.forEach(function(col, index){
             		var temp = names[index];
              		este[temp] =  arrayFiles[index];	
    			}) 				
				$rootScope.rowCollection.push(este)
			});	

  			console.debug("$rootScope.rowCollection",$rootScope.rowCollection);
		}



		/**
		 * [bucketRecursive description] ej: bucketRecursive( bucketname, '2015' ) 
		 * @param  {[type]} actualBucket bucket raiz desde el que se leera la estructura
		 * @param  {[type]} tipo         string que debe contener el path para incluirlo en la salida
		 * @return {[type]}              [description]
		 */
        var bucketRecursive = function ( actualBucket, tipo ) {

								
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

				 	bucketRecursive( arrayFolders[0], tipo);                  		// RECURSIVA SIGUIENTE CASO
				})

            }
            else{ 
            	console.debug("FILES",files);
            	console.debug("Folders",folders);

				setFileToBucket(bucket_name, tipo, files); 

            	// pathsToObject(tableTitles.documentos, folders, files);  	
              	return ;
            }

        }


        /**
         * Convierte un bucket completo recursivamente a JSON
         * @param {[type]} bucket [nombre del bucket deseado]
         * @param {[type]} tipo   [debe contenerlo en la ruta del bucket para incluirlo en los resultados] 
         *                        ej: tipo=factura -> /empresa/factura/2015/
         *                        $rootScope.S3_Folders		=>   contendra las carpetas del resultado
         *                        $rootScope.S3_Files	    =>   contendra los ficheros del resultado
         */
		var S3_bucketToJSON = function (bucket, tipo) {

			if(_.isUndefined(tipo)) tipo = '/';						// si no se indica tipo se devolveran todos los datos del bucket
			// inicializa
			folders = []; 
			files = [];	// borra datos de la tabla

			arrayFolders.push(bucket);								// pon el nombre del bucket en el array
			bucketRecursive( arrayFolders[0], tipo )      			// crea json, llama con el nombre del bucket
		
		}


    // Public API here

    return {
        S3getFolder: S3getFolder,
        S3_bucketToJSON, S3_bucketToJSON, 						// convierte toda la estructura de un bucket de S3 a  json          
    	getFileFromBucket: getFileFromBucket
    };  

  });
