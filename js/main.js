angular.module('sowingoModule', ['ngMaterial'])
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
			$scope.productData = $scope.allProductData = res.data.products; // this stores all of the data

			console.log(res.data.products);
		});

		$scope.user = {name: 'yay'};

	}]);
