import formatPrice from '@/constants/utils/formatPrice';
import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  available: boolean;
  price: number;
}

interface BookingSlotItemProps {
  slot: AvailabilitySlot;
  isSelected: boolean;
  onPress: () => void;
}

export const BookingSlotItem = memo(({ slot, isSelected, onPress }: BookingSlotItemProps) => {
  const isBooked = !slot.available;

  return (
    <Pressable
      disabled={isBooked}
      style={({ pressed }) => [
        styles.slot,
        isBooked && styles.slotBooked,
        isSelected && styles.slotSelected,
        pressed && !isBooked && styles.slotPressed,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.slotTime,
          isBooked && styles.slotTimeBooked,
          isSelected && styles.slotTextSelected,
        ]}
      >
        {slot.startTime}
      </Text>

      {/* Bagian harga tidak diubah sesuai format awal */}
      <Text
        style={[
          styles.slotPrice,
          isBooked && styles.slotTimeBooked,
        ]}
      >
        {slot.available ? `Rp. ${formatPrice(slot.price)}` : 'Booked'}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  slot: {
    width: '31%',
    backgroundColor: '#FAFAFA', // Background lebih muda/soft
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  slotBooked: {
    backgroundColor: '#F8FAFC',
    borderColor: '#F1F5F9',
  },
  slotSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#28293F',     // Border tetap #28293F
    borderWidth: 2,
  },
  slotTime: {
    fontSize: 14,
    color: '#0F172A',
    fontFamily: 'Poppins-SemiBold',
  },
  slotPrice: {
    fontSize: 11,
    color: '#000',
    fontFamily: 'Poppins-Regular',
  },
  slotTimeBooked: {
    color: '#94A3B8',
  },
  slotTextSelected: {
    color: '#28293F', // Teks menyesuaikan warna tema border saat selected
    fontFamily: 'Poppins-Bold',
  },
});