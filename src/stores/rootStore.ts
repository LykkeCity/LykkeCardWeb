import {CardStore} from './index';

export default class RootStore {
  readonly cardStore: CardStore;

  constructor() {
    this.cardStore = new CardStore(this);
  }
}
