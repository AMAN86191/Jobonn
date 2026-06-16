import { TextStyle } from 'react-native';
import { Colors } from './Colors';
import { RFValue } from 'react-native-responsive-fontsize';

export const Typography: Record<string, TextStyle> = {
  h1: {
    fontSize: RFValue(22),
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: RFValue(16),
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: RFValue(13),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: RFValue(11),
    fontWeight: '400',
    color: Colors.textPrimary,
  },
  bodySmall: {
    fontSize: RFValue(10),
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: RFValue(9),
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  small: {
    fontSize: RFValue(8),
    fontWeight: '400',
    color: Colors.textSecondary,
  },
  button: {
    fontSize: RFValue(11),
    fontWeight: '600',
    color: Colors.textLight,
    letterSpacing: 0.2,
  },
};
