import { showToast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getApiErrorMessage } from "../../api/client";
import { useAvailability } from "../../api/hooks/useAvailability";
import { useCreateBooking } from "../../api/hooks/useBookings";
import { AvailabilityCourt, AvailabilitySlot } from "../../api/types";

// Quick-pick strip: today + next 6 days. The calendar icon opens the full
// native picker for anything further out — the API contract
// (date=YYYY-MM-DD) is the same either way.
function nextDays(count: number) {
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function toDateOnlyString(date: Date) {
  // Avoids UTC/toISOString shifting the day backwards for negative-offset
  // timezones (e.g. late evening in WIB rolling to the previous UTC day).
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

interface Selection {
  court: AvailabilityCourt;
  slot: AvailabilitySlot;
}

export default function NewBookingScreen() {
  const { facilityId } = useLocalSearchParams<{ facilityId: string }>();
  const quickDates = nextDays(7);
  const [selectedDate, setSelectedDate] = useState(quickDates[0]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const insets = useSafeAreaInsets();

  const { data, isLoading, isError } = useAvailability(facilityId, selectedDate);
  const createBooking = useCreateBooking();

  const applyDate = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelection(null); // slots belong to a specific date, so clear on change
  };

  const handlePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") {
      // Android's picker is an imperative dialog that closes itself —
      // hide our wrapper regardless of whether the user picked or cancelled.
      setShowPicker(false);
    }
    if (event.type === "dismissed" || !date) return;
    applyDate(toDateOnlyString(date));
  };

  const toggleSlot = (court: AvailabilityCourt, slot: AvailabilitySlot) => {
    setError(null);
    setSelection((current) =>
      current?.court.id === court.id && current.slot.startTime === slot.startTime
        ? null // tapping the same slot again deselects it
        : { court, slot }
    );
  };

  const handleConfirm = () => {
    if (!selection) return;
 
   
    if (!useAuthStore.getState().token) {
      router.push("/(auth)/login");
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
          showToast("Booking confirmed!", "success");
          router.replace("/(tabs)/bookings");
        },
        onError: (err) => {
          const message = getApiErrorMessage(err, "Couldn't book this slot");
          setError(message);
          showToast(message, "error");
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateHeaderLabel}>{formatDisplayDate(selectedDate)}</Text>
        <Pressable
          style={styles.calendarButton}
          onPress={() => setShowPicker(true)}
          hitSlop={8}
        >
          <Ionicons name="calendar-outline" size={18} color="#0F172A" />
          <Text style={styles.calendarButtonText}>Pick a date</Text>
        </Pressable>
      </View>

      {/* <FlatList
        horizontal
        data={quickDates}
        keyExtractor={(d) => d}
        showsHorizontalScrollIndicator={false}
        style={styles.dateRow}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.dateChip, selectedDate === item && styles.dateChipActive]}
            onPress={() => applyDate(item)}
          >
            <Text style={[styles.dateText, selectedDate === item && styles.dateTextActive]}>
              {item.slice(5)}
            </Text>
          </Pressable>
        )}
      /> */}

      {showPicker && (
        <View style={Platform.OS === "ios" ? styles.iosPickerWrap : undefined}>
          <DateTimePicker
            value={new Date(`${selectedDate}T00:00:00`)}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            minimumDate={new Date()}
            onChange={handlePickerChange}
          />
          {Platform.OS === "ios" && (
            <Pressable style={styles.iosPickerDone} onPress={() => setShowPicker(false)}>
              <Text style={styles.iosPickerDoneText}>Done</Text>
            </Pressable>
          )}
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}
      {isLoading && <ActivityIndicator style={{ marginTop: 24 }} />}
      {isError && <Text style={styles.error}>Couldn't load availability for this date.</Text>}

      <ScrollView
        contentContainerStyle={{ paddingBottom: selection ? 112 + insets.bottom : 24 }}
        showsVerticalScrollIndicator={false}
      >
        {data?.courts.map((court) => (
          <View key={court.id} style={styles.courtSection}>
            <Text style={styles.courtName}>
              {court.name} · {court.type.toLowerCase()} · {court.indoor ? "indoor" : "outdoor"}
            </Text>
            <View style={styles.slotGrid}>
              {court.slots.map((slot) => {
                const isSelected =
                  selection?.court.id === court.id && selection.slot.startTime === slot.startTime;
                return (
                  <Pressable
                    key={slot.startTime}
                    disabled={!slot.available}
                    style={[
                      styles.slot,
                      !slot.available && styles.slotBooked,
                      isSelected && styles.slotSelected,
                    ]}
                    onPress={() => toggleSlot(court, slot)}
                  >
                    <Text
                      style={[
                        styles.slotTime,
                        !slot.available && styles.slotTimeBooked,
                        isSelected && styles.slotTextSelected,
                      ]}
                    >
                      {slot.startTime}
                    </Text>
                    <Text
                      style={[
                        styles.slotPrice,
                        !slot.available && styles.slotTimeBooked,
                        isSelected && styles.slotTextSelected,
                      ]}
                    >
                      {slot.available ? `Rp${(slot.price / 1000).toFixed(0)}k` : "Booked"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {selection && (
        <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>{selection.court.name}</Text>
            <Text style={styles.summarySubtitle}>
              {selectedDate} · {selection.slot.startTime}–{selection.slot.endTime} · Rp
              {selection.slot.price.toLocaleString("id-ID")}
            </Text>
          </View>
          <Pressable
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm booking</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 12 },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateHeaderLabel: { fontSize: 16, fontWeight: "700", color: "#0F172A" },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  calendarButtonText: { fontSize: 13, color: "#0F172A", fontWeight: "600" },
  dateRow: { flexGrow: 0, marginBottom: 12 },
  dateChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
  },
  dateChipActive: { backgroundColor: "#0F172A" },
  dateText: { color: "#334155" },
  dateTextActive: { color: "#fff" },
  iosPickerWrap: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  iosPickerDone: { alignItems: "flex-end", padding: 10 },
  iosPickerDoneText: { color: "#0F172A", fontWeight: "600" },
  error: { color: "#e11d48", marginBottom: 8 },
  courtSection: { marginBottom: 20 },
  courtName: { fontSize: 15, fontWeight: "600", marginBottom: 8, textTransform: "capitalize" },
  slotGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: {
    width: "31%",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  slotBooked: { backgroundColor: "#F8FAFC", borderColor: "#F1F5F9" },
  slotSelected: { backgroundColor: "#16A34A", borderColor: "#16A34A" },
  slotTime: { fontWeight: "600", fontSize: 13, color: "#0F172A" },
  slotPrice: { fontSize: 11, color: "#16A34A", marginTop: 2 },
  slotTimeBooked: { color: "#94A3B8" },
  slotTextSelected: { color: "#fff" },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  summary: { marginBottom: 10 },
  summaryTitle: { fontSize: 15, fontWeight: "600" },
  summarySubtitle: { color: "#666", fontSize: 13, marginTop: 2 },
  confirmButton: { backgroundColor: "#0F172A", borderRadius: 10, padding: 16, alignItems: "center" },
  confirmButtonText: { color: "#fff", fontWeight: "600" },
});