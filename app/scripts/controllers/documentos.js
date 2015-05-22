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
      Grupo_Panstar: ["JRC", "Grupo", "Nombre Empresa", "Tipo", "Año", "Fecha registro", "Documento"],
 			facturas: ["cliente", "asunto", "año", "trimestre", "documento"], 
 			gastos: ["cliente", "asunto", "documento"]
 		};

  		$scope.folders = [];							// carpetas de S3
  		$scope.files = [];								// ficheros de S3

  		var arrayFolders = [];					// contenedor temporal de todos los paths
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

			$scope.rowCollection = []; $scope.folders = [];  $scope.files = []; folders = []; files = [];	// borra datos de la tabla
			arrayFolders.push(bucket_name);
			bucketRecursive(1, arrayFolders[0], tipo);                            					//  RECURSIVA INICIAL
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
