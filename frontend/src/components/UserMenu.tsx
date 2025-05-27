'use client';

import { Menu, UnstyledButton, Avatar, Group, Text } from '@mantine/core';
import Link from 'next/link';
import { IconLogout, IconUser } from '@tabler/icons-react';

export default function UserMenu() {
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Avatar radius="xl" size="sm" />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/profile" leftSection={<IconUser size={14} />}>Profile</Menu.Item>
        <Menu.Item component={Link} href="/statistics" leftSection={<IconUser size={14} />}>Statistics</Menu.Item>
        <Menu.Item color="red" leftSection={<IconLogout size={14} />}>Logout</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
