import { Colors } from './Colors';
import { Typography } from './Typography';
import { RFValue } from 'react-native-responsive-fontsize';

export const Spacing = {
  xs: RFValue(4),
  s: RFValue(8),
  m: RFValue(16),
  l: RFValue(24),
  xl: RFValue(32),
  xxl: RFValue(40),
};

export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
};
