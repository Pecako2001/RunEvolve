"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ScrollArea,
  Group,
  Text,
  Divider,
  ActionIcon,
  Box,
  Tooltip,
  Stack,
  Anchor,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import dynamic from "next/dynamic";

import {
  IconHome,
  IconInfoCircle,
  IconUser,
  IconChecklist,
  IconChartDots,
  IconBrain,
} from "@tabler/icons-react";

import styles from "./Navbar.module.css";
import UserSidebarCard from "./UserSidebarCard";

const navSections = [
  {
    title: "Main",
    links: [
      { href: "/", label: "Home", icon: IconHome },
      { href: "/statistics", label: "Statistics", icon: IconChartDots },
      { href: "/CreateRunPage", label: "Create Run", icon: IconChecklist },
      { href: "/NetwerkPage", label: "Network", icon: IconBrain },
      { href: "/goals", label: "Goal", icon: IconBrain },
    ],
  },
  {
    title: "Other",
    links: [
      { href: "/UserMenu", label: "User", icon: IconUser },
      { href: "/info", label: "Project Info", icon: IconInfoCircle },
    ],
  },
];

type SidebarState = "full" | "mini";
type Props = {
  sidebarState?: SidebarState;
  onSidebarStateChange?: () => void;
  onClose?: () => void;
  mobileOpened?: boolean;
};

export function AppNavbar({
  sidebarState = "full",
  onSidebarStateChange,
  onClose,
  mobileOpened,
}: Props) {
  const [active, setActive] = useState("Home");
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (isMobile && onClose && mobileOpened === true) onClose();
    // eslint-disable-next-line
  }, [active]);

  return (
    <Box className={styles.navbar__container} data-sidebar-state={sidebarState}>
      {/* HEADER */}
      <Box className={styles.navbar__header}>
        <Group justify="space-between" align="center">
          <Group>
            <img src="/Icon.png" alt="Logo" width={32} height={32} />
            {sidebarState === "full" && (
              <Text fw={700} size="lg">
                Run Evolve
              </Text>
            )}
          </Group>
        </Group>
      </Box>

      <Divider />

      {/* LINKS WITH SECTION TITLES */}
      <ScrollArea className={styles.navbar__linksWrapper}>
        <Box
          className={styles.navbar__linksInner}
          data-sidebar-state={sidebarState}
        >
          {navSections.map((section) => (
            <Box key={section.title} mb={sidebarState === "mini" ? 0 : "md"}>
              {sidebarState !== "mini" && (
                <Text
                  tt="uppercase"
                  size="xs"
                  pl="md"
                  fw={500}
                  mb="sm"
                  className={styles.navbar__sectionTitle}
                >
                  {section.title}
                </Text>
              )}
              {section.links.map((item) =>
                sidebarState === "mini" ? (
                  <Tooltip label={item.label} position="right" key={item.label}>
                    <Link
                      href={item.href}
                      className={styles.navbar__link}
                      data-active={active === item.label ? "" : undefined}
                      onClick={() => setActive(item.label)}
                    >
                      <item.icon className={styles.navbar__icon} stroke={1.5} />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    href={item.href}
                    key={item.label}
                    className={styles.navbar__link}
                    data-active={active === item.label ? "" : undefined}
                    onClick={() => setActive(item.label)}
                  >
                    <item.icon className={styles.navbar__icon} stroke={1.5} />
                    <span>{item.label}</span>
                  </Link>
                ),
              )}
            </Box>
          ))}
        </Box>
      </ScrollArea>

      {/* FOOTER / INFO SECTION */}
      <Box className={styles.navbar__infoSection}>
        <Stack gap="xs">
          <Text className={styles.navbar__infoText}>Version: 1.0.0</Text>
          <Text className={styles.navbar__infoText}>
            Last Updated: 2025-05-27
          </Text>
          <Anchor
            href="https://github.com/your-repo/runevolve"
            target="_blank"
            className={styles.navbar__infoLink}
          >
            View on GitHub
          </Anchor>
        </Stack>
      </Box>
    </Box>
  );
}
