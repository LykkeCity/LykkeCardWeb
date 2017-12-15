/// <reference path="../../typings/globals/angular/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../typings/globals/wc.d.ts" />

module CardModule {
    import IPromise = angular.IPromise;

    export class CardController {
        static $inject = ['$scope', '$interval', '$timeout', '$q', 'ICardService'];

        interval: ng.IIntervalService;
        timeout: ng.ITimeoutService;
        scope: ng.IScope;
        q: ng.IQService;

        cardService: ICardService;
        data: Data;
        pageState: PageState;
        newCardForm: NewCardForm;
        qrCodeForm: QrCodeForm;
        viewPinForm: ViewPinForm;
        activateCardForm: ActivateCardForm;
        blockCardForm: BlockCardForm;

        constructor(scope: ng.IScope, interval: ng.IIntervalService, timeout: ng.ITimeoutService, q: ng.IQService, cardService: ICardService) {
            this.init(scope, interval, timeout, q, cardService);

            this.pageState.loading = true;

            var cardPromise = this.cardService.getCards((cards) => {
                this.data.cards = cards;
                console.log('cards');
            });

            var settingsPromise = this.cardService.getSettings((result) => {
                if (result.error) {
                    if (result.error.code === ServiceErrors.TechicalProblem) {
                        this.pageState.generalError = result.error.errorMessage;
                        $('#modal_error').modal();
                    } else {
                        this.pageState.error = result.error.errorMessage;
                    }
                } else {
                    this.data.settings = result.result.settings;
                    this.data.settings.isCardCreationFree = result.result.isCardCreationFree;
                    this.newCardForm.newCard.currency = this.data.settings.availableCurrencies[0];
                    this.updateFee();
                    console.log('settings');
                }
            });

            this.q.all([cardPromise, settingsPromise]).then(() => {
                this.pageState.loading = false;
                console.log('all');
            });
        }

        private init(scope: ng.IScope, interval: ng.IIntervalService, timeout: ng.ITimeoutService, q: ng.IQService, cardService: ICardService) {
            this.scope = scope;
            this.interval = interval;
            this.timeout = timeout;
            this.q = q;
            this.cardService = cardService;
            this.data = new Data();
            this.pageState = new PageState();
            this.newCardForm = new NewCardForm();
            this.qrCodeForm = new QrCodeForm();
            this.viewPinForm = new ViewPinForm();
            this.activateCardForm = new ActivateCardForm();
            this.blockCardForm = new BlockCardForm();

            $('#wc_cors_wrap').on('DOMNodeInserted', () => {
                this.resetCounter(false);
                this.viewPinForm.interval = this.interval(() => {
                    this.scope.$apply(() => { this.viewPinForm.seconds--; });

                    if (this.viewPinForm.seconds <= 0) {
                        this.viewPinForm.showNote = false;
                    }
                }, 1000, null, null, this.viewPinForm);

                this.scope.$apply(() => {
                    this.viewPinForm.loading = false;
                    this.viewPinForm.showNote = true;
                });
                this.viewPinForm.showNote = true;

            });

            $('#wc_cors_wrap').on('DOMNodeRemoved', () => {
                this.resetCounter(false);
                this.scope.$apply(() => {
                    this.viewPinForm.showNote = false;
                });
            });
        }

        addCard() {
            if (this.pageState.error) {
                this.pageState.action = 'error';
            } else {
                this.pageState.action = 'add';
            }
        }

        addCardDisabled() {
            return this.pageState.loading || this.data.cards && this.data.cards.filter(item => item.status === CardStatus.Pending || item.status === CardStatus.NeedPayment).length;
        }

        backToMainScreen() {
            this.pageState.action = null;
            this.newCardForm.newCard = new CardRequest();

            if (this.data.settings.availableCurrencies)
                this.newCardForm.newCard.currency = this.data.settings.availableCurrencies[0];
        }

        updateFee() {
            let creation: number;
            this.data.fees.plasticCreation = this.data.settings.plasticCreationPrices.filter(item => item.currency === this.newCardForm.newCard.currency)[0].fee.total;
            this.data.fees.virtualCreation = this.data.settings.virtualCreationPrices.filter(item => item.currency === this.newCardForm.newCard.currency)[0].fee.total;

            if (this.newCardForm.newCard.cardType === CardType.Plastic) {
                creation = this.data.settings.isCardCreationFree ? 0 : this.data.fees.plasticCreation;
                this.data.fees.standard = this.data.settings.standardDeliveryPrices.filter(item => item.currency === this.newCardForm.newCard.currency)[0].fee.total;
                this.data.fees.express = this.data.settings.expressDeliveryPrices.filter(item => item.currency === this.newCardForm.newCard.currency)[0].fee.total;
            } else {
                creation = this.data.fees.virtualCreation;
                this.data.fees.standard = 0;
                this.data.fees.express = 0;
            }

            this.data.fees.total = creation + (this.newCardForm.newCard.deliveryType === DeliveryType.Express ? this.data.fees.express : this.data.fees.standard);
        }

        isProceedDisabled() {
            return !(this.newCardForm.newCard.cardType === CardType.Virtual && this.newCardForm.newCard.nameOnCard && this.newCardForm.agree || this.newCardForm.form.$valid) || this.newCardForm.processing;
        }

