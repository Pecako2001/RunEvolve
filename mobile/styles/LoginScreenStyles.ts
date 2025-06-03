import { StyleSheet } from 'react-native';
import { Colors, spacing, radius, font } from '../theme';

export default function styles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
      backgroundColor: colors.background,
    },
    input: {
      width: '100%',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginVertical: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.inputBg,
      fontFamily: font.regular,
      color: colors.foreground,
    },
    error: {
      color: colors.error,
      marginVertical: spacing.sm,
    },
  });
}
