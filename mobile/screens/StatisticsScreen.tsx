import React, { useContext, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import { spacing } from "../theme";
import { ThemeContext } from "../ThemeContext";

export default function StatisticsScreen() {
  const { colors } = useContext(ThemeContext);
  const styles = useMemo(() =>
    StyleSheet.create({
      root: { flex: 1 },
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
    }),
  [colors]);
  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.title}>Statistics Page</Text>
      </View>
      <BottomNavBar />
    </View>
  );
}
