# Sowingo Front-End Challenge

An angularJS interview test seed

### Challenge

We've got two mocked up REST endpoints, one for a list of products and one for altering products' favorite status.

Your challenge is to work on this seed project to fetch the list of products and display them on a template according to this [figma design](https://www.figma.com/file/cwdrJAjr9k8HbNpVCTlSPy/Sowingo_Marketplace_Test) and:

- display all listed products (/1)
- add to and remove from cart with bubble update (locally, no endpoint for that)(/3)
- make changes to favorite status and keep state changes in memory (/2)
- filter list in real time through the search input on top (/1)
- filter for favorites or on-cart items (ie. when clicking favorites or cart) (/2)

Bonus points if you can also:
- use a CSS pre-processor such as LESS or SASS (you choose, but commit both source and compiled files if you do) (/1)
- make it responsive (you can find pre-made classes on the libs included)(/1)

Total /9 (+2 bonus)

### Stack

- AngularJS
- Angular Material (Material Design Components)

### API Mock

[https://demo1064913.mockable.io/products](https://demo1064913.mockable.io/products)

GET - returns json with a **products** array

[https://demo1064913.mockable.io/favorites](https://demo1064913.mockable.io/favorites)

POST - returns json with **favorite: true**

DELETE - returns json with **favorite: false**


### Submission Notes

1. Please Fork repo into your own private repo
2. Please invite [@carmona](https://github.com/carmona), [@ch3w](https://github.com/ch3w), [@rrsowingo](https://github.com/rrsowingo) and [@melaniemuzos](https://github.com/melaniemuzos) for offical submission
3. Please do not submit a pull request
