import React from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import { colors, spacing } from "../theme";

export default function StatisticsScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Statistics Page</Text>
      </View>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    fontSize: 20,
    color: colors.foreground,
  },
});
