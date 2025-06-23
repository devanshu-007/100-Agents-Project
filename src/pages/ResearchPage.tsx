import { Container, Title } from '@mantine/core';
import InteractionPane from '../components/InteractionPane';

function ResearchPage() {
  return (
    <Container style={{ paddingTop: '2rem' }}>
      <Title order={1} style={{ textAlign: 'center', marginBottom: '2rem' }}>
        AI Research Agent
      </Title>
      <InteractionPane />
    </Container>
  );
}

export default ResearchPage; 