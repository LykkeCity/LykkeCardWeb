import {CardStore, UiStore} from './index';

export default class RootStore {
  readonly cardStore: CardStore;
  readonly uiStore: UiStore;

  constructor() {
    this.cardStore = new CardStore(this);
    this.uiStore = new UiStore(this);
  }
}
