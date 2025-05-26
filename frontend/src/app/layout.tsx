'use client'; // Required for useDisclosure and other client-side hooks

import '@mantine/core/styles.css';
import '../styles/global.module.css';
import './globals.css';
import { MantineProvider, createTheme, ActionIcon, Loader } from '@mantine/core';
import Providers from './providers';

export const theme = createTheme({
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Run Evolve</title>
        <link rel="icon" href="/Icon.png" />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Providers>
            {children}
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}