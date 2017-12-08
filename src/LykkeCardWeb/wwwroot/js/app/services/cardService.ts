module CardModule {
    export interface ICardService {
        getCards(successCallback: Function): ng.IPromise<void>;
        getSettings(successCallback: Function): ng.IPromise<void>;
        createCard(cardRequest: CardRequest, callback: Function);
        getViewPinToken(cardId: string, callback: Function);
        activateCard(request: ActivateCardRequest, callback: Function);
        payCard(cardId: string, callback: Function);
        blockCard(cardId: string, callback: Function);
    }

    export class CardService implements ICardService {
        static $inject = ['$http', '$q'];

        http: ng.IHttpService;
        q: ng.IQService;

        constructor($http: ng.IHttpService, $q: ng.IQService) {
            this.http = $http;
            this.q = $q;
        }

        getCards(callback: Function): ng.IPromise<void> {
            return this.http.get('/api/cards/all').then((data) => {
                callback(data.data);
            }, (error) => {
                callback(error);
            });
        }

        getSettings(successCallback: Function): ng.IPromise<void> {
            return this.http.get('/api/cards/settings').then((data) => {
                successCallback(data.data);
            }, (error) => {
                successCallback(error);
            });
        }

        createCard(cardRequest: CardRequest, callback: Function) {
            return this.http.post('/api/cards/createRequest', cardRequest).then((data) => {
                callback(data.data);
            }, (data) => {
                callback(data.data);
            });
        }

        getViewPinToken(cardId: string, callback: Function) {
            return this.http.get('/api/cards/viewPinToken/'+cardId).then((data) => {
                callback(data.data);
            }, (data) => {
                callback(data.data);
            });
        }

        activateCard(request: ActivateCardRequest, callback: Function) {
            return this.http.post('/api/cards/activate/', request).then((data) => {
                callback(data.data);
            }, (data) => {
                callback(data.data);
            });
        }

        payCard(cardId: string, callback: Function) {
            return this.http.post('/api/cards/pay', '"' + cardId + '"').then((data) => {
                callback(data.data);
            }, (data) => {
                callback(data.data);
            });
        }

        blockCard(cardId: string, callback: Function) {
            return this.http.post('/api/cards/block', '"' + cardId + '"').then((data) => {
                callback(data.data);
            }, (data) => {
                callback(data.data);
            });
        }
    }

    export class ActivateCardRequest {
        cardId: string;
        pan: string;

        constructor(cardId: string, pan: string) {
            this.cardId = cardId;
            this.pan = pan;
        }
    }

    export enum ServiceErrors {
        NeedKyc = 1,
        TechicalProblem = 13
    }
}
