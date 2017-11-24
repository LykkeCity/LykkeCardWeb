import {rem} from 'polished';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Button: ReButton} = require('rebass');

const Button = styled(ReButton)`
  border-radius: ${rem('100px')};
  background-color: #0388ef;
  font-size: ${rem('18px')};
  font-weight: 600;
  padding: ${rem('14px')} ${rem('40px')};
`;

export default Button;
