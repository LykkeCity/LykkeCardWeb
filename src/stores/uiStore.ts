import {observable} from 'mobx';
import {RootStore} from './index';

export default class UiStore {
  @observable showOrderCardWindow = false;

  constructor(private readonly rootStore: RootStore) {
    // tslint:disable-next-line:no-console
    console.log(this.rootStore);
  }
}
