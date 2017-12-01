/// <reference path="../../typings/globals/angular/index.d.ts" />
/// <reference path="../../typings/globals/jquery/index.d.ts" />

module CardModule {
    export class CardController {
        static $inject = ['ICardService'];

        cardService: ICardService;
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

        constructor(cardService: ICardService) {
            this.cardService = cardService;
            this.newCard = new CardRequest();
            this.fees = new NewCardFees();
            this.settings = new VisaSettings();
            this.newCardForm = {};
            this.qrcode = '';
            this.error = '';
            this.createCardError = '';
            this.processing = false;

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
            return !(this.newCard.cardType === CardType.Virtual || this.newCardForm.$valid) || this.processing;
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
    }

    export class NewCardFees {
        plasticCreation: number;
        virtualCreation: number;
        standard: number;
        express: number;
        total: number;
    }
}
