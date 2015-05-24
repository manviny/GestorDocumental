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
	var apiReady = false;
	$rootScope.$on('api:ready', function(event) {
		console.debug('API cargada');
		apiReady = true;
	});


	/**
	 * CONFIGURACION
	 * 
	 */

	var folders = [];							// carpetas de S3
	var files = [];								// ficheros de S3
	var arrayFolders = [];						// contenedor temporal de todos los paths
	var selectedBucket = '';
	
	// GLOBALES
	$rootScope.rowCollection = [];


	var setBucket = function(name){
		selectedBucket = name;
	}

	var getBucket = function(){
		return selectedBucket;
	}


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
  		 * One bucket info, get bucket files and folders
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
  		*	Get all buckets in my S3
  		*/
  		var getBuckets = function () {
			var deferred = $q.defer();

			// carga buckets solo cuando la api esta disponible y no antes
			$rootScope.$on('api:ready', function(event) {
				DreamFactory.api.S3.getResources( function(result) { 
					// quita el bucket de BD, no es necesario verlo en el frontend

					// bucket_BD
					deferred.resolve(result); 

				});
			});

		    return deferred.promise
		}


		/**
		 * Writes file to S3 bucket
		 * @param {[type]} bucket_name [description]  jrcnaturalsystems
		 * @param {[type]} name        path+folder of file  _DB/hola.json
		 * @param {[type]} content     content of file  '{"name": "","path": "","content_type": "","metadata": [ ""]}'
		 */
  		var setFileToDB = function (nombreDB, titulos, terminos, roles, files) { 

		     DreamFactory.api.S3.createFile({
		     	container: selectedBucket,
		     	file_path: '/' + dbprefix + nombreDB + '.json', 
		     	body: {files: files, terminos: terminos, roles:roles, titles: titulos }
		     },
		     // Success function
		      function(result) { 
		      	console.debug("RESULTADO",result);
		      },
		     // Error function
		     function(reject) { console.debug("Reject",reject);  });

		}

		/**
		 * Gets file from S3 bucket
		 * @param {[type]} bucket_name [description]  jrcnaturalsystems
		 * @param {[type]} name        path+folder of file  _DB/hola.json
		 * @param {[type]} content     content of file  '{"name": "","path": "","content_type": "","metadata": [ ""]}'
		 */
  		var getFileFromDB = function (name) {
			var deferred = $q.defer();
		     DreamFactory.api.S3.getFile({
		     	container: selectedBucket,
		     	file_path:  '/' + dbprefix + name + '.json'
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
        var bucketRecursive = function ( actualBucket, nombreDB, titulos, terminos, roles ) {

								
            if (arrayFolders.length > 0) {     										// RECURSIVA FINAL
				getBucketInfo(actualBucket)
				.then(function(response){
					
					arrayFolders = _.rest(arrayFolders);							// quita el path recien leido

					// CARPETAS 
					_.forEach(response.folder, function(folder) {
					  	arrayFolders.push(folder.path);

						// 1.- COGE folders QUE TENGAN ES SU PATH LOS TERMINOS INDICADOS
						var coincidencias = 0;
						terminos.forEach(function(termino){ if(folder.path.indexOf(termino) > -1)  { coincidencias++; } })

						// 2.- si coinciden todas los terminos buscados lo añades a la BD
						if(terminos.length==coincidencias){ folders.push({  path: folder.path, name: folder.name }); } 

					});

					// FICHEROS 
					_.forEach(response.file, function(file) {

						// 1.- COGE files QUE TENGAN ES SU PATH LOS TERMINOS INDICADOS
						var coincidencias = 0;
						terminos.forEach(function(termino){ if(file.path.indexOf(termino) > -1)  { coincidencias++; } })

						// 2.- si coinciden todas los terminos buscados lo añades a la BD
						if(terminos.length==coincidencias){ files.push({ path: file.path, name: file.name }); } 


					});		    

				 	bucketRecursive( arrayFolders[0], nombreDB, titulos, terminos, roles);                  		// RECURSIVA SIGUIENTE CASO
				})

            }
            else{ 
            	console.debug("FILES",files);
            	console.debug("Folders",folders);
				setFileToDB(nombreDB, titulos, terminos, roles, files); 
              	return ;
            }

        }


        /**
         * Convierte un bucket completo recursivamente a JSON
         * 
         * @param {[String]} nombreBD	nombre con el que se guarda
         * @param {[array]} terminos		terminos que deben existir en el path de S3 para incluirlo en el fichero
         * @param {[array]} roles			roles que tendran accceso
   
         */
		var S3_bucketToJSON = function (nombreBD, titulos, terminos, roles) {

			if(_.isUndefined(nombreBD)) nombreBD = '/';						// si no se indica nombreBD se devolveran todos los paths del bucket
			
			// inicializa
			folders = []; 
			files = [];	// borra datos de la tabla

			arrayFolders.push(selectedBucket);										// pon el nombre del bucket activo en el array
			bucketRecursive( arrayFolders[0], nombreBD, titulos, terminos, roles )      					// crea json, llama con el nombre del bucket
		
		}


    // Public API here

    return {
    	
    	getBuckets: getBuckets,									// Devuelve los buckets existentes en S3
    	setBucket: setBucket,									// Activa un bucket para toda la app
    	getBucket: getBucket,									// devuelve el bucket activo
    	getBucketInfo: getBucketInfo,							// Devuelve el contenido de un bucket
        S3_bucketToJSON, S3_bucketToJSON, 						// convierte toda la estructura de un bucket de S3 a json          


        S3getFolder: S3getFolder,
    	getFileFromDB: getFileFromDB,							// get json file from database bucket
    	setFileToDB: setFileToDB,								// set json file to database bucket
    };  

  });
