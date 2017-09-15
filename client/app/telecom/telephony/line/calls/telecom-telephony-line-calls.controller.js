angular.module("managerApp").controller("TelecomTelephonyLineCallsCtrl", function ($translate, $stateParams, TelephonyMediator) {
    "use strict";

    var self = this;

    this.actions = [];

    this.loading = {
        init: true
    };

    /*= =====================================
    =            INITIALIZATION            =
    ======================================*/

    function initActions () {
        return [{
            name: "line_manage_filtering_lists_new",
            main: true,
            picto: "ovh-font-callFilter",
            sref: "telecom.telephony.line.calls.filtering",
            text: $translate.instant("telephony_line_calls_actions_line_manage_filtering_lists_new"),
            display: true,
            enable: true
        }, {
            name: "line_locking",
            sref: "telecom.telephony.line.calls.lockOutCall",
            text: $translate.instant("telephony_line_calls_actions_line_locking"),
            display: true,
            enable: true
        }, {
            name: "line_forwardcall",
            main: true,
            sref: "telecom.telephony.line.calls.forward",
            picto: "ovh-font-callForwarding",
            text: $translate.instant("telephony_line_calls_actions_line_forwardcall"),
            display: true,
            enable: true
        }, {
            name: "line_displayNumber",
            main: true,
            picto: "ovh-font-callRestriction",
            sref: "telecom.telephony.line.calls.line_displayNumber",
            text: $translate.instant("telephony_line_calls_actions_line_displayNumber"),
            display: true,
            enable: true
        }, {
            name: "line_simultaneouslines",
            sref: "telecom.telephony.line.calls.simultaneousLines",
            text: $translate.instant("telephony_line_calls_actions_line_simultaneouslines"),
            display: true,
            enable: ["sipfax", "priceplan", "trunk"]
        }, {
            name: "line_manage_slots",
            sref: "telecom.telephony.line.calls.timeCondition",
            text: $translate.instant("telephony_line_calls_actions_line_manage_slots"),
            display: ["priceplan", "trunk", "individual"],
            enable: ["priceplan", "trunk"]
        }, {
            name: "line_calendar",
            sref: "telecom.telephony.line.calls.events",
            text: $translate.instant("telephony_line_calls_actions_line_calendar"),
            display: ["priceplan", "trunk", "individual"],
            enable: ["priceplan", "trunk"]
        }, {
            name: "line_callWaiting",
            sref: "telecom.telephony.line.calls.callWaiting",
            text: $translate.instant("telephony_line_calls_actions_line_callWaiting"),
            display: true,
            enable: ["sipfax", "priceplan", "voicefax", "individual"]
        }, {
            name: "line_abbreviated_numbers",
            main: true,
            picto: "ovh-font-abbreviatedNumber",
            sref: "telecom.telephony.line.calls.abbreviatedNumbers",
            text: $translate.instant("telephony_line_calls_actions_line_abbreviated_numbers"),
            display: true,
            enable: true
        }, {
            name: "line_click2call",
            sref: "telecom.telephony.line.click2call",
            text: $translate.instant("telephony_line_calls_actions_line_click2call"),
            display: true,
            enable: ["sipfax", "priceplan", "voicefax"]
        }, {
            name: "line_external_number_display",
            sref: "telecom.telephony.line.calls.displayExternalNumber",
            text: $translate.instant("telephony_line_calls_actions_line_external_number_display"),
            display: ["trunk"],
            enable: ["trunk"]
        }];
    }

    function init () {
        return TelephonyMediator.getGroup($stateParams.billingAccount).then(function (group) {
            return group.getLine($stateParams.serviceName);
        }).then(function (line) {
            self.actions = _.filter(initActions(), function (action) {
                var display = action.display === true;
                var enable = action.enable === true;
                if (action.display !== true) {
                    _.forEach(action.display, function (offer) {
                        if (line.isOffer(offer)) {
                            display = true;
                        }
                    });
                }
                if (action.enable !== true) {
                    _.forEach(action.enable, function (offer) {
                        if (line.isOffer(offer)) {
                            enable = true;
                        }
                    });
                }
                action.disabled = !enable;
                return display;
            });
            return line;
        }).finally(function () {
            self.loading.init = false;
        });
    }

    /* -----  End of INITIALIZATION  ------*/

    init();

});
