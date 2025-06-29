import { AppLayout } from './components/AppLayout';
import { ConversationFlow } from './components/ConversationFlow';
import { SafetyReport } from './components/SafetyReport';
import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import ConsensusAgent from './agents/ConsensusAgent';
import { riskAuditorAgent } from './agents/RiskAuditorAgent';
import type { RiskAuditReport, ChatMessage } from './agents/RiskAuditorAgent';

// Ultra-modern dark theme inspired by Unseal design
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4ade80', // Bright teal/green like Unseal
      light: '#6ee7b7',
      dark: '#22c55e',
      contrastText: '#000000',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#0a0b0d', // Deep dark navy like Unseal
      paper: '#1a1d21', // Slightly lighter for cards
    },
    success: {
      main: '#4ade80',
      light: '#6ee7b7',
      dark: '#22c55e',
    },
    warning: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#4ade80',
      light: '#6ee7b7',
      dark: '#22c55e',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af', // Muted gray like Unseal
    },
    divider: 'rgba(75, 85, 99, 0.2)', // Subtle gray dividers
  },
  typography: {
    fontFamily: '"Space Grotesk", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#e5e7eb',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#9ca3af',
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners like Unseal
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0b0d 0%, #111827 50%, #0a0b0d 100%)',
          minHeight: '100vh',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            borderRadius: '10px',
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            '&:hover': {
              background: 'linear-gradient(135deg, #22c55e, #4ade80)',
            }
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 10px 40px rgba(74, 222, 128, 0.4), 0 0 20px rgba(74, 222, 128, 0.2)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
          color: '#000000',
          fontWeight: 700,
          border: '1px solid rgba(74, 222, 128, 0.3)',
          boxShadow: '0 4px 20px rgba(74, 222, 128, 0.3), 0 0 15px rgba(74, 222, 128, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)',
            boxShadow: '0 8px 40px rgba(74, 222, 128, 0.5), 0 0 30px rgba(74, 222, 128, 0.3)',
            border: '1px solid rgba(74, 222, 128, 0.5)',
          },
          '&:disabled': {
            background: 'rgba(74, 222, 128, 0.3)',
            color: 'rgba(0, 0, 0, 0.5)',
          },
        },
        outlined: {
          border: '1px solid rgba(74, 222, 128, 0.5)',
          color: '#4ade80',
          background: 'rgba(74, 222, 128, 0.05)',
          '&:hover': {
            background: 'rgba(74, 222, 128, 0.1)',
            border: '1px solid rgba(74, 222, 128, 0.7)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(26, 29, 33, 0.8)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            fontSize: '1rem',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              border: '1px solid rgba(74, 222, 128, 0.5)',
            },
            '&.Mui-focused': {
              border: '1px solid #4ade80',
              boxShadow: '0 0 20px rgba(74, 222, 128, 0.2)',
            },
            '& input': {
              color: '#ffffff',
              fontSize: '1rem',
              padding: '14px 16px',
              '&::placeholder': {
                color: '#9ca3af',
                opacity: 1,
              },
            },
            '& textarea': {
              color: '#ffffff',
              fontSize: '1rem',
              '&::placeholder': {
                color: '#9ca3af',
                opacity: 1,
              },
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 29, 33, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(75, 85, 99, 0.2)',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
        },
        elevation0: {
          background: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          fontSize: '0.875rem',
          border: '1px solid',
          transition: 'all 0.3s ease',
        },
        filled: {
          background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.1))',
          color: '#4ade80',
          borderColor: 'rgba(74, 222, 128, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.25), rgba(34, 197, 94, 0.2))',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 15px rgba(74, 222, 128, 0.3)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(10, 11, 13, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(75, 85, 99, 0.2)',
          boxShadow: '0 1px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 29, 33, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(75, 85, 99, 0.2)',
          borderRadius: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            boxShadow: '0 8px 40px rgba(74, 222, 128, 0.15), 0 0 20px rgba(74, 222, 128, 0.1)',
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: 'rgba(75, 85, 99, 0.3)',
        },
        bar: {
          borderRadius: 8,
          background: 'linear-gradient(135deg, #4ade80, #22c55e)',
          boxShadow: '0 0 10px rgba(74, 222, 128, 0.5)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#4ade80',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'rgba(26, 29, 33, 0.8)',
          border: '1px solid rgba(75, 85, 99, 0.2)',
          borderRadius: '12px !important',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
            border: '1px solid rgba(74, 222, 128, 0.3)',
            boxShadow: '0 4px 20px rgba(74, 222, 128, 0.1)',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderRadius: '12px 12px 0 0',
          '&:hover': {
            background: 'rgba(74, 222, 128, 0.05)',
          },
        },
        content: {
          '&.Mui-expanded': {
            margin: '12px 0',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '0 24px 24px',
          background: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '0 0 12px 12px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
        },
        standardSuccess: {
          background: 'rgba(74, 222, 128, 0.1)',
          border: '1px solid rgba(74, 222, 128, 0.3)',
          color: '#4ade80',
        },
        standardWarning: {
          background: 'rgba(251, 191, 36, 0.1)',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          color: '#fbbf24',
        },
        standardError: {
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#4ade80',
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'all 0.3s ease',
          '&:hover': {
            color: '#22c55e',
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

// Configuration for the Consensus Agent - Now with 3 models for advanced consensus
const agentConfig = {
  primaryModel: { modelName: 'llama3-8b-8192', temperature: 0.5, maxTokens: 1024 },
  secondaryModel: { modelName: 'mixtral-8x7b-32768', temperature: 0.5, maxTokens: 1024 },
  tertiaryModel: { modelName: 'llama3-70b-8192', temperature: 0.4, maxTokens: 1024 }, // NEW: More powerful 70B model
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
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [riskAuditReport, setRiskAuditReport] = useState<RiskAuditReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({
    clarity: 'pending',
    bias: 'pending',
    toxicity: 'pending',
    hallucination: 'pending',
    intent_alignment: 'pending'
  });

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { 
      id: `user-${Date.now()}`,
      role: 'user', 
      content: userInput 
    };
    setConversationHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setRiskAuditReport(null);
    setAnalysisProgress({ 
      clarity: 'pending', 
      bias: 'pending', 
      toxicity: 'pending',
      hallucination: 'pending',
      intent_alignment: 'pending'
    });

    try {
      // Add a placeholder for the assistant's response
      const assistantId = `assistant-${Date.now()}`;
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        model: 'Thinking...',
      };
      setConversationHistory(prev => [...prev, assistantMessage]);
      setIsProcessing(false);

      let streamingContent = '';
      const streamGenerator = consensusAgent.generateConsensusResponseStream(
        userInput,
        (token) => {
          streamingContent += token;
          setConversationHistory(prev =>
            prev.map(msg =>
              msg.id === assistantId
                ? { ...msg, content: streamingContent, model: 'Generating...' }
                : msg
            )
          );
        }
      );

      // Consume the stream to get the final response metadata
      let finalResponse: any = null;
      for await (const _token of streamGenerator) {}
      
      const result = await streamGenerator.next();
      if (result.done) {
        finalResponse = result.value;
      }

      // Update the final message with complete metadata
      setConversationHistory(prev =>
        prev.map(msg =>
          msg.id === assistantId
            ? {
                ...msg,
                content: finalResponse?.content || streamingContent,
                model: finalResponse?.model || 'Unknown',
                sources: finalResponse?.sources,
              }
            : msg
        )
      );

      // Step 2: Enhanced audit with conversation context
      setIsAuditing(true);
      const auditContent = finalResponse?.content || streamingContent;
      
      const report = await riskAuditorAgent.analyzeRisk(
        auditContent,
        conversationHistory, // Use the current history
        (metric: 'clarity' | 'bias' | 'toxicity' | 'hallucination' | 'intent_alignment') => {
          setAnalysisProgress(prev => ({ ...prev, [metric]: 'analyzing' }));
          setTimeout(() => {
            setAnalysisProgress(prev => ({ ...prev, [metric]: 'complete' }));
          }, 1000);
        }
      );
      setRiskAuditReport(report);

    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
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
            report={riskAuditReport}
            isLoading={isAuditing}
            analysisProgress={analysisProgress}
          />
        }
      />
    </ThemeProvider>
  );
}

export default App;
