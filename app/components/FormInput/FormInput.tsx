import type { ReactNode } from 'react'
import type { StandardTextFieldProps } from '@mui/material'
import { InputAdornment, TextField } from '@mui/material'

export interface FormInputProps extends StandardTextFieldProps {
  /**
   * defines the icon placed in the left side of the input
   */
  startIcon?: ReactNode
  /**
   * defines the icon placed in the right side of the input
   */
  endIcon?: ReactNode
  /**
   * defines if the input is in a loading state
   */
  loading?: boolean
}

export const FormInput = ({
  startIcon,
  endIcon,
  label,
  placeholder,
  required,
  ...props
}: FormInputProps) => {
  return (
    <TextField
      {...props}
      required={required}
      label={label}
      InputProps={{
        ...props.InputProps,
        startAdornment: startIcon && <InputAdornment position="start">{startIcon}</InputAdornment>,
        endAdornment: endIcon && <InputAdornment position="end">{endIcon}</InputAdornment>
      }}
    />
  )
}
