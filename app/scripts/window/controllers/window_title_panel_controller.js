chromeMyAdmin.directive("windowTitlePanel", function() {
    "use strict";

    return {
        restrict: "E",
        templateUrl: "templates/window_title_panel.html"
    };
});

chromeMyAdmin.controller("windowTitlePanelController", ["$scope", "mySQLClientService", "$q", "Events", function($scope, mySQLClientService, $q, Events) {
    "use strict";

    var storeWindowSize = function() {
        var deferred = $q.defer();
        var window = chrome.app.window.current();
        var windowSize = {
            bounds: {
                top: window.outerBounds.top,
                left: window.outerBounds.left,
                width: window.outerBounds.width,
                height: window.outerBounds.height
            },
            isFullscreen: window.isFullscreen(),
            isMaximized: window.isMaximized()
        };
        chrome.storage.sync.set({windowSize: windowSize}, function() {
            deferred.resolve();
        });
        return deferred.promise;
    };

    var assignEventHandlers = function() {
        $scope.$on(Events.CONNECTION_CHANGED, function(event, connectionInfo) {
            onConnectionChanged(connectionInfo);
        });
    };

    var resetTitleText = function() {
        $scope.titleText = "";
    };

    var onConnectionChanged = function(info) {
        if (mySQLClientService.isConnected()) {
            $scope.safeApply(function() {
                var tls = info.useSSL ? " (SSL)" : "";
                $scope.titleText = info.hostName + ":" + info.port + tls +
                    " | " + info.userName +
                    " | " + info.initialHandshakeRequest.serverVersion;
            });
        } else {
            resetTitleText();
        }
    };

    $scope.close = function() {
        if (mySQLClientService.isConnected()) {
            mySQLClientService.logout().then(function() {
                storeWindowSize().then(function() {
                    chrome.app.window.current().close();
                });
            });
        } else {
            storeWindowSize().then(function() {
                chrome.app.window.current().close();
            });
        }
    };

    $scope.minimize = function() {
        chrome.app.window.current().minimize();
    };

    $scope.maximize = function() {
        if (chrome.app.window.current().isMaximized()) {
            chrome.app.window.current().restore();
        } else {
            chrome.app.window.current().maximize();
        }
    };

    $scope.fullscreen = function() {
        if (chrome.app.window.current().isFullscreen()) {
            chrome.app.window.current().restore();
        } else {
            chrome.app.window.current().fullscreen();
        }
    };

    $scope.initialize = function() {
        assignEventHandlers();
        resetTitleText();
    };

    $scope.openNewWindow = function() {
        chrome.runtime.getBackgroundPage(function(bg) {
            bg.createWindow();
        });
    };

}]);
