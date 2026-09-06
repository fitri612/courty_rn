import { useBookings } from "@/api/hooks/useBookings";
import { BookingStatusFilter } from "@/api/types";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const TABS: { label: string; status: BookingStatusFilter }[] = [
  { label: "Upcoming", status: "UPCOMING" },
  { label: "Past", status: "PAST" },
  { label: "Cancelled", status: "CANCELLED" },
];

export default function BookingsScreen() {
  const [status, setStatus] = useState<BookingStatusFilter>("UPCOMING");
  const { data, isLoading, isError } = useBookings(status);

  const activeTab = TABS.find((t) => t.status === status)!;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>

      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <Pressable
            key={t.status}
            style={[styles.tab, status === t.status && styles.tabActive]}
            onPress={() => setStatus(t.status)}
          >
            <Text style={[styles.tabText, status === t.status && styles.tabTextActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading && <ActivityIndicator style={{ marginTop: 24 }} />}
      {isError && <Text style={styles.error}>Couldn't load your bookings.</Text>}
      {!isLoading && !isError && data?.length === 0 && (
        <Text style={styles.empty}>No {activeTab.label.toLowerCase()} bookings yet.</Text>
      )}

      <FlatList
        data={data ?? []}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/booking/${item.id}`)}>
            <Text style={styles.cardTitle}>{item.facility.name}</Text>
            <Text style={styles.cardSubtitle}>
              {item.court.name} · {item.date} · {item.startTime}–{item.endTime}
            </Text>
            <Text style={styles.reference}>Ref: {item.bookingReference}</Text>
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.badge,
                  item.status === "CANCELLED" && styles.badgeCancelled,
                  item.status === "COMPLETED" && styles.badgePast,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.status === "CANCELLED" && styles.badgeTextCancelled,
                    item.status === "COMPLETED" && styles.badgeTextPast,
                  ]}
                >
                  {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                </Text>
              </View>
              <Text style={styles.price}>Rp{item.totalPrice.toLocaleString("id-ID")}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 16 },
  header: { fontSize: 26, fontWeight: "700", marginBottom: 16 },
  tabRow: { flexDirection: "row", marginBottom: 16, backgroundColor: "#F1F5F9", borderRadius: 10, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: "center" },
  tabActive: { backgroundColor: "#fff" },
  tabText: { color: "#64748B", fontWeight: "500", fontSize: 13 },
  tabTextActive: { color: "#0F172A" },
  error: { color: "#e11d48", marginTop: 16 },
  empty: { color: "#666", marginTop: 24, textAlign: "center" },
  card: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSubtitle: { color: "#666", marginTop: 4, fontSize: 13 },
  reference: { color: "#94A3B8", marginTop: 4, fontSize: 12 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#E0F2FE",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeCancelled: { backgroundColor: "#FEE2E2" },
  badgePast: { backgroundColor: "#F1F5F9" },
  badgeText: { fontSize: 11, color: "#0369A1", fontWeight: "600" },
  badgeTextCancelled: { color: "#B91C1C" },
  badgeTextPast: { color: "#64748B" },
  price: { fontSize: 13, fontWeight: "600", color: "#0F172A" },
});