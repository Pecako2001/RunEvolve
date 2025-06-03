import { StyleSheet } from 'react-native';
import { Colors, spacing } from '../theme';

export default function styles(colors: Colors) {
  return StyleSheet.create({
    root: { flex: 1 },
    container: {
      flex: 1,
      padding: spacing.md,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 20,
      marginBottom: spacing.lg,
      color: colors.foreground,
      textAlign: 'center',
    },
    itemRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    itemText: {
      color: colors.foreground,
      fontSize: 16,
    },
    slider: {},
  });
}
