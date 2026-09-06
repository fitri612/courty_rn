import { AvailabilityCourt, AvailabilitySlot } from '@/api/types';
import { BookingSlotItem } from '@/components/common/Card/item-booking';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';

interface BookingCourtAccordionProps {
  court: AvailabilityCourt;
  isExpanded: boolean;
  onToggle: () => void;
  selectedCourtId?: string;
  selectedStartTime?: string;
  onSelectSlot: (court: AvailabilityCourt, slot: AvailabilitySlot) => void;
}

export const BookingCourtAccordion = ({
  court,
  isExpanded,
  onToggle,
  selectedCourtId,
  selectedStartTime,
  onSelectSlot,
}: BookingCourtAccordionProps) => {
  const availableSlotsCount = court.slots.filter((s) => s.available).length;

  return (
    <Animated.View layout={LinearTransition} style={styles.cardContainer}>
      {/* Accordion Header */}
      <Pressable
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
        onPress={onToggle}
      >
        <View style={styles.headerInfo}>
          <Text style={styles.courtName}>{court.name}</Text>
          <Text style={styles.courtMeta}>
            {court.type.toLowerCase()} · {court.indoor ? 'indoor' : 'outdoor'} ·{' '}
            <Text style={styles.slotCountText}>{availableSlotsCount} slots left</Text>
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color="#0F172A" />
        </View>
      </Pressable>

      {/* Accordion Content */}
      {isExpanded && (
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(150)} style={styles.content}>
          <View style={styles.slotGrid}>
            {court.slots.map((slot) => {
              const isSelected = selectedCourtId === court.id && selectedStartTime === slot.startTime;
              return (
                <BookingSlotItem
                  key={slot.startTime}
                  slot={slot}
                  isSelected={isSelected}
                  onPress={() => onSelectSlot(court, slot)}
                />
              );
            })}
          </View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  headerPressed: {
    backgroundColor: '#F1F5F9',
  },
  headerInfo: {
    flex: 1,
    marginRight: 8,
  },
  courtName: {
    fontSize: 12,
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
    textTransform: 'capitalize',
  },
  courtMeta: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'Poppins-Regular',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  slotCountText: {
    color: '#16A34A',
    fontFamily: 'Poppins-Medium',
  },
  arrowContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  content: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});