import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { materialTheme } from './theme'

export interface AppWrapperProps {
  children: React.ReactNode
}

export const AppWrapper = ({ children }: AppWrapperProps) => {
  return (
    <ThemeProvider theme={materialTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
