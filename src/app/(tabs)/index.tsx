import { useFacilities } from "@/api/hooks/useFacilities";
import { useSports } from "@/api/hooks/useSports";
import { Facility, Sport } from "@/api/types";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

const ALL_SPORTS: Sport = { id: "all", name: "All", slug: "" };

export default function FacilitiesScreen() {
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState<Sport>(ALL_SPORTS);

  const { data: sportsData, isLoading: isLoadingSports } = useSports();
  const sportChips = useMemo(() => [ALL_SPORTS, ...(sportsData ?? [])], [sportsData]);

  const filters = useMemo(
    () => ({
      search: search || undefined,
      sport: sport.slug || undefined,
    }),
    [search, sport]
  );

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFacilities(filters);

  const facilities = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find a court</Text>

      <TextInput
        style={styles.search}
        placeholder="Search facilities or city"
        value={search}
        onChangeText={setSearch}
      />

      {isLoadingSports ? (
        <ActivityIndicator style={{ alignSelf: "flex-start", marginBottom: 12 }} />
      ) : (
        <FlatList
          horizontal
          data={sportChips}
          keyExtractor={(s) => s.id}
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.chip, sport.id === item.id && styles.chipActive]}
              onPress={() => setSport(item)}
            >
              <Text
                style={[styles.chipText, sport.id === item.id && styles.chipTextActive]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      )}

      {isLoading && <ActivityIndicator style={{ marginTop: 24 }} />}
      {isError && <Text style={styles.error}>Couldn't load facilities. Pull to retry.</Text>}

      <FlatList
        data={facilities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        onEndReachedThreshold={0.4}
        onEndReached={() => hasNextPage && fetchNextPage()}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        renderItem={({ item }: { item: Facility }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/facility/${item.id}`)}>
            <Image source={{ uri: item.imageUrl }} style={styles.cardImage} contentFit="cover" transition={200} />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                {item.location} · {item.distanceKm.toFixed(1)} km
              </Text>
              <View style={styles.cardMetaRow}>
                <Text style={styles.rating}>
                  ★ {item.rating.toFixed(1)} ({item.reviewCount})
                </Text>
                <Text style={styles.price}>from Rp{item.startingPrice.toLocaleString("id-ID")}</Text>
              </View>
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
  search: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  chipRow: { marginBottom: 12, flexGrow: 0, height: 50 },
  chip: {
    minWidth: 92,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: "#0F172A" },
  chipText: { color: "#334155", fontSize: 13 },
  chipTextActive: { color: "#fff" },
  error: { color: "#e11d48", marginTop: 16 },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardImage: { width: 100, height: 100, backgroundColor: "#F1F5F9" },
  cardBody: { flex: 1, padding: 12, justifyContent: "center" },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardSubtitle: { color: "#666", marginTop: 2, fontSize: 13 },
  cardMetaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  rating: { fontSize: 13, color: "#B45309" },
  price: { fontSize: 13, fontWeight: "600" },
});