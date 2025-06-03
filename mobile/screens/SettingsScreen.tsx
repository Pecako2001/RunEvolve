import React, { useContext, useState, useMemo } from "react";
import { View, Text, Switch } from "react-native";
import Slider from "@react-native-community/slider";
import BottomNavBar from "../components/BottomNavBar";
import { spacing } from "../theme";
import { ThemeContext } from "../ThemeContext";
import { useFontScale } from "../FontSizeContext";
import stylesFunc from "../styles/SettingsScreenStyles";

export default function SettingsScreen() {
  const { darkMode, toggleDarkMode, colors } = useContext(ThemeContext);
  const { scale, setScale } = useFontScale();
  const styles = useMemo(() => stylesFunc(colors), [colors]);
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20 * scale }]}>Settings</Text>
        <View style={styles.itemRow}>
          <Text style={[styles.itemText, { fontSize: 16 * scale }]}>Dark Theme</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
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

