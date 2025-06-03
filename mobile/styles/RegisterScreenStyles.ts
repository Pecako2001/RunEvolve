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
    toggleRow: {
      flexDirection: 'row',
      backgroundColor: colors.inputBg,
      borderRadius: radius.md,
      marginBottom: spacing.lg,
    },
    toggleButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: 'center',
      borderRadius: radius.md,
    },
    toggleActive: {
      backgroundColor: colors.accent,
    },
    toggleText: {
      fontFamily: font.regular,
      color: colors.foreground,
    },
    toggleTextActive: {
      color: '#ffffff',
    },
    title: {
      fontFamily: font.regular,
      fontWeight: 'bold',
      color: colors.foreground,
      marginBottom: spacing.lg,
    },
    inputRow: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginVertical: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.inputBg,
    },
    inputField: {
      flex: 1,
      fontFamily: font.regular,
      color: colors.foreground,
    },
    icon: {
      marginLeft: spacing.sm,
    },
    checkboxRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.sm,
    },
    checkboxLabel: {
      marginLeft: spacing.sm,
      color: colors.foreground,
      fontFamily: font.regular,
    },
    altRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing.md,
    },
    link: {
      color: colors.accent,
      marginLeft: spacing.sm,
    },
    socialRow: {
      flexDirection: 'row',
      marginTop: spacing.lg,
    },
    socialButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: spacing.sm,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    error: {
      color: colors.error,
      marginVertical: spacing.sm,
    },
  });
}
