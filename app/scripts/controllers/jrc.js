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
    
    $scope.rowCollection = [
        {orden: '1', grupo: 'Grupo_Panstar', empresa: 'PNM_Panamar', tipo: '01-Registro', anyo: '2015', registro: '150114', documento: 'PNM-Panamar_#007-Cucas_Planos-Puntos-Control.pdf'},
        {orden: '1', grupo: 'Grupo_Panstar2', empresa: 'PNM_Panamar2', tipo: '01-Registro', anyo: '2015', registro: '150114', documento: 'PNM-Panamar_#007-inse-Puntos-Control.pdf'},
        {orden: '1', grupo: 'Grupo_Panstar3', empresa: 'PNM_Panamar3', tipo: '01-Registro', anyo: '2015', registro: '150114', documento: 'PNM-Panamar_#007-salta-Puntos-Control.pdf'},

    ];


    $scope.tableTitles = tableTitles.documentos;

    dfapi.S3_bucketToJSON( bucket_name, 'Grupo_Panstar'); 			// busca que el documento o ruta contenga 'Grupo_Panstar'
    // dfapi.S3_bucketToJSON( bucket_name, 'vigilancia');				// busca que el documento o ruta contenga 'vigilancia'




  });
