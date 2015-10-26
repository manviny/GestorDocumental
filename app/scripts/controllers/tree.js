'use strict';

angular.module('angularjsAuthTutorialApp')
  .controller('TreeCtrl', function ($scope, dfapi, $q, $filter, $http, DreamFactory, toastr) { 

  	// informacion del usuario
	console.debug("", $scope.$parent.currentUser);
	$scope.ficheros = [];

	$scope.actualFile;

	// toastr.info('estamos buscando tus documentos', 'Un momento');

    $scope.$watch('apiReady', function() { 

		// SI ES ADMIN -> carga todos los buckets como raiz, Busca todos los buckets del admin
    	if ($scope.$parent.currentUser.is_sys_admin){ $scope.getTree(); }  

    	// SI NO ES ADMIN (cliente) -> carga como raiz su folder definido en el role, busca ruta raiz del cliente
    	else { $scope.getClientRoot(); }

    });



    $scope.uploadFile = function(files){

	    var fd = new FormData();
	    //Take the first selected file
	    fd.append("files", files[0]);

	    // en S3 necesita el doble '//'' para subir correctamente
	    $http.post( df_DSP_URL + "/rest/S3/" + $scope.actualPath.id + '//' + files[0].name, fd, {	
	        headers: {'Content-Type': undefined },
	        transformRequest: angular.identity
	    })  
	    .success(function(data){
	    	console.debug("SUBIDO",data);
		})
		.error(function(data){
	    	console.debug("ERROR",data);
		});

    };



    // Busca la ruta raiz del cliente actual
    $scope.getClientRoot = function() { 
    	$scope.$parent.spin=true;
		dfapi.getRole($scope.$parent.currentUser.role_id)
		.then(function(result){
			console.debug("RESULT",result);
			$scope.clientRoot = result.description.split('/').pop();					// raiz del cliente, se usa aqui y en breadcrumbs
	    	$scope.data = [];
	    	$scope.data.push({  "id": result.description, "title": result.description.split('/').pop(), "nodes": []  });
	    	$scope.$parent.spin=false; 
		})
    }

	

	/**
	 * Lee todos los buckets de S3
	 * @return {[type]} [description]
	 */

    $scope.getTree = function() { 
    	$scope.$parent.spin=true;	
       	$scope.data = [];
	   	dfapi.getBuckets()
	   	.then(function(data){
	   		console.debug("Bucket",data);
	   		_.forEach(data.resource, function(item) { 
	   			$scope.data.push({ "id": item.path, "title": item.name, "access": item.access, "nodes": [] })
	   		})
	   		$scope.$parent.spin=false;
	   		// toastr.clear();
	   	})
    };



    /**
     * Busca hijos de la ruta indicada
     * @param  {[type]} modelValue [description]
     * @return {[type]}            [description]
     */
    $scope.getFolder = function(modelValue) { 
console.debug("FOLDER", $filter('escape')(modelValue.id) );
console.debug("FOLDER", modelValue.id );

    	$scope.$parent.spin=true;
		// Busca los files y folders del path
    	// dfapi.S3getFolder( encodeURI(modelValue.id) , '/', {full_tree: false})
    	dfapi.S3getFolder( modelValue.id , '/', {full_tree: false})
    	.then(function(data){
    	    console.debug("FOLDER DATA",data);
    	    modelValue.nodes = [];

    	    // FOLDERS
	   		_.forEach(data.folder, function(item) { 
	   			modelValue.nodes.push({ 
	   				"id": item.path, 
	   				"identidad": item.path.replace(/\//g,'_-_'), 
	   				"title": item.name, 
	   				"access": item.access, 
	   				"file": false, 
	   				"nodes": [] 
	   			})
	   		})
			$scope.$parent.spin=false;
    	    // FILES
	   		_.forEach(data.file, function(item) { 
			    console.debug("TIPO",item.name.split('.').pop());
				var icono ; var color ; 
	   			switch(item.name.split('.').pop()) {													// tipo de fichero
				    case 'txt': icono = 'fa fa-file-text-o'; color = 'orange'; break;
				    case 'html': icono = 'glyphicon glyphicon-globe'; color = 'blue'; break;
				    case 'jpeg': icono = 'glyphicon glyphicon-picture'; color = 'green'; break;
				    case 'jpg': icono = 'glyphicon glyphicon-picture'; color = 'green'; break;
				    case 'png': icono = 'glyphicon glyphicon-picture'; color = 'green'; break;
				    case 'json': icono = 'fa fa-file-code-o'; color = 'green'; break;
				    case 'pdf': icono = 'fa fa-file-pdf-o'; color = 'red'; break;
				    default: icono = 'fa fa-file-code-o'; color = 'blue'; 
				}

				if($scope.destaca){ 									// genera destacados solo en nivel 1 de la raiz
					$scope.destacados.push({  
						"id": item.path, 
						"title": item.name, 
						"content_length": item.content_length,
						"icon_type": icono,
						"icon_color": color
					})
				}

	   			// modelValue.nodes.push({ 
	   			$scope.ficheros.push({ 
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
			$scope.$parent.spin=false;
    	})


	}



	$scope.busca = function(){

		$scope.$parent.spin=true;
		$scope.verEncontrados = false;													// no muestrs encontraods en html


		dfapi.S3getFolder($scope.actualFolder, '/', {full_tree: true})
    	.then(function(response){
 
 			// quita los ficheros que no contienen el termino de busqueda
			$scope.encontrados = _.remove(response.file, function(encontrado) {
			  return _.includes(encontrado.name.toLowerCase(), $scope.termino.toLowerCase());
			});

    	    console.log($scope.encontrados);

    	    // si hay coincidencias muetra el html con los encontrados
    	    $scope.encontrados.length > 0 ? $scope.verEncontrados = true : $scope.verEncontrados = false;
    	    $scope.$parent.spin=false;
    	})
	}


    $scope.setFile = function(node) {
      $scope.actualFile = node;
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
console.debug("XXXXXX",scope)
		$scope.actualFolder = scope.$modelValue.id;														// folder abierto

    	// set breadcrumbs
      	$scope.pathToBC(scope);

      	// toggle folder
      	scope.toggle();

      	// actualize tree si la rama se abre
      	if(!scope.collapsed) {
      		$scope.refreshTree(scope);
      	}
 
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

		$scope.actualPath = scope.$modelValue;

		$scope.bc = [];
		$scope.bc = _.compact(scope.$modelValue.id.split("/"));

		var indice = _.indexOf($scope.bc, $scope.clientRoot);				// indice de la base de la ruta
		// $scope.base = _.slice($scope.bc, 0, indice);
		$scope.bc = _.drop($scope.bc, indice)

		// console.debug("BASE",$scope.base);
		console.debug("RUTA",$scope.bc);

		// destacados visibles solo en raiz
		scope.depth() <= 1 ? $scope.destaca = true : $scope.destaca = false;
		
		$scope.breadcrumbs = scope.$modelValue.id;
	}


	$scope.bcToPath = function(index) {

		if(index==0){ $scope.collapseAll()}

		var id =  '#' + _.take($scope.bc, index+1).join('_-_') + '_-_';

		console.debug("TAKE",   id  );
		$(id).click();
		$(id).click();
		$(id).click();
	}


  });