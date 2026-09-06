import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastType = "success" | "error";

interface ToastMessage {
  text: string;
  type: ToastType;
}

export interface ToastHandle {
  show: (text: string, type?: ToastType) => void;
}

export const Toast = forwardRef<ToastHandle>((_props, ref) => {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<ToastMessage | null>(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -16, duration: 200, useNativeDriver: true }),
    ]).start(() => setMessage(null));
  }, [opacity, translateY]);

  useImperativeHandle(ref, () => ({
    show: (text, type = "success") => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setMessage({ text, type });
      opacity.setValue(0);
      translateY.setValue(-16);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
      hideTimer.current = setTimeout(hide, 2500);
    },
  }));

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { top: insets.top + 8, opacity, transform: [{ translateY }] },
        message.type === "error" ? styles.error : styles.success,
      ]}
    >
      <Text style={styles.text}>{message.text}</Text>
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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    zIndex: 999,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  success: { backgroundColor: "#16A34A" },
  error: { backgroundColor: "#DC2626" },
  text: { color: "#fff", fontWeight: "600", textAlign: "center" },
});