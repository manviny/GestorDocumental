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

    $scope.titulos = [];

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
      $scope.buckets = [];
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

      // get ficheros de base de datos en el bucket
      $scope.rowCollection = [];
      dfapi.getBucketInfo($scope.bucketSelecionado)
      .then(function(response){
          _.forEach(response.file, function(item) {
              var nombre = item.name.replace(dbprefix,'');            // quita el prefijo ___DB___
              if(!_.isUndefined(nombre)){
                $scope.rowCollection.push({tblName: nombre.replace('.json',''), tblDate: item.last_modified}) // quita .json del nombre del fichero
              }
          })
      })
    }  

    /**
     * Añade una nueva BD
     * Busca en el bucket actual los paths que contengan la palabra name
     * @param {[type]} name palabra a buscar en el path
     */
     $scope.createDB = function(name){

      if(dfapi.getBucket()=='') { alert('Selecciona un bucket'); return;}
      dfapi.S3_bucketToJSON(name, '[terminos]', '[roles]', '[titulos]');                                        // crea el fichero .json
      // dfapi.S3_bucketToJSON(name, content, roles);                                        // crea el fichero .json
      $scope.rowCollection.push({tblName: name, tblDate: new Date()});    // añade a la tabla el fichero recien creado

     }

     /**
      * configura la BD seleccionada ( nombre, camps que deben aparecer en el path y roles de acceso)
      * @param  {[type]} name [description]
      * @return {[type]}      [description]
      */
     $scope.configDB = function(name){ 
      $scope.rowCampos = [];
      dfapi.getFileFromDB(name)
      .then(function(response){
          response.files[0].path.split('/').forEach(function(item){
            $scope.rowCampos.push({title: item});
          })
      })
     }


     /**
      * guarfa cambios de una BD, titulos, roles, terminos
      * @param  {[type]} name [description]
      * @return {[type]}      [description]
      */
     $scope.guardaCambios = function(name){ 
        console.debug($scope.titulos[1],$scope.titulos[0]);
     }


    // despliega dropdown
    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };





  });
