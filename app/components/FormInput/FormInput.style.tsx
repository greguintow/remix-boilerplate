import type { StandardTextFieldProps } from '@mui/material'
import { TextField } from '@mui/material'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

export interface InputProps extends Omit<StandardTextFieldProps, 'label'> {
  /**
   * defines if the input is in a success state
   */
  success?: boolean
}

export const Input = styled(TextField)`
  /* ${props =>
    props.success &&
    css`
      .MuiInput-root:not(.Mui-error) {
        box-shadow: 0 0 0 1px ${props.theme.tags.green};
      }
      .MuiFormHelperText-root:not(.Mui-error) {
        color: ${props.theme.tags.green};
      }
    `} */
`
