import {rem} from 'polished';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Border} = require('rebass');

export const Bordered = styled(Border)`
  border: solid 1px #cfd2d7;
  border-radius: 4px;
  padding: ${rem('20px')};
  margin: ${rem('10px')} 0;
`;

export default Bordered;
