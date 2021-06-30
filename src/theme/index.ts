import { black, blue, green, grey, red, white, orange, bg, teal } from './colors';

const theme = {
  borderRadius: 12,
  color: {
    black,
    blue,
    grey,
    green,
    teal,
    yellow: '#ffe970',
    primary: {
      light: orange[200],
      main: '#400003',
    },
    secondary: grey[500],
    white,
    orange,
    red,
    danger: red[600],
    success: green[500],
    bg,
  },
  siteWidth: 1010,
  spacing: {
    1: 4,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 48,
    7: 64,
  },
  breakpoints: {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  topBarSize: 72,

  font: {
    monospace: `'Chakra Petch', Courier, monospace`,
    sans: `'Chakra Petch', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    heading: `'Pixel Emulator', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
  },
};

export default theme;
