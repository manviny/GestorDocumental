'use strict';

angular.module('angularjsAuthTutorialApp')
  .controller('TreeCtrl', function ($scope, dfapi, $q) { 



    $scope.$watch('apiReady', function() { $scope.getTree(); });
	

	/**
	 * Lee todos los buckets de S3
	 * @return {[type]} [description]
	 */
    $scope.getTree = function() { 
       $scope.data = [];
	   dfapi.getBuckets()
	   .then(function(data){
	   		console.debug("Bucket",data);
	   		_.forEach(data.resource, function(item) { 
	   			$scope.data.push({ 
	   				"id": item.path, 
	   				"title": item.name, 
	   				"access": item.access, 
	   				"nodes": [] 
	   			})
	   		})
	   })

    };


    /**
     * datos generados al mover una rama
     * @type {Object}
     */
	$scope.treeOptions = { 
	    accept: function(sourceNodeScope, destNodesScope, destIndex) {
	    	console.debug(sourceNodeScope, destNodesScope, destIndex);
	      return true;
	    },
	};


    $scope.remove = function(scope) {
      scope.remove();
    };

    $scope.toggleBranch = function(scope) {

      	scope.toggle();
      	var icono = 'glyphicon glyphicon-file';
      	var color = 'blue';
      	// console.debug("$modelValue",scope.$modelValue);

		// Busca los files y folders del path
    	dfapi.S3getFolder(scope.$modelValue.id, '/', {full_tree: false})
    	.then(function(data){
    	    console.debug("FOLDER DATA",data);
    	    scope.$modelValue.nodes = [];
    	    // FOLDERS
	   		_.forEach(data.folder, function(item) { 
	   			scope.$modelValue.nodes.push({ 
	   				"id": item.path, 
	   				"title": item.name, 
	   				"access": item.access, 
	   				"file": false, 
	   				"nodes": [] 
	   			})
	   		})
    	    // FILES
	   		_.forEach(data.file, function(item) { 
	   			switch(item.content_type) {
				    case 'text/plain':
				        icono = 'glyphicon glyphicon-picture';
				        color = 'orange';
				        break;
				    case 'text/html':
				        icono = 'glyphicon glyphicon-globe';
				        color = 'blue';
				        break;
				    case 'image/jpeg':
				        icono = 'glyphicon glyphicon-camera';
				        color = 'green';
				        break;
				}

				console.debug("ICONO",icono);

	   			scope.$modelValue.nodes.push({ 
	   				"id": item.path, 
	   				"title": item.name, 
	   				"access": item.access, 
	   				"content_type": item.content_type, 
	   				"content_length": item.content_length, 
	   				"last_modified": item.last_modified, 
	   				"icon_type": icono,
	   				"icon_color": color,
	   				"file": true,
	   				"nodes": [] 
	   			})
	   		})

    	})

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