'use client';

import { NavLink } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <>
      {links}
    </>
  );
}
