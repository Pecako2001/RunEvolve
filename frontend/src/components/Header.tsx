'use client';

import { Group, Title, Burger, Box, ActionIcon } from '@mantine/core';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { IconMoon } from '@tabler/icons-react';
import { IconSun } from '@tabler/icons-react';
import { useState, useEffect } from "react";

interface AppHeaderProps {
  navbarOpened: boolean;
  toggleNavbar: () => void;
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
  return (
    <Box className="header__group">
      <Group>
        <Burger opened={navbarOpened} onClick={toggleNavbar} hiddenFrom="sm" size="sm" />
      </Group>
          <Group gap={0}>
            <ActionIcon
              onClick={toggleTheme}
              variant="subtle"
              size="lg"
              aria-label="Toggle color scheme"
            >
              {theme === 'theme-dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
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