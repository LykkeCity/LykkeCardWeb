import * as React from 'react';
import {Bordered} from '../Bordered/index';
import {Button} from '../Button/index';
import {FormGroup, Input, Label, Select} from '../Form/index';
import {Title} from '../Typography/index';

// tslint:disable-next-line:no-var-requires
const {Flex, Box, Radio, Text} = require('rebass');

const CardTypePicker = () => (
  <Flex align="center">
    <Box w={1 / 2} mr={3}>
      <Bordered align="center">
        <Text p={4}>Plastic</Text>
      </Bordered>
    </Box>
    <Box w={1 / 2}>
      <Bordered align="center">
        <Text p={4}>Virtual</Text>
      </Bordered>
    </Box>
  </Flex>
);

export const CardForm = () => (
  <div>
    <section>
      <Title>Card Info</Title>
      <CardTypePicker />
      <div>
        <Flex>
          <Box w={1 / 3}>
            <Label>Type of payment system</Label>
          </Box>
          <Box w={2 / 3}>
            <Bordered>
              <Label>
                <Radio name="asset" defaultChecked={true} />
                EUR
              </Label>
            </Bordered>
            <Bordered>
              <Label>
                <Radio name="asset" />
                GBP
              </Label>
            </Bordered>
            <Bordered>
              <Label>
                <Radio name="asset" />
                USD
              </Label>
            </Bordered>
          </Box>
        </Flex>
      </div>
      <FormGroup>
        <Label>Name on the card</Label>
        <Input defaultValue="" placeholder="Dustin Cox" />
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
      <Button w={'100%'}>Proceed</Button>
    </Flex>
  </div>
);

export default CardForm;
