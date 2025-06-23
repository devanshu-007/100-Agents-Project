import { AppLayout } from './components/AppLayout';
import { ConversationFlow } from './components/ConversationFlow';
import { SafetyReport } from './components/SafetyReport';
import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ConsensusAgent from './agents/ConsensusAgent';
import { complianceAgent } from './agents/ComplianceAgent';
import type { ComplianceReport, ChatMessage } from './agents/ComplianceAgent';

// Ultra-modern dark theme with high contrast and vibrant accents
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff',
      light: '#4fffb0',
      dark: '#0088cc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff6b6b',
      light: '#ff9999',
      dark: '#ff3333',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
    success: {
      main: '#00ff88',
      light: '#4fffb0',
      dark: '#00cc66',
    },
    warning: {
      main: '#ffb000',
      light: '#ffcc4d',
      dark: '#e6a000',
    },
    error: {
      main: '#ff4757',
      light: '#ff6b7a',
      dark: '#e63946',
    },
    info: {
      main: '#00d4ff',
      light: '#4fffb0',
      dark: '#0088cc',
    },
    grey: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#bdbdbd',
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '-0.005em',
      background: 'linear-gradient(135deg, #00d4ff 0%, #4fffb0 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 700,
      lineHeight: 1.5,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: '16px',
          lineHeight: 1.6,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: 'rgba(26, 26, 26, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 212, 255, 0.15), 0 0 0 1px rgba(0, 212, 255, 0.1)',
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.1), 0 0 0 1px rgba(0, 212, 255, 0.05)',
        },
        elevation3: {
          boxShadow: '0 12px 40px rgba(0, 212, 255, 0.2), 0 0 0 1px rgba(0, 212, 255, 0.15)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          padding: '14px 28px',
          background: 'linear-gradient(135deg, #00d4ff 0%, #4fffb0 100%)',
          color: '#000000',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4), 0 0 20px rgba(79, 255, 176, 0.2)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4fffb0 0%, #00d4ff 100%)',
            transform: 'translateY(-3px) scale(1.02)',
            boxShadow: '0 8px 40px rgba(0, 212, 255, 0.6), 0 0 30px rgba(79, 255, 176, 0.4)',
            border: '1px solid rgba(79, 255, 176, 0.5)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        sizeLarge: {
          fontSize: '1.125rem',
          padding: '16px 32px',
          borderRadius: 16,
        },
        sizeSmall: {
          fontSize: '0.875rem',
          padding: '10px 20px',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
            fontSize: '1rem',
            backgroundColor: 'rgba(26, 26, 26, 0.8)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(0, 212, 255, 0.3)',
              borderWidth: 2,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 212, 255, 0.6)',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00d4ff',
              borderWidth: 2,
              boxShadow: '0 0 30px rgba(0, 212, 255, 0.4)',
            },
            '& input': {
              padding: '16px 20px',
              fontSize: '1rem',
              color: '#ffffff',
            },
            '& textarea': {
              padding: '16px 20px',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#ffffff',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#b0b0b0',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00d4ff',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontSize: '1rem',
          padding: '16px 24px',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(0, 255, 136, 0.1)',
          color: '#00ff88',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)',
        },
        standardError: {
          backgroundColor: 'rgba(255, 71, 87, 0.1)',
          color: '#ff4757',
          border: '1px solid rgba(255, 71, 87, 0.3)',
          boxShadow: '0 0 20px rgba(255, 71, 87, 0.2)',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 176, 0, 0.1)',
          color: '#ffb000',
          border: '1px solid rgba(255, 176, 0, 0.3)',
          boxShadow: '0 0 20px rgba(255, 176, 0, 0.2)',
        },
        standardInfo: {
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          color: '#00d4ff',
          border: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 212, 255, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          fontSize: '0.875rem',
          height: 36,
          '&.MuiChip-sizeMedium': {
            height: 40,
            fontSize: '1rem',
            fontWeight: 600,
          },
          '&.MuiChip-sizeSmall': {
            height: 32,
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: 'hidden',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          fontSize: '1rem',
          fontWeight: 600,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '12px 20px',
          borderRadius: 12,
          fontSize: '1rem',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '1rem',
          fontWeight: 500,
        },
        secondary: {
          fontSize: '0.875rem',
          fontWeight: 400,
        },
      },
    },
  },
});

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
  hallucination: 'pending' | 'analyzing' | 'complete';
  intent_alignment: 'pending' | 'analyzing' | 'complete';
};

function App() {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({
    clarity: 'pending',
    bias: 'pending',
    toxicity: 'pending',
    hallucination: 'pending',
    intent_alignment: 'pending'
  });

  const convertToAuditFormat = (messages: Message[]): ChatMessage[] => {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  };

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: Message = { role: 'user', content: userInput };
    setConversationHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setComplianceReport(null);
    setAnalysisProgress({ 
      clarity: 'pending', 
      bias: 'pending', 
      toxicity: 'pending',
      hallucination: 'pending',
      intent_alignment: 'pending'
    });

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
      for await (const _token of streamGenerator) {
        // Tokens are handled in the callback above
      }
      
      try {
        const result = await streamGenerator.next();
        if (result.done) {
          finalResponse = result.value;
        }
      } catch (e) {
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
      const updatedHistory = [...conversationHistory, userMessage];
      const finalAssistantMessage: Message = {
        role: 'assistant',
        content: finalResponse?.content || streamingContent,
        model: finalResponse?.model || 'Unknown',
        sources: finalResponse?.sources,
      };
      updatedHistory.push(finalAssistantMessage);
      
      setConversationHistory(updatedHistory);

      // Step 2: Enhanced audit with conversation context
      setIsAuditing(true);
      const auditContent = finalResponse?.content || streamingContent;
      const auditHistory = convertToAuditFormat(updatedHistory);
      
      const report = await complianceAgent.analyzeCompliance(
        auditContent,
        auditHistory,
        (metric) => {
          setAnalysisProgress(prev => ({ ...prev, [metric]: 'analyzing' }));
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
    } finally {
      setIsProcessing(false);
      setIsAuditing(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

export default App;
