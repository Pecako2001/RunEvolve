import React, { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import BottomNavBar from "../components/BottomNavBar";
import { colors, spacing } from "../theme";
import { useFontScale } from "../FontSizeContext";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const { scale, setScale } = useFontScale();

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20 * scale }]}>Settings</Text>
        <View style={styles.itemRow}>
          <Text style={[styles.itemText, { fontSize: 16 * scale }]}>Dark Theme</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            accessibilityLabel="toggle dark theme"
          />
        </View>
        <View style={styles.itemRow}>
          <Text style={[styles.itemText, { fontSize: 16 * scale }]}>Text Size</Text>
          <Slider
            accessibilityLabel="text size"
            minimumValue={1}
            maximumValue={2}
            step={0.25}
            value={scale}
            onValueChange={setScale}
            style={styles.slider}
          />
        </View>
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
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 20,
    marginBottom: spacing.lg,
    color: colors.foreground,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  itemText: {
    color: colors.foreground,
    fontSize: 16,
  },
  slider: {
    flex: 1,
    marginLeft: spacing.md,
  },
});
