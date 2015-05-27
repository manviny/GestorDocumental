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


     $scope.configDB = function(name){ 

      $scope.nombreDB = name;
      $scope.rowCampos = [];

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


     
    dfapi.setBucket('jrcnaturalsystems');
    $scope.configDB('Insecto');

  });
