import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const Shimmer = ShimmerPlaceholder as unknown as React.ComponentType<any>;

interface TabSkeletonProps {
  count?: number;
}

export const TabSkeleton = ({count = 5}: TabSkeletonProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {Array.from({length: count}).map((_, index) => (
        <Shimmer key={index} LinearGradient={LinearGradient} style={styles.chipSkeleton} shimmerColors={['#CBD5E1', '#E2E8F0', '#CBD5E1']} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipSkeleton: {
    width: 80,
    height: 38,
    borderRadius: 19,
    marginRight: 8,
  },
});
