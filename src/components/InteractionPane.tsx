import { Box, Paper, TextInput, Button, Group, Code, Loader } from '@mantine/core';
import { useState } from 'react';
import { researchAgent } from '../agents/SearchAgent';

function InteractionPane() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setSearchResults(null);
    try {
      const results = await researchAgent.search(inputValue);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed', error);
      // You could set an error state here to display in the UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper shadow="md" p="lg" withBorder>
      <Box style={{ height: '70vh', overflowY: 'auto', marginBottom: '1rem' }}>
        {isLoading && <Loader />}
        {searchResults && (
          <Code block>
            {JSON.stringify(searchResults, null, 2)}
          </Code>
        )}
      </Box>
      <Group>
        <TextInput
          placeholder="Ask a research question..."
          style={{ flex: 1 }}
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch} disabled={isLoading}>Send</Button>
      </Group>
    </Paper>
  );
}

export default InteractionPane; 