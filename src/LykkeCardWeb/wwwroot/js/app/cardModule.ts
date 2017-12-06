/// <reference path="../typings/globals/angular/index.d.ts" />
/// <reference path="../typings/globals/jquery/index.d.ts" />

module CardModule {
    angular.module('cardApp', ['monospaced.qrcode', 'slick']).run($http => {
        $http.defaults.headers.common['RequestVerificationToken'] = angular.element('input[name="__RequestVerificationToken"]').attr('value');
        $('.ng-hidden').removeClass('ng-hidden');
    });

    angular.module('cardApp').service('ICardService', CardService);
    angular.module('cardApp').service('ISubscribeService', SubscribeService);
    angular.module('cardApp').controller('CardController', CardController);
    angular.module('cardApp').controller('SubscribeController', SubscribeController);
}
