import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

// Standardized spacing based on 8px grid
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Responsive breakpoints
export const breakpoints = {
  mobile: 767,
  tablet: 1023,
  desktop: 1024,
};

// Screen dimensions
export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  spacing,
  breakpoints,
};