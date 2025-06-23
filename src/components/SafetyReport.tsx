import { Paper, Title, Text, RingProgress, Group, Alert, Badge } from '@mantine/core';
import type { ComplianceReport } from '../agents/ComplianceAgent';
import { IconCheck, IconX, IconLoader } from '@tabler/icons-react';

type AnalysisProgress = {
  clarity: 'pending' | 'analyzing' | 'complete';
  bias: 'pending' | 'analyzing' | 'complete';
  toxicity: 'pending' | 'analyzing' | 'complete';
};

interface SafetyReportProps {
  report: ComplianceReport | null;
  isLoading: boolean;
  analysisProgress: AnalysisProgress;
}

export function SafetyReport({ report, isLoading, analysisProgress }: SafetyReportProps) {
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

  const renderProgressIndicator = (metric: keyof AnalysisProgress) => {
    const status = analysisProgress[metric];
    const color = status === 'complete' ? 'teal' : status === 'analyzing' ? 'blue' : 'gray';
    const icon = status === 'complete' ? <IconCheck size={12} /> : 
                status === 'analyzing' ? <IconLoader size={12} className="animate-spin" /> : null;
    
    return (
      <Badge color={color} size="sm" leftSection={icon}>
        {metric.charAt(0).toUpperCase() + metric.slice(1)}: {status}
      </Badge>
    );
  };

  return (
    <Paper shadow="md" p="lg" withBorder>
      <Title order={3} style={{ marginBottom: '1rem' }}>Safety & Compliance Report</Title>
      
      {isLoading && (
        <div>
          <Text mb="md">Auditing response...</Text>
          <Group gap="xs">
            {renderProgressIndicator('clarity')}
            {renderProgressIndicator('bias')}
            {renderProgressIndicator('toxicity')}
          </Group>
        </div>
      )}
      
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