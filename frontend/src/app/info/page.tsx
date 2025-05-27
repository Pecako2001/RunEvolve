'use client';

import { Container, Title, Text, Paper, Stack, Anchor, List, ThemeIcon } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import styles from './Info.module.css';

export default function InfoPage() {
  return (
    <Container className={styles.infoPage__container}>
      <Title order={1} className={styles.infoPage__title}>Project Information</Title>

      <Paper className={styles.infoPage__card}>
        <Stack gap="sm">
          <Title order={2} className={styles.infoPage__sectionTitle}>About RunEvolve</Title>
          <Text>
            RunEvolve helps you track runs, analyse statistics and reach your fitness goals. The frontend is built with Next.js and Mantine while the backend uses FastAPI.
          </Text>
          <Text>
            Explore the repository on GitHub:
            <Anchor href="https://github.com/your-repo/runevolve" target="_blank" className={styles.infoPage__link}>
              RunEvolve GitHub
            </Anchor>
          </Text>
        </Stack>
      </Paper>

      <Paper className={styles.infoPage__card}>
        <Title order={2} className={styles.infoPage__sectionTitle}>Key Features</Title>
        <List
          size="sm"
          spacing="xs"
          icon={
            <ThemeIcon size={16} radius="xl">
              <IconInfoCircle stroke={1.5} />
            </ThemeIcon>
          }
        >
          <List.Item>Track your runs and analyse detailed statistics</List.Item>
          <List.Item>Generate training plans using AI</List.Item>
          <List.Item>Set goals and monitor your progress</List.Item>
          <List.Item>Upcoming: Strava integration</List.Item>
        </List>
      </Paper>
    </Container>
  );
}
