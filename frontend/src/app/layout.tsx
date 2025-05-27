'use client'; // Required for useDisclosure and other client-side hooks

import '@mantine/core/styles.css';
import '../styles/global.module.css';
import './globals.css';
import { MantineProvider, createTheme, ActionIcon, Loader, AppShell } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { usePathname } from 'next/navigation';
import Providers, { useTheme } from './providers'; // Renamed to ThemeProvider internally but default export is Providers
import { AppHeader } from '../components/layout/Header';
import { AppNavbar } from '../components/layout/Navbar';

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
  const pathname = usePathname();
  const showNavbar = pathname !== '/login' && pathname !== '/register';

  return (
    <AppShell
      navbar={showNavbar ? { width: 250, breakpoint: 'sm', collapsed: { mobile: !opened, desktop: false } } : undefined}
    >
      {showNavbar && (
        <AppShell.Navbar px={0} py={0}>
          <AppNavbar onClose={toggle} mobileOpened={opened} />
        </AppShell.Navbar>
      )}

      <AppShell.Header>
        <AppHeader
          navbarOpened={opened}
          toggleNavbar={toggle}
          currentTheme={theme}
          onToggleTheme={toggleTheme}
        />
      </AppShell.Header>

      <AppShell.Main style={{ paddingTop: 60 }}>
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