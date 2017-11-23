import {rem} from 'polished';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Heading: ReHeading} = require('rebass');

export const Heading = styled(ReHeading)`
  color: white;
  font-family: 'Akrobat';
  font-size: ${rem('60px')};
  font-weight: bold;
  margin-top: ${rem('100px')};
  margin-bottom: ${rem('50px')};
  text-align: center;
`;

export default Heading;
