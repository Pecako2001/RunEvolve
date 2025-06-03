import { StyleSheet } from 'react-native';
import { spacing, radius, font } from '../theme';

export default StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.sm,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: font.regular,
  },
  icon: {
    marginLeft: spacing.sm,
  },
});
