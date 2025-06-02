import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { spacing } from "../theme";
import { ThemeContext } from "../ThemeContext";
import { useTheme } from "react-native-paper";

export default function BottomNavBar() {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const { colors: themeColors } = useTheme();
  const accent = themeColors.accent ?? colors.accent;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-end",
          backgroundColor: accent,
          paddingVertical: spacing.sm,
        },
        item: {
          flex: 1,
          alignItems: "center",
        },
        centerWrapper: {
          flex: 1,
          alignItems: "center",
        },
        centerButton: {
          backgroundColor: "#2563eb",
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        },
        text: {
          color: "#ffffff",
          marginTop: 2,
        },
      }),
    [accent],
  );
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
        <Text style={styles.text}>Statistics</Text>
      </TouchableOpacity>
      <View style={styles.centerWrapper}>
        <TouchableOpacity accessibilityRole="button" style={styles.centerButton}>
          <Ionicons name="git-network" size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
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
