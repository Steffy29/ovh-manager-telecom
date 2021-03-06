angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.fax.consumption', {
    url: '/consumption',
    views: {
      faxInnerView: {
        templateUrl: 'app/telecom/telephony/fax/consumption/telecom-telephony-fax-consumption.html',
        controller: 'TelecomTelephonyFaxConsumptionCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: [
      'common',
      'telecom/telephony/fax',
      'telecom/telephony/fax/consumption',
    ],
  });
});
