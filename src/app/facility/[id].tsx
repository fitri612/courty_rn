import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFacility } from '@/api/hooks/useFacility';
import { ImageWithFallback } from '@/components/common/image-with-fallback';
import { showToast } from '@/components/ui/toast';
import getSportIcon from '@/constants/utils/SportIcon';
import getAmenityIcon from '@/constants/utils/amenityIcon';
import formatAmenity from '@/constants/utils/formatAmenity';
import formatPrice from '@/constants/utils/formatPrice';

export default function FacilityDetailScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { data: facility, isLoading, isError } = useFacility(id);
	const insets = useSafeAreaInsets();

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	if (isError || !facility) {
		return (
			<SafeAreaView style={styles.errorContainer}>
				<Text style={styles.error}>Couldn't load this facility.</Text>
			</SafeAreaView>
		);
	}

	const cheapestPrice = facility?.courts && facility.courts.length > 0 ? Math.min(...facility.courts.map((court) => court.basePrice)) : null;

	return (
		<View style={styles.container}>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingBottom: 120 + insets.bottom,
				}}
			>
				<View style={styles.heroContainer}>
					<ImageWithFallback source={{ uri: facility.imageUrl }} style={styles.heroImage} contentFit="cover" transition={200} />

					<View style={styles.heroOverlay} />

					<SafeAreaView style={styles.header} edges={['top']}>
						<Pressable style={styles.backButton} onPress={() => router.back()}>
							<Ionicons name="arrow-back" size={24} color="#FFFFFF" />
						</Pressable>
					</SafeAreaView>
				</View>

				{/* MAIN CARD */}
				<View style={styles.detailCard}>
					{/* TITLE */}
					<View style={styles.titleRow}>
						<View style={styles.titleContainer}>
							<Text style={styles.title}>{facility.name}</Text>

							{!!facility.sports?.length && (
								<View style={styles.sportsRow}>
									{facility.sports.map((sport) => (
										<View key={sport} style={styles.sportBadge}>
											<Ionicons name={getSportIcon(sport) as any} size={14} color="#F59E0B" />

											<Text style={styles.sportText}>{sport}</Text>
										</View>
									))}
								</View>
							)}
						</View>
					</View>

					{/* RATING */}
					<View style={styles.ratingRow}>
						<Ionicons name="star" size={17} color="#FBBF24" />

						<Text style={styles.rating}>{facility.rating.toFixed(1)}</Text>

						<Text style={styles.reviewCount}>({facility.reviewCount})</Text>

						<View style={styles.dot} />

						<Text style={styles.reviewLabel}>{facility.reviewCount} Reviews</Text>
					</View>

					<View style={styles.divider} />

					<Pressable
						style={styles.addressContainer}
						onPress={() => {
							showToast('Feature coming soon: Open in Google Maps', 'info');
						}}
					>
						<View style={styles.locationIcon}>
							<Ionicons name="location" size={23} color="#1D4ED8" />
						</View>

						<View style={styles.addressContent}>
							<Text style={styles.address}>{facility.address}</Text>

							<Text style={styles.mapsText}>Open in Google Maps</Text>
						</View>

						<Ionicons name="chevron-forward" size={20} color="#94A3B8" />
					</Pressable>

					<View style={styles.divider} />

					{!!facility.description && (
						<>
							<Text style={styles.sectionTitle}>About Venue</Text>

							<Text style={styles.description}>{facility.description}</Text>
						</>
					)}

					{!!facility.sports?.length && (
						<>
							<Text style={styles.sectionTitle}>Sports</Text>

							<View style={styles.sportsGrid}>
								{facility.sports.map((sport) => (
									<View key={sport} style={styles.sportCard}>
										<View style={styles.sportIcon}>
											<Ionicons name={getSportIcon(sport) as any} size={22} color="#1E293B" />
										</View>

										<Text style={styles.sportCardText}>{sport.charAt(0).toUpperCase() + sport.slice(1)}</Text>
									</View>
								))}
							</View>
						</>
					)}

					{!!facility.amenities?.length && (
						<>
							<View style={styles.sectionHeader}>
								<Text style={styles.sectionTitle}>Facilities</Text>
							</View>

							<View style={styles.facilityGrid}>
								{facility.amenities.map((amenity) => (
									<View key={amenity} style={styles.facilityItem}>
										<View style={styles.facilityIconContainer}>
											<Ionicons name={getAmenityIcon(amenity) as any} size={21} color="#1E1B2E" />
										</View>

										<Text style={styles.facilityText}>{formatAmenity(amenity)}</Text>
									</View>
								))}
							</View>
						</>
					)}

					{!!facility.courts?.length && (
						<>
							<View style={styles.sectionHeader}>
								<Text style={styles.sectionTitle}>Courts</Text>

								<Text style={styles.courtCount}>
									{facility.courts.length} {facility.courts.length > 1 ? 'courts' : 'court'}
								</Text>
							</View>

							{facility.courts.map((court) => (
								<View key={court.id} style={styles.courtCard}>
									<View style={styles.courtLeft}>
										<View style={styles.courtIcon}>
											<Ionicons name="tennisball-outline" size={22} color="#1E1B2E" />
										</View>

										<View>
											<Text style={styles.courtName}>{court.name}</Text>

											<View style={styles.courtMeta}>
												<Text style={styles.courtType}>{court.type}</Text>

												<View style={styles.metaDot} />

												<Text style={styles.courtSport}>{court.sport}</Text>

												{court.indoor && (
													<>
														<View style={styles.metaDot} />

														<Text style={styles.courtSport}>Indoor</Text>
													</>
												)}
											</View>
										</View>
									</View>

									<View style={styles.priceContainer}>
										<Text style={styles.price}>Rp. {formatPrice(court.basePrice)}</Text>

										<Text style={styles.priceLabel}>/ hour</Text>
									</View>
								</View>
							))}
						</>
					)}
				</View>
			</ScrollView>

			<View
				style={[
					styles.footer,
					{
						paddingBottom: Math.max(insets.bottom, 16),
					},
				]}
			>
				<View style={styles.footerInfo}>
					<View>
						<Text style={styles.footerLabel}>Court price per hour</Text>

						{cheapestPrice !== null && <Text style={styles.footerSubLabel}>Starts from</Text>}
					</View>

					{cheapestPrice !== null && <Text style={styles.footerPrice}>Rp. {formatPrice(cheapestPrice)}</Text>}
				</View>
				<Pressable
					style={({ pressed }) => [styles.bookingButton, pressed && styles.bookingButtonPressed]}
					onPress={() =>
						router.push({
							pathname: '/booking/new',
							params: {
								facilityId: facility.id,
							},
						})
					}
				>
					<Text style={styles.bookingButtonText}>Booking Now</Text>

					<Ionicons name="arrow-forward" size={14} color="#1E1B2E" />
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F3F3F3',
	},

	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},

	errorContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFF',
	},

	error: {
		fontFamily: 'Poppins-Regular',
		color: '#E11D48',
		textAlign: 'center',
	},

	heroContainer: {
		height: 320,
		position: 'relative',
		backgroundColor: '#E5E7EB',
	},

	heroImage: {
		width: '100%',
		height: '100%',
	},

	heroOverlay: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: 'rgba(0,0,0,0.12)',
	},

	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
	},

	backButton: {
		marginLeft: 16,
		marginTop: 8,
		width: 42,
		height: 42,
		borderRadius: 21,
		backgroundColor: 'rgba(0,0,0,0.35)',
		justifyContent: 'center',
		alignItems: 'center',
	},

	detailCard: {
		marginTop: -22,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		backgroundColor: '#FFFFFF',
		paddingHorizontal: 20,
		paddingTop: 24,
		minHeight: 500,
	},

	titleRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},

	titleContainer: {
		flex: 1,
	},

	title: {
		fontSize: 18,
		lineHeight: 31,
		fontFamily: 'Poppins-Bold',
		color: '#211D2E',
	},

	sportsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginTop: 10,
	},

	sportBadge: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 5,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 20,
		backgroundColor: '#FFF7DB',
	},

	sportText: {
		fontSize: 10,
		fontFamily: 'Poppins-Medium',
		color: '#A16207',
		textTransform: 'capitalize',
	},

	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 12,
	},

	rating: {
		marginLeft: 5,
		fontSize: 12,
		fontFamily: 'Poppins-Bold',
		color: '#312E81',
	},

	reviewCount: {
		marginLeft: 3,
		fontSize: 12,
		color: '#64748B',
	},

	dot: {
		width: 4,
		height: 4,
		borderRadius: 2,
		backgroundColor: '#94A3B8',
		marginHorizontal: 9,
	},

	reviewLabel: {
		fontSize: 12,
		fontFamily: 'Poppins-Medium',
		color: '#64748B',
	},

	divider: {
		height: 1,
		backgroundColor: '#E2E8F0',
		marginVertical: 16,
	},

	addressContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},

	locationIcon: {
		width: 42,
		height: 52,
		borderRadius: 12,
		backgroundColor: '#EFF6FF',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 12,
	},

	addressContent: {
		flex: 1,
	},

	address: {
		fontSize: 12,
		fontFamily: 'Poppins-Regular',
		color: '#334155',
	},

	mapsText: {
		marginTop: 5,
		fontSize: 11,
		fontFamily: 'Poppins-Bold',
		color: '#2563EB',
	},

	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 22,
		marginBottom: 10,
	},

	sectionTitle: {
		fontSize: 14,
		fontFamily: 'Poppins-Bold',
		color: '#211D2E',
		marginTop: 22,
		marginBottom: 10,
	},

	description: {
		fontSize: 12,
		fontFamily: 'Poppins-Regular',
		lineHeight: 21,
		color: '#64748B',
	},

	sportsGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},

	sportCard: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: '#E2E8F0',
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},

	sportIcon: {
		width: 34,
		height: 34,
		borderRadius: 17,
		backgroundColor: '#F8FAFC',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 8,
	},

	sportCardText: {
		fontSize: 11,
		fontFamily: 'Poppins-Medium',
		color: '#334155',
		textTransform: 'capitalize',
	},

	facilityGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		rowGap: 18,
	},

	facilityItem: {
		width: '50%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: 10,
	},

	facilityIconContainer: {
		width: 32,
		alignItems: 'center',
		marginRight: 7,
	},

	facilityText: {
		flex: 1,
		fontSize: 11,
		fontFamily: 'Poppins-Medium',
		color: '#475569',
	},

	courtCount: {
		fontSize: 11,
		fontFamily: 'Poppins-Bold',
		color: '#94A3B8',
	},

	courtCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#E2E8F0',
		borderRadius: 14,
		padding: 13,
		marginBottom: 10,
	},

	courtLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
	},

	courtIcon: {
		width: 42,
		height: 42,
		borderRadius: 12,
		backgroundColor: '#F8FAFC',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 11,
	},

	courtName: {
		fontSize: 12,
		fontFamily: 'Poppins-Bold',
		color: '#211D2E',
	},

	courtMeta: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 5,
	},

	courtType: {
		fontSize: 11,
		fontFamily: 'Poppins-Medium',
		color: '#64748B',
	},

	courtSport: {
		fontSize: 11,
		color: '#64748B',
		fontFamily: 'Poppins-Medium',
		textTransform: 'capitalize',
	},

	metaDot: {
		width: 3,
		height: 3,
		borderRadius: 2,
		backgroundColor: '#94A3B8',
		marginHorizontal: 6,
	},

	priceContainer: {
		alignItems: 'flex-end',
		marginLeft: 10,
	},

	price: {
		fontSize: 11,
		fontFamily: 'Poppins-Bold',
		color: '#211D2E',
	},

	priceLabel: {
		fontSize: 11,
		color: '#94A3B8',
		marginTop: 2,
	},

	footer: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		paddingHorizontal: 20,
		paddingTop: 13,
		backgroundColor: '#FFFFFF',
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB',
	},

	footerInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 10,
	},

	footerLabel: {
		fontSize: 11,
		color: '#475569',
	},

	footerSubLabel: {
		fontSize: 11,
		fontFamily: 'Poppins-Regular',
		color: '#94A3B8',
		marginTop: 2,
	},

	footerPrice: {
		fontSize: 18,
		fontFamily: 'Poppins-Bold',
		color: '#211D2E',
	},

	bookingButton: {
		height: 56,
		borderRadius: 13,
		backgroundColor: '#FFC400',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
	},

	bookingButtonPressed: {
		opacity: 0.8,
	},

	bookingButtonText: {
		fontSize: 14,
		fontFamily: 'Poppins-Bold',
		color: '#211D2E',
	},
});
