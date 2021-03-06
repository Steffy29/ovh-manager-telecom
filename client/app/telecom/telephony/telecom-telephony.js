angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony', {
    url: '/telephony/:billingAccount',
    views: {
      'telecomView@telecom': {
        templateUrl: 'app/telecom/telephony/telecom-telephony.html',
      },
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/telecom-telephony-main.view.html',
      },
      'groupView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/telecom-telephony-billing-account.html',
        controller: 'TelecomTelephonyBillingAccountCtrl',
        controllerAs: 'BillingAccountCtrl',
      },
      'groupInnerView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/billingAccount/dashboard/telecom-telephony-billing-account-dashboard.html',
        controller: 'TelecomTelephonyBillingAccountDashboardCtrl',
        controllerAs: 'DashboardCtrl',
      },
    },
    resolve: {
      initTelephony($q, $stateParams, TelephonyMediator) {
        // init all groups, lines and numbers
        TelephonyMediator.init()
          .then(() => TelephonyMediator.getGroup($stateParams.billingAccount)
            .then(group => TelephonyMediator.setCurrentGroup(group)));
        return $q.when({ init: true });
      },
      $title(translations, $translate, $stateParams, OvhApiTelephony) {
        return OvhApiTelephony.v6().get({
          billingAccount: $stateParams.billingAccount,
        }).$promise.then(data => $translate.instant('telephony_page_title', { name: data.description || $stateParams.billingAccount }, null, null, 'escape')).catch(() => $translate('telephony_page_title', { name: $stateParams.billingAccount }));
      },
    },
    translations: ['common', 'telecom/telephony'],
  });
});
