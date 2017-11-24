import {CardModel} from '../models/index';

export interface CardApi {
  order: (card: Partial<CardModel>) => Promise<any>;
}

export class RestCardApi implements CardApi {
  order = (card: Partial<CardModel>) => Promise.resolve(card.asJson);
}

export default RestCardApi;
