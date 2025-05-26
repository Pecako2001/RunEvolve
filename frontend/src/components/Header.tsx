'use client';

import { Group, Title, Burger } from '@mantine/core';
import styles from './Header.module.css';

interface AppHeaderProps {
  navbarOpened: boolean;
  toggleNavbar: () => void;
}

export function AppHeader({ navbarOpened, toggleNavbar }: AppHeaderProps) {
  return (
    <Group h="100%" px="md">
      <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="sm" size="sm" />
      <Title order={3}>Run Tracker App</Title>
    </Group>
  );
}
