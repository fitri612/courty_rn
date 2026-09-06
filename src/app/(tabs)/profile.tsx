import { useLogout } from '@/api/hooks/useAuth';
import { HeaderPrimary } from '@/components/header';
import { showToast } from '@/components/ui/toast';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
	const user = useAuthStore((s) => s.user);
	const logout = useLogout();

	const handleLogout = () => {
		Alert.alert('Logout', 'Are you sure you want to log out?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Logout',
				style: 'destructive',
				onPress: async () => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

					await logout();

					showToast('Logged out successfully', 'success');

					router.replace('/(auth)/login');
				},
			},
		]);
	};

	const handleNavigate = (path: string) => {
		Haptics.selectionAsync();
		// Arahkan ke rute tujuan (sesuaikan path dengan halaman yang kamu miliki)
		router.push(path as any);
	};

	const getInitials = (name?: string) => {
		if (!name) return 'CU';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.substring(0, 2);
	};

	return (
		<View style={styles.container}>
			<HeaderPrimary title="My Profile" variant="textOnly" showNotification={false} />

			<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
				{/* Profile Card Header */}
				<View style={styles.profileCard}>
					<View style={styles.avatarContainer}>
						<Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
					</View>
					<Text style={styles.name}>{user?.name ?? 'Courtly User'}</Text>
					<Text style={styles.email}>{user?.email ?? 'user@courtly.com'}</Text>
					<View style={styles.badge}>
						<Text style={styles.badgeText}>Member</Text>
					</View>
				</View>

				{/* Menu Options */}
				<Text style={styles.sectionTitle}>Account Settings</Text>
				<View style={styles.menuContainer}>
					<Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]} onPress={() => showToast('Feature coming soon!', 'info')}>
						<View style={styles.menuLeft}>
							<Ionicons name="person-outline" size={20} color="#1E1A29" />
							<Text style={styles.menuText}>Edit Profile</Text>
						</View>
						<Ionicons name="chevron-forward" size={18} color="#94A3B8" />
					</Pressable>

					<View style={styles.divider} />

					<Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]} onPress={() => showToast('Feature coming soon!', 'info')}>
						<View style={styles.menuLeft}>
							<Ionicons name="shield-checkmark-outline" size={20} color="#1E1A29" />
							<Text style={styles.menuText}>Security & Password</Text>
						</View>
						<Ionicons name="chevron-forward" size={18} color="#94A3B8" />
					</Pressable>

					<View style={styles.divider} />

					<Pressable style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]} onPress={() => showToast('Feature coming soon!', 'info')}>
						<View style={styles.menuLeft}>
							<Ionicons name="help-circle-outline" size={20} color="#1E1A29" />
							<Text style={styles.menuText}>Help & Support</Text>
						</View>
						<Ionicons name="chevron-forward" size={18} color="#94A3B8" />
					</Pressable>
				</View>

				{/* Logout Button */}
				<Pressable style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutPressed]} onPress={handleLogout}>
					<Ionicons name="log-out-outline" size={20} color="#E11D48" />
					<Text style={styles.logoutText}>Log out</Text>
				</Pressable>
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8FAFC',
		paddingTop: 60,
	},
	scrollContent: {
		paddingHorizontal: 20,
		paddingBottom: 40,
	},
	profileCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		padding: 24,
		alignItems: 'center',
		marginBottom: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.05,
		shadowRadius: 10,
		elevation: 3,
	},
	avatarContainer: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: '#1E1A29',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 12,
	},
	avatarText: {
		fontSize: 28,
		fontFamily: 'Poppins-Bold',
		color: '#FFFFFF',
	},
	name: {
		fontSize: 16,
		fontFamily: 'Poppins-Bold',
		color: '#0F172A',
	},
	email: {
		fontSize: 12,
		fontFamily: 'Poppins-Regular',
		color: '#64748B',
		marginTop: 2,
	},
	badge: {
		backgroundColor: '#F1F5F9',
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 20,
		marginTop: 12,
	},
	badgeText: {
		fontSize: 10,
		fontFamily: 'Poppins-Medium',
		color: '#475569',
	},
	sectionTitle: {
		fontSize: 12,
		fontFamily: 'Poppins-Bold',
		color: '#94A3B8',
		marginBottom: 12,
		textTransform: 'uppercase',
		letterSpacing: 0.5,
	},
	menuContainer: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		paddingVertical: 4,
		marginBottom: 24,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.03,
		shadowRadius: 6,
		elevation: 2,
		overflow: 'hidden',
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingVertical: 16,
		paddingHorizontal: 16,
	},
	pressed: {
		backgroundColor: '#F1F5F9',
	},
	menuLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	menuText: {
		fontSize: 12,
		fontFamily: 'Poppins-Medium',
		color: '#1E293B',
	},
	divider: {
		height: 1,
		backgroundColor: '#F1F5F9',
		marginHorizontal: 16,
	},
	logoutButton: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		backgroundColor: '#FFE4E6',
		borderRadius: 14,
		paddingVertical: 16,
	},
	logoutPressed: {
		opacity: 0.8,
	},
	logoutText: {
		color: '#E11D48',
		fontFamily: 'Poppins-Bold',
		fontSize: 16,
	},
});
