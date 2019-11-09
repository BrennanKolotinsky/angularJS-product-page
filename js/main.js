angular.module('sowingoModule', [])
	.factory('RestServices', ['$http', function($http) {

		var services = {};
		services.getProducts = $http({
			method: 'GET',
			url: 'https://demo1064913.mockable.io/products'
		});
	  	
		return services;
	}])
	.service('StateManager', function() {
		this.words = 'awesome';
	})
	.controller('sowingoController', ['$scope', 'RestServices', 'StateManager', function($scope, RestServices, StateManager) {

		$scope.words = StateManager.words;

		RestServices.getProducts.then(function success(res) {
			$scope.productData = res.data.products;
			// let's loop over the elements to decide which to add display functionality

			console.log(res.data.products);
		});

	}]);
