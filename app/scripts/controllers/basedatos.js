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
    $scope.bd = {};
    $scope.titulos = [];
    // $scope.configVisible = false;

    $scope.predicates = ['firstName', 'lastName', 'birthDate', 'balance', 'email'];
    $scope.selectedPredicate = $scope.predicates[0];
  


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
    * Crea la estructura del bucket seleccionado
    */
    $scope.updateBucket = function(){
      dfapi.updateBucket($scope.bucketSelecionado); 
    }


    /**
     * Añade una nueva BD
     * Busca en el bucket actual los paths que contengan la palabra name
     * @param {[type]} name palabra a buscar en el path
     */
     $scope.createDB = function(name){ 

      if(dfapi.getBucket()=='') { alert('Selecciona un bucket'); return;}
      dfapi.bucketToJSON(name, '', [name], '');                            // crea el fichero .json
      $scope.rowCollection.push({tblName: name, tblDate: new Date()});        // añade a la tabla el fichero recien creado

     }

     /**
      * configura la BD seleccionada ( nombre, camps que deben aparecer en el path y roles de acceso)
      * @param  {[type]} name [description]
      * @return {[type]}      [description]
      */
     $scope.configDB = function(name){ 

      $scope.bd.nombre = name;
      $scope.rowCampos = [];

      dfapi.getFileFromDB(name)
      .then(function(response){
          console.debug("datos BD",response);

          // titulos
          response.files[1].path.split('/').forEach(function(item){
            $scope.rowCampos.push({title: item});
          })

          // terminos
          response.terminos.forEach(function(item){
            $scope.rowCampos.push({terminos: item});
          })
          $scope.bd.terminos = response.terminos;

          //roles
          response.roles.forEach(function(item){
            $scope.rowCampos.push({roles: item});
          })
          $scope.bd.roles = response.roles;


      })
     }


     /**
      * guarfa cambios de una BD, titulos, roles, terminos
      * @param  {[type]} name [description]
      * @return {[type]}      [description]
      */
     $scope.guardaBD = function(name){ 
        
        var titulos = [];
        var terminos = $scope.bd.terminos.split('\n');                        // terminos de busqueda
        var roles = $scope.bd.roles.split('\n');                              // roles admitidos

        // titulos para la tabla, sino se pone alguno se coge el del path por defecto
        for (var i = 0; i < $scope.rowCampos.length; i++) { 
            if(!$scope.titulos[i]){ titulos.push($scope.rowCampos[i].title); }
            else { titulos.push($scope.titulos[i]) }
        }


        dfapi.bucketToJSON($scope.bd.nombre, titulos, terminos, roles);   // guarda configuracion de la BD
     }


    // despliega dropdown
    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };





  });
