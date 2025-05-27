'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Checkbox, Anchor, Paper, Title, Text, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './AuthForm.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function LoginPage() {
  const router = useRouter();
  const form = useForm({ initialValues: { email: '', password: '', remember: false } });
  const [error, setError] = useState('');

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const params = new URLSearchParams();
      params.append('username', values.email);
      params.append('password', values.password);
      const resp = await axios.post(`${API_BASE_URL}/auth/token`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      localStorage.setItem('token', resp.data.access_token);
      router.push('/');
    } catch (e) {
      setError('Invalid credentials');
    }
  };

  return (
    <div
      className={styles.authPage__container}
      style={{
        minHeight: '100vh',
        backgroundImage: 'url("/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper withBorder shadow="md" p="xl" className={styles.authPage__card} style={{ background: 'rgba(255,255,255,1)' }}>
        <Stack>
          <img src="/Icon.png" alt="Logo" width={40} height={40} style={{ alignSelf: 'center' }} />
          <Title order={2} ta="center">Welcome back!</Title>
          <Text ta="center" c="dimmed" size="sm">
            Sign in to your account to continue
          </Text>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput label="Email" required {...form.getInputProps('email')} />
            <PasswordInput label="Password" required mt="md" {...form.getInputProps('password')} />
            <Checkbox label="Remember me" mt="md" {...form.getInputProps('remember', { type: 'checkbox' })} />
            <Anchor href="/forgot-password" size="sm" mt="xs" display="block">
              Forgot Password?
            </Anchor>
            {error && (
              <Text c="red" size="sm" mt="sm">
                {error}
              </Text>
            )}
            <Button fullWidth mt="xl" type="submit">
              Sign in
            </Button>
          </form>
          <Text size="sm" ta="center">
            Do not have an account yet? <Anchor href="/register">Create account</Anchor>
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}