        proceed() {
            this.newCardForm.processing = true;
            this.qrCodeForm.qrcode = null;
            this.cardService.createCard(this.newCardForm.newCard, (result) => {
                this.newCardForm.processing = false;
                if (result.error) {
                    this.pageState.generalError = result.error.errorMessage;
                    $('#modal_error').modal();
                } else {
                    this.data.cards.push(result.result.card);
                    this.qrCodeForm.qrcode = this.generateQrCode(result.result.operationId);
                    $('#modal_qrcode').modal();
                }
            });
        }

        generateQrCode(id: string): string {
            return btoa(JSON.stringify({ Id: id }));
        }

        showPinModal(card: VisaCard) {
            card.flipped = false;
            this.showCardModal(card, '#modal_showPin');
        }

        closeViewPin() {
            this.resetCounter(true);
            this.viewPinForm.loading = false;
            this.viewPinForm.showNote = false;
        }

        showBlockModal(card: VisaCard) {
            card.flipped = false;
            this.showCardModal(card, '#modal_blockCard');
        }

        blockCard() {
            this.blockCardForm.loading = true;

            this.cardService.blockCard(this.pageState.card.id, (result) => {
                if (result) {
                    this.pageState.card.status = this.pageState.card.status === CardStatus.Activated ? CardStatus.Blocked : CardStatus.Activated;
                }
                $('#modal_blockCard').modal('hide');
                this.blockCardForm.loading = false;
            });
        }

        viewPin() {
            this.viewPinForm.loading = true;
            this.viewPinForm.showNote = false;
            this.viewPinForm.seconds = this.pageState.card.cardType === CardType.Plastic ? 30 : 60;

            this.cardService.getViewPinToken(this.pageState.card.id,
                (result) => {
                    if (result.error) {
                        this.pageState.generalError = result.error.errorMessage;
                    } else {
                        wc_cors.getCardData(result.result);
                    }
                });
        }

        activateCard(card: VisaCard) {
            this.activateCardForm.loading = true;

            this.cardService.activateCard(new ActivateCardRequest(card.id, this.activateCardForm.pan), (result) => {
                if (result.error) {
                    this.activateCardForm.message = result.error.errorMessage;
                } else {
                    card.flipped = false;
                    card.status = CardStatus.Activated;
                    card.pan = this.activateCardForm.pan;
                }

                this.activateCardForm.loading = false;
            });
        }

        toggleActivate(card: VisaCard) {
            this.backToMainScreen();
            card.flipped = !card.flipped;
            this.activateCardForm = new ActivateCardForm();
        }

        payCard(cardId: string) {
            this.backToMainScreen();
            this.qrCodeForm.qrcode = null;
            this.qrCodeForm.message = null;
            this.qrCodeForm.loading = true;
            $('#modal_qrcode').modal();

            this.cardService.payCard(cardId, (result) => {
                if (result.error) {
                    this.qrCodeForm.message = result.error.errorMessage;
                } else {
                    this.qrCodeForm.qrcode = this.generateQrCode(result.result);
                }

                this.qrCodeForm.loading = false;
            });
        }

        getCardStatusName(card: VisaCard) {
            switch (card.status) {
                case CardStatus.Activated:
                    return card.cardType === CardType.Plastic ? '' : 'Virtual';
                case CardStatus.Issued:
                case CardStatus.Shipping:
                    return 'Not activated';
                case CardStatus.Pending:
                    return 'Pending';
                case CardStatus.NeedPayment:
                    return 'Unpaid';
                case CardStatus.Blocked:
                    return 'Blocked';
                default:
                    return '';
            }
        }

        private resetCounter(reload: boolean) {
            this.interval.cancel(this.viewPinForm.interval);

            if (reload) {
                this.stopAllTimeouts();
                this.timeout(() => {
                    wc_cors.reload();
                }, 0);
            }
        }

        private stopAllTimeouts() {
            var id = window.setTimeout(null, 0);
            while (id--) {
                window.clearTimeout(id);
            }
        }

        private showCardModal(card: VisaCard, modal: string) {
            this.backToMainScreen();
            this.pageState.card = card;
            $(modal).modal();
        }
    }

    export class Data {
        cards: VisaCard[] = [];
        settings: VisaSettings = new VisaSettings();
        fees: NewCardFees = new NewCardFees();
    }

    export class PageState {
        loading: boolean = false;
        card: VisaCard = null;
        error: string = null;
        action: string = null;
        generalError: string = null;
    }

    export class NewCardForm {
        newCard: CardRequest = new CardRequest();
        form: any = {};
        agree: boolean = false;
        processing: boolean = false;
    }

    export class QrCodeForm {
        qrcode: string = null;
        loading: boolean = false;
        message: string = null;
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
        seconds: number = 0;
        loading: boolean = false;
        showNote: boolean = false;
    }

    export class ActivateCardForm {
        pan: string;
        message: string = null;
        loading: boolean = false;

        constructor() {
            this.message = null;
            this.loading = false;
        }
    }

    export class BlockCardForm {
        loading: boolean;

        constructor() {
            this.loading = false;
        }
    }
}
