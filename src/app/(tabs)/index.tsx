import { useFacilities } from '@/api/hooks/useFacilities';
import { useSports } from '@/api/hooks/useSports';
import { Facility, Sport } from '@/api/types';
import { ItemTabMenu } from '@/components/common/Card/item-menu';
import { FacilityCard } from '@/components/common/facility-card';
import { FacilitySkeleton } from '@/components/common/skeleton/facility-skeleton';
import { TabSkeleton } from '@/components/common/skeleton/tab-skeleton';
import { HeaderPrimary } from '@/components/header';
import { useAuthStore } from '@/store/authStore';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

const ALL_SPORTS: Sport = { id: 'all', name: 'All', slug: '' };

export default function FacilitiesScreen() {
	const [search, setSearch] = useState('');
	const [sport, setSport] = useState<Sport>(ALL_SPORTS);
	const user = useAuthStore((s) => s.user);

	const { data: sportsData, isLoading: isLoadingSports } = useSports();
	const sportChips = useMemo(() => [ALL_SPORTS, ...(sportsData ?? [])], [sportsData]);

	const filters = useMemo(
		() => ({
			search: search || undefined,
			sport: sport.slug || undefined,
		}),
		[search, sport]
	);

	const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useFacilities(filters);
	const facilities = data?.pages.flatMap((p) => p.data) ?? [];

	return (
		<View style={styles.container}>
			{/* Header Banner Gelap */}
			<View style={styles.heroSection}>
				<HeaderPrimary userName={user?.name} />

				<Text style={styles.heroTitle}>Ready to book your court?</Text>

				<View style={styles.searchBox}>
					<TextInput style={styles.searchInput} placeholder="Search Facilities or Cities..." placeholderTextColor="#94A3B8" value={search} onChangeText={setSearch} />
				</View>
			</View>

			{/* Sport Chips Filter */}
			<View style={styles.chipContainer}>
				{isLoadingSports ? (
					<TabSkeleton count={5} />
				) : (
					<FlatList
						horizontal
						data={sportChips}
						keyExtractor={(s) => s.id}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingHorizontal: 16 }}
						renderItem={({ item }) => {
							const isActive = sport.id === item.id;
							return <ItemTabMenu item={item} isActive={isActive} onPress={setSport} />;
						}}
					/>
				)}
			</View>

			{/* Content List */}
			<View style={styles.contentContainer}>
				{isLoading && <FacilitySkeleton />}
				{isError && <Text style={styles.error}>Couldn't load facilities. Pull to retry.</Text>}

				<FlatList
					data={facilities}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 40 }}
					onEndReachedThreshold={0.4}
					onEndReached={() => hasNextPage && fetchNextPage()}
					ListFooterComponent={isFetchingNextPage ? <FacilitySkeleton /> : null}
					renderItem={({ item }: { item: Facility }) => <FacilityCard item={item} />}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: '#F8FAFC' },
	heroSection: {
		backgroundColor: '#0F172A',
		paddingTop: 54,
		paddingHorizontal: 20,
		paddingBottom: 24,
		borderBottomLeftRadius: 28,
		borderBottomRightRadius: 28,
	},
	userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
	avatarContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		backgroundColor: '#334155',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
	},
	avatarText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 16,
		fontFamily: 'Poppins-Bold',
	},
	greeting: {
		color: '#F1F5F9',
		fontSize: 16,
		fontFamily: 'Poppins-Medium',
	},
	heroTitle: {
		color: '#fff',
		fontSize: 16,
		marginBottom: 16,
		lineHeight: 32,
		fontFamily: 'Poppins-Bold',
	},
	searchBox: {
		backgroundColor: '#1E293B',
		borderRadius: 14,
		paddingHorizontal: 14,
		height: 48,
		justifyContent: 'center',
	},
	searchInput: { color: '#fff', fontSize: 12, fontFamily: 'Poppins-Regular' },
	chipContainer: { justifyContent: 'center', marginVertical: 12 },
	contentContainer: { flex: 1 },
	error: { color: '#e11d48', textAlign: 'center', marginTop: 12, fontFamily: 'Poppins-Regular' },
});
