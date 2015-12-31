angular.module('starter.controllers')

  .controller('NodesCtrl', function ($scope, $ionicPopup, configService, singletonService) {
    var currentStart = 0;
    $scope.init = function () {
      console.log('NodesCtrl init');
      $scope.data = {
        nodes: []
      };
      connection_visualizer.NodeManager.checkLoad();
      if (connection_visualizer.NodeManager.numberOfNodes() == 0)
        connection_visualizer.NodeManager.createRandomNodes(configService.infiniteScrollInterval * 3);
      //$scope.toggleMode();
    };
    $scope.clearFilter = function () {
      $scope.filterText = "";
      $scope.updateFilter();
    };
    $scope.updateFilter = function () {
      var target = utils.trimString($scope.filterText).toLowerCase();
      var filter = function (node) {
        return node.name().toLowerCase().indexOf(target) != -1;
      };
      $scope.loadNodes(filter);
    };
    $scope.saveNodes = function () {
      connection_visualizer.NodeManager.save();
      var popup = $ionicPopup.alert({title: 'Saving Finished'});
      popup.then($scope.toggleMode);
    };
    $scope.discardChange = function () {
      $scope.updateFilter();
      $scope.toggleMode();
    };
    $scope.toggleMode = function () {
      $scope.isEditing = !$scope.isEditing;
      $scope.shouldShowDelete = $scope.isEditing;
      $scope.shouldShowReorder = $scope.isEditing;
    };
    $scope.createNewNode = function () {
      $scope.data.newName = "";
      var popup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.newName" placeholder="name">',
        title: 'Enter new Node name',
        subTitle: '(Display name)',
        scope: $scope,
        buttons: [
          {text: 'Cancel'},
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function (event) {
              $scope.data.newName = utils.trimString($scope.data.newName);
              if ($scope.data.newName == "")
                event.preventDefault();
              else
                return $scope.data.newName
            }
          }
        ]
      });
      popup.then(function (newName) {
        newName = utils.trimString(newName);
        if (newName == "")
          return;
        var id = connection_visualizer.NodeManager.createNode(newName);
        if (newName.toLowerCase().indexOf(utils.trimString($scope.filterText).toLowerCase()) != -1)
          $scope.data.nodes.push(connection_visualizer.NodeManager.getNodeById(id));
      });
    };
    /**@deprecated replaced by infinite ? */
    $scope.loadNodes = function (filter) {
      connection_visualizer.NodeManager.checkLoad();
      if (connection_visualizer.NodeManager.numberOfNodes() == 0) {
        /* create default nodes */
        connection_visualizer.NodeManager.createNode("Beeno");
        connection_visualizer.NodeManager.createNode("Katie");
        var chance = singletonService.chance;
        for (var i = 0; i < configService.infiniteScrollInterval; i++) {
          connection_visualizer.NodeManager.createNode(chance.name());
        }
      }
      var nodes = connection_visualizer.NodeManager.toArray();
      if (filter != null)
        nodes = nodes.filter(filter);
      $scope.data.nodes = nodes;
      //$scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.hasMoreNodes = function () {
      connection_visualizer.NodeManager.checkLoad();
      var hasMore = currentStart < connection_visualizer.NodeManager.numberOfNodes();
      /* debug start */
      if (!hasMore && false) {
        /* create default nodes */
        connection_visualizer.NodeManager.createNode("Beeno");
        connection_visualizer.NodeManager.createNode("Katie");
        var chance = new Chance();
        for (var i = 0; i < configService.infiniteScrollInterval; i++) {
          connection_visualizer.NodeManager.createNode(chance.name());
        }
      }
      /* debug end */
      //if(hasMore)
      //$scope.loadMoreNodes();
      return hasMore;
    };
    $scope.loadMoreNodes = function () {
      console.log('loading more nodes');
      connection_visualizer.NodeManager.checkLoad();
      var step = Math.max(Math.min(connection_visualizer.NodeManager.numberOfNodes() - currentStart, configService.infiniteScrollInterval), 0);
      var newIds = connection_visualizer.NodeManager.getIds(currentStart, step);
      currentStart += step;
      newIds.forEach(function (id) {
        $scope.data.nodes.push({
          id: id,
          name: connection_visualizer.NodeManager.getName(id)
        });
      });
      $scope.$broadcast('scroll.infiniteScrollComplete');
    };
    $scope.deleteNode = function (node) {
      $scope.data.nodes.splice($scope.data.nodes.indexOf(node), 1);
    };
    $scope.reorderNode = function (node, $fromIndex, $toIndex) {
      $scope.data.nodes.splice($fromIndex, 1);
      $scope.data.nodes.splice($toIndex, 0, node);
    };
    $scope.init();
  });
