import {rem} from 'polished';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Heading} = require('rebass');

export const SubHeader = styled(Heading)`
  color: #111111;
  font-family: 'Akrobat';
  font-size: ${rem('40px')};
  font-weight: bold;
  padding-top: ${rem('60px')};
`;

export default SubHeader;
