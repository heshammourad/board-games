'use client';

import TextField, {TextFieldProps} from '@mui/material/TextField';
import {ChangeEvent} from 'react';

interface ScoreInputProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
}

export default function ScoreInput({
  value,
  onChange,
  ...props
}: ScoreInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    // If current value is '0' and user types a digit, remove the leading zero
    if (value === '0' && newVal.length > 1 && newVal.startsWith('0')) {
      onChange(newVal.slice(1));
    } else {
      onChange(newVal);
    }
  };

  return (
    <TextField
      type="number"
      size="small"
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
}