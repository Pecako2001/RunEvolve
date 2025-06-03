import React from "react";
import {
  TouchableOpacity,
  Text,
  GestureResponderEvent,
  View,
} from "react-native";
import { colors } from "../theme";
import { useTheme } from "react-native-paper";
import { useFontScale } from "../FontSizeContext";
import styles from "../styles/PrimaryButtonStyles";

type Props = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  iconRight?: React.ReactNode;
};

export default function PrimaryButton({ title, onPress, iconRight }: Props) {
  const { scale } = useFontScale();
  const { colors: themeColors } = useTheme();
  const accent = themeColors.accent ?? colors.accent;
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: accent }]} onPress={onPress}>
      <Text style={[styles.text, { fontSize: 16 * scale }]}>{title}</Text>
      {iconRight ? <View style={styles.icon}>{iconRight}</View> : null}
    </TouchableOpacity>
  );
}
