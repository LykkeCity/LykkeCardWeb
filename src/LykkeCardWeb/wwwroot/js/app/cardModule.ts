/// <reference path="../typings/globals/angular/index.d.ts" />
/// <reference path="../typings/globals/jquery/index.d.ts" />

module CardModule {
    angular.module('cardApp', []).run($http => {
        $http.defaults.headers.common['RequestVerificationToken'] = angular.element('input[name="__RequestVerificationToken"]').attr('value');

        //$('#profile-page').show();
    });

    angular.module('cardApp').service('ICardService', CardService);
    angular.module('cardApp').controller('CardController', CardController);
}
