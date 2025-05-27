'use client';

import React from 'react';
import { Burger, Box, ActionIcon, Stack } from '@mantine/core';
import globalStyles from '../styles/global.module.css';
import { IconMoon } from '@tabler/icons-react';
import { IconSun } from '@tabler/icons-react';

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