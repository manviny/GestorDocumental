'use strict';

angular.module('angularjsAuthTutorialApp')
  .controller('TreeCtrl', function ($scope, dfapi, $q) { 

	$scope.data = [];

    $scope.getTree = function(path) {
	   dfapi.getBucketInfo(path)
	   .then(function(data){

	   		console.debug("Bucket",data);
	   		_.forEach(data.resource, function(item) { 
	   			console.debug("",item.name);
	   			$scope.data.push({ 
	   				"id": item.path, 
	   				"title": item.name, 
	   				"access": item.access, 
	   				"nodes": [] 
	   			})
	   		})
	   })
    };


	  $scope.treeOptions = { 
	    accept: function(sourceNodeScope, destNodesScope, destIndex) {
	    	console.debug(sourceNodeScope, destNodesScope, destIndex);
	      return true;
	    },
	  };


    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggle = function(scope) {
      	scope.toggle();
    };

    $scope.unfold = function(scope) {
    	var folder = scope.$parent.$modelValue;
    	console.debug("scope",folder.access);



		var indice = _.findIndex($scope.data, function(chr) {
		  return chr.id == folder.id;
		});



	   dfapi.getBucketInfo(folder.title)
	   .then(function(data){
			
			if(!_.isUndefined($scope.data[indice].nodes)){ $scope.data[indice].nodes = []; }
			

	   		console.debug(folder.title,data);
	   		_.forEach(data.folder, function(item) { 
	   			console.debug("",item.name);
	   			$scope.data[indice].nodes.push({ 
	   				"id": item.path, 
	   				"title": item.name, 
	   				"access": item.access, 
	   				"nodes": [] 
	   			})
	   		})
	   })


      	scope.toggle();
    };

    $scope.moveLastToTheBegginig = function () {
      var a = $scope.data.pop();
      $scope.data.splice(0,0, a);
    };

    $scope.newSubItem = function(scope) {
    	console.debug("scope",scope);
      var nodeData = scope.$modelValue;
      nodeData.nodes.push({
        id: nodeData.id * 10 + nodeData.nodes.length,
        title: nodeData.title + '.' + (nodeData.nodes.length + 1),
        nodes: []
      });
    };

    var getRootNodesScope = function() {
      return angular.element(document.getElementById("tree-root")).scope();
    };

    $scope.collapseAll = function() {
      var scope = getRootNodesScope();
      scope.collapseAll();
    };

    $scope.expandAll = function() {
      var scope = getRootNodesScope();
      scope.expandAll();
    };




  });