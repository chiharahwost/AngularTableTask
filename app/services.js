
angular.module('testApp')
    .constant("baseURL", "data.json")

    .service('itemFactory', ['$http', 'baseURL', function ($http, baseURL) {

        this.getItems = function () {

            return $http.get(baseURL);
        };

    }])

;