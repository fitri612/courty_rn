import { useLogout } from "@/api/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.name}>{user?.name ?? "Courtly user"}</Text>
        <Text style={styles.email}>{user?.email ?? ""}</Text>
      </View>
      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 16 },
  header: { fontSize: 26, fontWeight: "700", marginBottom: 16 },
  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 14, padding: 16, marginBottom: 24 },
  name: { fontSize: 18, fontWeight: "600" },
  email: { color: "#666", marginTop: 4 },
  button: { borderWidth: 1, borderColor: "#e11d48", borderRadius: 10, padding: 14, alignItems: "center" },
  buttonText: { color: "#e11d48", fontWeight: "600" },
});
