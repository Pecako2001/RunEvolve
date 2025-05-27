'use client';

import React, { useState, useEffect } from 'react';
import { Group, Title, Burger, Box, ActionIcon } from '@mantine/core';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { IconMoon } from '@tabler/icons-react';
import { IconSun } from '@tabler/icons-react';

interface AppHeaderProps {
  navbarOpened: boolean;
  toggleNavbar: () => void;
  currentTheme: 'theme-dark' | 'theme-light';
  onToggleTheme: () => void;
}


export function AppHeader({ navbarOpened, toggleNavbar }: AppHeaderProps) {
  
  const [theme, setTheme] = useState<'theme-dark' | 'theme-light'>(() => {
    if (typeof window !== 'undefined') {
      return document.body.classList.contains('theme-light') ? 'theme-light' : 'theme-dark';
    }
    return 'theme-dark';
  });

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'theme-dark' ? 'theme-light' : 'theme-dark'));
  };

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(theme);
  }, [theme]);
  return (
    <Box className="header__group">
      <Group>
        <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="sm" size="sm" />
      </Group>
          <Group gap={0}>
            <ActionIcon
              onClick={onToggleTheme}
              variant="subtle"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {currentTheme === 'theme-dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
            </ActionIcon>
            {toggleNavbar && (
              <ActionIcon
                onClick={toggleNavbar}
                variant="subtle"
                size="lg"
                aria-label="Toggle sidebar"
              >
                <IconMenu2 size={20} />
              </ActionIcon>
            )}
          </Group>
    </Box>
  );
}