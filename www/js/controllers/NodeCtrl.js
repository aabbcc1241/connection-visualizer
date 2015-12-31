angular.module('starter.controllers')

  .controller('NodeCtrl', function ($scope, $stateParams) {
    $scope.init = function () {
      console.log('nodeCtrl init');
      console.log('nodeId', $stateParams.nodeId);
      $scope.data = {};
      connection_visualizer.NodeManager.checkLoad();
      $scope.data.node = connection_visualizer.NodeManager.getNodeById($stateParams.nodeId);
      console.log('node', $scope.data.node);
    };
    $scope.loadNodes = function (filter) {
      var nodeIds = $scope.data.node.forwardConnections();
      if (nodeIds.length == 0 && false) {
        /* create default connections */
        connection_visualizer.NodeManager.checkLoad();
        connection_visualizer.NodeManager.toArray().forEach(function (node) {
          nodeIds.push(node.id())
        });
      }
      var nodes = nodeIds.map(function (id) {
        return connection_visualizer.NodeManager.getNodeById(id)
      });
      if (filter != null)
        nodes = nodes.filter(filter);
      $scope.data.nodes = nodes;
    };
    $scope.toggleMode = function () {
      $scope.isEditing = !$scope.isEditing;
      $scope.shouldShowDelete = $scope.isEditing;
      $scope.shouldShowReorder = $scope.isEditing;
    };
    $scope.init();
  })
