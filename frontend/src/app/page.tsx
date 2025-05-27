"use client";

import { Grid } from "@mantine/core";
import LastRunCard from "../components/cards/LastRunCard";
import HeartRateCard from "../components/cards/HeartRateCard";
import Best5kCard from "../components/cards/Best5kCard";
import Best10kCard from "../components/cards/Best10kCard";
import BestHMCard from "../components/cards/BestHMCard";
import ThisWeekKmCard from "../components/cards/ThisWeekKmCard";
import RunsThisWeekCard from "../components/cards/RunsThisWeekCard";
import TotalRunsCard from "../components/cards/TotalRunsCard";
import TotalKmCard from "../components/cards/TotalKmCard";

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
