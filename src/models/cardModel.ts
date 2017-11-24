import {computed, extendObservable, observable} from 'mobx';
import CardStore from '../stores/cardStore';

export enum CardType {
  Plastic = 'Plastic',
  Virtual = 'Virtual'
}

export class CardModel {
  @observable type: CardType = CardType.Plastic;
  @observable asset: string; // TODO: convert to assetModel
  @observable name: string;

  @computed
  get asJson() {
    return {
      asset: this.asset,
      name: this.name,
      type: this.type
    };
  }

  constructor(private readonly store: CardStore) {
    // tslint:disable-next-line:no-console
    console.log(this.store);
  }

  update = (props: Partial<CardModel>) => extendObservable(this, props);
}

export default CardModel;
