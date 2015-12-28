angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
      console.log('Doing login', $scope.loginData);

      // Simulate a login delay. Remove this and replace with your login
      // code if using a login system
      $timeout(function () {
        $scope.closeLogin();
      }, 1000);
    };

  })

  .controller('NodesCtrl', function ($scope, $ionicPopup) {
    $scope.init = function () {
      $scope.data = {};
      $scope.toggleMode();
      //$scope.shouldShowReorder = true;
      //$scope.shouldShowDelete = true;
    };
    $scope.toggleShowDelete = function () {
      $scope.shouldShowDelete = !$scope.shouldShowDelete;
      //$scope.shouldShowReorder = false;
    };
    $scope.clearFilter = function () {
      $scope.filterText = "";
      $scope.updateFilter();
    };
    $scope.updateFilter = function () {
      var target = utils.trimString($scope.filterText.toLowerCase());
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
    $scope.loadNodes = function (filter) {
      connection_visualizer.NodeManager.checkLoad();
      if (connection_visualizer.NodeManager.numberOfNodes() == 0) {
        connection_visualizer.NodeManager.createNode("Beeno");
        connection_visualizer.NodeManager.createNode("Katie");
      }
      var nodes = connection_visualizer.NodeManager.toArray();
      if (filter != null)
        nodes = nodes.filter(filter);
      $scope.data.nodes = nodes;
    };
    $scope.deleteNode = function (node) {
      $scope.data.nodes.splice($scope.data.nodes.indexOf(node), 1);
    };
    $scope.reorderNode = function (node, $fromIndex, $toIndex) {
      $scope.data.nodes.splice($fromIndex, 1);
      $scope.data.nodes.splice($toIndex, 0, node);
    };
    $scope.init();
  })

  .controller('NodeCtrl', function ($scope, $stateParams) {
  });
