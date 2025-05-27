'use client';

import React from 'react';
import { Burger, Box, ActionIcon, Group, Flex } from '@mantine/core';
import globalStyles from '../styles/global.module.css';
import dynamic from 'next/dynamic';

const IconMoon = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconMoon),
  { ssr: false }
);
const IconSun = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconSun),
  { ssr: false }
);
const IconBell = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconBell),
  { ssr: false }
);
const IconLogout = dynamic(() =>
  import('@tabler/icons-react').then((mod) => mod.IconLogout),
  { ssr: false }
);

interface AppHeaderProps {
  navbarOpened: boolean;
  toggleNavbar: () => void;
  currentTheme: 'theme-dark' | 'theme-light';
  onToggleTheme: () => void;
}

export function AppHeader({
  navbarOpened,
  toggleNavbar,
  currentTheme,
  onToggleTheme,
}: AppHeaderProps) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Box className={globalStyles.header__group}>
      <Flex justify="space-between" align="center" w="100%">
        <Group gap="md">
          <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="sm" size="sm" />
        </Group>
        <Group gap="xs">
          <ActionIcon variant="subtle" size="lg" aria-label="Notifications">
            <IconBell size={20} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            size="lg"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <IconLogout size={20} />
          </ActionIcon>
          <ActionIcon
            onClick={onToggleTheme}
            variant="subtle"
            size="lg"
            aria-label="Toggle color scheme"
          >
            {currentTheme === 'theme-dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>
      </Flex>
    </Box>
  );
}