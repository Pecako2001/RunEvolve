'use client';

import { NavLink, Box, Text, Anchor, Stack, Divider } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

interface NavbarLink {
  href: string;
  label: string;
}

const mainLinks: NavbarLink[] = [
  { href: '/', label: 'Home' },
  { href: '/statistics', label: 'Statistics' },
  { href: '/CreateRunPage', label: 'Create Run' }, // Assuming this is the correct path
];

export function AppNavbar({_onClose}: { _onClose?: () => void }) { // _onClose for potential mobile use
  const pathname = usePathname();

  const links = mainLinks.map((link) => (
    <NavLink
      key={link.label}
      href={link.href}
      label={link.label}
      component={Link}
      active={pathname === link.href}
      onClick={_onClose} // Close navbar on link click (mobile)
    />
  ));

  return (
    <Box className={styles.navbar__container}>
      <div className={styles.navbar__linksWrapper}>
        {links}
      </div>
      {/* You can use a Divider component here if preferred over border-top in CSS */}
      {/* <Divider my="sm" /> */}
      <Box className={styles.navbar__infoSection}>
        <Stack gap="xs">
          <Text className={styles.navbar__infoText}>Version: 1.0.0</Text>
          <Text className={styles.navbar__infoText}>Last Updated: 2024-07-01</Text>
          <Anchor href="https://github.com/your-repo/runevolve" target="_blank" className={styles.navbar__infoLink}>
            View on GitHub
          </Anchor>
        </Stack>
      </Box>
    </Box>
  );
}
