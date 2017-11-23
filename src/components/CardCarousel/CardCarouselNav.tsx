import {margin, rem} from 'polished';
import * as React from 'react';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Circle, Flex} = require('rebass');

const CardCarouselNavButton = styled(Circle)`
  border: solid 2px white;
  font-size: ${rem('30px')};
  font-weight: 100;
  width: 50px;
  height: 50px;
  ${margin(0, rem('20px')) as any};
  &:first-child {
    opacity: 0.3;
  }
`;

export const CardCarouselNav = () => (
  <Flex align="center" justify="center" mb={50}>
    <CardCarouselNavButton bg="transparent">{'<'}</CardCarouselNavButton>
    <CardCarouselNavButton bg="transparent">{'>'}</CardCarouselNavButton>
  </Flex>
);

export default CardCarouselNav;
