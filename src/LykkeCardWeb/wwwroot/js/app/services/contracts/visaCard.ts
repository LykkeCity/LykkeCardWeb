module CardModule {
    export class VisaCard {
        id: string;
        nameOnCard: string;
        expiryDate: string;
        cardType: CardType;
        currency: string;
        pan: string;
        status: string;
        balance: number;

        flipped: boolean;
    }

    export enum CardType {
        Plastic = 'Plastic',
        Virtual = 'Virtual'
    }

    export enum CardStatus {
        NeedPayment = 'NeedPayment',
        Pending = 'Pending',
        NeedKyc = 'NeedKyc',
        Issued = 'Issued',
        Shipping = 'Shipping',
        Activated = 'Activated',
        Blocked = 'Blocked'
    }
}
