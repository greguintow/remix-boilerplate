export type Mode = 'light' | 'dark'

export const theme = {
  mode: 'light' as Mode,
  modeColor: '#000',
  colors: {
    primary: '#8B58F5',
    secondary: '#8D9091',
    darker: '#1D2B4E',
    alternative: '#F49F0E'
  },
  background: {
    main: '#f8f9fa',
    disabled: '#EFEFEF',
    light: '#FFF',
    calm: '#F9FAFF',
    foreground: '#DEDEDE',
    darker: '#6c7288',
    summary: '#c5c4c4',
    box: '#fff'
  },
  text: {
    main: '#1D2B4E',
    description: '#90A0BB',
    link: '#4A90E2',
    light: '#fff',
    divider: '#959cb9'
  },
  grey: {
    main: '#918C9B',
    secondary: '#B5BED2',
    third: '#F4F9FD',
    fourth: '#E6EDF5',
    fifth: '#3c4043',
    darker: '#666b7f',
    darker2: '#545760',
    light: '#8A8A98',
    text: '#90A0BB',
    whiteLight: 'rgba(255, 255, 255, 0.8)'
  },
  tags: {
    black: '#000000',
    white: '#FFFFFF',
    yellow: '#F49F0E',
    red: '#FF5353',
    green: '#00C48C'
  },
  border: {
    thin: '#D8E0F0',
    darker: '#E2E2EA',
    colored: '#F49F0E',
    light: '#e4ebf5',
    step: 'rgba(0, 0, 0, 0.1)'
  },
  button: {
    background: '#6A29F2',
    hover: '#521ebf',
    color: 'white',
    disabledBackground: '#f5f5f5',
    disabledText: '#C9CBCD'
  },
  input: {
    borderFocus: '#0e63f4',
    background: 'rgba(194, 215, 244, 0.18)',
    placeholder: '#818791',
    border: 'rgba(194, 215, 244, 0.6)',
    pinBackground: 'transparent',
    pinBorder: '#e4ebf5'
  },
  shadow: {
    first: '0 3px 10px rgba(0, 0, 0, 0.04)',
    second: '0 7px 60px rgba(0, 0, 0, 0.12)',
    third: '0 2px 5px rgba(112, 144, 176, 0.12)',
    box: ' 0 0 0 1px #e4ebf5'
  },
  social: {
    background: 'transparent'
  },
  fontFamily: {
    default: `'Inter',"Helvetica","Arial",sans-serif`,
    heading: `'DM Sans', 'Helvetica', 'Arial', sans-serif`
  },
  icon: {
    auth: '#90A0BB',
    verifyBorder: '#f0f2f0',
    verifyBackground: '#f6f7f6'
  }
}

export type Theme = typeof theme

export const darkTheme: Theme = {
  ...theme,
  modeColor: '#fff',
  mode: 'dark',
  background: {
    ...theme.background,
    main: '#111315',
    box: '#242636'
  },
  text: {
    ...theme.text,
    main: '#fff'
  },
  social: {
    background: '#2C2E3D'
  },
  border: {
    ...theme.border,
    light: 'rgba(194, 215, 244, 0.2)',
    step: 'rgba(255, 255, 255, 0.1)'
  },
  grey: {
    ...theme.grey,
    text: 'rgba(255, 255, 255, 0.75)'
  },
  input: {
    ...theme.input,
    placeholder: '#a7b3c7',
    background: 'rgba(194, 215, 244, 0.1)',
    pinBackground: 'rgba(194, 215, 244, 0.1)',
    pinBorder: 'rgba(255, 255, 255, 0.1)'
  },
  icon: {
    ...theme.icon,
    auth: '#a3acb9',
    verifyBorder: '#565c6e',
    verifyBackground: 'rgba(255,255,255,0.1)'
  },
  button: {
    ...theme.button,
    disabledBackground: 'rgba(255,255,255,0.12)',
    disabledText: 'rgba(255,255,255,0.3)'
  },
  shadow: {
    ...theme.shadow,
    box: '15px 15px 50px 0 rgba(0, 0, 0, 0.04)'
  }
}
