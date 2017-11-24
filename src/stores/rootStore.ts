import {CardApi} from '../api';
import {CardStore, UiStore} from './index';

export default class RootStore {
  readonly cardStore: CardStore;
  readonly uiStore: UiStore;

  constructor() {
    this.cardStore = new CardStore(this, new CardApi());
    this.uiStore = new UiStore(this);
  }
}
