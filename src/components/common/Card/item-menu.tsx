import { Sport } from '@/api/types';
import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface ItemTabMenuProps {
  item: Sport;
  isActive: boolean;
  onPress: (item: Sport) => void;
}

export const ItemTabMenu = memo(({ item, isActive, onPress }: ItemTabMenuProps) => {
  return (
    <Pressable
      style={[styles.chip, isActive && styles.chipActive]}
      onPress={() => onPress(item)}
    >
      <Text style={[styles.chipText, isActive && styles.chipTextActive]} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  chip: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#F59E0B' },
  chipText: {
    color: '#334155',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },
  chipTextActive: {
    color: '#0F172A',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
});