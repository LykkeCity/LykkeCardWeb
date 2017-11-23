import {rem} from 'polished';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Input: ReInput} = require('rebass');

export const Input = styled(ReInput)`
  padding: ${rem('14px')} ${rem('20px')};
`;

export default Input;
