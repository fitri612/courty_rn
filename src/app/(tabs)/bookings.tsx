import { DEFAULT_TABS } from '@/api/default';
import { useBookings } from '@/api/hooks/useBookings';
import { BookingStatusFilter } from '@/api/types';
import { ItemHistory } from '@/components/common/Card/item-history';
import { HeaderPrimary } from '@/components/header';
import { Colors } from '@/constants/theme';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function BookingsScreen() {
  const [status, setStatus] = useState<BookingStatusFilter>('UPCOMING');
  const {data, isLoading, isError} = useBookings(status);

  const activeTab = DEFAULT_TABS?.find((t) => t.status === status)!;

  return (
    <View style={styles.container}>
      <HeaderPrimary title="My Bookings" variant="textOnly" />

      <View style={styles.tabRow}>
        {DEFAULT_TABS?.map((t) => (
          <Pressable key={t.status} style={[styles.tab, status === t.status && styles.tabActive]} onPress={() => setStatus(t.status)}>
            <Text style={[styles.tabText, status === t.status && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      {isLoading && <ActivityIndicator style={{marginTop: 24}} />}
      {isError && <Text style={styles.error}>Couldn't load your bookings.</Text>}
      {!isLoading && !isError && data?.length === 0 && <Text style={styles.empty}>No {activeTab.label.toLowerCase()} bookings yet.</Text>}

      <FlatList
        data={data ?? []}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{paddingBottom: 24}}
        renderItem={({item}) => (
          <ItemHistory item={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16},
  tabRow: {flexDirection: 'row', marginBottom: 16, backgroundColor: Colors['global'].primary, borderRadius: 10, padding: 4},
  tab: {flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center'},
  tabActive: {backgroundColor: '#fff'},
  tabText: {color: Colors['global'].secondary, fontFamily: 'Poppins-Medium', fontSize: 10},
  tabTextActive: {color: '#0F172A'},
  error: {color: '#e11d48', marginTop: 16},
  empty: {color: '#666', marginTop: 24, textAlign: 'center'},
});
