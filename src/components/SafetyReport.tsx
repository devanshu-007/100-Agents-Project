import { 
  Paper, 
  Typography, 
  Alert, 
  Stack, 
  Chip, 
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Card,
  CardContent,
  Fade,
  Grow,
  CircularProgress as MUICircularProgress
} from '@mui/material';
import { 
  CheckCircle, 
  Error, 
  Refresh,
  Analytics,
  BalanceOutlined,
  HealthAndSafety,
  Psychology,
  TrackChanges,
  Warning,
  Info,
  ExpandMore,
  Security,
  Speed,
  TrendingUp,
  Shield,
  Visibility
} from '@mui/icons-material';
import type { RiskAuditReport, AuditItem } from '../agents/ComplianceAgent';

type AnalysisProgress = {
  clarity: 'pending' | 'analyzing' | 'complete';
  bias: 'pending' | 'analyzing' | 'complete';
  toxicity: 'pending' | 'analyzing' | 'complete';
  hallucination: 'pending' | 'analyzing' | 'complete';
  intent_alignment: 'pending' | 'analyzing' | 'complete';
};

interface SafetyReportProps {
  report: RiskAuditReport | null;
  isLoading: boolean;
  analysisProgress: AnalysisProgress;
}

export function SafetyReport({ report, isLoading, analysisProgress }: SafetyReportProps) {
  const renderMetricCard = (
    label: string, 
    value: number, 
    icon: React.ReactNode, 
    isIntentAlignment = false,
    delay = 0
  ) => {
    // Debug: Log the actual value being passed
    console.log(`${label} metric value:`, value);
    
    return (
      <Grow in timeout={800} style={{ transitionDelay: `${delay}ms` }}>
        <Card 
          sx={{ 
            background: 'rgba(26, 29, 33, 0.8)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${getScoreColor(value, isIntentAlignment)}40`,
            borderRadius: 4,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              border: `1px solid ${getScoreColor(value, isIntentAlignment)}60`,
              boxShadow: `0 8px 32px ${getScoreColor(value, isIntentAlignment)}20`,
            },
          }}
        >
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Box sx={{ 
              mb: 2, 
              p: 2,
              borderRadius: 3,
              background: `${getScoreColor(value, isIntentAlignment)}15`,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Box sx={{ color: getScoreColor(value, isIntentAlignment) }}>
                {icon}
              </Box>
            </Box>
            <Typography 
              variant="caption" 
              sx={{ 
                textTransform: 'uppercase', 
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                color: '#9ca3af',
              }}
            >
              {label}
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mt: 1,
                mb: 1,
                color: getScoreColor(value, isIntentAlignment),
                fontSize: '2rem',
              }}
            >
              {isNaN(value) ? '0' : (value * 100).toFixed(0)}%
            </Typography>
            <Chip
              size="small"
              label={getScoreLabel(value, isIntentAlignment)}
              sx={{
                background: `${getScoreColor(value, isIntentAlignment)}20`,
                color: getScoreColor(value, isIntentAlignment),
                border: `1px solid ${getScoreColor(value, isIntentAlignment)}40`,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </CardContent>
        </Card>
      </Grow>
    );
  };

  const getScoreColor = (score: number, isIntentAlignment = false) => {
    // Handle invalid scores
    if (isNaN(score) || score === undefined || score === null) {
      return '#6b7280'; // Gray for unknown/invalid scores
    }
    
    if (isIntentAlignment) {
      if (score > 0.7) return '#8b5cf6'; // Purple for good intent alignment
      if (score > 0.3) return '#f59e0b'; // Orange for moderate
      return '#ef4444'; // Red for poor
    }
    // For risk metrics (lower is better)
    if (score < 0.3) return '#8b5cf6'; // Purple for low risk
    if (score < 0.7) return '#f59e0b'; // Orange for moderate risk
    return '#ef4444'; // Red for high risk
  };

  const getScoreLabel = (score: number, isIntentAlignment = false) => {
    if (isNaN(score) || score === undefined || score === null) {
      return 'Unknown';
    }
    
    if (isIntentAlignment) {
      if (score > 0.7) return 'Excellent';
      if (score > 0.3) return 'Moderate';
      return 'Poor';
    }
    if (score < 0.3) return 'Secure';
    if (score < 0.7) return 'Moderate';
    return 'High Risk';
  };

  const renderProgressIndicator = (
    metric: keyof AnalysisProgress, 
    label: string, 
    defaultIcon: React.ReactElement,
    delay = 0
  ) => {
    const status = analysisProgress[metric];
    const color = status === 'complete' ? 'success' : status === 'analyzing' ? 'primary' : 'default';
    const chipIcon = status === 'complete' ? <CheckCircle /> : 
                    status === 'analyzing' ? <Refresh className="rotating" /> : defaultIcon;
    
    return (
      <Fade in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
        <Chip
          icon={chipIcon}
          label={`${label}: ${status === 'analyzing' ? 'Analyzing...' : status}`}
          color={color}
          variant={status === 'complete' ? 'filled' : 'outlined'}
          size="medium"
          sx={{
            fontWeight: 500,
            background: status === 'complete' 
              ? 'rgba(139, 92, 246, 0.15)' // Purple theme
              : status === 'analyzing'
              ? 'rgba(139, 92, 246, 0.1)'
              : 'rgba(75, 85, 99, 0.1)',
            color: status === 'complete' 
              ? '#8b5cf6'
              : status === 'analyzing'
              ? '#8b5cf6'
              : '#9ca3af',
            border: `1px solid ${status === 'complete' 
              ? 'rgba(139, 92, 246, 0.3)'
              : status === 'analyzing'
              ? 'rgba(139, 92, 246, 0.2)'
              : 'rgba(75, 85, 99, 0.3)'}`,
            '& .rotating': {
              animation: 'spin 1s linear infinite',
            },
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }}
        />
      </Fade>
    );
  };

  const renderAuditItem = (item: AuditItem, index: number) => {
    const getItemIcon = () => {
      switch (item.type) {
        case 'error': return <Error color="error" />;
        case 'warning': return <Warning color="warning" />;
        case 'info': return <Info color="info" />;
      }
    };

    const getItemColor = () => {
      switch (item.type) {
        case 'error': return 'error.main';
        case 'warning': return 'warning.main';
        case 'info': return 'info.main';
      }
    };

    return (
      <Fade in timeout={400} style={{ transitionDelay: `${index * 100}ms` }} key={item.id}>
        <ListItem
          sx={{
            borderRadius: 2,
            mb: 1,
            background: 'rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(102, 126, 234, 0.05)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <ListItemIcon>{getItemIcon()}</ListItemIcon>
          <ListItemText
            primary={item.message}
            secondary={`${item.type.toUpperCase()} • ${item.timestamp.toLocaleTimeString()}`}
            primaryTypographyProps={{ 
              color: getItemColor(),
              fontWeight: 500,
            }}
          />
        </ListItem>
      </Fade>
    );
  };

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
      {/* Header - Purple Theme */}
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)',
        borderBottom: '1px solid rgba(75, 85, 99, 0.2)',
      }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.1))',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <Shield sx={{ fontSize: 32, color: '#8b5cf6' }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: 'white', 
              mb: 0.5,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}>
              Risk Analysis
            </Typography>
            <Typography variant="body2" sx={{ 
              color: '#9ca3af', 
              fontSize: '0.9rem',
              fontWeight: 500,
            }}>
              Real-time safety monitoring
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Content Area */}
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
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            borderRadius: '6px',
            '&:hover': {
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
            }
          },
        }}
      >
        {/* Progress Indicators */}
        {isLoading && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
              Analyzing Response...
            </Typography>
            <Stack spacing={2}>
              {renderProgressIndicator('clarity', 'Clarity', <Visibility />, 0)}
              {renderProgressIndicator('bias', 'Bias Detection', <BalanceOutlined />, 200)}
              {renderProgressIndicator('toxicity', 'Toxicity Scan', <HealthAndSafety />, 400)}
              {renderProgressIndicator('hallucination', 'Hallucination Check', <Psychology />, 600)}
              {renderProgressIndicator('intent_alignment', 'Intent Alignment', <TrackChanges />, 800)}
            </Stack>
          </Box>
        )}

        {/* Results */}
        {report && (
          <Fade in timeout={800}>
            <Box>
              {/* Overall Status */}
              <Box sx={{ mb: 4 }}>
                <Alert 
                  severity={report.isCompliant ? 'success' : 'warning'}
                  sx={{ 
                    borderRadius: 3,
                    border: `1px solid ${report.isCompliant ? '#8b5cf6' : '#fbbf24'}40`,
                    background: `${report.isCompliant ? '#8b5cf6' : '#fbbf24'}10`,
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {report.isCompliant ? '✅ Analysis Complete - Low Risk' : '⚠️ Analysis Complete - Review Recommended'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                    {report.reasoning}
                  </Typography>
                </Alert>
              </Box>

              {/* Metrics Grid */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                  Safety Metrics
                </Typography>
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 2,
                }}>
                  {renderMetricCard('Clarity', report.metrics?.clarity || 0, <Visibility />, false, 0)}
                  {renderMetricCard('Bias', report.metrics?.bias || 0, <BalanceOutlined />, false, 100)}
                  {renderMetricCard('Toxicity', report.metrics?.toxicity || 0, <HealthAndSafety />, false, 200)}
                  {renderMetricCard('Hallucination', report.metrics?.hallucination || 0, <Psychology />, false, 300)}
                  {renderMetricCard('Intent', report.metrics?.intent_alignment || 0, <TrackChanges />, true, 400)}
                </Box>
              </Box>

              {/* Detailed Issues */}
              {report.items && report.items.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
                    Detailed Analysis
                  </Typography>
                  <Accordion
                    sx={{
                      background: 'rgba(26, 29, 33, 0.8)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px !important',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMore sx={{ color: '#8b5cf6' }} />}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Info sx={{ color: '#8b5cf6' }} />
                        <Typography variant="body1" fontWeight={600} sx={{ color: 'white' }}>
                          {report.items.length} Issue{report.items.length !== 1 ? 's' : ''} Found
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List sx={{ p: 0 }}>
                        {report.items.map((item, index) => (
                          <ListItem 
                            key={item.id}
                            sx={{
                              borderRadius: 2,
                              mb: 1,
                              background: 'rgba(0, 0, 0, 0.2)',
                              border: `1px solid ${getItemColor(item.type)}40`,
                            }}
                          >
                            <ListItemIcon>
                              {getItemIcon(item.type)}
                            </ListItemIcon>
                            <ListItemText
                              primary={item.message}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  color: '#e5e7eb',
                                  fontWeight: 500,
                                }
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}
            </Box>
          </Fade>
        )}

        {/* Empty State */}
        {!isLoading && !report && (
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08), rgba(124, 58, 237, 0.04))',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  maxWidth: '300px',
                  mx: 'auto',
                }}
              >
                <Security sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
                <Typography variant="h6" color="white" gutterBottom sx={{ fontWeight: 600 }}>
                  Ready for Analysis
                </Typography>
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  Send a message to see real-time risk assessment and safety metrics.
                </Typography>
              </Box>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );

  function getItemIcon(type: 'info' | 'warning' | 'error') {
    switch (type) {
      case 'error': return <Error sx={{ color: '#ef4444' }} />;
      case 'warning': return <Warning sx={{ color: '#fbbf24' }} />;
      case 'info': return <Info sx={{ color: '#8b5cf6' }} />;
    }
  }

  function getItemColor(type: 'info' | 'warning' | 'error') {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warning': return '#fbbf24';
      case 'info': return '#8b5cf6';
    }
  }
} 