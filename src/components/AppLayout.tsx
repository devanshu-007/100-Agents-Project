import { Box, Container, AppBar, Toolbar, Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, AutoFixHigh } from '@mui/icons-material';
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
        height: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(79, 255, 176, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 40% 70%, rgba(0, 212, 255, 0.08) 0%, transparent 60%),
            radial-gradient(circle at 90% 80%, rgba(255, 107, 107, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(79, 255, 176, 0.05) 0%, transparent 40%)
          `,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2300d4ff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          pointerEvents: 'none',
        },
      }}
    >
      <AppBar 
        position="static" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(79, 255, 176, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 212, 255, 0.2), 0 0 20px rgba(79, 255, 176, 0.1)',
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <AutoFixHigh sx={{ mr: 3, fontSize: 32, color: 'white' }} />
          <Typography 
            variant="h4" 
            noWrap 
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: '1.75rem',
              color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              letterSpacing: '-0.01em',
            }}
          >
            AI Agent Console
          </Typography>
        </Toolbar>
      </AppBar>

      <Container 
        maxWidth="xl" 
        sx={{ 
          flexGrow: 1, 
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
          zIndex: 1,
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            gap: { xs: 3, md: 4 }, 
            height: '100%',
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          <Box 
            sx={{ 
              flex: { md: 2 }, 
              height: '100%',
              '& > *': {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                },
              }
            }}
          >
            {chatPanel}
          </Box>
          <Box 
            sx={{ 
              flex: { md: 1 }, 
              height: '100%',
              '& > *': {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
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