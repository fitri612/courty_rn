import { AvailabilityCourt, AvailabilitySlot } from '@/api/types';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

interface Selection {
  court: AvailabilityCourt;
  slot: AvailabilitySlot;
}

interface BookingFooterBarProps {
  selection: Selection;
  selectedDate: string;
  paddingBottom: number;
  isPending: boolean;
  onConfirm: () => void;
}

export const BookingFooterBar = ({selection, selectedDate, paddingBottom, isPending, onConfirm}: BookingFooterBarProps) => {
  return (
    <View style={[styles.footer, {paddingBottom}]}>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>{selection.court.name}</Text>
        <Text style={styles.summarySubtitle}>
          {selectedDate} · {selection.slot.startTime}–{selection.slot.endTime} · Rp
          {selection.slot.price.toLocaleString('id-ID')}
        </Text>
      </View>
      <Pressable style={styles.confirmButton} onPress={onConfirm} disabled={isPending}>
        {isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.confirmButtonText}>Confirm booking</Text>}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  summary: {
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 15,
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
  },
  summarySubtitle: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    fontFamily: 'Poppins-Regular',
  },
  confirmButton: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Poppins-Bold',
  },
});
