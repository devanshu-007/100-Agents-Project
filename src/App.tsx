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
  fallbackModel: { modelName: 'gemma-7b-it', temperature: 0.7, maxTokens: 1024 },
  similarityThreshold: 0.5,
};
const consensusAgent = new ConsensusAgent(agentConfig);

type AnalysisProgress = {
  clarity: 'pending' | 'analyzing' | 'complete';
  bias: 'pending' | 'analyzing' | 'complete';
  toxicity: 'pending' | 'analyzing' | 'complete';
};

function App() {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({
    clarity: 'pending',
    bias: 'pending',
    toxicity: 'pending'
  });

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: 'user', content: userInput };
    setConversationHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setComplianceReport(null); // Clear previous report
    setAnalysisProgress({ clarity: 'pending', bias: 'pending', toxicity: 'pending' });

    try {
      // Step 1: Get streaming response from the consensus agent
      const tempAssistantMessage: Message = {
        role: 'assistant',
        content: '',
        model: 'Generating...',
      };
      setConversationHistory(prev => [...prev, tempAssistantMessage]);

      let streamingContent = '';
      const streamGenerator = consensusAgent.generateConsensusResponseStream(
        userInput,
        (token) => {
          streamingContent += token;
          // Update the last message with the new token
          setConversationHistory(prev => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (updated[lastIndex].role === 'assistant') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: streamingContent,
              };
            }
            return updated;
          });
        }
      );

      // Consume the stream and get final response
      let finalResponse: any = null;
      for await (const token of streamGenerator) {
        // Tokens are handled in the callback above
      }
      
      // The generator should return the final response data
      try {
        const result = await streamGenerator.next();
        if (result.done) {
          finalResponse = result.value;
        }
      } catch (e) {
        // Fallback to regular response if streaming fails
        finalResponse = await consensusAgent.generateConsensusResponse(userInput);
        setConversationHistory(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (updated[lastIndex].role === 'assistant') {
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: finalResponse.content,
            };
          }
          return updated;
        });
      }
      
      // Update the final message with complete metadata
      setConversationHistory(prev => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (updated[lastIndex].role === 'assistant') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            model: finalResponse?.model || 'Unknown',
            sources: finalResponse?.sources,
          };
        }
        return updated;
      });

      // Step 2: Audit the response with progress tracking
      setIsAuditing(true);
      const auditContent = finalResponse?.content || streamingContent;
      const report = await complianceAgent.analyzeCompliance(
        auditContent,
        (metric) => {
          setAnalysisProgress(prev => ({ ...prev, [metric]: 'analyzing' }));
          // Mark as complete after a brief delay to show the analyzing state
          setTimeout(() => {
            setAnalysisProgress(prev => ({ ...prev, [metric]: 'complete' }));
          }, 1000);
        }
      );
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
          analysisProgress={analysisProgress}
        />
      }
    />
  );
}

export default App;
