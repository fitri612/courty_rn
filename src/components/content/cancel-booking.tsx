import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface CancelBookingModalProps {
  visible: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const CancelBookingModal = ({visible, isLoading, onClose, onConfirm}: CancelBookingModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalCard}>
          <View style={styles.iconContainer}>
            <Ionicons name="warning-outline" size={32} color="#E11D48" />
          </View>

          <Text style={styles.title}>Cancel Booking?</Text>
          <Text style={styles.description}>Are you sure you want to cancel this booking? This action cannot be undone.</Text>

          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.keepButton]} onPress={onClose} disabled={isLoading}>
              <Text style={styles.keepText}>Keep Booking</Text>
            </Pressable>

            <Pressable style={[styles.button, styles.cancelButton]} onPress={onConfirm} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.cancelText}>Yes, Cancel</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFE4E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    color: '#0F172A',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepButton: {
    backgroundColor: '#F1F5F9',
  },
  keepText: {
    color: '#334155',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
  cancelButton: {
    backgroundColor: '#E11D48',
  },
  cancelText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  },
});
