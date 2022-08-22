import type { ReactNode } from 'react'
import { Box, CircularProgress, InputAdornment } from '@mui/material'
import type { InputProps } from './FormInput.style'
import { Input } from './FormInput.style'

export interface FormInputProps extends InputProps {
  /**
   * defines the label of the input
   * It will be showed as placeholder though
   */
  label?: string
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
  loading,
  success,
  ...props
}: FormInputProps) => {
  // const placeholderText = (placeholder || label || '') + (!required ? ' (Optional)' : '')

  return (
    <Input
      {...props}
      // success={success}
      required={required}
      label={label}
      // placeholder={placeholderText}
      InputProps={{
        ...props.InputProps,
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : null,
        endAdornment: (endIcon || loading || success) && (
          <InputAdornment position="end">
            {endIcon}
            {/* {success && (
              <Box ml={2} mr={1} display="flex" alignItems="center">
                <Check color="success" fontSize="large" />
              </Box>
            )} */}
            {/* {loading && <CircularProgress size={20} color="grey" sx={{ ml: 2, mr: 1 }} />} */}
          </InputAdornment>
        )
      }}
    />
  )
}
