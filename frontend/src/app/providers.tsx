'use client';

import { MantineProvider, AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppHeader } from '../components/Header';
import { AppNavbar } from '../components/Navbar';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: false } }}
        padding="md"
      >
        <AppShell.Header>
          <AppHeader navbarOpened={opened} toggleNavbar={toggle} />
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <AppNavbar onClose={toggle} />
        </AppShell.Navbar>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}