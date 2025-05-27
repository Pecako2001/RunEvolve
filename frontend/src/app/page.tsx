"use client";

import { Grid } from "@mantine/core";
import LastRunCard from "../components/LastRunCard";
import HeartRateCard from "../components/HeartRateCard";
import Best5kCard from "../components/Best5kCard";
import Best10kCard from "../components/Best10kCard";
import BestHMCard from "../components/BestHMCard";
import ThisWeekKmCard from "../components/ThisWeekKmCard";
import RunsThisWeekCard from "../components/RunsThisWeekCard";
import TotalRunsCard from "../components/TotalRunsCard";
import TotalKmCard from "../components/TotalKmCard";

export default function Home() {
  return (
    <div className="page-container">
      <Grid gutter="md" className="dashboard-grid">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <LastRunCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <HeartRateCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Best5kCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Best10kCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <BestHMCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <ThisWeekKmCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <RunsThisWeekCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <TotalRunsCard />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <TotalKmCard />
        </Grid.Col>
      </Grid>
    </div>
  );
}
