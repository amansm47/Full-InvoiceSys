import React from 'react';
import { Box, Container, Grid, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Marketplace', path: '/marketplace' },
        { label: 'Portfolio', path: '/portfolio' },
        { label: 'Analytics', path: '/analytics' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'How it Works', path: '/how-it-works' },
        { label: 'Security', path: '/security' },
        { label: 'Compliance', path: '/compliance' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'API Documentation', path: '/docs' },
        { label: 'Status', path: '/status' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy' },
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Cookie Policy', path: '/cookies' },
        { label: 'Disclaimer', path: '/disclaimer' }
      ]
    }
  ];

  const stats = [
    { label: 'Total Funded', value: '₹47Cr+' },
    { label: 'Active Investors', value: '15,000+' },
    { label: 'Success Rate', value: '99.8%' },
    { label: 'Avg Returns', value: '15-18%' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: '#000000',
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `
            radial-gradient(circle at 30% 40%, #3b82f6 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, #22c55e 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, #06b6d4 0%, transparent 50%)
          `
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(2px 2px at 20px 30px, rgba(34,197,94,0.3), transparent),
            radial-gradient(1px 1px at 40px 70px, rgba(59,130,246,0.2), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(6,182,212,0.3), transparent),
            radial-gradient(2px 2px at 130px 80px, rgba(34,197,94,0.15), transparent),
            radial-gradient(1px 1px at 160px 30px, rgba(255,255,255,0.2), transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px',
          opacity: 0.2,
          zIndex: 1,
          animation: 'particleFlow 20s linear infinite'
        }
      }}
    >
      {/* Floating Elements */}
      {Array(15).fill().map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: `${Math.random() * 6 + 2}px`,
            height: `${Math.random() * 6 + 2}px`,
            background: ['#22c55e', '#3b82f6', '#06b6d4', '#ffffff'][Math.floor(Math.random() * 4)],
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float${i % 3 + 1} ${Math.random() * 10 + 15}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.3 + 0.1,
            zIndex: 0
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Stats Section */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color: '#22c55e',
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#9ca3af',
                      fontWeight: 500
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: '#374151', mb: 6 }} />

        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              ReturnX
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#9ca3af',
                mb: 3,
                lineHeight: 1.6,
                maxWidth: '300px'
              }}
            >
              India's leading blockchain-powered invoice financing platform. 
              Connecting businesses with investors for mutual growth.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #16a34a, #15803d)'
                  }
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: '#374151',
                  color: '#9ca3af',
                  '&:hover': {
                    borderColor: '#22c55e',
                    color: '#22c55e'
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </Grid>

          {/* Links Sections */}
          {footerSections.map((section, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  color: '#f3f4f6'
                }}
              >
                {section.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {section.links.map((link, linkIndex) => (
                  <Typography
                    key={linkIndex}
                    variant="body2"
                    sx={{
                      color: '#9ca3af',
                      cursor: 'pointer',
                      '&:hover': {
                        color: '#22c55e'
                      },
                      transition: 'color 0.2s ease'
                    }}
                    onClick={() => navigate(link.path)}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: '#374151', my: 4 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280'
            }}
          >
            © 2025 ReturnX. All rights reserved. | Regulated by RBI | Blockchain Secured
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                cursor: 'pointer',
                '&:hover': {
                  color: '#22c55e'
                }
              }}
            >
              Status: Online
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#22c55e',
                fontWeight: 500
              }}
            >
              v2.1.0
            </Typography>
          </Box>
        </Box>
      </Container>

      <style>
        {`
          @keyframes gradientShift {
            0%, 100% { 
              background: radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
                         radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.15) 0%, transparent 50%);
            }
            50% { 
              background: radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                         radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
                         radial-gradient(circle at 60% 40%, rgba(34, 197, 94, 0.15) 0%, transparent 50%);
            }
          }
          
          @keyframes particleFlow {
            0% { transform: translateX(0) translateY(0); }
            100% { transform: translateX(-200px) translateY(-100px); }
          }
          
          @keyframes float1 {
            0%, 100% { transform: translateY(0px) translateX(0px); }
            33% { transform: translateY(-20px) translateX(10px); }
            66% { transform: translateY(10px) translateX(-5px); }
          }
          
          @keyframes float2 {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
            50% { transform: translateY(-15px) translateX(15px) rotate(180deg); }
          }
          
          @keyframes float3 {
            0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
            25% { transform: translateY(-10px) translateX(-10px) scale(1.2); }
            75% { transform: translateY(5px) translateX(8px) scale(0.8); }
          }
        `}
      </style>
    </Box>
  );
}

export default Footer;