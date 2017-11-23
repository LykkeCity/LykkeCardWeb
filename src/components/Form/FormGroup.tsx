import {rem} from 'polished';
import styled from 'styled-components';

export const FormGroup = styled.div`
  margin-bottom: ${rem('20px')};
  & > label {
    font-weight: bold;
  }
  & > input,
  & > select {
    margin-top: ${rem('5px')};
  }
`;

export default FormGroup;
