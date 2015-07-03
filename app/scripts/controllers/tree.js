'use strict';

angular.module('angularjsAuthTutorialApp')
  .controller('TreeCtrl', function ($scope, dfapi, $q) { 

  	// informacion del usuario
	console.debug("",$scope.$parent.currentUser)

    $scope.$watch('apiReady', function() { 

		// ADMIN -> carga todos los buckets como raiz, Busca todos los buckets del admin
    	if ($scope.$parent.currentUser.is_sys_admin){ $scope.getTree(); }  

    	// NO ADMIN (cliente) -> carga como raiz su folder definido en el role, busca ruta raiz del cliente
    	else { $scope.getClientRoot(); }

    });


    // Busca la ruta raiz del cliente actual
    $scope.getClientRoot = function() { 
		dfapi.getRole($scope.$parent.currentUser.role_id)
		.then(function(result){
			$scope.clientRoot = result.description;					// raiz del cliente, se usa aqui y en breadcrumbs
	    	$scope.data = [];
	    	$scope.data.push({  "id": $scope.clientRoot, "title": result.name, "nodes": []  }); 
		})
    }

	

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
	   			$scope.data.push({ "id": item.path, "title": item.name, "access": item.access, "nodes": [] })
	   		})
	   })
    };



    /**
     * Busca hijos de la ruta indicada
     * @param  {[type]} modelValue [description]
     * @return {[type]}            [description]
     */
    $scope.getFolder = function(modelValue) { 


		// Busca los files y folders del path
    	dfapi.S3getFolder(modelValue.id, '/', {full_tree: false})
    	.then(function(data){
    	    console.debug("FOLDER DATA",data);
    	    modelValue.nodes = [];

    	    // FOLDERS
	   		_.forEach(data.folder, function(item) { 
	   			modelValue.nodes.push({ 
	   				"id": item.path, 
	   				"identidad": item.path.replace(/\//g,'_'), 
	   				"title": item.name, 
	   				"access": item.access, 
	   				"file": false, 
	   				"nodes": [] 
	   			})
	   		})

    	    // FILES
	   		_.forEach(data.file, function(item) { 
	   			switch(item.content_type) {
				    case 'text/plain': icono = 'fa fa-file-text-o'; color = 'orange'; break;
				    case 'text/html': icono = 'glyphicon glyphicon-globe'; color = 'blue'; break;
				    case 'image/jpeg': icono = 'glyphicon glyphicon-picture'; color = 'green'; break;
				    case 'application/json': icono = 'fa fa-file-code-o'; color = 'green'; break;
				    case 'application/pdf': icono = 'fa fa-file-pdf-o'; color = 'red'; break;
				}

				$scope.destacados.push({  
					"id": item.path, 
					"title": item.name, 
					"content_length": item.content_length,
					"icon_type": icono,
					"icon_color": color
				})

	   			modelValue.nodes.push({ 
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


	}



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

    	// set breadcrumbs
      	$scope.pathToBC(scope);

      	// toggle folder
      	scope.toggle();

      	// actualize tree
      	$scope.refreshTree(scope);
 
    };


    $scope.refreshTree = function (scope) {
    	

      	var icono = 'fa fa-file-o';
      	var color = 'red';

      	$scope.destacados = [];
      	// console.debug("$modelValue",scope.$modelValue);
      	
		$scope.getFolder(scope.$modelValue);


    }



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

	$scope.pathToBC = function(scope) {

// console.debug("RAIZ",$scope.data[0]);
// console.debug("scope.$modelValue.id",scope.$modelValue.id);
// console.debug("$scope.clientRoot",$scope.clientRoot);

		$scope.bc = [];
		$scope.bc = scope.$modelValue.id.split("/");
		$scope.bc = _.compact($scope.bc);

		// destacados visibles solo en raiz
		
		scope.depth() <= 1 ? $scope.destaca = true : $scope.destaca = false;
		
		console.debug("bc",$scope.bc);
		$scope.breadcrumbs = scope.$modelValue.id;
	}
	$scope.bcToPath = function(index) {

		if(index==0){ $scope.collapseAll()}

		var id =  '#' + _.take($scope.bc, index+1).join('_') + '_';
		console.debug("TAKE",   id  );
		$(id).click();
		$(id).click();
		$(id).click();
	}


  });