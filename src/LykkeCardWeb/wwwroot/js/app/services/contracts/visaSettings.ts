module CardModule {
    export class VisaSettings {
        availableCurrencies: string[];
        availableCountries: Country[];
        plasticCreationPrices: Price[];
        virtualCreationPrices: Price[];
        standardDeliveryPrices: Price[];
        expressDeliveryPrices: Price[];
    }

    export class Country {
        iso2: string;
        iso3: string;
        name: string;
    }

    export class Price {
        currency: string;
        fee: Fee;
    }

    export class Fee {
        lykke: number;
        waveCrest: number;
        total: number;
    }
}
