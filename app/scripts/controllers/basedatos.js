'use strict';

/**
 * @ngdoc function
 * @name angularjsAuthTutorialApp.controller:BasedatosCtrl
 * @description
 * # BasedatosCtrl
 * Controller of the angularjsAuthTutorialApp
 */
angular.module('angularjsAuthTutorialApp')
  .controller('BasedatosCtrl', function ($scope, dfapi) {

    $scope.rowCollection = [];

    $scope.predicates = ['firstName', 'lastName', 'birthDate', 'balance', 'email'];
    $scope.selectedPredicate = $scope.predicates[0];
  	/**	
  	*  Genera la BD de Grupo_Panstar
  	*/

	// dfapi.S3_bucketToJSON( bucket_name, 'Grupo_Panstar'); 

  // dfapi.S3_bucketToJSON( bucket_name, 'Palomillas');				// busca que el documento o ruta contenga 'vigilancia'
  


    $scope.bucketSelecionado = 'selecciona un bucket';


    /**
     * Carga todos los buckets disponibles en S3 para el desplegable
     */

    dfapi.getBuckets()
    .then(function(response){
    	$scope.buckets = response.resource;
    	console.debug(response);
    });


    /**
     * Selecciona el bucket activo
     * Carga la BD del bucket seleccionado
     * @param {[type]} name [description]
     */
    $scope.setBucket = function(name){ 
      dfapi.setBucket(name);                                          // set selected bucket as actual bucket
      $scope.bucketSelecionado = dfapi.getBucket();
      dfapi.getBucketInfo($scope.bucketSelecionado)
      .then(function(response){

          _.forEach(response.file, function(item) { 
            $scope.rowCollection.push({tblName: item.name, tblDate: item.last_modified})
          })
          // response.forEach(function(item){
          //   $scope.rowCollection.push({tblName: item.name, tblDate: item.last_modified})
          // })  
          console.log(response);


      })
    }  

    /**
     * Añade una nueva BD
     * Busca en el bucket actual los paths que contengan la palabra name
     * @param {[type]} name palabra a buscar en el path
     */
     $scope.createDB = function(name){

      if(dfapi.getBucket()=='') { alert('Selecciona un bucket'); return;}
      dfapi.S3_bucketToJSON(name);

     }


    // despliega dropdown
    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };





  });
