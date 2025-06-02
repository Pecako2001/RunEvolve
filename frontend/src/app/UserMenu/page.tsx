"use client";

import { Card, Title, Text, Group, Avatar, Stack, Button } from "@mantine/core";
import { IconUser, IconLogout } from "@tabler/icons-react";
import UserSidebarCard from "@/components/layout/UserSidebarCard";
export default function ProfilePage() {
  // Dummy user data for demonstration
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/Icon.png",
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <Group align="center" justify="center" style={{ minHeight: "80vh" }}>
      <Card
        shadow="md"
        padding="xl"
        radius="md"
        withBorder
        style={{ minWidth: 340 }}
      >
        <Stack align="center" gap="md">
          <Avatar src={user.avatar} size={80} radius="xl" />
          <Title order={3}>{user.name}</Title>
          <Text c="dimmed">{user.email}</Text>
          <Button
            leftSection={<IconLogout size={18} />}
            color="red"
            variant="light"
            mt="md"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Card>
    </Group>
  );
}
