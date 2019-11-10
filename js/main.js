angular.module('sowingoModule', ['ngMaterial'])
	.factory('RestServices', ['$http', function($http) {

		// this creates rest services for reuse between future controllers
		var services = {};
		services.getProducts = $http({
			method: 'GET',
			url: 'https://demo1064913.mockable.io/products'
		});

		// services.getFavorites = $http({
		// 	method: 'GET',
		// 	url: 'https://demo1064913.mockable.io/favorites'
		// });

		// services.addFavorite = function() {

		// 	$http({
		// 		method: 'POST',
		// 		url: 'https://demo1064913.mockable.io/favorites',
		// 		data: {
		// 			"favorite": "true"
		// 		}
		// 	});
		// };
	  	
		return services;
	}])
	.service('StateManager', function() {
		// this service predefines a bunch of state to easily pass content between pages
		this.searchMatch = function(keyword, search) {
			return keyword.toUpperCase().startsWith(search.toUpperCase());
		}

		this.classSwitch = function(classToSwitch, element) {
			if (angular.element(element).hasClass(classToSwitch)) {
				angular.element(element).removeClass(classToSwitch);
				return false;	
			} else {
				angular.element(element).addClass(classToSwitch);
				return true;
			}
		}

		this.addClass = function(classToSwitch, element) {
			if (angular.element(element).hasClass(classToSwitch)) {
			} else {
				angular.element(element).addClass(classToSwitch);
			}
		}
	})
	.controller('sowingoController', ['$scope', '$timeout', 'RestServices', 'StateManager', function($scope, $timeout, RestServices, StateManager) {

		$scope.words = StateManager.words;

		RestServices.getProducts.then(function success(res) {
			$scope.productData = $scope.allProductData = res.data.products; // this stores all of the data
			$scope.loaded = true;

			// let's grab the favorited products that way they are saved throughout the app
			// RestServices.getFavorites.then(
			// 	function success(res) {
			// 		console.log('here');
			// 	}, function failure(res) {
			// 		console.log('failed');
			// 	}
			// );

			// RestServices.addFavorite();

			console.log(res.data.products);
		});

		$scope.currentSearch = {word: ''};
		
		$scope.likedProds = [];
		$scope.inCart = [];

		$scope.displayingCart = false;
		$scope.displayingLiked = false;

		$scope.loaded = false;

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

		$scope.like = function(event, product) {
			var elem = event.currentTarget;
			var liked = StateManager.classSwitch('liked', elem); // will flip the css and return true/false if liked currently

			// let's add the product to the liked list
			if (liked) {
				$scope.likedProds.push(product);
			} else {
				// let's loop over and remove the appropriate product from our liked list
				angular.forEach($scope.likedProds, function(likedProduct, index) {
					if (product.id === likedProduct.id) {
						$scope.likedProds.splice(index, 1);
					}
				});
			}

			// console.log($scope.likedProds);
		}

		$scope.addToCart = function(event, product) {
			var elem = event.currentTarget;
			var inCart = StateManager.classSwitch('inCart', elem);

			if (inCart) {
				$scope.inCart.push(product);
			} else {
				// let's loop over and remove the appropriate product from our liked list
				angular.forEach($scope.inCart, function(cartedProds, index) {
					if (product.id === cartedProds.id) {
						$scope.inCart.splice(index, 1);
					}
				});
			}

			// console.log($scope.inCart);
		}

		function updateIcons() {

			// let's add the likes and add-to-cart clicks on the items
			angular.forEach($scope.inCart, function(cartedProds) {
				var elem = angular.element(document.querySelector('#cart' + cartedProds.id));
				console.log(elem);
				StateManager.addClass('inCart', elem);
			});

			// let's add the likes and add-to-cart clicks on the items
			angular.forEach($scope.likedProds, function(likedProds) {
				var elem = angular.element(document.querySelector('#heart' + likedProds.id));
				StateManager.addClass('liked', elem);
			});
		}

		$scope.displayCart = function(event) {
			var elem = event.currentTarget;
			$scope.currentSearch.word = '';

			if ($scope.displayingCart) {
				$scope.productData = $scope.allProductData;

				elem.innerHTML = 'View Cart';
				$scope.displayingCart = false;
			} else {
				$scope.productData = $scope.inCart;
				elem.innerHTML = 'View All';
				$scope.displayingCart = true;
			}

			// need a timeout to prevent a bug -- could also try re-applying scope, but this is a better solution
			$timeout(function() {
				updateIcons();	
			}, 50)
		}

		$scope.displayLiked = function(event) {
			var elem = event.currentTarget;
			$scope.currentSearch.word = '';

			if ($scope.displayingLiked) {
				$scope.productData = $scope.allProductData;

				elem.innerHTML = 'View Liked';
				$scope.displayingLiked = false;
			} else {
				$scope.productData = $scope.likedProds;
				elem.innerHTML = 'View All';
				$scope.displayingLiked = true;
			}

			$timeout(function() {
				updateIcons();	
			}, 50)
		}
	}]);
