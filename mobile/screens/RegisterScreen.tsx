import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { colors, spacing, radius, font } from "../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

type Props = NativeStackScreenProps<any>;

export default function RegisterScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    try {
      const resp = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });
      if (!resp.ok) throw new Error("Registration failed");
      navigation.replace("Login");
    } catch (e) {
      setError("Registration failed");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="First Name"
        placeholderTextColor="#6b7280"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Last Name"
        placeholderTextColor="#6b7280"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        placeholder="Confirm Password"
        placeholderTextColor="#6b7280"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton title="Create Account" onPress={handleRegister} />
      <PrimaryButton title="Back to login" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  input: {
    width: "100%",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.inputBg,
    fontFamily: font.regular,
    color: colors.foreground,
  },
  error: {
    color: colors.error,
    marginVertical: spacing.sm,
  },
});
