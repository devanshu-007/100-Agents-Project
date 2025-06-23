import { AppLayout } from './components/AppLayout';
import { ConversationFlow } from './components/ConversationFlow';
import { SafetyReport } from './components/SafetyReport';
import { useState } from 'react';
import ConsensusAgent from './agents/ConsensusAgent';
import { complianceAgent } from './agents/ComplianceAgent';
import type { ComplianceReport } from './agents/ComplianceAgent';

// Define the structure for a single message
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
  sources?: any[];
}

// Configuration for the Consensus Agent
const agentConfig = {
  primaryModel: { modelName: 'llama3-8b-8192', temperature: 0.5, maxTokens: 1024 },
  secondaryModel: { modelName: 'mixtral-8x7b-32768', temperature: 0.5, maxTokens: 1024 },
  similarityThreshold: 0.5,
};
const consensusAgent = new ConsensusAgent(agentConfig);


function App() {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: 'user', content: userInput };
    setConversationHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setComplianceReport(null); // Clear previous report

    try {
      // Step 1: Get response from the consensus agent
      const assistantResponse = await consensusAgent.generateConsensusResponse(userInput);
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponse.content,
        model: assistantResponse.model,
      };
      setConversationHistory(prev => [...prev, assistantMessage]);

      // Step 2: Audit the response
      setIsAuditing(true);
      const report = await complianceAgent.analyzeCompliance(assistantResponse.content);
      setComplianceReport(report);

    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        model: 'system-error'
      };
      setConversationHistory(prev => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsProcessing(false);
      setIsAuditing(false);
    }
  };

  return (
    <AppLayout 
      chatPanel={
        <ConversationFlow 
          history={conversationHistory}
          isProcessing={isProcessing}
          onSendMessage={handleSendMessage}
        />
      }
      reportPanel={
        <SafetyReport 
          report={complianceReport}
          isLoading={isAuditing}
        />
      }
    />
  );
}

export default App;
