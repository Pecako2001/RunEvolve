import React, { useContext, useMemo } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { spacing, radius, font } from "../theme";
import { ThemeContext } from "../ThemeContext";

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
};

export default function PrimaryButton({ title, onPress }: Props) {
  const { colors } = useContext(ThemeContext);
  const styles = useMemo(() =>
    StyleSheet.create({
      button: {
        backgroundColor: colors.accent,
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
    }),
  [colors]);
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
