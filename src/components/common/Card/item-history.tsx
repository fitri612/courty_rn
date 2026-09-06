import { Booking } from '@/api/types';
import { ImageWithFallback } from '@/components/common/image-with-fallback';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ItemHistoryProps {
  item: Booking;
}

// Formatter Tanggal: 2026-09-06 -> Sun, 6 Sep 2026
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const ItemHistory = memo(({ item }: ItemHistoryProps) => {
  const isCancelled = item.status === 'CANCELLED';
  const isCompleted = item.status === 'COMPLETED';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={() => router.push(`/booking/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <ImageWithFallback
          source={{ uri: item.facility.imageUrl }}
          style={styles.facilityImage}
          contentFit="cover"
          transition={200}
          iconSize={24}
        />

        {/* Info Utama */}
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.facilityName} numberOfLines={1}>
              {item.facility.name}
            </Text>

            <View
              style={[
                styles.badge,
                isCancelled && styles.badgeCancelled,
                isCompleted && styles.badgeCompleted,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  isCancelled && styles.badgeTextCancelled,
                  isCompleted && styles.badgeTextCompleted,
                ]}
              >
                {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
              </Text>
            </View>
          </View>

          <Text style={styles.courtName} numberOfLines={1}>
            {item.court.name}
          </Text>

          <Text style={styles.bookingRef}>Ref: {item.bookingReference}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.timeInfo}>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          <Text style={styles.timeText}>
            {item.startTime} – {item.endTime}
          </Text>
        </View>

        <Text style={styles.priceText}>
          Rp{item.totalPrice.toLocaleString('id-ID')}
        </Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 14,
  },
  facilityImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  facilityName: {
    fontSize: 12,
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
    flex: 1,
    marginRight: 6,
  },
  courtName: {
    fontSize: 10,
    color: '#334155',
    fontFamily: 'Poppins-Medium',
  },
  bookingRef: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: '#E0F2FE', // Default (UPCOMING)
  },
  badgeCancelled: {
    backgroundColor: '#FEE2E2',
  },
  badgeCompleted: {
    backgroundColor: '#F1F5F9',
  },
  badgeText: {
    fontSize: 10,
    color: '#0369A1',
    fontFamily: 'Poppins-SemiBold',
  },
  badgeTextCancelled: {
    color: '#B91C1C',
  },
  badgeTextCompleted: {
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 10,
    color: '#475569',
    fontFamily: 'Poppins-Medium',
  },
  timeText: {
    fontSize: 10,
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
  },
  priceText: {
    fontSize: 12,
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
  },
});