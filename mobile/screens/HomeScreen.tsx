import React from "react";
import { View, Text, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { colors, spacing } from "../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export default function HomeScreen({ navigation }: NativeStackScreenProps<any>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <PrimaryButton
        title="Statistics"
        onPress={() => navigation.navigate("Statistics")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  title: {
    fontSize: 20,
    marginBottom: spacing.lg,
    color: colors.foreground,
  },
});
