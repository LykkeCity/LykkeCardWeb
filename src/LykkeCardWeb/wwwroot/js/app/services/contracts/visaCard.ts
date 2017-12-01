﻿module CardModule {
    export class VisaCard {
        id: string;
        nameOnCard: string;
        expiryDate: string;
        cardType: CardType;
        currency: string;
        pan: string;
        status: string;
        balance: number;
    }

    export enum CardType {
        Plastic = 'Plastic',
        Virtual = 'Virtual'
    }
}
