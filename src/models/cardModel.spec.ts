import CardStore from '../stores/cardStore';
import RootStore from '../stores/rootStore';
import {CardType} from './cardModel';

describe('card model', () => {
  describe('create card', () => {
    let cardStore: CardStore;

    beforeEach(() => {
      cardStore = new RootStore().cardStore;
    });

    it('should correctly extend passed card', () => {
      const card = cardStore.createCard({
        asset: 'LKK',
        name: 'John Doe',
        type: CardType.Plastic
      });

      expect(card).toBeDefined();
      expect(card).not.toBeNull();
      expect(card.type).toBe(CardType.Plastic);
      expect(card.name).toContain('John');
      expect(card.asset).toBe('LKK');
    });
  });
});
