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
	$rootScope.apiReady = false;
	$rootScope.$on('api:ready', function(event) {
		console.debug('API cargada');
		$rootScope.apiReady = true;
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


	var S3getFolder = function(bucket, path){

       	var deferred = $q.defer(); 
	     // DreamFactory.api.S3.getContainer({container:'lamemoriagrafica/lallosaderanes/imagenes/Els+banys'},
	     DreamFactory.api.S3.getFolder({
	     	container: bucket,
	     	include_folders: true,
	     	include_properties: true,
	     	folder_path: path
	     },
	     // Success function
	      function(result) { deferred.resolve(result); },
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
			DreamFactory.api.S3.getResources( function(result) {  deferred.resolve(result);  });
		    return deferred.promise
		}


		/**
		 * Writes file to S3 bucket
		 * @param {[type]} bucket_name [description]  jrcnaturalsystems
		 * @param {[type]} name        path+folder of file  _DB/hola.json
		 * @param {[type]} content     content of file  '{"name": "","path": "","content_type": "","metadata": [ ""]}'
		 */
  		var setFileToDB = function (nombreDB, titulos, terminos, roles, files, folders) { 

		     DreamFactory.api.S3.createFile({
		     	container: selectedBucket,
		     	file_path: '/' + dbprefix + nombreDB + '.json', 
		     	body: {files: files, folders:folders, terminos: terminos, roles:roles, titles: titulos }
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
		 * get all Db files from actual bucket
		 * @return {[type]} [description]
		 */
		var getDBs = function(){
			var deferred = $q.defer();
			var rowCollection = [];	
		      getBucketInfo(selectedBucket)
		      .then(function(response){
		        
		          _.forEach(response.file, function(item) {
		              var nombre = item.name.replace(dbprefix,'');            // quita el prefijo ___DB___
		               // quita el json con el nombre del bucket
		              if(!_.isUndefined(nombre) && (nombre!=selectedBucket+'.json') ){
		                rowCollection.push({tblName: nombre.replace('.json',''), tblDate: item.last_modified}) // quita .json del nombre del fichero
		              }
		          })
		          deferred.resolve(rowCollection);
		      })
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
				setFileToDB(nombreDB, titulos, terminos, roles, files, folders); 
              	return ;
            }

        }

		/**
		 * [bucketRecursive description] ej: getTree( bucketname, '2015' ) 
		 * @param  {[type]} actualBucket bucket raiz desde el que se leera la estructura
		 * @param  {[type]} tipo         string que debe contener el path para incluirlo en la salida
		 * @return {[type]}              [description]
		 */
        var getTree = function ( actualBucket ) {

								
            if (arrayFolders.length > 0) {     										// RECURSIVA FINAL
				getBucketInfo(actualBucket)
				.then(function(response){
					
					arrayFolders = _.rest(arrayFolders);							// quita el path recien leido

					// CARPETAS 
					_.forEach(response.folder, function(folder) {
					  	arrayFolders.push(folder.path);
						folders.push({  path: folder.path, name: folder.name }); 
					});

					// FICHEROS 
					_.forEach(response.file, function(file) {
						files.push({ path: file.path, name: file.name }); 
					});		    

				 	getTree( arrayFolders[0]);                  		// RECURSIVA SIGUIENTE CASO
				})

            }
            else{ 
            	console.debug("FILES",files);
            	console.debug("Folders",folders);
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
		var bucketToJSON = function (nombreBD, titulos, terminos, roles) {

			if(_.isUndefined(nombreBD)) nombreBD = '/';							// si no se indica nombreBD se devolveran todos los paths del bucket
			
			// inicializa
			folders = []; 
			files = [];	// borra datos de la tabla

			arrayFolders.push(selectedBucket);											// pon el nombre del bucket activo en el array
			bucketRecursive( arrayFolders[0], nombreBD, titulos, terminos, roles )      // crea json, llama con el nombre del bucket
		
		}

		/**	
		*  Crea ficheroBD con toda la estructura del bucket indicado
		*  bucketName: bucket raiz para buscar
		*
		*/
		var updateBucket = function (bucketName) {
			
			// inicializa
			folders = []; 
			files = [];	// borra datos de la tabla

			arrayFolders.push(bucketName);											// pon el nombre del bucket activo en el array
			bucketRecursive( arrayFolders[0], bucketName,  '', ['/'], '' )      // crea json, llama con el nombre del bucket
		
		}

		/**
		 * [setDbFile description]
		 * @param {[type]} fileName nombre para guardar la BD
		 * @param {[type]} titulos  titulos para la estructura del path
		 * @param {[type]} terminos terminos que debe contener el path
		 * @param {[type]} roles    roles que pueden acceder la BD
		 * @param {[type]} content  json con los paths
		 */
		var setDbFile = function (nombreDB, titulos, terminos, roles, content) {

		     DreamFactory.api.S3.createFile({
		     	container: selectedBucket,
		     	file_path: '/' + dbprefix + nombreDB + '.json', 
		     	body: { titles: titulos, terminos: terminos, roles:roles, content:content }
		     },
		     // Success function
		      function(result) { 
		      	console.debug("RESULTADO",result);
		      },
		     // Error function
		     function(reject) { console.debug("Reject",reject);  });
		
		}

		/**
		 * resultado de buscar en el bucket activo
		 * @param  {[array]} 	terminos para buscar en el bucket activo
		 * @return {[type]}     reduccion del bucket principal con datos encontrados en path-terminos
		 */
		var searchInBucket = function (terminos) {
			
			var deferred = $q.defer();
			var encontrados = [];

			console.debug("array de terminos a buscar",terminos);
			console.debug("selectedBucket",selectedBucket);
			getFileFromDB(selectedBucket)
			.then(function(response){

				// FICHEROS 
				_.forEach(response.files, function(file) {

					// 1.- COGE files QUE TENGAN ES SU PATH LOS TERMINOS INDICADOS
					var coincidencias = 0;
					terminos.forEach(function(termino){ if(file.path.indexOf(termino) > -1)  { coincidencias++; } })

					// 2.- si coinciden todas los terminos buscados lo añades a la BD
					if(terminos.length==coincidencias){ encontrados.push({ path: file.path, name: file.name }); } 
				});	

				deferred.resolve(encontrados);

			})
			return deferred.promise;
		}



    // Public API here

    return {
    	
    	getBuckets: getBuckets,									// Devuelve los buckets existentes en S3
    	setBucket: setBucket,									// Activa un bucket para toda la app
    	getBucket: getBucket,									// devuelve el bucket activo
    	getBucketInfo: getBucketInfo,							// Devuelve el contenido de un bucket, no recursivo
        // bucketToJSON: bucketToJSON, 							// convierte toda la estructura (paths) de un bucket de S3 a json          
		updateBucket: updateBucket,								// Crea la estrucutra del bucket en un json
		setDbFile: setDbFile,									// Creates a DB file
		searchInBucket: searchInBucket,							// resultado de buscar en el bucket activo
		getDBs: getDBs,											// gets DB files in a bucket
		getTree: getTree,

        S3getFolder: S3getFolder,
    	getFileFromDB: getFileFromDB,							// get json file from database bucket
    	setFileToDB: setFileToDB,								// set json file to database bucket
    };  

  });
