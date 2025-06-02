import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { spacing } from "../theme";
import { ThemeContext } from "../ThemeContext";

export default function BottomNavBar() {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
  const styles = useMemo(() =>
    StyleSheet.create({
      container: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: colors.accent,
        paddingVertical: spacing.sm,
      },
      item: {
        flex: 1,
        alignItems: "center",
      },
      text: {
        color: "#ffffff",
      },
    }),
  [colors]);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.item}
        onPress={() => navigation.navigate("Home" as never)}
      >
        <Text style={[styles.text, { fontSize: 16 * scale }]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.item}
        onPress={() => navigation.navigate("Statistics" as never)}
      >
        <Text style={[styles.text, { fontSize: 16 * scale }]}>Stats</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.item}
        onPress={() => navigation.navigate("Settings" as never)}
      >
        <Text style={[styles.text, { fontSize: 16 * scale }]}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
