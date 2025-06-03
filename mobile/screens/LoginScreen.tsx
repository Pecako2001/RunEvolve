import React, { useState, useContext, useMemo } from "react";
import { View, TextInput, Text } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { spacing } from "../theme";
import { ThemeContext } from "../ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://192.168.7.138:8000";

type LoginCallbacks = {
  /** Called when login succeeds */
  onSuccess?: () => void;
  /** Called when login fails */
  onError?: (err: unknown) => void;
};

type Props = NativeStackScreenProps<any> & LoginCallbacks;

import { PixelRatio } from "react-native";
import stylesFunc from "../styles/LoginScreenStyles";

export default function LoginScreen({ navigation, onSuccess, onError }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { colors } = useContext(ThemeContext);
  const scale = PixelRatio.getFontScale ? PixelRatio.getFontScale() : 1;
  const styles = useMemo(() => stylesFunc(colors), [colors]);
    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      const resp = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      if (!resp.ok) throw new Error("Invalid credentials");
      const json = await resp.json();
      await AsyncStorage.setItem("token", json.access_token);
      onSuccess?.();
      navigation.replace("Home");
    } catch (e) {
      setError("Invalid credentials");
      onError?.(e);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#6b7280"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { fontSize: 16 * scale }]}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#6b7280"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { fontSize: 16 * scale }]}
      />
      {error ? <Text style={[styles.error, { fontSize: 14 * scale }]}>{error}</Text> : null}
      <PrimaryButton title="Sign in" onPress={handleLogin} />
      <PrimaryButton
        title="Create account"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

