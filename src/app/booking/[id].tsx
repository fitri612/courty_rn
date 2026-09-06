import { showToast } from "@/components/ui/toast";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { getApiErrorMessage } from "../../api/client";
import { useBooking, useCancelBooking } from "../../api/hooks/useBookings";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: booking, isLoading, isError } = useBooking(id);
  const cancelBooking = useCancelBooking();
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (isError || !booking) return <Text style={styles.error}>Couldn't load this booking.</Text>;

  const confirmCancel = () => {
    Alert.alert("Cancel booking?", "This can't be undone.", [
      { text: "Keep booking", style: "cancel" },
      {
        text: "Cancel booking",
        style: "destructive",
        onPress: () => {
          setError(null);
          cancelBooking.mutate(booking.id, {
            onSuccess: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              showToast("Booking cancelled", "success");
              router.back();
            },
            onError: (err) => {
              const message = getApiErrorMessage(err, "Couldn't cancel this booking");
              setError(message);
              showToast(message, "error");
            },
          });
        },
      },
    ]);
  };

  const canCancel = booking.status === "CONFIRMED";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{booking.facility.name}</Text>
      <Text style={styles.reference}>Ref: {booking.bookingReference}</Text>

      <View style={styles.card}>
        <Row label="Court" value={booking.court.name} />
        <Row label="Date" value={booking.date} />
        <Row label="Time" value={`${booking.startTime} – ${booking.endTime}`} />
        <Row label="Total" value={`Rp${booking.totalPrice.toLocaleString("id-ID")}`} />
        <Row label="Status" value={booking.status.charAt(0) + booking.status.slice(1).toLowerCase()} />
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      {canCancel && (
        <Pressable style={styles.cancelButton} onPress={confirmCancel} disabled={cancelBooking.isPending}>
          {cancelBooking.isPending ? (
            <ActivityIndicator color="#e11d48" />
          ) : (
            <Text style={styles.cancelText}>Cancel booking</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, capitalize && { textTransform: "capitalize" }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  reference: { color: "#666", marginTop: 4, marginBottom: 16 },
  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 14, padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  rowLabel: { color: "#666" },
  rowValue: { fontWeight: "600" },
  error: { color: "#e11d48", marginTop: 16 },
  cancelButton: { borderWidth: 1, borderColor: "#e11d48", borderRadius: 10, padding: 16, alignItems: "center", marginTop: 24 },
  cancelText: { color: "#e11d48", fontWeight: "600" },
});