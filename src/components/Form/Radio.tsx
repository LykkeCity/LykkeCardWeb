import * as React from 'react';
import {Bordered} from '../Bordered/index';
import {Label} from './index';

// tslint:disable-next-line:no-var-requires
const {Radio: ReRadio} = require('rebass');

interface RadioActions {
  onChange?: any;
}

interface RadioProps extends RadioActions {
  label: string;
  checked: boolean;
  name: string;
}

export const Radio: React.SFC<RadioProps> = ({
  checked,
  label,
  name,
  onChange
}) => (
  <Bordered>
    <Label>
      <ReRadio
        // tslint:disable-next-line:jsx-no-lambda
        onChange={onChange}
        name={name}
        value={label}
        defaultChecked={checked}
      />
      {label}
    </Label>
  </Bordered>
);

interface RadioGroupProps extends RadioActions {
  value: string;
  labels: string[];
  name: string;
}

export const RadioGroup: React.SFC<RadioGroupProps> = ({
  labels,
  value,
  name,
  onChange
}) => (
  <div>
    {labels.map(x => (
      <Radio
        onChange={onChange}
        name={name}
        key={x}
        checked={x === value}
        label={x}
      />
    ))}
  </div>
);

export default RadioGroup;
