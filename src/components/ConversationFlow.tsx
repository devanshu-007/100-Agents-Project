import { Paper, Title, Box, TextInput, Button, Group, Loader, Text } from '@mantine/core';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../App';

interface ConversationFlowProps {
  history: Message[];
  isProcessing: boolean;
  onSendMessage: (message: string) => void;
}

export function ConversationFlow({ history, isProcessing, onSendMessage }: ConversationFlowProps) {
  const [userInput, setUserInput] = useState('');

  const handleSend = () => {
    if (!userInput.trim()) return;
    onSendMessage(userInput);
    setUserInput('');
  };

  return (
    <Paper shadow="md" p="lg" withBorder style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Title order={3} style={{ marginBottom: '1rem' }}>Conversation</Title>
      
      <Box style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
        {history.map((msg, index) => (
          <Paper key={index} p="sm" mb="sm" withBorder 
            bg={msg.role === 'user' ? 'blue.1' : 'gray.1'}>
            <Text size="sm" c={msg.role === 'user' ? 'blue.9' : 'gray.9'}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </Text>
            {msg.model && <Text size="xs" c="dimmed" ta="right">Model: {msg.model}</Text>}
          </Paper>
        ))}
        {isProcessing && <Loader />}
      </Box>

      <Group>
        <TextInput
          placeholder="Enter your message..."
          style={{ flex: 1 }}
          value={userInput}
          onChange={(e) => setUserInput(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isProcessing}
        />
        <Button onClick={handleSend} disabled={isProcessing}>
          Send
        </Button>
      </Group>
    </Paper>
  );
} 