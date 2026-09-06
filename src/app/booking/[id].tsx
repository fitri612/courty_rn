import { getApiErrorMessage } from '@/api/client';
import { useBooking, useCancelBooking } from '@/api/hooks/useBookings';
import { ImageWithFallback } from '@/components/common/image-with-fallback';
import { HeaderPrimary } from '@/components/header';
import { showToast } from '@/components/ui/toast';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CancelBookingModal } from '../../components/content/cancel-booking';

export default function BookingDetailScreen() {
  const {id} = useLocalSearchParams<{id: string}>();
  const {data: booking, isLoading, isError} = useBooking(id);
  const cancelBooking = useCancelBooking();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0F172A" />
      </SafeAreaView>
    );
  }

  if (isError || !booking) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>Couldn't load this booking detail.</Text>
      </SafeAreaView>
    );
  }

  const isConfirmed = booking.status === 'CONFIRMED';
  const isCancelled = booking.status === 'CANCELLED';

  const handleExecuteCancel = () => {
    setError(null);
    cancelBooking.mutate(booking.id, {
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowCancelModal(false);
        showToast('Booking cancelled', 'success');
        router.back();
      },
      onError: (err) => {
        const message = getApiErrorMessage(err, "Couldn't cancel this booking");
        setError(message);
        setShowCancelModal(false);
        showToast(message, 'error');
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPrimary title="Booking Detail" variant="back" showNotification={false} onBackPress={() => router.back()} />

      <ScrollView contentContainerStyle={{paddingBottom: isConfirmed ? 100 : 32}} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <ImageWithFallback source={{uri: booking.facility.imageUrl}} style={styles.heroImage} contentFit="cover" transition={200} />
          <View style={styles.heroOverlay}>
            <Text style={styles.facilityTitle}>{booking.facility.name}</Text>
            <Text style={styles.refCode}>Ref: {booking.bookingReference}</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.sectionLabel}>Status</Text>
          <View style={[styles.badge, isCancelled && styles.badgeCancelled, isConfirmed && styles.badgeConfirmed]}>
            <Text style={[styles.badgeText, isCancelled && styles.badgeTextCancelled, isConfirmed && styles.badgeTextConfirmed]}>
              {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
            </Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Schedule Information</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#64748B" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Court</Text>
              <Text style={styles.infoValue}>{booking.court.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color="#64748B" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{booking.date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={20} color="#64748B" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Time Slot</Text>
              <Text style={styles.infoValue}>
                {booking.startTime} – {booking.endTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Summary Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.cardHeaderTitle}>Payment Details</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Court Fee</Text>
            <Text style={styles.priceValue}>Rp{(booking.price ?? 0).toLocaleString('id-ID')}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>Rp{(booking.serviceFee ?? 0).toLocaleString('id-ID')}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalValue}>Rp{booking.totalPrice.toLocaleString('id-ID')}</Text>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      {isConfirmed && (
        <View style={[styles.bottomBar, {paddingBottom: 16 + insets.bottom}]}>
          <Pressable style={({pressed}) => [styles.cancelButton, pressed && styles.buttonPressed]} onPress={() => setShowCancelModal(true)}>
            <Ionicons name="close-circle-outline" size={20} color="#E11D48" />
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </Pressable>
        </View>
      )}

      {/* Custom Confirmation Modal */}
      <CancelBookingModal visible={showCancelModal} isLoading={cancelBooking.isPending} onClose={() => setShowCancelModal(false)} onConfirm={handleExecuteCancel} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16},
  centerContainer: {flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF'},
  heroCard: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginVertical: 12,
  },
  heroImage: {width: '100%', height: '100%'},
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    padding: 16,
  },
  facilityTitle: {color: '#FFFFFF', fontSize: 18, fontFamily: 'Poppins-Bold'},
  refCode: {color: '#CBD5E1', fontSize: 12, fontFamily: 'Poppins-Regular', marginTop: 2},
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  sectionLabel: {fontSize: 12, color: '#0F172A', fontFamily: 'Poppins-Bold'},
  badge: {paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, backgroundColor: '#F1F5F9'},
  badgeConfirmed: {backgroundColor: '#DCFCE7'},
  badgeCancelled: {backgroundColor: '#FEE2E2'},
  badgeText: {fontSize: 10, fontFamily: 'Poppins-Bold', color: '#64748B'},
  badgeTextConfirmed: {color: '#166534'},
  badgeTextCancelled: {color: '#991B1B'},
  sectionCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderTitle: {fontSize: 12, color: '#0F172A', fontFamily: 'Poppins-Bold', marginBottom: 14},
  infoRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12},
  infoTextGroup: {flex: 1},
  infoLabel: {fontSize: 10, color: '#64748B', fontFamily: 'Poppins-Regular'},
  infoValue: {fontSize: 12, color: '#0F172A', fontFamily: 'Poppins-SemiBold'},
  priceRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8},
  priceLabel: {fontSize: 10, color: '#64748B', fontFamily: 'Poppins-Regular'},
  priceValue: {fontSize: 10, color: '#0F172A', fontFamily: 'Poppins-Medium'},
  divider: {height: 1, backgroundColor: '#E2E8F0', marginVertical: 10},
  totalLabel: {fontSize: 12, color: '#0F172A', fontFamily: 'Poppins-Bold'},
  totalValue: {fontSize: 12, color: '#0F172A', fontFamily: 'Poppins-Bold'},
  errorText: {color: '#E11D48', textAlign: 'center', fontFamily: 'Poppins-Regular', marginVertical: 8},
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#FECDD3',
    backgroundColor: '#FFF1F2',
    height: 50,
    borderRadius: 14,
  },
  buttonPressed: {opacity: 0.8},
  cancelButtonText: {color: '#E11D48', fontSize: 12, fontFamily: 'Poppins-Bold'},
});
