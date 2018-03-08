angular.module("managerApp").config(function ($stateProvider) {
    "use strict";

    $stateProvider.state("telecom.telephony.portabilityOrder", {
        url: "/portabilityOrder",
        views: {
            "telephonyView@telecom.telephony": {
                templateUrl: "app/telecom/telephony/alias/portability/order/telecom-telephony-alias-portability-order.html",
                controller: "TelecomTelephonyAliasPortabilityOrderCtrl",
                controllerAs: "PortabilityOrderCtrl"
            }
        },
        translations: ["common", "telecom/telephony", "telecom/telephony/alias/portability/order"]
    });
});
