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
    $scope.titulos = [];                  // titulos 
    $scope.terminos = [];                 // terminos de busqueda
    $scope.roles = [];                    // roles con acceso
    $scope.nombreDB = '';                 // nombre de la BD seleccionada
    $scope.contentLength = '';             // numero de elementos encontrados para una BD

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
               // quita el json con el nombre del bucket
              if(!_.isUndefined(nombre) && (nombre!=$scope.bucketSelecionado+'.json') ){
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

      $scope.terminos = [];                
      $scope.roles = [];  

      if(dfapi.getBucket()=='') { alert('Selecciona un bucket'); return;}
      // dfapi.bucketToJSON(name, '', [name], '');                               // crea el fichero .json
      dfapi.setDbFile(name, [],[], [], '');
      $scope.nombreDB = name;
      $scope.rowCollection.push({tblName: name, tblDate: new Date()});           // añade a la tabla el fichero recien creado

     }

     /**
      * configura la BD seleccionada ( nombre, camps que deben aparecer en el path y roles de acceso)
      * @param  {[type]} name [description]
      * @return {[type]}      [description]
      */
     $scope.configDB = function(name){ 

      $scope.nombreDB = name;
      $scope.rowCampos = [];

      dfapi.getFileFromDB(name)
      .then(function(response){
          console.debug("datos BD",response);

          // terminos
          $scope.terminos = response.terminos;

          //roles
          $scope.roles = response.roles;

          //titulos, pone el primer Objeto del contenido como base para crear titulos
          response.content[0].path.split('/').forEach(function(item){
            $scope.rowCampos.push({title: item});
          })

          // numero de datos encontrados
          $scope.contentLength = response.content.length;

      })
     }


     /**
      * guarfa cambios de una BD, titulos, roles, terminos
      * @param  {[type]} name [description]
      * @return {[type]}      [description]
      */
     $scope.guardaBD = function(){ 
        
        // $scope.searchInBucket();      // busca terminos antes de grabar para actualizar BD
console.debug("TITULOS",$scope.titulos);
        var titulos = [];
        // titulos para la tabla, sino se pone alguno se coge el del path por defecto
        for (var i = 0; i < $scope.rowCampos.length; i++) { 
            // if( _.isUndefined($scope.titulos[i]) ) { titulos.push($scope.rowCampos[i].title); }
            if(!$scope.titulos[i]){ titulos.push(''); }
            else { titulos.push($scope.titulos[i]) }
        }      

        dfapi.setDbFile($scope.nombreDB, titulos, $scope.terminos, $scope.roles, $scope.content);

     }


    /**
     * busca los terminos indicados en el bucket activo
     * @return {[type]}      Object con path y name de quien cumple la busqueda
     */
     $scope.searchInBucket = function(){ 
        dfapi.searchInBucket($scope.terminos)
        .then(function(response){ 
          $scope.content = response; 
          $scope.contentLength = response.length;
          console.debug("contern",$scope.content);
          $scope.guardaBD();
        })
     }


     /**
      * RELATIVO A TITULOS, TERMINOS Y ROLES
      */

     // TERMINOS
     $scope.addTermino = function(){  $scope.terminos.push(''); }     
     $scope.removeTermino = function(index){  $scope.terminos.splice(index, 1); }    
     $scope.refreshTermino = function(index, termino){  $scope.terminos[index] = termino; }

     // ROLES
     $scope.addRol = function(){  $scope.roles.push(''); }     
     $scope.removeRol = function(index){  $scope.roles.splice(index, 1); }    
     $scope.refreshRol = function(index, rol){  $scope.roles[index] = rol; }






    // despliega dropdown
    $scope.toggleDropdown = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.status.isopen = !$scope.status.isopen;
    };





  });
