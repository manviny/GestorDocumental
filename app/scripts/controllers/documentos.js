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
 *  COGE files QUE TENGAN ES SU PATH EL TIPO INDICADO
 *  el nombre seleccinado en colTitles debe ser unico
 *  no podemos usar por ej facturas en dos tipos diferentes de datos
 *   jrcnaturalsystems/gastos/
 *   jrcnaturalsystems/facturas/2015/1er trimester/
 */

  		/**
  		 * CONFIGURACION
  		 */
 		var colTitles = { 
      Ofertas: ["Raiz", "Grupo", "Empresa", "Informes", "documentos"], 
      Registros: ["Raiz", "Grupo", "Empresa", "Informes", "tipo", "documentos"], 
      // Ofertas: ["Grupo", "Empresa", "Ofertas", "documentos"], 
      // Registros: ["Grupo", "Empresa", "Registros", "Insectos", "documentos"], 
 			facturas: ["cliente", "asunto", "año", "trimestre", "documento"], 
 			gastos: ["cliente", "asunto", "documento"]
 		};

  		$scope.folders = [];							// carpetas de S3
  		$scope.files = [];								// ficheros de S3

  		var arrayFolders = [];							// contenedor temporal de todos los paths
  		var folders = [];								// contenedor temporal de folders
  		var files = [];									// contenedor temporal de ficheros


 		// Crea botones de tipos de documentos
 		$scope.horasLibres = {};
		Object.keys(colTitles).forEach(function(key) { 
			console.debug("KEY",key);
			$scope.horasLibres[key] = false; 
		}); 		
  		console.debug("hora libres",$scope.horasLibres);


  		// Selecciona un solo elemento de botones de tipos de documentos
		$scope.selectModelo = function(tipo) {

			Object.keys(colTitles).forEach(function(key) { $scope.horasLibres[key] = false; }); 
			$scope.horasLibres[tipo] = true;
			$scope.tableTitles = colTitles[tipo];

			$scope.rowCollection = []; $scope.folders = [];  $scope.files = []; folders = []; files = [];	// borra datos de la tabla
			arrayFolders.push(bucket_name);
			bucketRecursive(1, arrayFolders[0], tipo);                            					//  RECURSIVA INICIAL
		}



  		/**
  		 * Crea Rows a partir de paths
  		 */
  		var pathsToArrays = function (folders, files, tipo) {
  			var arrayFolder = [];
  			var arrayFiles = [];

  			$scope.rowCollection = [];

  			/**
  			 * paths de Folders a arrays (el último elemento es una cadena vacia -> folder)
  			 */
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

      // 	Object.keys(colTitles).forEach(function(key) {
      // 		console.debug("Objeto",key);  // facturas | recibos
      // 		console.debug("Objeto datos",colTitles[key]);  // ["cliente","tipo"]  
		    // });
      // 	console.debug("___Object.keys(colTitles)____",Object.keys(colTitles)[0]);  //   primera llave del Objeto


      		/**
      		 * paths de ficheros a arrays (el último elemento es contiene datos -> nombre del fichero)
      		 */
  			_.forEach(files, function(file) {

    			arrayFiles = file.path.split('/');				// convierte el path en un array
  				
  				// 1.- este objetos 
    			var este = {};
    			colTitles[tipo].forEach(function(col, index){
             		var temp = colTitles[tipo][index];
              		este[temp] =  arrayFiles[index];
    				
    			}) 				
				$scope.rowCollection.push(este);
        getFilters(tipo);

  			});

  			console.debug("$scope.rowCollection",$scope.rowCollection);
		}

    function getFilters(tipo){ 
        $scope.filtro = [];
        // Registros: ["Raiz", "Grupo", "Empresa", "Informes", "tipo", "documentos"], 
        colTitles[tipo].forEach(function(col, index){
            // var temp = colTitles[tipo][index];
            // este[temp] =  arrayFiles[index];
            var tmp = _.compact(_.union(_.pluck($scope.rowCollection, colTitles[tipo][index])));  
            $scope.filtro[colTitles[tipo][index]] = tmp;
            
        })  
           //  $scope.filtro.tipo = _.compact(_.union(_.pluck($scope.rowCollection, 'tipo')));               // nombre de las pistas
           // console.debug("22222222", $scope.filtro.tipo );
           //  $scope.filtro.operarios = _.compact(_.union(_.pluck($scope.rowCollection, 'operario')));         // nombres de los operarios en fecha seleccionada
           //  $scope.filtro.tarifas = _.compact(_.union(_.pluck($scope.rowCollection, 'tarifa')));             // tipo de tarifas
           //  $scope.filtro.horas = _.compact(_.union(_.pluck($scope.rowCollection, 'hora')));                 // tipo de horas
        
    }



    // filtra datos desde los desplegables
    $scope.filtra = function(filtro){

        switch(Object.keys(filtro)[0]) {
            case 'cliente':
                $scope.search.cliente = filtro.cliente;
                break;
            case 'pista':
                $scope.search.sujeto = filtro.pista;
                break;
            case 'hora':
                $scope.search.hora = filtro.hora;
                break;
            case 'operario':
                $scope.search.operario = filtro.operario;
                break;
            case 'tarifa':
                $scope.search.tarifa = filtro.tarifa;
                break;

        }

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

					  	// COGE folders QUE TENGAN ES SU PATH EL TIPO INDICADO
					  	if(folder.path.indexOf(tipo) > -1) folders.push({ path: folder.path, name: folder.name, nivel: n });
					});

					// añade los ficheros si son del tipo seleccionado [factura | gasto | intervencion ]
					_.forEach(response.file, function(file) {

						// COGE files QUE TENGAN ES SU PATH EL TIPO INDICADO
						if(file.path.indexOf(tipo) > -1) files.push({ path: file.path, name: file.name, nivel: n });
					});		    

				 	bucketRecursive(n+1, arrayFolders[0], tipo);                  		// RECURSIVA SIGUIENTE CASO
				})

            }
            else{ 
            	$scope.folders = folders;
            	$scope.files = files;
            	pathsToArrays(folders, files, tipo);
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
