import {rem} from 'polished';
import QRCode from 'qrcode.react';
import * as React from 'react';
import styled from 'styled-components';
import {CardModel} from '../../models';
import {Button} from '../Button';
import {Link} from '../Link';
import {Title} from '../Typography';

// tslint:disable-next-line:no-var-requires
const {Fixed, Overlay, Flex, Circle} = require('rebass');

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  li {
    margin-bottom: ${rem('20px')};
  }
`;

const ListItem = ({label, idx}: any) => (
  <li>
    <Circle bg="#333" mr={20}>
      {idx}
    </Circle>
    {label}
  </li>
);

interface OrderCardWindowProps {
  card: CardModel;
  show: boolean;
  onClose: any;
}

export const OrderCardWindow: React.SFC<OrderCardWindowProps> = ({
  card,
  show,
  onClose
}) => {
  if (!show) {
    document.body.style.overflow = 'auto';
    return null;
  }
  document.body.style.overflow = 'hidden';
  return (
    <div>
      {/* tslint:disable-next-line:jsx-boolean-value */}
      <Fixed top right bottom left onClick={onClose} />
      <Overlay w={512} p={30}>
        <Title mt={10}>Payment confirmation</Title>
        <List>
          {[
            'Log in to your Lykke Wallet app',
            'Tap Scan in the pop-up message',
            'Scan the QR code below',
            'Confirm the transaction'
          ].map((x, idx) => <ListItem key={idx} label={x} idx={++idx} />)}
        </List>
        <Flex mt={45} mb={45} justify="center">
          <QRCode size={200} value={JSON.stringify(card.asJson)} />
        </Flex>
        <Flex mt={60} align="center">
          <Button w={'100%'}>Resend the QR code scan message</Button>
        </Flex>
        <Flex align="center" justify="center" mt={20}>
          <Link onClick={onClose}>Close and go back</Link>
        </Flex>
      </Overlay>
    </div>
  );
};

export default OrderCardWindow;
