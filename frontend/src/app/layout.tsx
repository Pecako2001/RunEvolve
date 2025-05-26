'use client'; // Required for useDisclosure and other client-side hooks

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@mantine/core/styles.css';
import { MantineProvider, ColorSchemeScript, AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppHeader } from '../components/Header'; // Adjust path if necessary
import { AppNavbar } from '../components/Navbar'; // Adjust path if necessary

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = { // Metadata should not be exported from client component
//   title: "Run Tracker App",
//   description: "Track your runs efficiently",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        {/* It's generally recommended to put metadata in a server component or pages/_document.js if using older Next.js */}
        <title>Run Tracker App</title>
        <meta name="description" content="Track your runs efficiently" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
              <AppNavbar _onClose={toggle} />
            </AppShell.Navbar>

            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
