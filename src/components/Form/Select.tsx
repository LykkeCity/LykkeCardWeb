import {rem} from 'polished';
import {Select} from 'rebass';
import styled from 'styled-components';

export default styled(Select)`
  select {
    padding: ${rem('14px')} ${rem('20px')};
  }
  svg {
    top: 10px;
  }
`;
