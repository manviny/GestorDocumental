'use strict';

/**
 * @ngdoc function
 * @name angularjsAuthTutorialApp.controller:JrcCtrl
 * @description
 * # JrcCtrl
 * Controller of the angularjsAuthTutorialApp
 */
angular.module('angularjsAuthTutorialApp')
  .controller('JrcCtrl', function ($scope, dfapi, DreamFactory) {
    
    // $scope.rowCollection = [
    //     {Nosotros: '1', Grupo: 'Grupo_Panstar', Empresa: 'PNM_Panamar', Tipo: '01-Registro', anyo: '2015', mes: '150114', documento: 'PNM-Panamar_#007-Cucas_Planos-Puntos-Control.pdf'},
    //     {Nosotros: '1', Grupo: 'Grupo_Panstar2', Empresa: 'PNM_Panamar2', Tipo: '01-Registro', anyo: '2015', mes: '150114', documento: 'PNM-Panamar_#007-inse-Puntos-Control.pdf'},
    //     {Nosotros: '1', çGrupo: 'Grupo_Panstar3', Empresa: 'PNM_Panamar3', Tipo: '01-Registro', anyo: '2015', mes: '150114', documento: 'PNM-Panamar_#007-salta-Puntos-Control.pdf'},

    // ];





             // DreamFactory.api.S3.getFile({
             //    container: 'jrcnaturalsystems',
             //    file_path: '/Grupo_Panstar/PNM_Panamar/01-Registro/2015/150114/PNM-Panamar_#007-Palomillas_Registro-de-vigilancia-Insectos.pdf'
             // },
             // // Success function
             //  function(result) { 
             //    console.debug("RESULTADO",result);
             //  },
             // // Error function
             // function(reject) { console.debug("Reject",reject);  });


      
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



    // $scope.tableTitles = tableTitles.documentos;

    // dfapi.getFileFromDB('Palomillas')
    // .then(function(response){
    	
    //     console.log(response);
    // })


  });
