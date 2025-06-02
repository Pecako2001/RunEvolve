import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityRole="button"
        style={styles.item}
        onPress={() => navigation.navigate("Statistics" as never)}
      >
        <Text style={styles.text}>Stats</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
