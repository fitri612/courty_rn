import { useFacility } from "@/api/hooks/useFacility";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FacilityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: facility, isLoading, isError } = useFacility(id);
  const insets = useSafeAreaInsets();

  if (isLoading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (isError || !facility) return <Text style={styles.error}>Couldn't load this facility.</Text>;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 96 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: facility.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
        <View style={styles.body}>
          <Text style={styles.title}>{facility.name}</Text>
          <Text style={styles.address}>{facility.address}</Text>
          <Text style={styles.rating}>
            ★ {facility.rating.toFixed(1)} ({facility.reviewCount} reviews)
          </Text>

          {facility.description && <Text style={styles.description}>{facility.description}</Text>}

          {!!facility.sports?.length && (
            <>
              <Text style={styles.sectionTitle}>Sports</Text>
              <Text style={styles.text}>{facility.sports.join(", ")}</Text>
            </>
          )}

          {!!facility.amenities?.length && (
            <>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <Text style={styles.text}>{facility.amenities.join(", ")}</Text>
            </>
          )}

          {!!facility.courts?.length && (
            <>
              <Text style={styles.sectionTitle}>Courts</Text>
              {facility.courts.map((c) => (
                <View key={c.id} style={styles.courtRow}>
                  <Text style={styles.text}>
                    • {c.name} ({c.type.toLowerCase()}, {c.indoor ? "indoor" : "outdoor"})
                  </Text>
                  <Text style={styles.courtPrice}>Rp{c.basePrice.toLocaleString("id-ID")}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 16 + insets.bottom }]}>
        <Pressable
          style={styles.button}
          onPress={() => router.push({ pathname: "/booking/new", params: { facilityId: facility.id } })}
        >
          <Text style={styles.buttonText}>Check availability & book</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  image: { width: "100%", height: 220, backgroundColor: "#F1F5F9" },
  body: { padding: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  address: { color: "#666", marginTop: 4 },
  rating: { color: "#B45309", marginTop: 6 },
  description: { marginTop: 12, lineHeight: 20, color: "#334155" },
  sectionTitle: { fontSize: 15, fontWeight: "600", marginTop: 16, marginBottom: 4 },
  text: { color: "#334155", lineHeight: 20 },
  courtRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  courtPrice: { color: "#334155", fontWeight: "600", fontSize: 13 },
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
  button: { backgroundColor: "#0F172A", borderRadius: 10, padding: 16, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "#e11d48", margin: 24, textAlign: "center" },
});