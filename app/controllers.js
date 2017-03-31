
angular.module('testApp')

    .controller('ItemController', ['$scope', 'itemFactory', function ($scope, itemFactory) {
        $scope.currentPage = 0;
        $scope.defaultPageSize = 2;
        $scope.pageSize = 2;
        $scope.items = [];
        $scope.editBoolean = false;
        itemFactory.getItems()
            .then(
                function (response) {
                    $scope.items = response.data;
                    numberOfPages();
                    $scope.edited = [];
                    for (var i = 0; i < $scope.items.length; i++) {
                        (function (i) {
                            $scope.$watch('items[' + i + ']', function (newValue, oldValue) {
                                if (newValue != oldValue) {
                                    $scope.edited[i] = $scope.items[i];
                                    console.log($scope.edited);
                                }
                            }, true);
                        })(i);

                    }
                    $scope.getEdited = function () {
                        $scope.editBoolean = true;
                        $scope.edited = $scope.edited.filter(function (e) {
                            return e
                        });

                    }
                },
                function (response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );


        function numberOfPages() {

            var len = Math.ceil($scope.items.length / $scope.pageSize);
            $scope.pageArray = [];

            for (var i = 0; i < len; i++) {
                $scope.pageArray.push(i);
            }

            return len;
        }

    }])
    .filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            if (angular.isArray(input) && input.length > 0) {
                return input.slice(start);
            }
            return input;
        }
    })
    .directive('cell', function () {
        return {
            restrict: 'E',
            scope: {value: '='},
            template: '<span ng-dblclick="edit()" ng-bind="value"></span><input ng-model="value"/>',
            link: function ($scope, element, attrs) {
                var inputElement = angular.element(element.children()[1]);

                //style
                element.addClass('column');
                attrs.$set('title', 'Двойной клик для редактирования');
                $scope.editing = false;

                // ng-dblclick handler to activate edit
                $scope.edit = function () {
                    $scope.editing = true;
                    element.addClass('active');
                    inputElement[0].focus();
                    attrs.$set('title', 'Enter или клик мимо для сохранения');
                };


                function done() {
                    $scope.editing = false;
                    element.removeClass('active');
                    attrs.$set('title', 'Двойной клик для редактирования');
                }

                // When done editing.
                inputElement.prop('onblur', done);
                inputElement.prop('onkeyup', function (event) {
                    if (event.which === 13) {
                        event.preventDefault();
                        done();
                    }
                });

            }
        };
    })
;
