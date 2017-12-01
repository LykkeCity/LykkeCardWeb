module CardModule {
    export interface ICardService {
        getCards(successCallback: Function);
        getSettings(successCallback: Function);
        createCard(cardRequest: CardRequest, callback: Function);
    }

    export class CardService implements ICardService {
        http: ng.IHttpService;

        constructor($http: ng.IHttpService) {
            this.http = $http;
        }

        getCards(successCallback: Function) {
            this.http.get('/api/cards/all').then((data) => {
                successCallback(data.data);
            }, (error) => {
                successCallback(error);
            });
        }

        getSettings(successCallback: Function) {
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
    }

    export enum ServiceErrors {
        NeedKyc = 1,
        TechicalProblem = 13
    }
}
