import { Facility } from '@/api/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ImageWithFallback } from './image-with-fallback';

interface FacilityCardProps {
	item: Facility;
}

export const FacilityCard = memo(({ item }: FacilityCardProps) => {
	const formattedPrice = `${Math.round(item.startingPrice / 1000)}K`;

	return (
		<Pressable
			style={({ pressed }) => [
				styles.card,
				pressed && styles.cardPressed, // click
			]}
			onPress={() => router.push(`/facility/${item.id}`)}
		>
			<View style={styles.cardContent}>
				<View style={styles.imageContainer}>
					<ImageWithFallback source={{ uri: item.imageUrl }} style={styles.cardImage} contentFit="cover" />
					<View style={styles.distanceBadge}>
						<Text style={styles.distanceText}>
							{item.distanceKm.toFixed(1)} <Text style={styles.distanceUnit}>km</Text>
						</Text>
					</View>
				</View>

				<View style={styles.cardBody}>
					<View style={styles.cardHeader}>
						<Text style={styles.cardTitle} numberOfLines={1}>
							{item.name}
						</Text>
						<Text style={styles.cardSubtitle} numberOfLines={1}>
							{item.location}
						</Text>
					</View>

					<View style={styles.cardMetaRow}>
						<View style={styles.ratingRow}>
							<Ionicons name="star" size={15} color="#FFC107" style={styles.starIcon} />

							<Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>

							<Text style={styles.reviewCount}>({item.reviewCount})</Text>
						</View>

						<View style={styles.priceContainer}>
							<Text style={styles.priceText} numberOfLines={1} adjustsFontSizeToFit>
								{formattedPrice}
								<Text style={styles.priceUnit}> /jam</Text>
							</Text>
						</View>
					</View>
				</View>
			</View>

			<View style={styles.cardFooter}>
				<Text style={styles.footerText}>{item.sports ? item.sports.join(' · ') : 'Available Today'}</Text>
			</View>
		</Pressable>
	);
});

const styles = StyleSheet.create({
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: '#E2E8F0',
	},
	// Style khusus saat ditekan
	distanceUnit: {
		fontSize: 11,
		color: '#0F172A',
		fontFamily: 'Poppins-Regular',
	},
	cardPressed: {
		opacity: 0.9,
		transform: [{ scale: 0.98 }],
	},
	cardContent: {
		flexDirection: 'row',
		padding: 14,
	},
	imageContainer: {
		position: 'relative',
	},
	cardImage: {
		width: 96,
		height: 96,
		borderRadius: 10,
		backgroundColor: '#F1F5F9',
	},
	distanceBadge: {
		position: 'absolute',
		top: 6,
		right: 6,
		backgroundColor: '#FFC107',
		paddingHorizontal: 8,
		paddingVertical: 0,
		borderRadius: 5,
	},
	distanceText: {
		fontSize: 10,
		color: '#0F172A',
		fontFamily: 'Poppins-Bold',
	},
	cardBody: {
		flex: 1,
		minWidth: 0,
		marginLeft: 14,
		justifyContent: 'space-between',
	},
	cardHeader: {
		flexDirection: 'column',
	},
	cardTitle: {
		fontSize: 12,
		color: '#0F172A',
		fontFamily: 'Poppins-Bold',
		lineHeight: 22,
		flexShrink: 1,
	},
	cardSubtitle: {
		fontSize: 10,
		color: '#64748B',
		fontFamily: 'Poppins-Regular',
		flexShrink: 1,
	},

	starIcon: {
		marginRight: 2,
		marginBottom: 5,
	},
	ratingText: {
		fontSize: 12,
		color: '#0F172A',
		fontFamily: 'Poppins-Bold',
		marginRight: 3,
	},
	reviewCount: {
		fontSize: 10,
		color: '#64748B',
		fontFamily: 'Poppins-Regular',
	},

	cardMetaRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 8,
		width: '100%',
	},

	ratingRow: {
		flexDirection: 'row',
		alignItems: 'center',
		flexShrink: 1,
		minWidth: 0,
	},

	priceContainer: {
		flexShrink: 0,
		marginLeft: 8,
		maxWidth: '45%',
	},

	priceText: {
		fontSize: 16,
		color: '#0F172A',
		fontFamily: 'Poppins-Bold',
		textAlign: 'right',
	},

	priceUnit: {
		fontSize: 11,
		color: '#64748B',
		fontFamily: 'Poppins-Regular',
	},
	cardFooter: {
		borderTopWidth: 1,
		borderTopColor: '#F1F5F9',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	footerText: {
		fontSize: 10,
		color: '#334155',
		fontFamily: 'Poppins-Medium',
		textTransform: 'capitalize',
	},
});
