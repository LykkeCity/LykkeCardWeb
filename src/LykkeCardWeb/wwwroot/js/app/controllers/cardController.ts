/// <reference path="../../typings/globals/angular/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/wc.d.ts" />

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
        activateCardForm: ActivateCardForm;

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
                        this.error = result.error.errorMessage;
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
            this.activateCardForm = new ActivateCardForm();
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
            this.newCard = new CardRequest();

            if (this.settings.availableCurrencies)
                this.newCard.currency = this.settings.availableCurrencies[0];
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
                    this.cards.push(result.result.card);
                    this.qrcode = this.generateQrCode(result.result.operationId);
                    $('#modal_qrcode').modal();
                }
            });
        }

        generateQrCode(id: string):string {
            return btoa(JSON.stringify({Id: id}));
        }

        showPinModal(card: VisaCard) {
            card.flipped = false; 
            this.showCardModal(card, '#modal_showPin');
        }

        closeViewPin() {
            this.resetCounter(true);
        }

        showBlockModal(card: VisaCard) {
            card.flipped = false; 
            this.showCardModal(card, '#modal_blockCard');
        }

        blockCard() {
            this.cardService.blockCard(this.card.id, (result) => {
                if (result) {
                    this.card.status = this.card.status === 'Activated' ? 'Blocked' : 'Activated';
                }
                $('#modal_blockCard').modal('hide');
            });
        }

        viewPin() {
            $('#pin-loading').removeClass('hidden');
            $('#wc_cors_button').attr('disabled', 'disabled');
            this.viewPinForm.seconds = this.card.cardType === CardType.Plastic ? 30 : 60;

            this.cardService.getViewPinToken(this.card.id,
                (result) => {
                    if (result.error) {
                        this.createCardError = result.error.errorMessage;
                    } else {
                        wc_cors.getCardData(result.result);

                        $('#wc_cors_wrap').on('DOMNodeInserted', () => {
                            $('#pin-loading').addClass('hidden');
                            $('#pin-note').removeClass('hidden');

                            this.resetCounter(false);

                            this.viewPinForm.interval = this.interval(() => {
                                this.scope.$apply(() => { this.viewPinForm.seconds--; });
                                if (this.viewPinForm.seconds <= 0) {


                                    $('#pin-note').addClass('hidden');
                                }
                            }, 1000, null, null, this.viewPinForm);

                        });

                        $('#wc_cors_wrap').on('DOMNodeRemoved', () => {
                            this.resetCounter(false);
                            $('#pin-note').addClass('hidden');
                        });
                    }
                });
        }

        activateCard(card: VisaCard) {
            this.cardService.activateCard(new ActivateCardRequest(card.id, this.activateCardForm.pan), (result) => {
                if (result.error) {
                    this.activateCardForm.message = result.error.errorMessage;
                } else {
                    card.flipped = false;
                    card.status = 'Activated';
                }
            });
        }

        toggleActivate(card: VisaCard) {
            this.backToMainScreen();
            if (card.flipped)
                this.activateCardForm = new ActivateCardForm();

            card.flipped = !card.flipped;
        }

        payCard(cardId: string) {
            this.backToMainScreen();
            this.cardService.payCard(cardId, (result) => {
                if (result.error) {
                    //this.activateCardForm.message = result.error.errorMessage;
                } else {
                    this.qrcode = this.generateQrCode(result.result);
                    $('#modal_qrcode').modal();
                }
            });
        }

        private resetCounter(reload:boolean) {
            if (angular.isDefined(this.viewPinForm.interval)) {
                this.interval.cancel(this.viewPinForm.interval);

                if (reload)
                    wc_cors.reload();
            }
        }

        private showCardModal(card: VisaCard, modal: string) {
            this.backToMainScreen();
            this.card = card;
            $(modal).modal();
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

    export class ActivateCardForm {
        pan: string;
        message: string;
    }
}
