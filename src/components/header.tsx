import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export type HeaderVariant = 'profile' | 'textOnly' | 'back';

interface HeaderProps {
  variant?: HeaderVariant;
  title?: string;
  userName?: string;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  showNotification?: boolean;
}

export const HeaderPrimary = ({
  variant = 'profile',
  title = 'Header Title',
  userName = 'User',
  onBackPress,
  onNotificationPress,
  showNotification = true,
}: HeaderProps) => {
  const initial = userName.charAt(0) || 'A';

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
    }
  };

  return (
    <View style={styles.container}>
      {/* Variant 1: Profile (Default) */}
      {variant === 'profile' && (
        <View style={styles.leftSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.greeting}>Halo, {userName}</Text>
        </View>
      )}

      {/* Variant 2: Back Button + Title */}
      {variant === 'back' && (
        <View style={styles.leftSection}>
          <Pressable
            style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}
            onPress={handleBack}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={22} color="#F1F5F9" />
          </Pressable>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      {/* Variant 3: Text Only */}
      {variant === 'textOnly' && (
        <View style={styles.leftSection}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}

      {/* Right Action: Notification Button */}
      {showNotification ? (
        <Pressable
          style={({ pressed }) => [styles.iconButton, pressed && styles.buttonPressed]}
          onPress={handleNotificationPress}
          hitSlop={8}
        >
          <Ionicons name="notifications-outline" size={22} color="#F1F5F9" />
        </Pressable>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    height: 40,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
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
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  greeting: {
    color: '#F1F5F9',
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  titleText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  iconPlaceholder: {
    width: 36,
  },
});