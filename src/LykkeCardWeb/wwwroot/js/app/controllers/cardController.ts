/// <reference path="../../typings/globals/angular/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />

module CardModule {
    import IPromise = angular.IPromise;

    export class CardController {
        static $inject = ['ICardService', '$scope', '$interval'];

        cardService: ICardService;
        interval: ng.IIntervalService;
        cards: VisaCard[];
        settings: VisaSettings;
        newCard: CardRequest;
        fees: NewCardFees;
        newCardForm: any;
        qrcode: string;
        error: string;
        action: string;
        createCardError: string;
        processing: boolean;
        slickConfig: any;
        card: VisaCard;
        viewPinForm: ViewPinForm;
        scope: ng.IScope;

        constructor(cardService: ICardService, scope: ng.IScope, interval: ng.IIntervalService) {
            this.init(cardService, scope, interval);

            this.cardService.getCards((cards) => {
                this.cards = cards;
            });

            this.cardService.getSettings((result) => {
                if (result.error) {
                    if (result.error.code === ServiceErrors.TechicalProblem) {
                        this.createCardError = result.error.errorMessage;
                        $('#modal_error').modal();
                    } else {
                        this.error = result.error.code;
                    }
                } else {
                    this.settings = result.result.settings;
                    this.newCard.currency = this.settings.availableCurrencies[0];
                    this.updateFee();
                }
            });
        }

        private init(cardService: ICardService, scope: ng.IScope, interval: ng.IIntervalService) {
            this.cardService = cardService;
            this.interval = interval;
            this.scope = scope;
            this.newCard = new CardRequest();
            this.fees = new NewCardFees();
            this.settings = new VisaSettings();
            this.newCardForm = {};
            this.qrcode = '';
            this.error = '';
            this.createCardError = '';
            this.processing = false;
            this.slickConfig = {
                dots: false,
                infinite: false,
                speed: 300,
                variableWidth: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                responsive: []
            };
            this.card = null;
            this.viewPinForm = new ViewPinForm();
            this.viewPinForm.seconds = 0;
        }

        addCard() {
            if (this.error) {
                this.action = 'error';
            } else {
                this.action = 'add';
            }
        }

        backToMainScreen() {
            this.action = '';
        }

        finish() {
            this.cardService.getCards((cards) => {
                this.cards = cards;
                this.backToMainScreen();
            });
        }

        updateFee() {
            var creation = 0;
            this.fees.plasticCreation = this.settings.plasticCreationPrices.filter(item => item.currency === this.newCard.currency)[0].fee.total;
            this.fees.virtualCreation = this.settings.virtualCreationPrices.filter(item => item.currency === this.newCard.currency)[0].fee.total;

            if (this.newCard.cardType === CardType.Plastic) {
                creation = this.fees.plasticCreation;
                this.fees.standard = this.settings.standardDeliveryPrices.filter(item => item.currency === this.newCard.currency)[0].fee.total;
                this.fees.express = this.settings.expressDeliveryPrices.filter(item => item.currency === this.newCard.currency)[0].fee.total;
            } else {
                creation = this.fees.virtualCreation;
                this.fees.standard = 0;
                this.fees.express = 0;
            }

            this.fees.total = creation + (this.newCard.deliveryType === DeliveryType.Express ? this.fees.express : this.fees.standard);
        }

        isProceedDisabled() {
            return !(this.newCard.cardType === CardType.Virtual && this.newCard.nameOnCard || this.newCardForm.$valid) || this.processing;
        }

        proceed() {
            this.processing = true;
            this.cardService.createCard(this.newCard, (result) => {
                this.processing = false;
                if (result.error) {
                    this.createCardError = result.error.errorMessage;
                    $('#modal_error').modal();
                } else {
                    this.qrcode = this.generateQrCode(result.result.operationId);
                    $('#modal_qrcode').modal();
                }
            });
        }

        generateQrCode(id: string):string {
            return btoa(JSON.stringify({Id: id}));
        }

        showPinModal(card: VisaCard) {
            this.backToMainScreen();
            this.card = card;
            $('#modal_showPin').modal();
        }

        viewPin() {
            $('#pin-loading').removeClass('hidden');
            $('#wc_cors_button').attr('disabled', 'disabled');

            this.cardService.getViewPinToken(this.card.id,
                (result) => {
                    if (result.error) {
                        this.createCardError = result.error.errorMessage;
                    } else {
                        console.log(result.result);
                        wc_cors.getCardData(result.result);

                        $('#wc_cors_wrap').on('DOMNodeInserted', () => {
                            $('#pin-loading').addClass('hidden');
                            $('#pin-note').removeClass('hidden');

                            this.scope.$apply(() => {
                                this.viewPinForm.seconds = 30;
                            });

                            if (angular.isDefined(this.viewPinForm.interval))
                                this.interval.cancel(this.viewPinForm.interval);

                            this.viewPinForm.interval = this.interval(() => {
                                this.scope.$apply(() => { this.viewPinForm.seconds--; });
                                if (this.viewPinForm.seconds <= 0) {
                                    this.closeViewPin();
                                    $('#pin-note').addClass('hidden');
                                }
                            }, 1000, null, null, this.viewPinForm);

                        });

                        $('#wc_cors_wrap').on('DOMNodeRemoved', () => {
                            if (angular.isDefined(this.viewPinForm.interval))
                                this.interval.cancel(this.viewPinForm.interval);
                            $('#pin-note').addClass('hidden');
                        });
                    }
                });
        }

        closeViewPin() {
            if (angular.isDefined(this.viewPinForm.interval)) {
                this.interval.cancel(this.viewPinForm.interval);
                wc_cors.reload();
            }
        }
    }

    export class NewCardFees {
        plasticCreation: number;
        virtualCreation: number;
        standard: number;
        express: number;
        total: number;
    }

    export class ViewPinForm {
        interval: IPromise<any>;
        seconds: number;
    }
}
