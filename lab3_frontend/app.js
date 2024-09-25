var app = angular.module('referenceGuideApp', []);

app.controller('ConceptController', function($scope, $http) {
    $scope.concepts = [];
    $scope.selectedConcept = null;
    $scope.definition = null;
    $scope.newConcept = { name: '', definition: '' };

    // Загрузка списка понятий
    $http.get('http://localhost:3000/api/concepts')
        .then(function(response) {
            $scope.concepts = response.data;
        });

    $scope.getDefinition = function() {
        if ($scope.selectedConcept) {
            $http.get('http://localhost:3000/api/concepts/' + $scope.selectedConcept.name)
                .then(function(response) {
                    $scope.definition = response.data.definition;
                });
        } else {
            $scope.definition = null;
        }
    };

    $scope.addConcept = function() {
        $http.post('http://localhost:3000/api/concepts', $scope.newConcept)
            .then(function(response) {
                $scope.concepts.push(response.data);
                $scope.newConcept = { name: '', definition: '' };
            });
    };

    $scope.deleteConcept = function(name) {
        $http.delete('http://localhost:3000/api/concepts/' + name)
            .then(function() {
                $scope.concepts = $scope.concepts.filter(function(concept) {
                    return concept.name !== name;
                });
                $scope.selectedConcept = null;
                $scope.definition = null;
            });
    };
});