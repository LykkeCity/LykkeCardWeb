import {rem} from 'polished';
import styled from 'styled-components';
import {SubHeading} from './index';

interface TitleProps {
  mt?: number;
}

export const Title = styled<TitleProps>(SubHeading)`
  font-size: ${rem('24px')};
  margin-top: ${props => `${(props as any).mt}px` || rem('0px')};
  margin-bottom: ${rem('35px')};
  padding: 0;
`;

export default Title;
