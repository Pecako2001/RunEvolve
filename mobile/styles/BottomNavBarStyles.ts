import { StyleSheet } from 'react-native';
import { spacing } from '../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: spacing.sm,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  centerButton: {
    backgroundColor: '#2563eb',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#ffffff',
    marginTop: 2,
  },
});
