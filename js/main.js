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
			
			// loop over each of the products and check local storage to add applicable likes
			$timeout(function() {
				angular.forEach($scope.productData, function(product) {
					var id = product.id;

					// if the item is liked in local storage, continue to like the item
					if (localStorage.getItem(id + '-favorite') == "true") {
						$scope.likedProds.push(product); // let's throw the product in our list of liked products
						
						var elem = angular.element(document.querySelector('#heart' + id));
						StateManager.addClass('liked', elem); // let's add the like
					}
				});	

				$scope.loaded = true;
			}, 50)
			
			console.log(res.data.products);
		});

		$scope.currentSearch = {word: ''};
		
		$scope.likedProds = [];
		$scope.inCart = [];

		$scope.displayingCart = false;
		$scope.displayingLiked = false;

		$scope.loaded = false;
		$scope.changingView = false;

		$scope.categories = [{category: "Example"},
			{category: "Example2"},
		];

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
				$scope.likedProds.push(product); // update the list
				localStorage.setItem(product.id + '-favorite', true); // add to local storage
			} else {
				// let's loop over and remove the appropriate product from our liked list
				angular.forEach($scope.likedProds, function(likedProduct, index) {
					if (product.id === likedProduct.id) {
						$scope.likedProds.splice(index, 1);
						localStorage.setItem(likedProduct.id + '-favorite', false);
					}
				});
			}
		}

		$scope.addToCart = function(event, product) {
			var elem = event.currentTarget;
			var inCart = StateManager.classSwitch('inCart', elem);

			if (inCart) {
				elem.innerHTML = "remove_shopping_cart";
				$scope.inCart.push(product);

			} else {
				elem.innerHTML = "add_shopping_cart";

				// let's loop over and remove the appropriate product from our liked list
				angular.forEach($scope.inCart, function(cartedProds, index) {
					if (product.id === cartedProds.id) {
						$scope.inCart.splice(index, 1);
					}
				});
			}

		}

		function updateIcons() {

			// let's add the likes and add-to-cart clicks on the items
			angular.forEach($scope.inCart, function(cartedProds) {
				var elem = angular.element(document.querySelector('#cart' + cartedProds.id));
				StateManager.addClass('inCart', elem);
				elem.innerHTML = 'remove_shopping_cart'; //apply the remove from shopping cart icon to all in cart
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
			$scope.changingView = true;

			if ($scope.displayingCart) {
				$scope.productData = $scope.allProductData;

				elem.innerHTML = '<i class="material-icons iconTop">shopping_cart</i> View Cart';
				$scope.displayingCart = false;
				$scope.changingView = false;
			} else {
				$scope.productData = $scope.inCart;
				elem.innerHTML = 'View All';
				$scope.displayingCart = true;
				$scope.changingView = false;
			}

			// need a timeout to prevent a bug -- could also try re-applying scope, but this is a better solution
			$timeout(function() {
				updateIcons();	
			}, 50)
		}

		$scope.displayLiked = function(event) {
			var elem = event.currentTarget;
			$scope.currentSearch.word = '';
			$scope.changingView = true;

			if ($scope.displayingLiked) {
				$scope.productData = $scope.allProductData;

				elem.innerHTML = '<i class="material-icons iconTop">favorite</i> View Liked';
				$scope.displayingLiked = false;
				$scope.changingView = false;
			} else {
				$scope.productData = $scope.likedProds;
				elem.innerHTML = 'View All';
				$scope.displayingLiked = true;
				$scope.changingView = false;
			}

			$timeout(function() {
				updateIcons();	
			}, 50)
		}
	}]);
