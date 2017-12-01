/// <reference path="../../typings/globals/angular/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />

module CardModule {
    export class SubscribeController {
        static $inject = ['ISubscribeService'];

        subscribeService: ISubscribeService;
        data: any;
        subscribeForm: any;

        constructor(subscribeService: ISubscribeService) {
            this.data = {
                email: '',
                hasError: false,
                message: ''
            };

            this.subscribeForm = {};

            this.subscribeService = subscribeService;
        }

        subscribe() {
            var data = this.data;
            this.subscribeService.subscribe(this.data.email, (res) => {
                if (res.error) {
                    data.hasError = true;
                    data.message = res.error;
                } else {
                    data.hasError = false;
                    data.message = 'Great! Сheck your inbox for confirmation';
                    data.email = '';
                }
            });
        }
    }
}