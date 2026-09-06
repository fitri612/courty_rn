import { getApiErrorMessage } from '@/api/client';
import { useAvailability } from '@/api/hooks/useAvailability';
import { useCreateBooking } from '@/api/hooks/useBookings';
import { AvailabilityCourt, AvailabilitySlot } from '@/api/types';
import { HeaderPrimary } from '@/components/header';
import { showToast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/authStore';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookingCourtAccordion } from '../../components/content/booking-accordion';
import { BookingDatePicker } from '../../components/content/booking-datepicker';
import { BookingFooterBar } from '../../components/content/booking-footer';

function nextDays(count: number) {
  return Array.from({length: count}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function formatDisplayDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

interface Selection {
  court: AvailabilityCourt;
  slot: AvailabilitySlot;
}

export default function NewBookingScreen() {
  const {facilityId} = useLocalSearchParams<{facilityId: string}>();
  const quickDates = nextDays(7);
  const [selectedDate, setSelectedDate] = useState(quickDates[0]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [expandedCourtId, setExpandedCourtId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const {data, isLoading, isError} = useAvailability(facilityId, selectedDate);
  const createBooking = useCreateBooking();

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelection(null);
  };

  const handleToggleCourt = (courtId: string) => {
    setExpandedCourtId((currentId) => (currentId === courtId ? null : courtId));
  };

  const toggleSlot = (court: AvailabilityCourt, slot: AvailabilitySlot) => {
    setError(null);
    setSelection((current) => (current?.court.id === court.id && current.slot.startTime === slot.startTime ? null : {court, slot}));
  };

  const handleConfirm = () => {
    if (!selection) return;

    if (!useAuthStore.getState().token) {
      router.push('/(auth)/login');
      return;
    }

    setError(null);
    createBooking.mutate(
      {
        facilityId: facilityId as string,
        courtId: selection.court.id,
        date: selectedDate,
        startTime: selection.slot.startTime,
        endTime: selection.slot.endTime,
      },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showToast('Booking confirmed!', 'success');
          router.replace('/(tabs)/bookings');
        },
        onError: (err) => {
          const message = getApiErrorMessage(err, "Couldn't book this slot");
          setError(message);
          showToast(message, 'error');
        },
      },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPrimary title="Booking" variant="back" showNotification={false} onBackPress={() => router.back()} />

      <BookingDatePicker selectedDate={selectedDate} displayFormattedDate={formatDisplayDate(selectedDate)} onDateChange={handleDateChange} />

      {error && <Text style={styles.error}>{error}</Text>}
      {isLoading && <ActivityIndicator style={styles.loader} color="#0F172A" />}
      {isError && <Text style={styles.error}>Couldn't load availability for this date.</Text>}

      <ScrollView contentContainerStyle={{paddingBottom: selection ? 112 + insets.bottom : 24}} showsVerticalScrollIndicator={false}>
        {data?.courts.map((court) => (
          <BookingCourtAccordion
            key={court.id}
            court={court}
            isExpanded={expandedCourtId === court.id}
            onToggle={() => handleToggleCourt(court.id)}
            selectedCourtId={selection?.court.id}
            selectedStartTime={selection?.slot.startTime}
            onSelectSlot={toggleSlot}
          />
        ))}
      </ScrollView>

      {selection && <BookingFooterBar selection={selection} selectedDate={selectedDate} paddingBottom={16 + insets.bottom} isPending={createBooking.isPending} onConfirm={handleConfirm} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  loader: {
    marginTop: 24,
  },
  error: {
    color: '#E11D48',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
  },
});
