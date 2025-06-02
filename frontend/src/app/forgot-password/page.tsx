"use client";

import { useState } from "react";
import { TextInput, Paper, Title, Text, Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import styles from "../login/AuthForm.module.css";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ForgotPasswordPage() {
  const form = useForm({ initialValues: { email: "" } });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (values: typeof form.values) => {
    setError("");
    setMessage("");
    try {
      await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
        email: values.email,
      });
      setMessage("If that account exists, a reset link has been sent.");
    } catch (e) {
      setError("Request failed");
    }
  };

  return (
    <div className={styles.authPage__container}>
      <Paper withBorder shadow="md" p="xl" className={styles.authPage__card}>
        <Stack>
          <Title order={2} ta="center">
            Forgot Password
          </Title>
          <Text ta="center" c="dimmed" size="sm">
            Enter your email to receive a reset link
          </Text>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="Email"
              required
              {...form.getInputProps("email")}
            />
            {message && (
              <Text c="green" size="sm" mt="sm">
                {message}
              </Text>
            )}
            {error && (
              <Text c="red" size="sm" mt="sm">
                {error}
              </Text>
            )}
            <Button fullWidth mt="xl" type="submit">
              Send Reset Link
            </Button>
          </form>
        </Stack>
      </Paper>
    </div>
  );
}
