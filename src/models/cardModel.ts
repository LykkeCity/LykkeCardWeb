import {observable} from 'mobx';
import CardStore from '../stores/cardStore';

export enum CardType {
  Plastic,
  Virtual
}

export class CardModel {
  @observable type: CardType;
  @observable asset: string; // TODO: convert to assetModel
  @observable name: string;

  constructor(private readonly store: CardStore) {
    // tslint:disable-next-line:no-console
    console.log(this.store);
  }
}

export default CardModel;
