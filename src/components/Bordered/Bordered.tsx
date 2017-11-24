import {rem} from 'polished';
import styled from 'styled-components';

// tslint:disable-next-line:no-var-requires
const {Border} = require('rebass');

interface BorderedProps {
  color?: string;
  size?: string | number;
}

export const Bordered = styled<BorderedProps>(Border)`
  border: solid ${props => props.size || '1px'}
    ${props => props.color || '#cfd2d7'};
  border-radius: 4px;
  padding: ${rem('20px')};
  margin: ${rem('10px')} 0;
`;

export default Bordered;
