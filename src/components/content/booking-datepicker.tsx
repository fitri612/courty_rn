import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface BookingDatePickerProps {
  selectedDate: string;
  displayFormattedDate: string;
  onDateChange: (dateStr: string) => void;
}

function toDateOnlyString(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Generate 14 hari ke depan untuk quick selector
function generateQuickDates(count = 14) {
  return Array.from({length: count}).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);

    return {
      fullDate: toDateOnlyString(d),
      dayName: d.toLocaleDateString('en-US', {weekday: 'short'}), // "Mon", "Tue"
      dayNumber: d.getDate(), // 1, 2, 3
      monthName: d.toLocaleDateString('en-US', {month: 'short'}), // "Sep"
      isToday: i === 0,
    };
  });
}

export const BookingDatePicker = ({selectedDate, displayFormattedDate, onDateChange}: BookingDatePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const quickDates = useMemo(() => generateQuickDates(14), []);

  const handlePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event.type === 'dismissed' || !date) return;
    onDateChange(toDateOnlyString(date));
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.dateHeader}>
        <View style={styles.titleWrapper}>
          <Text style={styles.dateHeaderLabel}>{displayFormattedDate}</Text>
          <Text style={styles.dateHeaderSub}>Select date & time slot</Text>
        </View>

        <Pressable style={({pressed}) => [styles.calendarButton, pressed && styles.buttonPressed]} onPress={() => setShowPicker(true)} hitSlop={8}>
          <Ionicons name="calendar-outline" size={18} color="#0F172A" />
        </Pressable>
      </View>

      {/* Quick Pick Date Strip */}
      <FlatList
        horizontal
        data={quickDates}
        keyExtractor={(item) => item.fullDate}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stripContainer}
        renderItem={({item}) => {
          const isSelected = selectedDate === item.fullDate;

          return (
            <Pressable style={({pressed}) => [styles.dateCard, isSelected && styles.dateCardSelected, pressed && styles.buttonPressed]} onPress={() => onDateChange(item.fullDate)}>
              <Text style={[styles.dayName, isSelected && styles.textSelected]}>{item.isToday ? 'Today' : item.dayName}</Text>
              <Text style={[styles.dayNumber, isSelected && styles.textSelected]}>{item.dayNumber}</Text>
              <Text style={[styles.monthName, isSelected && styles.textSelected]}>{item.monthName}</Text>
            </Pressable>
          );
        }}
      />

      {/* Native Date Picker Modal/Wrapper */}
      {showPicker && (
        <View style={Platform.OS === 'ios' ? styles.iosPickerWrap : undefined}>
          <DateTimePicker value={new Date(`${selectedDate}T00:00:00`)} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} minimumDate={new Date()} onChange={handlePickerChange} />
          {Platform.OS === 'ios' && (
            <Pressable style={styles.iosPickerDone} onPress={() => setShowPicker(false)}>
              <Text style={styles.iosPickerDoneText}>Done</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleWrapper: {
    flex: 1,
  },
  dateHeaderLabel: {
    fontSize: 12,
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
  },
  dateHeaderSub: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'Poppins-Regular',
    marginTop: -2,
  },
  calendarButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{scale: 0.96}],
  },
  stripContainer: {
    paddingRight: 16,
    gap: 8,
  },
  dateCard: {
    width: 50,
    height: 76,
    backgroundColor: '#FAFAFA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  dateCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#90CAF9',
  },
  dayName: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: 'Poppins-Medium',
  },
  dayNumber: {
    fontSize: 14,
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
    marginVertical: 1,
  },
  monthName: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: 'Poppins-Regular',
  },
  textSelected: {
    color: '#0F172A',
  },
  activeDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#F59E0B', // Aksen warna kuning
  },
  iosPickerWrap: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginTop: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iosPickerDone: {
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  iosPickerDoneText: {
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
  },
});
