import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { colors, spacing, radius, font } from "../theme";
import { useTheme } from "react-native-paper";
import { useFontScale } from "../FontSizeContext";

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  const { scale } = useFontScale();
  const { colors: themeColors } = useTheme();
  const accent = themeColors.accent ?? colors.accent;
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: accent }]} onPress={onPress}>
      <Text style={[styles.text, { fontSize: 16 * scale }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginVertical: spacing.sm,
    alignItems: "center",
  },
  text: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: font.regular,
  },
});
