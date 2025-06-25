import { 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Stack, 
  CircularProgress, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Divider,
  Chip,
  Fade,
  Slide,
  Skeleton,
  LinearProgress
} from '@mui/material';
import { 
  ExpandMore, 
  Send, 
  SmartToy, 
  Person,
  Source,
  AutoAwesome,
  Bolt,
  Search,
  Analytics
} from '@mui/icons-material';
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

  const suggestionQueries = [
    "What are the latest AI safety developments?",
    "Explain quantum computing breakthroughs in 2024",
    "What are the risks of AGI development?",
    "How can businesses prepare for AI transformation?"
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        background: 'transparent',
        overflow: 'hidden'
      }}
    >
      {/* Header - Unseal Style */}
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.05) 0%, rgba(34, 197, 94, 0.02) 100%)',
        borderBottom: '1px solid rgba(75, 85, 99, 0.2)',
      }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.1))',
              border: '1px solid rgba(74, 222, 128, 0.3)',
            }}
          >
            <AutoAwesome sx={{ fontSize: 32, color: '#4ade80' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700, 
              color: 'white', 
              mb: 0.5,
              fontSize: { xs: '1.75rem', md: '2rem' }
            }}>
              AI Research Console
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#9ca3af', 
              fontSize: '1rem',
              fontWeight: 500,
            }}>
              Multi-model consensus • Real-time verification • Risk analysis
            </Typography>
          </Box>
        </Stack>
      </Box>
      
      {/* Messages Area */}
      <Box 
        sx={{ 
          flex: 1,
          minHeight: 0,
          overflowY: 'auto', 
          p: 3,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #4ade80, #22c55e)',
            borderRadius: '6px',
            '&:hover': {
              background: 'linear-gradient(135deg, #22c55e, #4ade80)',
            }
          },
        }}
      >
        {history.length === 0 && (
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.08), rgba(34, 197, 94, 0.04))',
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  maxWidth: '500px',
                  mx: 'auto',
                }}
              >
                <Bolt sx={{ fontSize: 48, color: '#4ade80', mb: 2 }} />
                <Typography 
                  variant="h5" 
                  color="white" 
                  gutterBottom
                  sx={{ mb: 2, fontWeight: 600 }}
                >
                  Ready to explore verified AI insights?
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ color: '#9ca3af', fontSize: '1rem' }}
                >
                  Try asking about technology, research, or any topic you need expert analysis on.
                </Typography>
              </Box>
              
              <Stack spacing={2} alignItems="center">
                {suggestionQueries.map((query, index) => (
                  <Chip
                    key={index}
                    label={query}
                    onClick={() => setUserInput(query)}
                    size="medium"
                    sx={{
                      maxWidth: '450px',
                      height: 'auto',
                      py: 1.5,
                      px: 2,
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        padding: '8px 16px',
                      },
                      background: 'rgba(26, 29, 33, 0.8)',
                      color: '#e5e7eb',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'rgba(74, 222, 128, 0.1)',
                        color: '#4ade80',
                        border: '1px solid rgba(74, 222, 128, 0.4)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(74, 222, 128, 0.2)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Fade>
        )}
        
        <Stack spacing={3}>
          {history.map((msg, index) => (
            <Slide 
              key={index} 
              direction={msg.role === 'user' ? 'left' : 'right'} 
              in 
              timeout={500}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  maxWidth: '85%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.1))'
                    : 'rgba(15, 17, 20, 0.95)',
                  color: msg.role === 'user' ? '#ffffff' : '#ffffff',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  border: msg.role === 'user' 
                    ? '1px solid rgba(74, 222, 128, 0.3)'
                    : '1px solid rgba(74, 222, 128, 0.4)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: msg.role === 'user' 
                    ? '0 4px 20px rgba(74, 222, 128, 0.2)'
                    : '0 6px 30px rgba(74, 222, 128, 0.25), 0 0 15px rgba(74, 222, 128, 0.1)',
                }}
              >
                {/* Message Header */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      background: msg.role === 'user' 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(74, 222, 128, 0.2)',
                    }}
                  >
                    {msg.role === 'user' ? (
                      <Person sx={{ fontSize: 20, color: '#ffffff' }} />
                    ) : (
                      <SmartToy sx={{ fontSize: 20, color: '#4ade80' }} />
                    )}
                  </Box>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: msg.role === 'user' ? '#ffffff' : '#4ade80'
                  }}>
                    {msg.role === 'user' ? 'You' : 'AI Research Assistant'}
                  </Typography>
                </Stack>

                {/* Message Content */}
                <Typography 
                  variant="body1" 
                  component="div"
                  sx={{ 
                    '& p': { margin: 0, fontSize: '1rem' },
                    lineHeight: 1.6,
                    fontSize: '1rem',
                    color: '#ffffff',
                  }}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </Typography>
                
                {/* Model Info */}
                {msg.model && msg.role === 'assistant' && (
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(75, 85, 99, 0.2)' }}>
                    <Chip
                      size="small"
                      label={
                        msg.model === 'system-error' ? '⚠️ Error' :
                        msg.model === 'Unknown' ? '🔮 AI Consensus' :
                        msg.model.includes('llama') ? '🦙 Llama' :
                        msg.model.includes('mixtral') ? '🌀 Mixtral' :
                        msg.model.includes('+') ? '🤖 Multi-Model' :
                        `🤖 ${msg.model}`
                      }
                      sx={{
                        background: msg.model === 'system-error' 
                          ? 'rgba(239, 68, 68, 0.15)' 
                          : 'rgba(74, 222, 128, 0.15)',
                        color: msg.model === 'system-error' ? '#ef4444' : '#4ade80',
                        border: '1px solid',
                        borderColor: msg.model === 'system-error' ? '#ef4444' : 'rgba(74, 222, 128, 0.3)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                      }}
                    />
                  </Box>
                )}
                
                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Accordion 
                      sx={{ 
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(75, 85, 99, 0.3)',
                        borderRadius: 3,
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMore sx={{ color: '#4ade80' }} />}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Source sx={{ fontSize: 18, color: '#4ade80' }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#ffffff' }}>
                            📚 {msg.sources.length} Research Sources
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={2}>
                          {msg.sources.map((source: any, i: number) => (
                            <Link 
                              key={i}
                              href={source.url} 
                              target="_blank" 
                              rel="noopener"
                              underline="hover"
                              sx={{
                                display: 'block',
                                p: 2,
                                borderRadius: 2,
                                background: 'rgba(74, 222, 128, 0.08)',
                                border: '1px solid rgba(74, 222, 128, 0.2)',
                                color: '#e5e7eb',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: 'rgba(74, 222, 128, 0.15)',
                                  borderColor: 'rgba(74, 222, 128, 0.4)',
                                  color: '#4ade80',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Typography variant="body2" fontWeight={500}>
                                {i + 1}. {source.title}
                              </Typography>
                            </Link>
                          ))}
                        </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}
              </Paper>
            </Slide>
          ))}
          
          {isProcessing && (
            <Fade in timeout={300}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  background: 'rgba(15, 17, 20, 0.95)',
                  border: '2px solid rgba(74, 222, 128, 0.4)',
                  borderRadius: '20px 20px 20px 4px',
                  maxWidth: '85%',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 40px rgba(74, 222, 128, 0.2), 0 0 20px rgba(74, 222, 128, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Animated Border */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, #4ade80, transparent)',
                    animation: 'shimmer 2s infinite',
                    '@keyframes shimmer': {
                      '0%': { transform: 'translateX(-100%)' },
                      '100%': { transform: 'translateX(100%)' },
                    },
                  }}
                />
                
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      background: 'rgba(74, 222, 128, 0.2)',
                    }}
                  >
                    <SmartToy sx={{ fontSize: 20, color: '#4ade80' }} />
                  </Box>
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: '#4ade80'
                  }}>
                    AI Research Assistant
                  </Typography>
                </Stack>

                {/* Processing Steps */}
                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <CircularProgress size={16} sx={{ color: '#4ade80' }} />
                      <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
                        🔍 Searching latest research...
                      </Typography>
                    </Stack>
                    <LinearProgress 
                      sx={{ 
                        borderRadius: 2,
                        height: 6,
                        backgroundColor: 'rgba(75, 85, 99, 0.3)',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(90deg, #4ade80, #22c55e)',
                          borderRadius: 2,
                        },
                      }} 
                    />
                  </Box>
                  
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      <Analytics sx={{ fontSize: 16, color: '#4ade80' }} />
                      <Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 500 }}>
                        🤖 Analyzing with 3 AI models...
                      </Typography>
                    </Stack>
                  </Box>
                  
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Search sx={{ fontSize: 16, color: '#6b7280' }} />
                      <Typography variant="body2" sx={{ color: '#9ca3af', fontWeight: 500 }}>
                        🛡️ Running safety checks...
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Fade>
        )}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'rgba(75, 85, 99, 0.2)' }} />
      
      {/* Input Area - Unseal Style */}
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.03) 0%, rgba(34, 197, 94, 0.01) 100%)',
        borderTop: '1px solid rgba(75, 85, 99, 0.2)',
      }}>
        <Stack direction="row" spacing={3} alignItems="flex-end">
          <TextField
            placeholder="Ask me anything about AI, research, technology..."
            fullWidth
            multiline
            maxRows={4}
            minRows={1}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isProcessing}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '1rem',
                minHeight: '56px',
                borderRadius: 3,
                '& textarea': {
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  resize: 'none',
                },
              },
          }}
        />
          <Button 
            onClick={handleSend} 
            disabled={isProcessing || !userInput.trim()}
            variant="contained"
            size="large"
            sx={{ 
              minWidth: '100px',
              height: '56px',
              borderRadius: 3,
              fontSize: '1rem',
              fontWeight: 700,
              textTransform: 'none',
              px: 3,
              boxShadow: '0 4px 20px rgba(74, 222, 128, 0.3)',
              '&:hover': {
                boxShadow: '0 8px 40px rgba(74, 222, 128, 0.4)',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                opacity: 0.6,
                transform: 'none',
              }
            }}
          >
            {isProcessing ? (
              <CircularProgress size={24} sx={{ color: '#000000' }} />
            ) : (
              <>
                <Send sx={{ fontSize: 20, mr: 1 }} />
                Send
              </>
            )}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}