module CardModule {
    export class CardRequest {
        nameOnCard: string;
        cardType: CardType;
        currency: string;
        deliveryAddress: DeliveryAddress;
        deliveryType: DeliveryType;

        constructor() {
            this.cardType = CardType.Plastic;
            this.deliveryType = DeliveryType.Standard;
            this.deliveryAddress = new DeliveryAddress();
            this.nameOnCard = '';
        }
    }

    export class DeliveryAddress {
        city: string;
        zipCode: string;
        country: string;
        address: string;
    }

    export enum DeliveryType {
        Standard = 'StandardTrackableDelivery',
        Express = 'ExpressDelivery'
    }
}
