import {rem} from 'polished';
import styled from 'styled-components';
import {SubHeading} from './index';

export const Title = styled(SubHeading)`
  font-size: ${rem('24px')};
  margin-top: ${rem('60px')};
  margin-bottom: ${rem('35px')};
  padding: 0;
`;

export default Title;
