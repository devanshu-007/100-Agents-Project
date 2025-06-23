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
  Slide
} from '@mui/material';
import { 
  ExpandMore, 
  Send, 
  SmartToy, 
  Person,
  Source,
  AutoAwesome
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
    "Explain quantum computing in simple terms",
    "What are the risks of AGI development?",
    "How does machine learning bias occur?"
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 0,
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        background: 'transparent',
        overflow: 'hidden'
      }}
    >
      {/* Header with gradient */}
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(79, 255, 176, 0.04) 100%)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
      }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <AutoAwesome sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
              AI Research Assistant
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
              Powered by multi-model consensus & real-time web search
            </Typography>
          </Box>
        </Stack>
      </Box>
      
      {/* Messages Area */}
      <Box 
        sx={{ 
          flex: 1,
          minHeight: 0, // This prevents the initial scrollbar
          overflowY: 'auto', 
          p: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(135deg, #00d4ff, #4fffb0)',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #4fffb0, #00d4ff)',
              boxShadow: '0 0 15px rgba(0, 212, 255, 0.5)',
            }
          },
        }}
      >
        {history.length === 0 && (
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography 
                variant="h5" 
                color="text.primary" 
                gutterBottom
                sx={{ mb: 4, fontWeight: 600 }}
              >
                🚀 Ready to explore? Try asking:
              </Typography>
              <Stack spacing={3} alignItems="center">
                {suggestionQueries.map((query, index) => (
                  <Chip
                    key={index}
                    label={query}
                    onClick={() => setUserInput(query)}
                    size="medium"
                    sx={{
                      maxWidth: '500px',
                      height: 'auto',
                      py: 2,
                      px: 3,
                      fontSize: '1rem',
                      fontWeight: 500,
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        padding: '8px 16px',
                      },
                      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(79, 255, 176, 0.05))',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(79, 255, 176, 0.1))',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 24px rgba(0, 212, 255, 0.4), 0 0 20px rgba(79, 255, 176, 0.2)',
                        border: '1px solid rgba(0, 212, 255, 0.5)',
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Fade>
        )}
        
        <Stack spacing={2}>
          {history.map((msg, index) => (
            <Slide 
              key={index} 
              direction={msg.role === 'user' ? 'left' : 'right'} 
              in 
              timeout={500}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Paper 
                variant="outlined"
                sx={{ 
                  p: 4,
                  maxWidth: '85%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, #00d4ff 0%, #4fffb0 100%)'
                    : 'rgba(26, 26, 26, 0.9)',
                  color: msg.role === 'user' ? '#000000' : '#ffffff',
                  borderRadius: msg.role === 'user' ? '24px 24px 8px 24px' : '24px 24px 24px 8px',
                  border: msg.role === 'user' 
                    ? '1px solid rgba(0, 212, 255, 0.3)'
                    : '1px solid rgba(0, 212, 255, 0.2)',
                  position: 'relative',
                  boxShadow: msg.role === 'user' 
                    ? '0 8px 32px rgba(0, 212, 255, 0.4), 0 0 20px rgba(79, 255, 176, 0.2)'
                    : '0 4px 20px rgba(0, 212, 255, 0.1), 0 0 10px rgba(0, 212, 255, 0.05)',
                  '&::before': msg.role === 'assistant' ? {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.03) 0%, rgba(79, 255, 176, 0.02) 100%)',
                    borderRadius: 'inherit',
                    pointerEvents: 'none',
                  } : {},
                }}
              >
                {/* Message Header */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  {msg.role === 'user' ? (
                    <Person sx={{ fontSize: 24, opacity: 0.9 }} />
                  ) : (
                    <SmartToy sx={{ fontSize: 24, color: 'primary.main' }} />
                  )}
                  <Typography variant="subtitle2" sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    opacity: msg.role === 'user' ? 0.95 : 1,
                    color: msg.role === 'user' ? 'inherit' : 'primary.main'
                  }}>
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                  </Typography>
                </Stack>

                {/* Message Content */}
                <Typography 
                  variant="body1" 
                  component="div"
                  sx={{ 
                    '& p': { margin: 0, fontSize: '1.1rem' },
                    lineHeight: 1.7,
                    fontSize: '1.1rem',
                  }}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </Typography>
                
                {/* Model Info */}
                {msg.model && msg.role === 'assistant' && (
                  <Box sx={{ mt: 2, pt: 1, borderTop: '1px solid rgba(0, 212, 255, 0.2)' }}>
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
                          ? 'rgba(255, 71, 87, 0.1)' 
                          : 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(79, 255, 176, 0.05))',
                        color: msg.model === 'system-error' ? '#ff4757' : '#00d4ff',
                        border: '1px solid',
                        borderColor: msg.model === 'system-error' ? '#ff4757' : 'rgba(0, 212, 255, 0.3)',
                        fontWeight: 600,
                        '& .MuiChip-label': {
                          fontSize: '0.8rem',
                        }
                      }}
                    />
                  </Box>
                )}
                
                {/* Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Accordion 
                      sx={{ 
                        background: 'rgba(26, 26, 26, 0.9)',
                        border: '1px solid rgba(0, 212, 255, 0.2)',
                        borderRadius: 2,
                        '&:before': { display: 'none' },
                        color: '#ffffff',
                      }}
                    >
                      <AccordionSummary 
                        expandIcon={<ExpandMore sx={{ color: '#00d4ff' }} />}
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            color: '#ffffff',
                          }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Source sx={{ fontSize: 18, color: '#00d4ff' }} />
                          <Typography variant="body2" fontWeight={600} sx={{ color: '#ffffff' }}>
                            📚 {msg.sources.length} Research Sources
                          </Typography>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails sx={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                        <Stack spacing={1}>
                          {msg.sources.map((source: any, i: number) => (
                            <Link 
                              key={i}
                              href={source.url} 
                              target="_blank" 
                              rel="noopener"
                              underline="hover"
                              sx={{
                                display: 'block',
                                p: 1.5,
                                borderRadius: 1,
                                background: 'rgba(0, 212, 255, 0.1)',
                                border: '1px solid rgba(0, 212, 255, 0.2)',
                                color: '#ffffff',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: 'rgba(0, 212, 255, 0.2)',
                                  transform: 'translateX(4px)',
                                  borderColor: 'rgba(0, 212, 255, 0.4)',
                                  boxShadow: '0 2px 10px rgba(0, 212, 255, 0.2)',
                                },
                              }}
                            >
                              <Typography variant="body2" fontWeight={500} sx={{ color: '#ffffff' }}>
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
            <Fade in>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 3, 
                  background: 'rgba(26, 26, 26, 0.9)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '20px 20px 20px 5px',
                  maxWidth: '85%',
                  boxShadow: '0 4px 20px rgba(0, 212, 255, 0.2), 0 0 15px rgba(79, 255, 176, 0.1)',
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <CircularProgress size={20} sx={{ color: '#00d4ff' }} />
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600 }}>
                    🔍 Searching web & analyzing responses...
                  </Typography>
                </Stack>
              </Paper>
            </Fade>
          )}
        </Stack>
      </Box>

      <Divider sx={{ opacity: 0.3 }} />
      
      {/* Input Area */}
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(79, 255, 176, 0.02) 100%)',
        borderTop: '1px solid rgba(0, 212, 255, 0.2)',
      }}>
        <Stack direction="row" spacing={3} alignItems="end">
          <TextField
            placeholder="Ask me anything about AI, research, technology..."
            fullWidth
            multiline
            maxRows={4}
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
                  fontSize: '1.1rem',
                  minHeight: '60px',
                  '& fieldset': {
                    borderColor: 'rgba(0, 212, 255, 0.4)',
                  },
                  '& input, & textarea': {
                    fontSize: '1.1rem',
                    padding: '18px 24px',
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
              minWidth: '120px',
              height: '60px',
              borderRadius: '16px',
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'none',
              alignSelf: 'flex-end',
              background: 'linear-gradient(135deg, #00d4ff 0%, #4fffb0 100%)',
              color: '#000000',
              border: '1px solid rgba(0, 212, 255, 0.3)',
              boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4), 0 0 20px rgba(79, 255, 176, 0.2)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4fffb0 0%, #00d4ff 100%)',
                transform: 'translateY(-2px) scale(1.02)',
                boxShadow: '0 8px 40px rgba(0, 212, 255, 0.6), 0 0 30px rgba(79, 255, 176, 0.4)',
                border: '1px solid rgba(79, 255, 176, 0.5)',
              },
              '&:disabled': {
                opacity: 0.6,
                transform: 'none',
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(79, 255, 176, 0.3) 100%)',
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