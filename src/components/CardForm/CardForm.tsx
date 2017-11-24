import {inject, observer} from 'mobx-react';
import * as React from 'react';
import {CardModel, CardType} from '../../models/index';
import {UiStore} from '../../stores/';
import {RootStore} from '../../stores/index';
import {Bordered} from '../Bordered/index';
import {Button} from '../Button/index';
import {FormGroup, Input, Label, Select} from '../Form/index';
import {RadioGroup} from '../Form/Radio';
import {OrderCardWindow} from '../OrderCardWindow/OrderCardWindow';
import {Title} from '../Typography/index';

// tslint:disable-next-line:no-var-requires
const {Flex, Box, Radio, Text} = require('rebass');

interface CardTypeActions {
  onChange: any;
}

interface CardTypeItemProps extends CardTypeActions {
  name: string;
  w: any;
  checked: boolean;
}

const CardTypeItem = ({name, onChange, checked}: CardTypeItemProps) => (
  // tslint:disable-next-line:jsx-no-lambda
  <Box w={1 / 2} mr={3} onClick={() => onChange(name)}>
    <Bordered color={checked ? '#0388ef' : ''} size={checked ? '2px' : ''}>
      <Text p={4}>{name}</Text>
    </Bordered>
  </Box>
);

interface CardTypePickerProps extends CardTypeActions {
  items: string[];
  value: string;
}

const CardTypePicker = ({items, value, onChange}: CardTypePickerProps) => (
  <Flex align="center">
    {items.map((x: any) => (
      <CardTypeItem
        key={x}
        name={x}
        checked={x === value}
        onChange={onChange}
        w={1 / items.length}
      />
    ))}
  </Flex>
);

interface CardFormProps {
  card?: CardModel;
  uiStore?: UiStore;
}

export const CardForm: React.SFC<CardFormProps> = ({card, uiStore}) => {
  if (!card) {
    return null;
  }

  const handleChangeName = (e: any) =>
    card.update({name: e.currentTarget.value});
  const handleChangeAsset = (e: any) =>
    card.update({asset: e.currentTarget.value});
  const handleChangeType = (type: any) => card.update({type});

  const toggleWindow = () =>
    (uiStore!.showOrderCardWindow = !uiStore!.showOrderCardWindow);

  return (
    <div>
      <section>
        <Title>Card Info</Title>
        <CardTypePicker
          items={Object.keys(CardType)}
          value={card.type}
          onChange={handleChangeType}
        />
        <div>
          <Flex>
            <Box w={1 / 3}>
              <Label>Type of payment system</Label>
            </Box>
            <Box w={2 / 3}>
              <RadioGroup
                name="asset"
                labels={['EUR', 'GBP', 'USD']}
                value={card.asset}
                onChange={handleChangeAsset}
              />
            </Box>
          </Flex>
        </div>
        <FormGroup>
          <Label>Name on the card</Label>
          <Input
            defaultValue={card.name}
            onChange={handleChangeName}
            placeholder="Place your name here"
          />
        </FormGroup>
      </section>
      <section>
        <Title>Delivery Info</Title>
        <Flex>
          <Box w={1 / 3}>
            <Label mt={10}>Delivery option</Label>
          </Box>
          <Box w={2 / 3}>
            <Bordered>
              <Label>
                <Radio name="delivery" defaultChecked={true} />
                Standard
              </Label>
            </Bordered>
            <Bordered>
              <Label>
                <Radio name="delivery" />
                Express
              </Label>
            </Bordered>
          </Box>
        </Flex>
        <FormGroup>
          <Label>Country</Label>
          <Select>
            {new Array(10).fill('US').map((x, idx) => (
              <option key={idx} value={x}>
                {x}
              </option>
            ))}
          </Select>
        </FormGroup>
        <Flex>
          <Box w={1 / 2} mr={3}>
            <FormGroup>
              <Label>City</Label>
              <Input />
            </FormGroup>
          </Box>
          <Box w={1 / 2}>
            <FormGroup>
              <Label>ZIP</Label>
              <Input />
            </FormGroup>
          </Box>
        </Flex>
        <FormGroup>
          <Label>Address Line</Label>
          <Input />
        </FormGroup>
      </section>
      <Flex mt={60}>
        <Button w={'100%'} onClick={toggleWindow}>
          Proceed
        </Button>
      </Flex>
      <OrderCardWindow
        card={card}
        show={uiStore!.showOrderCardWindow!}
        onClose={toggleWindow}
      />
    </div>
  );
};

export default inject(({cardStore: {newCard: card}, uiStore}: RootStore) => ({
  card,
  uiStore
}))(observer(CardForm));
