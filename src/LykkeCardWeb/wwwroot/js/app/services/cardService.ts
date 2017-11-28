module CardModule {
    export interface ICardService {
        getPersonalData(successCallback: Function);
        savePersonalData(profile: any, successCallback: Function);
        deleteAvatar(successCallback: Function);
    }

    export class CardService implements ICardService {
        http: ng.IHttpService;

        constructor($http: ng.IHttpService) {
            this.http = $http;
        }

        getPersonalData(successCallback: Function) {
            this.http.post('/profile/getpersonaldata', null).then((data) => {
                successCallback(data.data);
            }, (error) => {
                successCallback(error);
            });
        }

        savePersonalData(profile: any, successCallback: Function) {
            return this.http.post('/profile/savepersonaldata', profile).then((data) => {
                successCallback(data.data);
            }, (error) => {
                successCallback(error);
            });
        }

        deleteAvatar(successCallback: Function) {
            return this.http.post('/profile/deleteavatar', null).then((data) => {
                successCallback(data.data);
            }, (error) => {
                successCallback(error);
            });
        }
    }
}
