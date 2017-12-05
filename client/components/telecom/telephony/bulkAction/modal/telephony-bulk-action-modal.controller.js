angular.module("managerApp").controller("telephonyBulkActionModalCtrl", function ($http, $filter, $translate, $uibModalInstance, modalBindings, telecomVoip) {
    "use strict";

    var self = this;
    var allServices;

    self.loading = {
        init: false,
        bulk: false
    };

    self.model = {
        billingAccount: null,
        searchService: "",
        selection: {}
    };

    self.state = {
        selectAll: false
    };

    self.bindings = null;
    self.billingAccounts = null;
    self.serviceList = null;

    /* ==============================
    =            HELPERS            =
    =============================== */

    function getFilteredServiceList () {
        var services = null;

        if (!self.model.billingAccount) {
            services = allServices;
        } else {
            services = _.find(self.billingAccounts, {
                billingAccount: self.model.billingAccount
            }).services;
        }

        services = _.filter(services, {
            serviceType: self.bindings.serviceType
        });

        if (self.model.searchService !== "") {
            return $filter("propsFilter")(services, {
                serviceName: self.model.searchService,
                description: self.model.searchService
            });
        }

        return services;
    }

    self.getSelectedCount = function () {
        var count = 0;

        _.keys(self.model.selection).forEach(function (serviceName) {
            count += _.get(self.model.selection, serviceName) === true ? 1 : 0;
        });

        return count;
    };

    self.getSelectedServices = function () {
        var selectedServices = [];

        _.keys(self.model.selection).forEach(function (serviceName) {
            if (self.model.selection[serviceName] === true && self.bindings.serviceName !== serviceName) {
                selectedServices.push({
                    billingAccount: _.find(allServices, {
                        serviceName: serviceName
                    }).billingAccount,
                    serviceName: serviceName
                });
            }
        });

        return selectedServices;
    };

    /* -----  End of HELPERS  ------ */


    /* =============================
    =            EVENTS            =
    ============================== */

    self.cancel = function (reason) {
        return $uibModalInstance.dismiss(reason);
    };

    self.onBillingAccountSelectChange = function () {
        self.state.selectAll = false;
        self.serviceList = getFilteredServiceList();
    };

    self.onToggleAllCheckStateBtnClick = function () {
        self.state.selectAll = !self.state.selectAll;
        self.serviceList.forEach(function (service) {
            if (service.serviceName !== self.bindings.serviceName) {
                _.set(self.model.selection, service.serviceName, self.state.selectAll);
            }
        });
    };

    self.onSearchServiceInputChange = function () {
        self.state.selectAll = false;
        self.serviceList = getFilteredServiceList();
    };

    self.onBulkServiceChoiceFormSubmit = function () {
        self.loading.bulk = true;

        // build params for each actions
        self.bindings.bulkInfos.actions.forEach(function (info) {
            info.params = self.bindings.getBulkParams()(info.name);
        });

        // call 2API endpoint
        return $http.post("/" + ["telephony", self.bindings.billingAccount, "service", self.bindings.serviceName, "bulk"].join("/"), {
            bulkInfos: self.bindings.bulkInfos,
            bulkServices: self.getSelectedServices()
        }, {
            serviceType: "aapi"
        }).then(function (result) {
            var partitionedResult = _.partition(result.data, function (res) {
                return res.errors.length === 0;
            });

            return $uibModalInstance.close({
                success: _.first(partitionedResult),
                error: _.last(partitionedResult)
            });
        }).catch(function (error) {
            return self.cancel({
                type: "API",
                msg: error
            });
        }).finally(function () {
            self.loading.bulk = false;
        });
    };

    /* -----  End of EVENTS  ------ */

    /* =====================================
    =            INITIALIZATION            =
    ====================================== */

    self.$onInit = function () {
        self.loading.init = true;

        self.bindings = modalBindings;
        self.model.billingAccount = self.bindings.billingAccount;

        return telecomVoip.fetchAll(false).then(function (billingAccounts) {
            self.billingAccounts = _.sortBy(billingAccounts, function (billingAccount) {
                return billingAccount.getDisplayedName();
            });
            allServices = _.chain(self.billingAccounts).map("services").flatten().value();
            self.serviceList = getFilteredServiceList();

            // set current serviceName as selected
            _.set(self.model.selection, self.bindings.serviceName, true);
        }).finally(function () {
            self.loading.init = false;
        });
    };

    /* -----  End of INITIALIZATION  ------ */

});
