module CardModule {
    export interface ISubscribeService {
        subscribe(email: string, successCallback: Function);
    }

    export class SubscribeService implements ISubscribeService {
        http: ng.IHttpService;

        constructor($http: ng.IHttpService) {
            this.http = $http;
        }

        subscribe(email: string, successCallback: Function) {
            this.http.post('/api/Subscriber', { email: email }).then((data) => {
                successCallback(data.data);
            }, (error) => {
                successCallback(error);
            });
        }
    }
}
