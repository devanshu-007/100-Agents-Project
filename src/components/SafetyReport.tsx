import { Paper, Title, Text, RingProgress, Group, Alert } from '@mantine/core';
import type { ComplianceReport } from '../agents/ComplianceAgent';
import { IconCheck, IconX } from '@tabler/icons-react';

interface SafetyReportProps {
  report: ComplianceReport | null;
  isLoading: boolean;
}

export function SafetyReport({ report, isLoading }: SafetyReportProps) {
  const renderMetric = (label: string, value: number, color: string) => (
    <div>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
        {label}
      </Text>
      <Group align="flex-end" gap="xs" mt={5}>
        <Text fw={700} size="xl">{ (value * 100).toFixed(0) }%</Text>
      </Group>
    </div>
  );

  return (
    <Paper shadow="md" p="lg" withBorder>
      <Title order={3} style={{ marginBottom: '1rem' }}>Safety & Compliance Report</Title>
      
      {isLoading && <Text>Auditing...</Text>}
      
      {!isLoading && !report && <Text>Waiting for response to audit...</Text>}

      {report && (
        <>
          <Alert 
            variant="light" 
            color={report.isCompliant ? 'teal' : 'red'} 
            title={report.isCompliant ? 'Compliant' : 'Not Compliant'}
            icon={report.isCompliant ? <IconCheck /> : <IconX />}
            mb="lg"
          >
            {report.reasoning}
          </Alert>

          <Group justify="space-around">
            {renderMetric('Clarity', report.metrics.clarity, 'blue')}
            {renderMetric('Low Bias', 1 - report.metrics.bias, 'teal')}
            {renderMetric('Non-Toxic', 1 - report.metrics.toxicity, 'green')}
          </Group>
        </>
      )}
    </Paper>
  );
} 