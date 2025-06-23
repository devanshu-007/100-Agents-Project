import { Paper, Title } from '@mantine/core';

export function SafetyReport() {
  return (
    <Paper shadow="md" p="lg" withBorder>
      <Title order={3}>Safety & Compliance Report</Title>
      {/* Audit results will go here */}
    </Paper>
  );
} 