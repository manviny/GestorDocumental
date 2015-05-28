'use strict';

/**
 * @ngdoc function
 * @name angularjsAuthTutorialApp.controller:JrcCtrl
 * @description
 * # JrcCtrl
 * Controller of the angularjsAuthTutorialApp
 */
angular.module('angularjsAuthTutorialApp')
  .controller('JrcCtrl', function ($scope, dfapi) {
    
    // $scope.rowCollection = [
    //     {orden: '1', grupo: 'Grupo_Panstar', empresa: 'PNM_Panamar', tipo: '01-Registro', anyo: '2015', registro: '150114', documento: 'PNM-Panamar_#007-Cucas_Planos-Puntos-Control.pdf'},
    //     {orden: '1', grupo: 'Grupo_Panstar2', empresa: 'PNM_Panamar2', tipo: '01-Registro', anyo: '2015', registro: '150114', documento: 'PNM-Panamar_#007-inse-Puntos-Control.pdf'},
    //     {orden: '1', grupo: 'Grupo_Panstar3', empresa: 'PNM_Panamar3', tipo: '01-Registro', anyo: '2015', registro: '150114', documento: 'PNM-Panamar_#007-salta-Puntos-Control.pdf'},

    // ];



    /**
     * Carga todos los buckets disponibles en S3 para el desplegable
     */
     $scope.inicializa = function(){ 
        dfapi.getBuckets()
        .then(function(response){
          $scope.buckets = [];
            $scope.buckets = response.resource;
            console.debug(response);
        });
    }


    /**
     * Selecciona el bucket activo
     * Carga la BD del bucket seleccionado
     * @param {[type]} name [description]
     */
    $scope.setBucket = function(name){ 

        dfapi.setBucket(name);
        
            // Crea botones de tipos de documentos disponibles
    
            dfapi.getDBs($scope.bucketSelecionado)
            .then(function(response){ 
                $scope.horasLibres = {};
                response.forEach(function(key) { $scope.horasLibres[key.tblName] = false; });          
            })

    }  

     $scope.configDB = function(name){ 

      $scope.nombreDB = name;
      $scope.rowCampos = [];
      $scope.rowCollection = [];

      dfapi.getFileFromDB(name)
      .then(function(response){

            console.debug("datos BD",response);
            
            $scope.tableTitles = response.titles;
            var arrayFiles = [];
            _.forEach(response.content, function(file) {
                arrayFiles = file.path.split('/');              // convierte el path en un array
                // 1.- este objetos 
                var este = {url:file.path};
                response.titles.forEach(function(col, index){
                    var temp = response.titles[index];
                    este[temp] =  arrayFiles[index];    
                })            
                $scope.rowCollection.push(este)
            }); 

            console.debug("rowCollection",$scope.rowCollection);

            //roles
            $scope.roles = response.roles;

            // numero de datos encontrados
            $scope.contentLength = response.content.length;

      })

     }

    



       
        


    // Selecciona un solo elemento de botones de tipos de documentos
    $scope.selectModelo = function(tipo) {

        Object.keys($scope.horasLibres).forEach(function(key) { $scope.horasLibres[key] = false; });    // pon todos a falso
        $scope.horasLibres[tipo] = true;      
        // $scope.rowCollection = [];                                                          // pon a tru el seleccinado
        // $scope.tableTitles = colTitles[tipo];
        $scope.configDB(tipo);
        // $scope.rowCollection = []; $scope.folders = [];  $scope.files = []; folders = []; files = [];   // borra datos de la tabla
        // arrayFolders.push(bucket_name);
        // bucketRecursive(1, arrayFolders[0], tipo);                                              //  RECURSIVA INICIAL
    }

     


  });
