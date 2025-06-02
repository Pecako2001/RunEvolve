import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing } from "../theme";

export default function BottomNavBar() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.item}
        onPress={() => navigation.navigate("Home" as never)}
      >
        <Ionicons name="home" size={24} color="#ffffff" />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.item}
        onPress={() => navigation.navigate("Statistics" as never)}
      >
        <Ionicons name="stats-chart" size={24} color="#ffffff" />
        <Text style={styles.text}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.item}
        onPress={() => navigation.navigate("Settings" as never)}
      >
        <Ionicons name="settings" size={24} color="#ffffff" />
        <Text style={styles.text}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  item: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    marginTop: 2,
  },
});
