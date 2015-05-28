'use strict';

/**
 * @ngdoc filter
 * @name angularjsAuthTutorialApp.filter:escape
 * @function
 * @description
 * # escape
 * Filter in the angularjsAuthTutorialApp.
 */
angular.module('angularjsAuthTutorialApp')
  .filter('escape', function () {
	return window.encodeURIComponent;
  });

