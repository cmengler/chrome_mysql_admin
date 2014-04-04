var chromeMyAdmin = angular.module("chromeMyAdmin", ["ngGrid"]);

chromeMyAdmin.run(["$rootScope", function($rootScope) {
    "use strict";

    $rootScope.connected = false;

    $rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase === '$apply' || phase === '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.fatalErrorOccurred = function(errorMessage) {
        $rootScope.$broadcast("fatalErrorOccurred", errorMessage);
    };

    $rootScope.notifyConnectionChanged = function(connectionInfo) {
        $rootScope.$broadcast("connectionChanged", connectionInfo);
    };

    $rootScope.notifyDatabaseChanged = function(database) {
        $rootScope.$broadcast("databaseChanged", database);
    };

    $rootScope.notifyTableChanged = function(table) {
        $rootScope.$broadcast("tableChanged", table);
    };

    $rootScope.showMainStatusMessage = function(message) {
        $rootScope.$broadcast("showMainStatusMessage", message);
    };

    $rootScope.showProgressBar = function() {
        $rootScope.$broadcast("showProgressBar", null);
    };

    $rootScope.hideProgressBar = function() {
        $rootScope.$broadcast("hideProgressBar", null);
    };

    var adjustMainPanelHeight = function() {
        $("#mainPanel").height($(window).height() - 76);
    };

    var assignWindowResizeEventHandler = function() {
        $(window).resize(function(evt) {
            adjustMainPanelHeight();
        });
    };

    assignWindowResizeEventHandler();
    adjustMainPanelHeight();
}]);

chromeMyAdmin.directive("resizeWhen", function() {
    "use strict";

    return {
        restrict: "A",
        scope: false,
        link: function(scope, elem, attrs, ctrl) {
            var resizeExpr = attrs.resizeWhen;
            var listener = scope.$watch(resizeExpr, function(value) {
                if (value) {
                    elem.resize();
                    listener();
                }
            }, false);
        }
    };
});
