import { Ionicons } from "@expo/vector-icons";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  text: string;
  type: ToastType;
}

export interface ToastHandle {
  show: (text: string, type?: ToastType) => void;
}

// Map ikon berdasarkan tipe toast
const TOAST_ICONS: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  error: "alert-circle",
  warning: "warning",
  info: "information-circle",
};

export const Toast = forwardRef<ToastHandle>((_props, ref) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
    ]).start(() => setMessage(null));
  }, [opacity, translateY]);

  useImperativeHandle(ref, () => ({
    show: (text, type = "success") => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setMessage({ text, type });
      opacity.setValue(0);
      translateY.setValue(-20);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
      hideTimer.current = setTimeout(hide, 3000);
    },
  }));

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { top: insets.top + 10, opacity, transform: [{ translateY }] },
        styles[message.type],
      ]}
    >
      <View style={styles.contentContainer}>
        <Ionicons name={TOAST_ICONS[message.type]} size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.text}>{message.text}</Text>
      </View>
    </Animated.View>
  );
});

Toast.displayName = "Toast";

const toastRef: { current: ToastHandle | null } = { current: null };

export function setToastRef(instance: ToastHandle | null) {
  toastRef.current = instance;
}

export function showToast(text: string, type: ToastType = "success") {
  toastRef.current?.show(text, type);
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 9999,
    elevation: 6,
    shadowColor: "#0F172A",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    flexShrink: 1,
  },
  // Style Warna Latar Belakang
  success: { backgroundColor: "#10B981" },
  info: { backgroundColor: "#3B82F6" },
  warning: { backgroundColor: "#F59E0B" },
  error: { backgroundColor: "#EF4444" },
});