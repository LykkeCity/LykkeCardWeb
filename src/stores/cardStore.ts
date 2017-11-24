import {extendObservable, observable} from 'mobx';
import {CardApi} from '../api/cardApi';
import {CardModel} from '../models/cardModel';
import RootStore from './rootStore';

export default class CardStore {
  @observable cards: CardModel[] = [];
  @observable newCard: CardModel = new CardModel(this);

  constructor(
    private readonly rootStore: RootStore,
    private readonly api: CardApi
  ) {
    // tslint:disable-next-line:no-console
    console.log(this.rootStore);
  }

  createCard = (card: Partial<CardModel>) =>
    extendObservable(this.newCard, card);

  orderCard = (card: Partial<CardModel>) => this.api.order(card);
}
