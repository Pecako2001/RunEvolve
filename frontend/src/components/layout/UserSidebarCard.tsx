import React from "react";
import { Group, Avatar, Text } from "@mantine/core";
import { IconGridDots } from "@tabler/icons-react";
import styles from "./UserSidebarCard.module.css";

export interface UserSidebarCardProps {
  name: string;
  email: string;
  avatarSrc: string;
}

const UserSidebarCard: React.FC<UserSidebarCardProps> = ({
  name,
  email,
  avatarSrc,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.rail}>
        <IconGridDots aria-label="menu" size={18} color="white" />
      </div>
      <Group wrap="nowrap" className={styles.card} gap="sm">
        <Avatar src={avatarSrc} radius="xl" size="md" />
        <div>
          <Text fw={700} size="sm" className={styles.name}>
            {name}
          </Text>
          <Text size="xs" c="dimmed" className={styles.email}>
            {email}
          </Text>
        </div>
      </Group>
    </div>
  );
};

export default UserSidebarCard;
