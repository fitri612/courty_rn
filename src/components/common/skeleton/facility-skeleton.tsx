import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const Shimmer = ShimmerPlaceholder as unknown as React.ComponentType<any>;

interface FacilitySkeletonProps {
  count?: number;
}

export const FacilitySkeleton = ({ count = 3 }: FacilitySkeletonProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.cardSkeleton}>
          {/* Main Card Content */}
          <View style={styles.cardContent}>
            {/* Image Placeholder */}
            <Shimmer
              LinearGradient={LinearGradient}
              style={styles.imageSkeleton}
              shimmerColors={['#CBD5E1', '#E2E8F0', '#CBD5E1']}
            />

            {/* Right Body Content */}
            <View style={styles.cardBody}>
              <View style={styles.titleContainer}>
                {/* Title */}
                <Shimmer
                  LinearGradient={LinearGradient}
                  style={styles.titleSkeleton}
                  shimmerColors={['#CBD5E1', '#E2E8F0', '#CBD5E1']}
                />
                {/* Subtitle */}
                <Shimmer
                  LinearGradient={LinearGradient}
                  style={styles.subtitleSkeleton}
                  shimmerColors={['#CBD5E1', '#E2E8F0', '#CBD5E1']}
                />
              </View>

              {/* Meta Row (Rating & Price) */}
              <View style={styles.cardMetaRow}>
                <Shimmer
                  LinearGradient={LinearGradient}
                  style={styles.ratingSkeleton}
                  shimmerColors={['#CBD5E1', '#E2E8F0', '#CBD5E1']}
                />
                <Shimmer
                  LinearGradient={LinearGradient}
                  style={styles.priceSkeleton}
                  shimmerColors={['#CBD5E1', '#E2E8F0', '#CBD5E1']}
                />
              </View>
            </View>
          </View>

          {/* Card Footer Divider & Text */}
          <View style={styles.cardFooter}>
            <Shimmer
              LinearGradient={LinearGradient}
              style={styles.footerSkeleton}
              shimmerColors={['#CBD5E1', '#E2E8F0', '#CBD5E1']}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  cardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 14,
  },
  imageSkeleton: {
    width: 96,
    height: 96,
    borderRadius: 18,
  },
  cardBody: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  titleContainer: {
    gap: 8,
  },
  titleSkeleton: {
    width: '85%',
    height: 18,
    borderRadius: 6,
  },
  subtitleSkeleton: {
    width: '60%',
    height: 13,
    borderRadius: 4,
  },
  cardMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingSkeleton: {
    width: 60,
    height: 14,
    borderRadius: 6,
  },
  priceSkeleton: {
    width: 75,
    height: 18,
    borderRadius: 6,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerSkeleton: {
    width: 130,
    height: 13,
    borderRadius: 4,
  },
});