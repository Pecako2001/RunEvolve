import { StyleSheet } from 'react-native';
import { Colors, spacing } from '../theme';

export default function styles(colors: Colors) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: spacing.md,
    },
    title: {
      fontSize: 20,
      marginBottom: spacing.lg,
      color: colors.foreground,
    },
  });
}
