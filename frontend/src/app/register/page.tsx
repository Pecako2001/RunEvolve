'use client';

import { useState } from 'react';
import { TextInput, PasswordInput, Anchor, Paper, Title, Text, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './AuthForm.module.css';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm({
    initialValues: { firstName: '', lastName: '', email: '', password: '', confirm: '' },
  });
  const [error, setError] = useState('');

  const handleSubmit = async (values: typeof form.values) => {
    if (values.password !== values.confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
      });
      router.push('/login');
    } catch (e) {
      setError('Registration failed');
    }
  };

  return (
    <div className={styles.authPage__container}>
      <Paper withBorder shadow="md" p="xl" className={styles.authPage__card}>
        <Stack>
          <img src="/Icon.png" alt="Logo" width={40} height={40} style={{ alignSelf: 'center' }} />
          <Title order={2} ta="center">Welcome!</Title>
          <Text ta="center" c="dimmed" size="sm">
            Create your account to continue
          </Text>
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput label="First Name" required {...form.getInputProps('firstName')} />
            <TextInput label="Last Name" required mt="md" {...form.getInputProps('lastName')} />
            <TextInput label="Email" required mt="md" {...form.getInputProps('email')} />
            <PasswordInput label="Password" required mt="md" {...form.getInputProps('password')} />
            <PasswordInput label="Confirm Password" required mt="md" {...form.getInputProps('confirm')} />
            {error && (
              <Text c="red" size="sm" mt="sm">
                {error}
              </Text>
            )}
            <Button fullWidth mt="xl" type="submit">
              Create Account
            </Button>
          </form>
          <Text size="sm" ta="center">
            Already have an account? <Anchor href="/login">Sign in</Anchor>
          </Text>
        </Stack>
      </Paper>
    </div>
  );
}
