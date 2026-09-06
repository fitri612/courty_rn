import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#1E1A29", // Warna gelap/hitam untuk tab aktif
        tabBarInactiveTintColor: "#8E8E93", // Warna abu-abu untuk tab tidak aktif
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // Warna latar belakang putih
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
        },
        tabBarLabelStyle: {
          fontFamily: "Poppins-Medium", // Nama font yang didaftarkan
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Facilities",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "tennisball" : "tennisball-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "My Bookings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}