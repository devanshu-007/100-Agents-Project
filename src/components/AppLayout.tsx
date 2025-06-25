import { Box, Container, AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme, Chip, Stack } from '@mui/material';
import { Menu as MenuIcon, AutoFixHigh, Verified, Security, Speed } from '@mui/icons-material';
import { useState } from 'react';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  chatPanel: ReactNode;
  reportPanel: ReactNode;
}

export function AppLayout({ chatPanel, reportPanel }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0b0d 0%, #111827 50%, #0a0b0d 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(74, 222, 128, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 40% 70%, rgba(74, 222, 128, 0.06) 0%, transparent 60%),
            radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234ade80" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      {/* Header - Unseal Style */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'rgba(10, 11, 13, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(75, 85, 99, 0.2)',
          boxShadow: '0 1px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <AutoFixHigh sx={{ fontSize: 28, color: '#4ade80' }} />
              <Typography 
                variant="h5" 
                noWrap 
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: '1.5rem',
                  color: 'white',
                  letterSpacing: '-0.01em',
                }}
              >
                AI Agent Console
              </Typography>
            </Stack>

            {/* Beta Badge like Unseal */}
            <Chip
              icon={<Verified sx={{ fontSize: 16 }} />}
              label="Live Beta • Advanced AI Research"
              size="small"
              sx={{
                background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15), rgba(34, 197, 94, 0.1))',
                color: '#4ade80',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: '#4ade80',
                },
              }}
            />
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section - Unseal Style */}
      <Box
        sx={{
          textAlign: 'center',
          py: { xs: 4, md: 6 },
          px: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
              fontWeight: 700,
              color: 'white',
              mb: 3,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            AI Research for{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              the future
            </Box>
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.125rem', md: '1.25rem' },
              color: '#9ca3af',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Multi-model consensus with real-time web search. 
            We analyze bias, toxicity, and accuracy until you trust it.
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '1rem',
              color: '#6b7280',
              mb: 6,
              fontWeight: 500,
            }}
          >
            No hallucinations. No bias. Just verified intelligence.
          </Typography>

          {/* Feature Pills - Unseal Style */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 6 }}
          >
            <Chip
              icon={<Security sx={{ fontSize: 18 }} />}
              label="Multi-model consensus"
              sx={{
                background: 'rgba(74, 222, 128, 0.1)',
                color: '#4ade80',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                fontWeight: 500,
                px: 1,
                '& .MuiChip-icon': { color: '#4ade80' },
              }}
            />
            <Chip
              icon={<Verified sx={{ fontSize: 18 }} />}
              label="Real-time fact checking"
              sx={{
                background: 'rgba(74, 222, 128, 0.1)',
                color: '#4ade80',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                fontWeight: 500,
                px: 1,
                '& .MuiChip-icon': { color: '#4ade80' },
              }}
            />
            <Chip
              icon={<Speed sx={{ fontSize: 18 }} />}
              label="Risk-proof analysis"
              sx={{
                background: 'rgba(74, 222, 128, 0.1)',
                color: '#4ade80',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                fontWeight: 500,
                px: 1,
                '& .MuiChip-icon': { color: '#4ade80' },
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* Main Content - Cards Layout like Unseal */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          flexGrow: 1, 
          pb: 4,
          px: { xs: 2, sm: 3, md: 4 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            gap: { xs: 3, md: 4 }, 
            height: { xs: 'auto', md: '600px' },
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Chat Panel */}
          <Box 
            sx={{ 
              flex: { md: 2 }, 
              height: { xs: '500px', md: '100%' },
              '& > *': {
                background: 'rgba(26, 29, 33, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(75, 85, 99, 0.2)',
                borderRadius: 4,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                '&:hover': {
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  boxShadow: '0 8px 40px rgba(74, 222, 128, 0.1), 0 0 20px rgba(74, 222, 128, 0.05)',
                },
              }
            }}
          >
            {chatPanel}
          </Box>
          
          {/* Risk Report Panel */}
          <Box 
            sx={{ 
              flex: { md: 1 }, 
              height: { xs: '400px', md: '100%' },
              '& > *': {
                background: 'rgba(26, 29, 33, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(75, 85, 99, 0.2)',
                borderRadius: 4,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                overflow: 'hidden',
                '&:hover': {
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                  boxShadow: '0 8px 40px rgba(74, 222, 128, 0.1), 0 0 20px rgba(74, 222, 128, 0.05)',
                },
              }
            }}
          >
            {reportPanel}
          </Box>
        </Box>
      </Container>
    </Box>
  );
} 