angular.module('sowingoModule', ['ngMaterial'])
	.factory('RestServices', ['$http', function($http) {

		// this creates rest services for reuse between future controllers
		var services = {};
		services.getProducts = $http({
			method: 'GET',
			url: 'https://demo1064913.mockable.io/products'
		});
	  	
		return services;
	}])
	.service('StateManager', function() {
		// this service predefines a bunch of state to easily pass content between pages
		this.words = 'awesome';

		this.searchMatch = function(keyword, search) {
			return keyword.toUpperCase().startsWith(search.toUpperCase());
		}

		this.classSwitch = function(classToSwitch, element) {
			if (document.querySelector('.' + classToSwitch) !== null) {
				console.log(element);
				element.classList.remove(classToSwitch);	
			} else {
				element.classList.add(classToSwitch);	
			}
		}
	})
	.controller('sowingoController', ['$scope', 'RestServices', 'StateManager', function($scope, RestServices, StateManager) {

		$scope.words = StateManager.words;

		RestServices.getProducts.then(function success(res) {
			$scope.productData = $scope.allProductData = res.data.products; // this stores all of the data

			console.log(res.data.products);
		});

		$scope.currentSearch = {word: ''};

		$scope.search = function() {

			// if no word is entered let's display all the products
			if ($scope.currentSearch.word === '') {
				$scope.productData = $scope.allProductData;
			}
			// else let's find matching words
			else {
				var searchedArr = [];
				var searchedWord = $scope.currentSearch.word;
				angular.forEach($scope.allProductData, function (product, key) {
					// we'll run our check which I store in state manager for future use
					if (StateManager.searchMatch(product.name, searchedWord) || StateManager.searchMatch(product.manufacturer.name, searchedWord) || StateManager.searchMatch(product.manufacturer.sku, searchedWord) || StateManager.searchMatch(product.description, searchedWord)) {
						searchedArr.push(product);	
					}
	            });

	            $scope.productData = searchedArr;
			}
			
		}

		$scope.like = function(event) {
			StateManager.classSwitch('liked', event.currentTarget);
		}

		$scope.addToCart = function(event) {
			StateManager.classSwitch('inCart', event.currentTarget);
		}

	}]);
