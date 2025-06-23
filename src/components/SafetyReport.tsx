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
  TrendingUp
} from '@mui/icons-material';
import type { ComplianceReport, AuditItem } from '../agents/ComplianceAgent';

type AnalysisProgress = {
  clarity: 'pending' | 'analyzing' | 'complete';
  bias: 'pending' | 'analyzing' | 'complete';
  toxicity: 'pending' | 'analyzing' | 'complete';
  hallucination: 'pending' | 'analyzing' | 'complete';
  intent_alignment: 'pending' | 'analyzing' | 'complete';
};

interface SafetyReportProps {
  report: ComplianceReport | null;
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
  ) => (
    <Grow in timeout={800} style={{ transitionDelay: `${delay}ms` }}>
      <Card 
        sx={{ 
          minWidth: 120,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
          },
        }}
      >
        <CardContent sx={{ textAlign: 'center', py: 2 }}>
          <Box sx={{ mb: 1.5, color: getScoreColor(value, isIntentAlignment) }}>
            {icon}
          </Box>
          <Typography 
            variant="caption" 
            color="text.secondary" 
            sx={{ 
              textTransform: 'uppercase', 
              fontWeight: 700,
              fontSize: '0.7rem',
              letterSpacing: '0.5px'
            }}
          >
            {label}
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              mt: 0.5,
              background: `linear-gradient(45deg, ${getScoreColor(value, isIntentAlignment)}, ${getScoreColor(value, isIntentAlignment)}88)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {(value * 100).toFixed(0)}%
          </Typography>
          <Chip
            size="small"
            label={getScoreLabel(value, isIntentAlignment)}
            sx={{
              mt: 1,
              background: `${getScoreColor(value, isIntentAlignment)}20`,
              color: getScoreColor(value, isIntentAlignment),
              border: `1px solid ${getScoreColor(value, isIntentAlignment)}40`,
              fontWeight: 600,
              fontSize: '0.7rem',
            }}
          />
        </CardContent>
      </Card>
    </Grow>
  );

  const getScoreColor = (score: number, isIntentAlignment = false) => {
    if (isIntentAlignment) {
      if (score > 0.7) return '#10b981';
      if (score > 0.3) return '#f59e0b';
      return '#ef4444';
    }
    if (score < 0.3) return '#10b981';
    if (score < 0.7) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score: number, isIntentAlignment = false) => {
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
        p: 0, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'transparent',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 4, 
        background: 'linear-gradient(135deg, rgba(255, 71, 87, 0.06) 0%, rgba(0, 255, 136, 0.06) 100%)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
      }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Security sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5 }}>
              Security & Compliance Audit
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.125rem' }}>
              Real-time AI safety & bias detection
            </Typography>
          </Box>
        </Stack>
      </Box>
      
      <Box sx={{ flex: 1, p: 4, overflowY: 'auto' }}>
        {isLoading && (
          <Box>
            <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 4 }}>
              <MUICircularProgress size={32} />
              <Typography variant="h5" color="primary.main" fontWeight={600}>
                Performing comprehensive security audit...
              </Typography>
            </Stack>
            
            <Stack spacing={3} sx={{ mb: 4 }}>
              {renderProgressIndicator('clarity', 'Clarity', <Analytics />, 0)}
              {renderProgressIndicator('bias', 'Bias Detection', <BalanceOutlined />, 200)}
              {renderProgressIndicator('toxicity', 'Toxicity Scan', <HealthAndSafety />, 400)}
              {renderProgressIndicator('hallucination', 'Hallucination Check', <Psychology />, 600)}
              {renderProgressIndicator('intent_alignment', 'Intent Alignment', <TrackChanges />, 800)}
            </Stack>
            
            <LinearProgress 
              sx={{ 
                borderRadius: 2,
                height: 8,
                background: 'rgba(102, 126, 234, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  borderRadius: 2,
                },
              }} 
            />
          </Box>
        )}
        
        {!isLoading && !report && (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Speed sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Ready for Security Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Send a message to begin comprehensive AI safety auditing
              </Typography>
            </Box>
          </Fade>
        )}

        {report && (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Summary Alert */}
            <Fade in timeout={600}>
              <Alert 
                severity={report.isCompliant ? 'success' : 'error'}
                icon={report.isCompliant ? <CheckCircle /> : <Error />}
                sx={{ 
                  mb: 3,
                  borderRadius: 3,
                  background: report.isCompliant 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                  border: `1px solid ${report.isCompliant ? '#10b981' : '#ef4444'}30`,
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  {report.isCompliant ? '✅ Security Audit Passed' : '⚠️ Security Issues Detected'}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Typography variant="body2">Risk Assessment:</Typography>
                  <Typography 
                    component="span" 
                    sx={{ 
                      fontSize: '1.5em',
                      filter: 'grayscale(0%)',
                    }}
                  >
                    {report.summary}
                  </Typography>
                </Stack>
              </Alert>
            </Fade>

            {/* Risk Metrics Grid */}
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <TrendingUp sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={700}>
                  Risk Analysis Dashboard
                </Typography>
              </Stack>
              
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: 2,
                }}
              >
                {renderMetricCard('Clarity', report.metrics.clarity, <Analytics sx={{ fontSize: 28 }} />, false, 0)}
                {renderMetricCard('Bias Risk', report.metrics.bias, <BalanceOutlined sx={{ fontSize: 28 }} />, false, 100)}
                {renderMetricCard('Toxicity', report.metrics.toxicity, <HealthAndSafety sx={{ fontSize: 28 }} />, false, 200)}
                {renderMetricCard('Hallucination', report.metrics.hallucination, <Psychology sx={{ fontSize: 28 }} />, false, 300)}
                {renderMetricCard('Intent Match', report.metrics.intent_alignment, <TrackChanges sx={{ fontSize: 28 }} />, true, 400)}
              </Box>
            </Box>

            <Divider sx={{ my: 2, opacity: 0.3 }} />

            {/* Detailed Findings */}
            {report.items && report.items.length > 0 ? (
              <Fade in timeout={800}>
                <Accordion 
                  sx={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 3,
                    '&:before': { display: 'none' },
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMore />}
                    sx={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Warning sx={{ color: 'warning.main' }} />
                      <Typography variant="h6" fontWeight={600}>
                        Detailed Security Findings ({report.items.length} items)
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ maxHeight: 300, overflow: 'auto', p: 2 }}>
                    <List dense>
                      {report.items.map((item, index) => renderAuditItem(item, index))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </Fade>
            ) : (
              <Fade in timeout={600}>
                <Card 
                  sx={{ 
                    textAlign: 'center', 
                    py: 4,
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: 3,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="success.main" fontWeight={600}>
                    No Security Issues Detected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    The response passed all security checks
                  </Typography>
                </Card>
              </Fade>
            )}

            {/* Analysis Summary */}
            {report.explanation && (
              <Fade in timeout={1000}>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ color: 'primary.main' }}>
                    🔍 AI Analysis Summary
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      background: 'rgba(102, 126, 234, 0.05)',
                      border: '1px solid rgba(102, 126, 234, 0.2)',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {report.explanation}
                    </Typography>
                  </Paper>
                </Box>
              </Fade>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
} 