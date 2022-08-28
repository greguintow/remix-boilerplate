import { alpha, createTheme } from '@mui/material/styles'
import { theme } from './theme'

export const pxToRem = (px: number): string => `${px / 16}rem`

export const materialTheme = createTheme({
  palette: {
    primary: {
      main: theme.colors.primary
    }
  },
  typography: {
    fontFamily: theme.fontFamily.default,
    h1: {
      fontFamily: theme.fontFamily.heading
    },
    h2: {
      fontFamily: theme.fontFamily.heading
    },
    h3: {
      fontFamily: theme.fontFamily.heading
    },
    h4: {
      fontFamily: theme.fontFamily.heading
    },
    h5: {
      fontFamily: theme.fontFamily.heading
    },
    h6: {
      fontFamily: theme.fontFamily.heading
    }
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true
      },
      styleOverrides: {
        root: {
          fontFamily: theme.fontFamily.heading,
          textTransform: 'none',
          fontSize: pxToRem(14),
          fontWeight: '500',
          borderRadius: '6px',
          transition: 'all 0.2s linear'
        },
        sizeMedium: {
          padding: '10px 20px',
          '@media (min-width: 960px)': {
            height: 40
          },
          '@media (max-width: 960px)': {
            borderRadius: '12px',
            fontSize: pxToRem(16)
          }
        },
        sizeSmall: {
          padding: '6px 10px'
        },
        sizeLarge: {
          padding: '13px 30px'
        },
        contained: {
          '&:disabled': {
            backgroundColor: theme.button.disabledBackground,
            color: theme.button.disabledText
          }
        },
        containedPrimary: {
          color: theme.button.color
        },
        containedSecondary: {
          backgroundColor: theme.grey.fourth,
          color: theme.text.main,
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: alpha(theme.grey.fourth, 0.8)
          },
          '&:active': {
            backgroundColor: alpha(theme.grey.fourth, 0.6)
          }
        },
        outlined: {
          padding: '6px 30px',
          borderWidth: '2px !important'
        },
        outlinedPrimary: {
          borderColor: alpha(theme.button.background, 0.5)
        },
        text: {
          fontWeight: 400,
          padding: '2px 5px',
          '& .MuiButton-label': {
            justifyContent: 'space-between'
          }
        }
      }
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true
      },
      styleOverrides: {
        root: {
          color: theme.text.main
        },
        shrink: {
          marginBottom: 8,
          position: 'initial',
          transform: 'unset',
          transformOrigin: 'unset'
        },
        asterisk: {
          color: theme.tags.red
        }
      }
    },
    MuiInput: {
      defaultProps: {
        disableUnderline: true
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: pxToRem(13),
          boxShadow: `0 0 0 1px ${theme.border.light}`,
          height: 40,
          marginTop: '0 !important',
          '&.Mui-focused': {
            boxShadow: `0 0 0 1px ${theme.colors.primary}`
          },
          '&.Mui-error': {
            boxShadow: `0 0 0 1px ${theme.tags.red}`
          },
          '&.Mui-disabled': {
            boxShadow: `0 0 0 1px ${theme.border.thin}`,
            backgroundColor: alpha(theme.grey.fourth, 0.5),
            color: theme.grey.main
          },
          '& .MuiIconButton-root.MuiIconButton-edgeEnd': {
            marginRight: 0,
            marginLeft: -4
          }
        },
        input: {
          padding: '10px 15px',
          '&::placeholder': {
            fontSize: pxToRem(13),
            textTransform: 'none',
            color: theme.input.placeholder
          }
        }
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        positionStart: {
          marginLeft: '16px',
          marginRight: '4px'
        },
        positionEnd: {
          marginRight: '8px'
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: 'standard'
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-disabled': {
            WebkitTextFillColor: null
          }
        },
        multiline: {
          height: 'auto !important'
        },
        input: {
          '&::placeholder': {
            color: theme.text.description,
            opacity: 0.7
          }
        }
      }
    }
  }
})
