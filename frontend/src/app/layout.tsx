'use client'; // Required for useDisclosure and other client-side hooks

import '@mantine/core/styles.css';
import '../styles/global.module.css';
import './globals.css';
import { MantineProvider, createTheme, ActionIcon, Loader, AppShell } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import Providers, { useTheme } from './providers'; // Renamed to ThemeProvider internally but default export is Providers
import { AppHeader } from '../components/Header';
import { AppNavbar } from '../components/Navbar';

// Mantine theme configuration (can be kept or further customized)
export const mantineThemeConfig = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  focusRing: 'auto',
  fontFamily: 'Open Sans, sans-serif',
  headings: { fontFamily: 'Open Sans, sans-serif' },
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        type: 'bars',
      },
    }),
  },
});

function AppLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const { theme, toggleTheme } = useTheme();

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: false },
      }}
    >
      <AppShell.Header>
        <AppHeader
          navbarOpened={opened}
          toggleNavbar={toggle}
          currentTheme={theme}
          onToggleTheme={toggleTheme}
        />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <AppNavbar onClose={toggle} mobileOpened={opened} />
      </AppShell.Navbar>
      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Run Evolve</title>
        <link rel="icon" href="/Icon.png" />
      </head>
      <body>
        {/* MantineProvider should be at the root for styles */}
        <MantineProvider theme={mantineThemeConfig}>
          {/* Providers now refers to ThemeProvider */}
          <Providers>
            <Notifications />
            <AppLayout>{children}</AppLayout>
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}