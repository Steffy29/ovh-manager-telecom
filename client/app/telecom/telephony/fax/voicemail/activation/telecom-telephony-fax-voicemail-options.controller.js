angular.module('managerApp').controller('TelecomTelephonyFaxVoicemailActivationCtrl', function ($q, $translate, $stateParams, OvhApiTelephony, Toast) {
  const self = this;

  self.loading = {
    init: false,
    save: false,
  };

  self.isVoicemailActive = false;

  /* =============================
    =            EVENTS            =
    ============================== */

  self.onChangeRoutingBtnClick = function () {
    self.loading.save = true;

    return OvhApiTelephony.Voicemail().v6().changeRouting({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }, {
      routing: self.isVoicemailActive ? 'fax' : 'voicemail',
    }).$promise.then(() => {
      Toast.success($translate.instant('telephony_group_fax_voicemail_activation_save_success'));
      self.isVoicemailActive = !self.isVoicemailActive;
    }).catch((error) => {
      Toast.error([$translate.instant('telephony_group_fax_voicemail_activation_save_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.save = false;
    });
  };

  /* -----  End of EVENTS  ------ */

  /* =====================================
    =            INITIALIZATION            =
    ====================================== */

  self.$onInit = function () {
    self.loading.init = true;

    return OvhApiTelephony.Voicemail().v6().routing({
      billingAccount: $stateParams.billingAccount,
      serviceName: $stateParams.serviceName,
    }).$promise.then((routingSetting) => {
      self.isVoicemailActive = routingSetting.data === 'voicemail';
    }).catch((error) => {
      Toast.error([$translate.instant('telephony_group_fax_voicemail_activation_load_error'), _.get(error, 'data.message')].join(' '));
      return $q.reject(error);
    }).finally(() => {
      self.loading.init = false;
    });
  };

  /* -----  End of INITIALIZATION  ------ */
});
