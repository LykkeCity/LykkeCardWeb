import * as React from 'react';
import {CardCarouselNav} from './index';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('rebass');

export const CardCarousel: React.SFC = ({children}) => (
  <div>
    <CardCarouselNav />
    <Flex align="center" justify="center">
      {children}
    </Flex>
  </div>
);

export default CardCarousel;
