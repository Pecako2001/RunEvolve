import React, { useContext, useMemo } from "react";
import { View, Text } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import BottomNavBar from "../components/BottomNavBar";
import { lightColors, darkColors } from "../theme";
import { ThemeContext } from "../ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFontScale } from "../FontSizeContext";
import stylesFunc from "../styles/HomeScreenStyles";

export default function HomeScreen({
  navigation,
}: NativeStackScreenProps<any>) {
  const themeContext = useContext(ThemeContext);
  const colors = themeContext?.isDark ? darkColors : lightColors;
  const scale = useFontScale ? useFontScale() : 1;

  const styles = useMemo(() => stylesFunc(colors), [colors]);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        <Text style={[styles.title, { fontSize: 20 * scale }]}>Home Page</Text>
        <PrimaryButton
          title="Statistics"
          onPress={() => navigation.navigate("Statistics")}
        />
      </View>
      <BottomNavBar />
    </View>
  );
}
