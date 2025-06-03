import React, { useState, useContext, useMemo } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from "react-native-paper";
import PrimaryButton from "../components/PrimaryButton";
import { spacing } from "../theme";
import { ThemeContext } from "../ThemeContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFontScale } from "../FontSizeContext";
import stylesFunc from "../styles/RegisterScreenStyles";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

type Props = NativeStackScreenProps<any>;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const { colors } = useContext(ThemeContext);
  const { scale } = useFontScale();
  const styles = useMemo(() => stylesFunc(colors), [colors]);

  const handleRegister = async () => {
    if (!acceptTerms) {
      setError("Please accept the terms");
      return;
    }
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ");
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
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.toggleText, { fontSize: 14 * scale }]}>Log In</Text>
        </TouchableOpacity>
        <View style={[styles.toggleButton, styles.toggleActive]}>
          <Text
            style={[styles.toggleText, styles.toggleTextActive, { fontSize: 14 * scale }]}
          >
            Sign Up
          </Text>
        </View>
      </View>
      <Text style={[styles.title, { fontSize: 24 * scale }]}>Sign Up</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Your Name"
          placeholderTextColor="#6b7280"
          value={name}
          onChangeText={setName}
          style={[styles.inputField, { fontSize: 16 * scale }]}
        />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Your Email"
          placeholderTextColor="#6b7280"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={[styles.inputField, { fontSize: 16 * scale }]}
        />
        <Ionicons name="mail-outline" size={20} color={colors.foreground} style={styles.icon} />
      </View>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#6b7280"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[styles.inputField, { fontSize: 16 * scale }]}
        />
        <TouchableOpacity
          onPress={() => setShowPassword((s) => !s)}
          accessibilityRole="button"
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.foreground}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={acceptTerms ? "checked" : "unchecked"}
          onPress={() => setAcceptTerms((v) => !v)}
        />
        <Text style={[styles.checkboxLabel, { fontSize: 14 * scale }]}>I accept the Terms & Conditions.</Text>
      </View>
      {error ? (
        <Text style={[styles.error, { fontSize: 14 * scale }]}>{error}</Text>
      ) : null}
      <PrimaryButton
        title="Create Account"
        onPress={handleRegister}
        iconRight={<Ionicons name="arrow-forward" size={20} color="#fff" />}
      />
      <View style={styles.altRow}>
        <Text style={{ color: colors.foreground, fontSize: 14 * scale }}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.link, { fontSize: 14 * scale }]}>Log In</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-facebook" size={20} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-apple" size={20} color={colors.foreground} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
