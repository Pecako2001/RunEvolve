import { StyleSheet } from 'react-native';
import { spacing } from '../theme';

export default StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    padding: spacing.md,
  },
  title: {
    fontSize: 20,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  cell: {
    flex: 1,
    fontSize: 12,
  },
  chart: {
    alignSelf: 'center',
  },
});
