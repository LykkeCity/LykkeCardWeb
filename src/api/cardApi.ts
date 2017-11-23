import {CardModel} from '../models/index';

export interface CardApi {
  order: (card: CardModel) => Promise<any>;
}

export class RestCardApi implements CardApi {
  order = (card: any) => Promise.resolve({id: new Date().getUTCDate()});
}
