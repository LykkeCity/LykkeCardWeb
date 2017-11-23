import {extendObservable, observable} from 'mobx';
import {CardModel} from '../models/cardModel';
import RootStore from './rootStore';

export default class CardStore {
  @observable cards: CardModel[] = [];
  @observable newCard: CardModel = new CardModel(this);

  constructor(private readonly rootStore: RootStore) {
    // tslint:disable-next-line:no-console
    console.log(this.rootStore);
  }

  createCard = (card: Partial<CardModel>) =>
    extendObservable(this.newCard, card);
}
