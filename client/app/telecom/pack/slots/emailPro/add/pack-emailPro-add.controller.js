angular.module('managerApp').controller('PackEmailProAddCtrl', class PackEmailProAddCtrl {
  constructor($q, $scope, $state, $stateParams, $translate, OvhApiPackXdsl, Toast) {
    this.$q = $q;
    this.$state = $state;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.OvhApiPackXdsl = OvhApiPackXdsl;
    this.Toast = Toast;
  }

  $onInit() {
    this.availablesDomains = [];

    this.OvhApiPackXdsl.EmailPro().v6()
      .getDomains({ packName: this.$stateParams.packName }).$promise
      .then((domains) => {
        this.availablesDomains = _.map(domains, domain => ({ value: `@${domain}`, label: domain }));
      });

    this.$scope.$watchGroup(['ctrl.account.name', 'ctrl.account.domain'], ([name, domain]) => {
      if (name && domain) {
        const email = name + domain;
        const validAddress = validator.isEmail(email);

        if (!validAddress) {
          this.$scope.accountForm.accountName.$error.invalidAddress = true;
          return this.$scope.accountForm.accountName.$validate();
        }
        delete this.$scope.accountForm.accountName.$error.invalidAddress;

        return this.OvhApiPackXdsl.EmailPro().v6().isEmailAvailable({
          packName: this.$stateParams.packName,
          email,
        }).$promise
          .then((data) => {
            if (!data.available) {
              return this.$q.reject();
            }
            delete this.$scope.accountForm.accountName.$error.invalidAddress;
            return data;
          })
          .catch(() => {
            this.$scope.accountForm.accountName.$error.invalidAddress = true;
          })
          .finally(() => {
            this.$scope.accountForm.accountName.$validate();
          });
      }
      return false;
    });
  }

  add() {
    this.pendindOrder = true;

    return this.OvhApiPackXdsl.EmailPro().v6()
      .save({ packName: this.$stateParams.packName }, {
        email: this.account.name + this.account.domain,
        password: this.account.password,
      }).$promise
      .then(() => this.$state.go('telecom.pack', { packName: this.$stateParams.packName }))
      .then(() => this.Toast.success(this.$translate.instant('success_validation')))
      .catch((error) => {
        this.Toast.error([this.$translate.instant('an_error_ocurred'), _.get(error, 'data.message', '')].join(' '));
        return this.$q.reject(error);
      })
      .finally(() => {
        this.pendingOrder = false;
      });
  }
});
