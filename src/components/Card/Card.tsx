import {rem} from 'polished';
import styled from 'styled-components';

export const Card = styled.div`
  width: 500px;
  height: 310px;
  opacity: 0.1;
  border-radius: 12px;
  background-image: linear-gradient(
    to bottom,
    rgba(241, 245, 255, 0.8),
    rgba(241, 245, 255, 0.6) 98%
  );
  margin-bottom: ${rem('80px')};
`;

export default Card;
