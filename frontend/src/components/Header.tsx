'use client';

import React from 'react';
import { Burger, Box, ActionIcon, Stack } from '@mantine/core';
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
  return (
    <Box className={globalStyles.header__group}>
      <Stack justify="center" gap="md">
        <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="sm" size="sm" />
        <ActionIcon
          onClick={onToggleTheme}
          variant="subtle"
          size="lg"
          aria-label="Toggle color scheme"
        >
          {currentTheme === 'theme-dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
        </ActionIcon>
      </Stack>
    </Box>
  );
}