import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Zoom,
  Avatar,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  TrendingUp,
  Security,
  Speed,
  AccountBalance,
  Upload,
  MonetizationOn,
  Payment,
  Verified,
  Shield,
  FlashOn,
  Assessment,
  Star,
  ArrowForward,
  PlayArrow,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { usePointerGlow } from '../hooks/usePointerGlow';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

// Import Google Fonts
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

// Custom Animated Loader Component
const AnimatedLoader = () => {
  return (
    <Box sx={{
      '& svg': {
        '& #particles': {
          animation: 'partciles 4s ease-in-out infinite'
        },
        '& #animatedStop': {
          animation: 'umbral 4s infinite'
        },
        '& #bounce': {
          animation: 'bounce 4s ease-in-out infinite',
          translate: '0px 36px'
        },
        '& #bounce2': {
          animation: 'bounce2 4s ease-in-out infinite',
          translate: '0px 46px',
          animationDelay: '0.5s'
        }
      },
      '@keyframes bounce': {
        '0%, 100%': { translate: '0px 36px' },
        '50%': { translate: '0px 46px' }
      },
      '@keyframes bounce2': {
        '0%, 100%': { translate: '0px 46px' },
        '50%': { translate: '0px 56px' }
      },
      '@keyframes umbral': {
        '0%': { stopColor: '#d3a5102e' },
        '50%': { stopColor: 'rgba(211, 165, 16, 0.519)' },
        '100%': { stopColor: '#d3a5102e' }
      },
      '@keyframes partciles': {
        '0%, 100%': { translate: '0px 16px' },
        '50%': { translate: '0px 6px' }
      }
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" height={200} width={200}>
        <g style={{order: -1}}>
          <polygon transform="rotate(45 100 100)" strokeWidth={1} stroke="#d3a410" fill="none" points="70,70 148,50 130,130 50,150" id="bounce" />
          <polygon transform="rotate(45 100 100)" strokeWidth={1} stroke="#d3a410" fill="none" points="70,70 148,50 130,130 50,150" id="bounce2" />
          <polygon transform="rotate(45 100 100)" strokeWidth={2} stroke fill="#414750" points="70,70 150,50 130,130 50,150" />
          <polygon strokeWidth={2} stroke fill="url(#gradiente)" points="100,70 150,100 100,130 50,100" />
          <defs>
            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente">
              <stop style={{stopColor: '#1e2026', stopOpacity: 1}} offset="20%" />
              <stop style={{stopColor: '#414750', stopOpacity: 1}} offset="60%" />
            </linearGradient>
          </defs>
          <polygon transform="translate(20, 31)" strokeWidth={2} stroke fill="#b7870f" points="80,50 80,75 80,99 40,75" />
          <polygon transform="translate(20, 31)" strokeWidth={2} stroke fill="url(#gradiente2)" points="40,-40 80,-40 80,99 40,75" />
          <defs>
            <linearGradient y2="100%" x2="0%" y1="-17%" x1="10%" id="gradiente2">
              <stop style={{stopColor: '#d3a51000', stopOpacity: 1}} offset="20%" />
              <stop style={{stopColor: '#d3a51054', stopOpacity: 1}} offset="100%" id="animatedStop" />
            </linearGradient>
          </defs>
          <polygon transform="rotate(180 100 100) translate(20, 20)" strokeWidth={2} stroke fill="#d3a410" points="80,50 80,75 80,99 40,75" />
          <polygon transform="rotate(0 100 100) translate(60, 20)" strokeWidth={2} stroke fill="url(#gradiente3)" points="40,-40 80,-40 80,85 40,110.2" />
          <defs>
            <linearGradient y2="100%" x2="10%" y1="0%" x1="0%" id="gradiente3">
              <stop style={{stopColor: '#d3a51000', stopOpacity: 1}} offset="20%" />
              <stop style={{stopColor: '#d3a51054', stopOpacity: 1}} offset="100%" id="animatedStop" />
            </linearGradient>
          </defs>
          <polygon transform="rotate(45 100 100) translate(80, 95)" strokeWidth={2} stroke fill="#ffe4a1" points="5,0 5,5 0,5 0,0" id="particles" />
          <polygon transform="rotate(45 100 100) translate(80, 55)" strokeWidth={2} stroke fill="#ccb069" points="6,0 6,6 0,6 0,0" id="particles" />
          <polygon transform="rotate(45 100 100) translate(70, 80)" strokeWidth={2} stroke fill="#fff" points="2,0 2,2 0,2 0,0" id="particles" />
          <polygon strokeWidth={2} stroke fill="#292d34" points="29.5,99.8 100,142 100,172 29.5,130" />
          <polygon transform="translate(50, 92)" strokeWidth={2} stroke fill="#1f2127" points="50,50 120.5,8 120.5,35 50,80" />
        </g>
      </svg>
    </Box>
  );
};

const EnhancedHomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLoader, setShowLoader] = useState(true);

  usePointerGlow();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  if (showLoader) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.3,
            zIndex: 1
          }}
        >
          <source src="/InShot_20251226_220728817.mp4" type="video/mp4" />
        </video>
        
        {/* Simple Elegant Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 10
          }}
        >
          {/* Logo with Pulse */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              marginBottom: '40px',
              position: 'relative'
            }}
          >
            <AnimatedLoader />
            
            {/* Logo Coming from Inside */}
            <motion.img
              src="/app_icon_512.png"
              alt="ReturnX Logo"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 0, 1.5, 1],
                opacity: [0, 0, 1, 1]
              }}
              transition={{
                duration: 2,
                times: [0, 0.5, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeOut"
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                filter: 'drop-shadow(0 0 50px rgba(34, 197, 94, 1)) drop-shadow(0 0 100px rgba(211, 164, 16, 0.8)) drop-shadow(0 0 150px rgba(255, 255, 255, 0.6))',
                zIndex: 10
              }}
            />
            
            {/* Profit Explosion */}
            {Array(100).fill().map((_, index) => {
              const profits = ['₹25L', '₹50L', '₹18%', '₹1Cr', '+847%', '₹75L', '₹12L', '+250%', '₹200L', '₹5Cr'];
              const angle = (index * 3.6) * Math.PI / 180;
              const distance = 300 + (index % 3) * 100;
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1.2, 0],
                    opacity: [0, 1, 0],
                    x: [0, distance * Math.cos(angle)],
                    y: [0, distance * Math.sin(angle)]
                  }}
                  transition={{
                    duration: 2,
                    delay: 1 + (index % 20) * 0.05,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeOut"
                  }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: index % 2 === 0 ? '#22c55e' : '#fbbf24',
                    textShadow: '0 0 15px rgba(34, 197, 94, 0.8)',
                    zIndex: 5,
                    pointerEvents: 'none'
                  }}
                >
                  {profits[index % profits.length]}
                </motion.div>
              );
            })}
          </motion.div>
          
          {/* Brand Name */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Typography variant="h3" sx={{
              fontFamily: '"Orbitron", monospace',
              fontWeight: 900,
              mb: 2
            }}>
              <span style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #ffa500 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Return</span>
              <span style={{
                background: 'linear-gradient(135deg, #ff0040 0%, #ff6080 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>X</span>
            </Typography>
            
            <Typography variant="h6" sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 400
            }}>
              Invoice Financing Platform
            </Typography>
          </motion.div>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#000000',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background Particles */}
      <Box
        sx={{
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
        }}
      />

      {/* Navigation */}
      <AppBar
        position="fixed"
        sx={{
          background: 'transparent',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: 'none'
        }}
      >
        <Toolbar sx={{ py: 0, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <img 
              src="/app_icon_512.png" 
              alt="ReturnX Logo" 
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'contain',
                marginRight: '16px',
                cursor: 'pointer'
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                letterSpacing: '4px',
                fontSize: '2.2rem',
                fontFamily: '"Orbitron", monospace',
                position: 'relative',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <span style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #ffa500 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.5))'
              }}>Return</span>
              <span style={{
                background: 'linear-gradient(135deg, #ff0040 0%, #ff4060 50%, #ff6080 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(255, 0, 64, 0.8))',
                textShadow: '0 0 30px rgba(255, 0, 64, 0.6)',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(255, 0, 64, 0.2), rgba(255, 96, 128, 0.2))',
                  borderRadius: '4px',
                  zIndex: -1
                }
              }}>X</span>
            </Typography>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, mr: 4 }}>
              {['Home', 'How it Works', 'Marketplace', 'Investors'].map((item) => (
                <Button
                  key={item}
                  sx={{
                    color: '#ffffff',
                    px: 2,
                    py: 1,
                    borderRadius: '15px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22c55e'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}

          {isMobile ? (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleMenuOpen}
                sx={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  '&:hover': {
                    background: 'rgba(34, 197, 94, 0.2)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => handleNavigation('/login')}>Login</MenuItem>
                <MenuItem onClick={() => handleNavigation('/register')}>Register</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => handleNavigation('/login')}
                sx={{
                  borderColor: 'rgba(59, 130, 246, 0.5)',
                  color: '#3b82f6',
                  px: 4,
                  py: 1.5,
                  borderRadius: '25px',
                  fontWeight: 600,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#22c55e',
                    color: '#22c55e',
                    transform: 'scale(1.05)',
                    boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => handleNavigation('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #22c55e)',
                  px: 4,
                  py: 1.5,
                  borderRadius: '25px',
                  fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 8px 30px rgba(34, 197, 94, 0.5)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 12, md: 16 },
          pb: { xs: 8, md: 12 },
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* Video Background for Hero Stats Area */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.15,
            zIndex: 0
          }}
        >
          <source src="/video_20251226_230008_edit.mp4" type="video/mp4" />
        </video>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={7} sx={{ position: 'relative', zIndex: 1 }}>
            <Fade in timeout={1000}>
              <Box>
                <Chip
                  label="🚀 Now Live - Invoice Financing Revolution"
                  sx={{
                    mb: 3,
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    fontSize: '0.9rem',
                    px: 2
                  }}
                />
                
                <Typography
                  variant={isMobile ? 'h2' : 'h1'}
                  sx={{
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '4.5rem' },
                    lineHeight: 1.1,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 50%, #06b6d4 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Finance Invoices
                  <br />
                  <span style={{ color: '#22c55e' }}>Earn Predictable Returns</span>
                </Typography>
                
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    opacity: 0.8,
                    fontWeight: 400,
                    maxWidth: '600px',
                    lineHeight: 1.6
                  }}
                >
                  Small businesses get instant liquidity. Investors earn secure returns through invoice financing.
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, mb: 6, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => handleNavigation('/register')}
                    sx={{
                      background: 'linear-gradient(45deg, #3b82f6, #22c55e)',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #22c55e, #06b6d4)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(34, 197, 94, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Start Investing
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<Upload />}
                    sx={{
                      borderColor: '#3b82f6',
                      color: '#3b82f6',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      '&:hover': {
                        borderColor: '#22c55e',
                        color: '#22c55e',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    List Invoice
                  </Button>
                </Box>

                {/* Live Stats */}
                <Grid container spacing={3}>
                  {[
                    { label: 'Total Funded', value: '₹2.4Cr+', icon: <MonetizationOn /> },
                    { label: 'Active Investors', value: '1,200+', icon: <TrendingUp /> },
                    { label: 'Avg Returns', value: '12-18%', icon: <Assessment /> }
                  ].map((stat, index) => (
                    <Grid item xs={4} key={index}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box sx={{ color: '#22c55e', mb: 1 }}>{stat.icon}</Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22c55e' }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Fade>
          </Grid>

          <Grid item xs={12} md={5}>
            {/* Empty space */}
          </Grid>
        </Grid>
      </Container>

      {/* How ReturnX Works - Zigzag Design */}
      <Box sx={{ py: 20, position: 'relative', overflow: 'hidden' }}>



        <Container maxWidth="xl">
          {/* Top Investors Scrolling Cards - 3 Layers */}
          <Box sx={{ mb: 12, overflow: 'hidden', position: 'relative' }}>
            <Typography variant="h4" sx={{ 
              textAlign: 'center', 
              mb: 8, 
              fontWeight: 800,
              background: 'linear-gradient(135deg, #22c55e 0%, #ffa500 50%, #06b6d4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Orbitron", monospace',
              letterSpacing: '2px',
              filter: 'drop-shadow(0 0 20px rgba(34, 197, 94, 0.4))',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #22c55e, #ffa500, transparent)',
                borderRadius: '2px'
              }
            }}>
              🏆 Top Investors This Month
            </Typography>
            
            {/* Layer 1: Right to Left */}
            <Box sx={{
              display: 'flex',
              gap: 3,
              animation: 'scrollRight 25s linear infinite',
              width: 'calc(100% * 3)'
            }}>
              {Array(12).fill([
                { name: 'Rajesh Sharma', fund: '₹25L', avatar: 'R', returns: '+18.5%' },
                { name: 'Priya Patel', fund: '₹18L', avatar: 'P', returns: '+22.1%' },
                { name: 'Amit Kumar', fund: '₹32L', avatar: 'A', returns: '+15.8%' },
                { name: 'Sneha Gupta', fund: '₹12L', avatar: 'S', returns: '+19.3%' }
              ]).flat().map((investor, index) => (
                <Card key={`layer1-${index}`} sx={{
                  minWidth: 280,
                  height: 120,
                  background: `
                    linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%),
                    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M0,40 Q25,20 50,25 T100,15" stroke="%2300f5ff" stroke-width="2" fill="none" opacity="0.3"/><path d="M0,45 Q25,25 50,30 T100,20" stroke="%2300f5ff" stroke-width="1" fill="none" opacity="0.2"/></svg>')
                  `,
                  backgroundSize: 'cover, 100% 100%',
                  border: '1px solid rgba(0, 245, 255, 0.3)',
                  borderRadius: '12px',
                  p: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'none'
                }}>
                  <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{
                      background: 'linear-gradient(135deg, #3b82f6, #00f5ff)',
                      width: 40,
                      height: 40,
                      fontWeight: 'bold',
                      border: '1px solid rgba(0, 245, 255, 0.5)',
                      fontSize: '1rem'
                    }}>
                      {investor.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 'bold', 
                        color: '#ffffff',
                        mb: 0.5,
                        fontSize: '0.9rem'
                      }}>
                        {investor.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ 
                          color: '#00f5ff',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}>
                          {investor.fund}
                        </Typography>
                        <Chip 
                          label={investor.returns}
                          size="small"
                          sx={{
                            background: 'rgba(0, 245, 255, 0.15)',
                            color: '#00f5ff',
                            border: '1px solid rgba(0, 245, 255, 0.4)',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            height: 20
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))
            }}
            </Box>

            {/* Layer 2: Left to Right */}
            <Box sx={{
              display: 'flex',
              gap: 3,
              animation: 'scrollLeft 20s linear infinite',
              width: 'calc(100% * 3)'
            }}>
              {Array(12).fill([
                { name: 'Vikram Singh', fund: '₹28L', avatar: 'V', returns: '+16.7%' },
                { name: 'Anita Roy', fund: '₹21L', avatar: 'A', returns: '+20.4%' },
                { name: 'Rohit Jain', fund: '₹35L', avatar: 'R', returns: '+17.2%' },
                { name: 'Kavya Nair', fund: '₹14L', avatar: 'K', returns: '+21.8%' }
              ]).flat().map((investor, index) => (
                <Card key={`layer2-${index}`} sx={{
                  minWidth: 280,
                  height: 120,
                  background: `
                    linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%),
                    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M0,40 Q25,20 50,25 T100,15" stroke="%2300ff88" stroke-width="2" fill="none" opacity="0.3"/><path d="M0,45 Q25,25 50,30 T100,20" stroke="%2300ff88" stroke-width="1" fill="none" opacity="0.2"/></svg>')
                  `,
                  backgroundSize: 'cover, 100% 100%',
                  border: '1px solid rgba(0, 255, 136, 0.3)',
                  borderRadius: '12px',
                  p: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'none'
                }}>
                  <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{
                      background: 'linear-gradient(135deg, #22c55e, #00ff88)',
                      width: 40,
                      height: 40,
                      fontWeight: 'bold',
                      border: '1px solid rgba(0, 255, 136, 0.5)',
                      fontSize: '1rem'
                    }}>
                      {investor.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 'bold', 
                        color: '#ffffff',
                        mb: 0.5,
                        fontSize: '0.9rem'
                      }}>
                        {investor.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ 
                          color: '#00ff88',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}>
                          {investor.fund}
                        </Typography>
                        <Chip 
                          label={investor.returns}
                          size="small"
                          sx={{
                            background: 'rgba(0, 255, 136, 0.15)',
                            color: '#00ff88',
                            border: '1px solid rgba(0, 255, 136, 0.4)',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            height: 20
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))
            }}
            </Box>

            {/* Layer 3: Right to Left */}
            <Box sx={{
              display: 'flex',
              gap: 3,
              animation: 'scrollRight 30s linear infinite',
              width: 'calc(100% * 3)'
            }}>
              {Array(12).fill([
                { name: 'Deepak Shah', fund: '₹42L', avatar: 'D', returns: '+24.2%' },
                { name: 'Meera Iyer', fund: '₹19L', avatar: 'M', returns: '+18.9%' },
                { name: 'Suresh Reddy', fund: '₹31L', avatar: 'S', returns: '+16.4%' },
                { name: 'Pooja Mehta', fund: '₹26L', avatar: 'P', returns: '+19.7%' }
              ]).flat().map((investor, index) => (
                <Card key={`layer3-${index}`} sx={{
                  minWidth: 280,
                  height: 120,
                  background: `
                    linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%),
                    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 50"><path d="M0,40 Q25,20 50,25 T100,15" stroke="%23ff0080" stroke-width="2" fill="none" opacity="0.3"/><path d="M0,45 Q25,25 50,30 T100,20" stroke="%23ff0080" stroke-width="1" fill="none" opacity="0.2"/></svg>')
                  `,
                  backgroundSize: 'cover, 100% 100%',
                  border: '1px solid rgba(255, 0, 128, 0.3)',
                  borderRadius: '12px',
                  p: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: 'none'
                }}>
                  <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{
                      background: 'linear-gradient(135deg, #ec4899, #ff0080)',
                      width: 40,
                      height: 40,
                      fontWeight: 'bold',
                      border: '1px solid rgba(255, 0, 128, 0.5)',
                      fontSize: '1rem'
                    }}>
                      {investor.avatar}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: 'bold', 
                        color: '#ffffff',
                        mb: 0.5,
                        fontSize: '0.9rem'
                      }}>
                        {investor.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ 
                          color: '#ff0080',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}>
                          {investor.fund}
                        </Typography>
                        <Chip 
                          label={investor.returns}
                          size="small"
                          sx={{
                            background: 'rgba(255, 0, 128, 0.15)',
                            color: '#ff0080',
                            border: '1px solid rgba(255, 0, 128, 0.4)',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            height: 20
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Card>
              ))
            }}
            </Box>
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 12, position: 'relative', zIndex: 10 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 4,
                fontSize: { xs: '2.5rem', md: '4.5rem' },
                background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 30%, #06b6d4 60%, #8b5cf6 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
                textShadow: '0 0 30px rgba(34, 197, 94, 0.3)'
              }}
            >
              How ReturnX
              <br />
              <span style={{ fontSize: '0.8em', opacity: 1 }}>Transforms Finance</span>
            </Typography>
          </Box>

          {/* Process Flow */}
          <Box sx={{ position: 'relative', maxWidth: '1400px', mx: 'auto' }}>
            {/* Enhanced Blockchain Connection Network */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              display: { xs: 'none', md: 'block' }
            }}>
              {/* Main Blockchain Chain */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '8%',
                right: '8%',
                height: '4px',
                background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 33%, #06b6d4 66%, #8b5cf6 100%)',
                borderRadius: '4px',
                boxShadow: '0 0 30px rgba(59, 130, 246, 0.6), 0 0 60px rgba(34, 197, 94, 0.4)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '-3px',
                  left: 0,
                  width: '20px',
                  height: '10px',
                  background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent)',
                  borderRadius: '10px',
                  animation: 'blockchainFlow 4s ease-in-out infinite'
                }
              }} />
              
              {/* Blockchain Nodes */}
              {[0, 1, 2, 3].map((index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: `${12 + index * 25.33}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: ['#3b82f6', '#22c55e', '#06b6d4', '#8b5cf6'][index],
                    boxShadow: `0 0 30px ${['#3b82f6', '#22c55e', '#06b6d4', '#8b5cf6'][index]}, 0 0 60px ${['#3b82f6', '#22c55e', '#06b6d4', '#8b5cf6'][index]}40`,
                    animation: `blockPulse${index + 1} 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.7}s`,
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: '-6px',
                      borderRadius: '50%',
                      background: `conic-gradient(from 0deg, ${['#3b82f6', '#22c55e', '#06b6d4', '#8b5cf6'][index]}, transparent, ${['#3b82f6', '#22c55e', '#06b6d4', '#8b5cf6'][index]})`,
                      animation: 'blockRotate 4s linear infinite',
                      zIndex: -1
                    },
                    '&::after': {
                      content: `"${index + 1}"`,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }
                  }}
                />
              ))}
              
              {/* Vertical Blockchain Connectors */}
              {[0, 1, 2, 3].map((index) => (
                <Box
                  key={`vertical-${index}`}
                  sx={{
                    position: 'absolute',
                    top: index % 2 === 0 ? '15%' : '85%',
                    left: `${12 + index * 25.33}%`,
                    transform: 'translateX(-50%)',
                    width: '3px',
                    height: '35%',
                    background: `linear-gradient(${index % 2 === 0 ? '180deg' : '0deg'}, ${['#3b82f6', '#22c55e', '#06b6d4', '#8b5cf6'][index]}, transparent)`,
                    borderRadius: '3px',
                    animation: `chainFlow${index + 1} 3s ease-in-out infinite`,
                    animationDelay: `${index * 0.5}s`,
                    boxShadow: `0 0 15px ${['#3b82f6', '#22c55e', '#06b6d4', '#8b5cf6'][index]}80`
                  }}
                />
              ))}
              
              {/* Data Packets */}
              {[0, 1, 2].map((index) => (
                <Box
                  key={`packet-${index}`}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: `${20 + index * 25.33}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '2px',
                    background: '#ffffff',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
                    animation: `dataPacket${index + 1} 5s ease-in-out infinite`,
                    animationDelay: `${index * 1.5}s`
                  }}
                />
              ))}
            </Box>

            <Grid container spacing={0} sx={{ position: 'relative', zIndex: 10 }}>
              {[
                {
                  step: '01',
                  icon: <Upload sx={{ fontSize: 32 }} />,
                  title: 'Smart Upload',
                  subtitle: 'AI-Powered OCR',
                  description: 'Upload invoices with instant OCR extraction and fraud detection',
                  features: ['OCR Extraction', 'Fraud Detection', 'Risk Scoring'],
                  color: '#3b82f6',
                  position: 'top'
                },
                {
                  step: '02',
                  icon: <TrendingUp sx={{ fontSize: 32 }} />,
                  title: 'Live Marketplace',
                  subtitle: 'Competitive Bidding',
                  description: 'Investors compete in real-time for the best investment opportunities',
                  features: ['Live Bidding', 'Best Rates', '24hr Funding'],
                  color: '#22c55e',
                  position: 'bottom'
                },
                {
                  step: '03',
                  icon: <MonetizationOn sx={{ fontSize: 32 }} />,
                  title: 'Auto Settlement',
                  subtitle: 'Smart Contracts',
                  description: 'Blockchain automatically distributes profits when buyers pay',
                  features: ['Smart Contracts', 'Auto Distribution', 'Instant Payouts'],
                  color: '#06b6d4',
                  position: 'top'
                },
                {
                  step: '04',
                  icon: <Assessment sx={{ fontSize: 32 }} />,
                  title: 'Analytics Hub',
                  subtitle: 'Performance Insights',
                  description: 'Real-time dashboard with portfolio tracking and market analytics',
                  features: ['Live Dashboard', 'ROI Tracking', 'Market Data'],
                  color: '#8b5cf6',
                  position: 'bottom'
                }
              ].map((step, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    px: 2
                  }}>
                    {/* Step Number Circle */}
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${step.color}, ${step.color}80)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: step.position === 'top' ? 4 : 0,
                      mt: step.position === 'bottom' ? 4 : 0,
                      position: 'relative',
                      zIndex: 2,
                      boxShadow: `0 10px 30px ${step.color}40`,
                      border: '3px solid rgba(255, 255, 255, 0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: '-3px',
                        borderRadius: '50%',
                        background: `conic-gradient(from 0deg, ${step.color}, transparent, ${step.color})`,
                        zIndex: -1,
                        animation: 'rotate 3s linear infinite'
                      }
                    }}>
                      <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.2rem' }}>
                        {step.step}
                      </Typography>
                    </Box>

                    {/* Card */}
                    <Card sx={{
                      width: '100%',
                      maxWidth: 280,
                      background: 'rgba(15, 23, 42, 0.95)',
                      backdropFilter: 'blur(30px)',
                      border: `1px solid ${step.color}30`,
                      borderRadius: '24px',
                      p: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: step.position === 'bottom' ? 'translateY(60px)' : 'translateY(-60px)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `radial-gradient(600px circle at var(--x) var(--y), ${step.color}10, transparent 40%)`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: 0
                      },
                      '&:hover': {
                        transform: step.position === 'bottom' ? 'translateY(50px) scale(1.05)' : 'translateY(-70px) scale(1.05)',
                        border: `1px solid ${step.color}`,
                        boxShadow: `0 25px 50px ${step.color}30`,
                        '&::before': {
                          opacity: 1
                        }
                      }
                    }}>
                      <Box sx={{ position: 'relative', zIndex: 1 }}>
                        {/* Icon */}
                        <Box sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '16px',
                          background: `linear-gradient(135deg, ${step.color}, ${step.color}80)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                          color: 'white',
                          mx: 'auto'
                        }}>
                          {step.icon}
                        </Box>

                        <Typography variant="h6" sx={{
                          fontWeight: 800,
                          color: '#ffffff',
                          textAlign: 'center',
                          mb: 1
                        }}>
                          {step.title}
                        </Typography>

                        <Typography variant="caption" sx={{
                          color: step.color,
                          fontWeight: 600,
                          display: 'block',
                          textAlign: 'center',
                          mb: 2
                        }}>
                          {step.subtitle}
                        </Typography>

                        <Typography variant="body2" sx={{
                          color: '#ffffff',
                          opacity: 0.8,
                          textAlign: 'center',
                          lineHeight: 1.5,
                          mb: 3,
                          fontSize: '0.85rem'
                        }}>
                          {step.description}
                        </Typography>

                        {/* Features */}
                        <Box sx={{ textAlign: 'center' }}>
                          {step.features.map((feature, idx) => (
                            <Chip
                              key={idx}
                              label={feature}
                              size="small"
                              sx={{
                                background: `${step.color}15`,
                                color: step.color,
                                border: `1px solid ${step.color}30`,
                                fontSize: '0.7rem',
                                height: 24,
                                m: 0.3
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Bottom CTA */}
          <Box sx={{ textAlign: 'center', mt: 16, position: 'relative', zIndex: 20 }}>
            <Typography variant="h4" sx={{
              mb: 4,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #3b82f6, #22c55e)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              position: 'relative',
              zIndex: 21
            }}>
              Ready to Experience the Future?
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => handleNavigation('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6, #22c55e)',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  fontWeight: 700,
                  boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 15px 40px rgba(34, 197, 94, 0.4)'
                  }
                }}
              >
                Start Your Journey
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.1rem',
                  borderRadius: '50px',
                  fontWeight: 700,
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: '#22c55e',
                    color: '#22c55e',
                    transform: 'translateY(-3px)'
                  }
                }}
              >
                Watch Demo
              </Button>
            </Box>
          </Box>
        </Container>

        <style>
          {`
            @keyframes glow {
              0% { opacity: 0.5; transform: translateX(-50%) scaleX(0.8); }
              100% { opacity: 1; transform: translateX(-50%) scaleX(1.2); }
            }
            
            @keyframes scrollRight {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.33%); }
            }
            
            @keyframes scrollLeft {
              0% { transform: translateX(-33.33%); }
              100% { transform: translateX(0); }
            }
            
            @keyframes profitPulse {
              0%, 100% { transform: scale(1); opacity: 0.9; }
              50% { transform: scale(1.05); opacity: 1; }
            }
            
            @keyframes neonGlow {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.8; }
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.7; transform: scale(1.2); }
            }
            
            @keyframes blockchainFlow {
              0% { transform: translateX(0); opacity: 1; }
              100% { transform: translateX(1200px); opacity: 0; }
            }
            
            @keyframes blockRotate {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            
            @keyframes blockPulse1 {
              0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 30px #3b82f6, 0 0 60px #3b82f640; }
              50% { transform: translate(-50%, -50%) scale(1.4); box-shadow: 0 0 50px #3b82f6, 0 0 100px #3b82f680; }
            }
            
            @keyframes blockPulse2 {
              0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 30px #22c55e, 0 0 60px #22c55e40; }
              50% { transform: translate(-50%, -50%) scale(1.4); box-shadow: 0 0 50px #22c55e, 0 0 100px #22c55e80; }
            }
            
            @keyframes blockPulse3 {
              0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 30px #06b6d4, 0 0 60px #06b6d440; }
              50% { transform: translate(-50%, -50%) scale(1.4); box-shadow: 0 0 50px #06b6d4, 0 0 100px #06b6d480; }
            }
            
            @keyframes blockPulse4 {
              0%, 100% { transform: translate(-50%, -50%) scale(1); box-shadow: 0 0 30px #8b5cf6, 0 0 60px #8b5cf640; }
              50% { transform: translate(-50%, -50%) scale(1.4); box-shadow: 0 0 50px #8b5cf6, 0 0 100px #8b5cf680; }
            }
            
            @keyframes chainFlow1 {
              0% { opacity: 0; transform: translateX(-50%) scaleY(0); }
              50% { opacity: 1; transform: translateX(-50%) scaleY(1); }
              100% { opacity: 0; transform: translateX(-50%) scaleY(0); }
            }
            
            @keyframes chainFlow2 {
              0% { opacity: 0; transform: translateX(-50%) scaleY(0); }
              50% { opacity: 1; transform: translateX(-50%) scaleY(1); }
              100% { opacity: 0; transform: translateX(-50%) scaleY(0); }
            }
            
            @keyframes chainFlow3 {
              0% { opacity: 0; transform: translateX(-50%) scaleY(0); }
              50% { opacity: 1; transform: translateX(-50%) scaleY(1); }
              100% { opacity: 0; transform: translateX(-50%) scaleY(0); }
            }
            
            @keyframes chainFlow4 {
              0% { opacity: 0; transform: translateX(-50%) scaleY(0); }
              50% { opacity: 1; transform: translateX(-50%) scaleY(1); }
              100% { opacity: 0; transform: translateX(-50%) scaleY(0); }
            }
            
            @keyframes dataPacket1 {
              0% { transform: translate(-50%, -50%) translateX(0); opacity: 1; }
              100% { transform: translate(-50%, -50%) translateX(300px); opacity: 0; }
            }
            
            @keyframes dataPacket2 {
              0% { transform: translate(-50%, -50%) translateX(0); opacity: 1; }
              100% { transform: translate(-50%, -50%) translateX(300px); opacity: 0; }
            }
            
            @keyframes dataPacket3 {
              0% { transform: translate(-50%, -50%) translateX(0); opacity: 1; }
              100% { transform: translate(-50%, -50%) translateX(300px); opacity: 0; }
            }
          `}
        </style>
      </Box>

      {/* Live Investment Stats */}
      <Container maxWidth="xl" sx={{ py: 12, position: 'relative', background: '#000000' }}>
        <Box
          sx={{
            p: 6,
            position: 'relative',
            zIndex: 1
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                mb: 2,
                background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #06b6d4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              📈 Live Platform Performance
            </Typography>
            <Typography variant="h6" sx={{ color: '#22c55e', fontWeight: 600 }}>
              Real-time investor growth & profit metrics
            </Typography>
          </Box>
          
          <Grid container spacing={6} justifyContent="center" sx={{ position: 'relative' }}>
            {/* Hexagonal Layer */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '300px',
              height: '100%',
              background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500"><defs><pattern id="hex" width="40" height="35" patternUnits="userSpaceOnUse"><polygon points="20,5 35,15 35,30 20,40 5,30 5,15" fill="none" stroke="%2322c55e" stroke-width="0.6" opacity="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(%23hex)"/></svg>')`,
              opacity: 0.4,
              zIndex: 0
            }} />
            {/* Hexagonal Blockchain Network */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `
                  url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><defs><pattern id="hexGrid" width="60" height="52" patternUnits="userSpaceOnUse"><polygon points="30,8 50,18 50,38 30,48 10,38 10,18" fill="none" stroke="%2322c55e" stroke-width="0.8" opacity="0.2"/></pattern><filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100%" height="100%" fill="url(%23hexGrid)"/><g filter="url(%23glow)"><circle cx="150" cy="100" r="4" fill="%2322c55e"><animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/></circle><circle cx="350" cy="150" r="4" fill="%233b82f6"><animate attributeName="r" values="3;6;3" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/></circle><circle cx="550" cy="120" r="4" fill="%2306b6d4"><animate attributeName="r" values="3;6;3" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite"/></circle><circle cx="650" cy="200" r="4" fill="%238b5cf6"><animate attributeName="r" values="3;6;3" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.5;1;0.5" dur="2.2s" repeatCount="indefinite"/></circle><line x1="150" y1="100" x2="350" y2="150" stroke="%2322c55e" stroke-width="2" opacity="0.4"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="3s" repeatCount="indefinite"/><animate attributeName="stroke-dasharray" values="0,400;200,200;400,0" dur="4s" repeatCount="indefinite"/></line><line x1="350" y1="150" x2="550" y2="120" stroke="%233b82f6" stroke-width="2" opacity="0.4"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="3.5s" repeatCount="indefinite"/><animate attributeName="stroke-dasharray" values="0,400;200,200;400,0" dur="4.5s" repeatCount="indefinite"/></line><line x1="550" y1="120" x2="650" y2="200" stroke="%2306b6d4" stroke-width="2" opacity="0.4"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite"/><animate attributeName="stroke-dasharray" values="0,400;200,200;400,0" dur="5s" repeatCount="indefinite"/></line><circle cx="250" cy="250" r="3" fill="%2322c55e" opacity="0.6"><animate attributeName="cy" values="250;80;250" dur="6s" repeatCount="indefinite"/></circle><circle cx="450" cy="80" r="3" fill="%233b82f6" opacity="0.6"><animate attributeName="cx" values="450;150;450" dur="7s" repeatCount="indefinite"/></circle></g></svg>')
                `,
                backgroundSize: 'cover',
                opacity: 0.8
              }
            }} />
            {[
              { 
                label: 'Total Profit Generated', 
                value: '₹47,56,78,900', 
                change: '+847%', 
                icon: '💎',
                trend: 'up',
                description: 'Massive profit explosion'
              },
              { 
                label: 'Millionaire Investors', 
                value: '15,247', 
                change: '+2,847%', 
                icon: '👑',
                trend: 'up',
                description: 'Wealth creators this year'
              },
              { 
                label: 'Daily Profit Volume', 
                value: '₹12.5Cr', 
                change: '+1,250%', 
                icon: '🔥',
                trend: 'up',
                description: 'Record-breaking daily earnings'
              },
              { 
                label: 'Success Rate', 
                value: '99.8%', 
                change: '+12.8%', 
                icon: '⚡',
                trend: 'up',
                description: 'Guaranteed profit delivery'
              }
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box
                  sx={{
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 2
                  }}
                >
                  <Box sx={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '24px',
                    p: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: '2px',
                      borderRadius: '22px',
                      border: '1px dashed rgba(34, 197, 94, 0.4)',
                      animation: 'borderGlow 3s ease-in-out infinite'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      boxShadow: '0 0 10px #22c55e',
                      animation: 'statusBlink 2s ease-in-out infinite'
                    }
                  }}>
                    <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>
                      {stat.icon}
                    </Typography>
                    
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 900,
                        color: '#22c55e',
                        mb: 1,
                        fontSize: '2.2rem'
                      }}
                    >
                      {stat.value}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      color: '#ffffff', 
                      fontWeight: 600,
                      mb: 2,
                      opacity: 0.9
                    }}>
                      {stat.label}
                    </Typography>
                    
                    <Chip
                      label={stat.change}
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1))',
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.4)',
                        fontWeight: 'bold',
                        '&::before': {
                          content: '"↗"',
                          marginRight: '4px'
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          {/* Investor Growth Highlight */}
          <Box sx={{ 
            mt: 6, 
            p: 4, 
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ 
              color: '#22c55e', 
              fontWeight: 700, 
              mb: 2 
            }}>
               Investor Growth Milestone
            </Typography>
            <Typography variant="h6" sx={{ 
              color: '#ffffff', 
              mb: 1 
            }}>
              Over <span style={{ color: '#22c55e', fontWeight: 'bold' }}>15,000+</span> investors became millionaires this year!
            </Typography>
            <Typography variant="body1" sx={{ 
              color: '#ffffff', 
              opacity: 0.8 
            }}>
              Join India's most profitable investment platform - Average ROI: 847%
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Why ReturnX Section */}
      <Container maxWidth="xl" sx={{ py: 16, background: '#000000' }}>
        <Box sx={{ textAlign: 'center', mb: 12 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 4,
              fontSize: { xs: '2.5rem', md: '4rem' },
              background: 'linear-gradient(135deg, #22c55e 0%, #ffa500 50%, #06b6d4 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Orbitron", monospace',
              letterSpacing: '3px',
              filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.4))'
            }}
          >
            Why Choose ReturnX?
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: '600px', mx: 'auto' }}>
            Experience the future of invoice financing with cutting-edge technology
          </Typography>
        </Box>

        <Grid container spacing={8} justifyContent="center">
          {[
            {
              icon: <Shield sx={{ fontSize: 60 }} />,
              title: 'Secure Blockchain Escrow',
              description: 'Smart contracts ensure transparent and secure transactions with military-grade encryption',
              color: '#22c55e',
              gradient: 'linear-gradient(135deg, #22c55e, #16a34a)'
            },
            {
              icon: <FlashOn sx={{ fontSize: 60 }} />,
              title: 'Instant Funding',
              description: 'Get liquidity within 24 hours of invoice verification through our AI-powered system',
              color: '#3b82f6',
              gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
            },
            {
              icon: <Verified sx={{ fontSize: 60 }} />,
              title: 'AI-Powered OCR Verification',
              description: 'Advanced OCR technology with 99.8% accuracy and real-time fraud detection',
              color: '#06b6d4',
              gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
            },
            {
              icon: <Assessment sx={{ fontSize: 60 }} />,
              title: 'Smart Auto-Settlement',
              description: 'Automated profit distribution with real-time analytics and performance tracking',
              color: '#8b5cf6',
              gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
            }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Box
                sx={{
                  textAlign: 'center',
                  position: 'relative',
                  transform: index % 2 === 0 ? 'translateY(-40px)' : 'translateY(40px)',
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    transform: index % 2 === 0 ? 'translateY(-50px)' : 'translateY(50px)'
                  }
                }}
              >
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: feature.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  mx: 'auto',
                  boxShadow: `0 10px 30px ${feature.color}40`,
                  color: 'white'
                }}>
                  {feature.icon}
                </Box>

                <Typography variant="h5" sx={{
                  fontWeight: 800,
                  color: feature.color,
                  mb: 2,
                  fontFamily: '"Orbitron", monospace'
                }}>
                  {feature.title}
                </Typography>

                <Typography variant="body1" sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: 1.6,
                  maxWidth: '280px',
                  mx: 'auto'
                }}>
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Trusted & Compliant Platform */}
      <Container maxWidth="xl" sx={{ py: 12, background: '#000000' }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 3,
              background: 'linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2.5rem'
            }}
          >
             Trusted & Compliant Platform
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: '500px', mx: 'auto' }}>
            Enterprise-grade security with regulatory excellence
          </Typography>
        </Box>

        <Box sx={{ overflow: 'hidden', position: 'relative' }}>
          <Box sx={{
            display: 'flex',
            gap: 3,
            animation: 'scrollLeftToRight 20s linear infinite',
            width: 'calc(100% * 3)'
          }}>
            {Array(3).fill([
              {
                icon: <Verified sx={{ fontSize: 24 }} />,
                title: 'RBI Compliant',
                subtitle: 'Financing',
                description: 'Fully regulated NBFC with automated compliance monitoring',
                color: '#22c55e',
                gradient: 'linear-gradient(135deg, #22c55e, #16a34a)'
              },
              {
                icon: <Security sx={{ fontSize: 24 }} />,
                title: 'KYC Verified',
                subtitle: 'Identity System',
                description: 'Biometric authentication with government API integration',
                color: '#3b82f6',
                gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)'
              },
              {
                icon: <Shield sx={{ fontSize: 24 }} />,
                title: 'Triple Verification',
                subtitle: 'GST + PAN + Bank',
                description: 'Real-time validation through secure government networks',
                color: '#8b5cf6',
                gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
              },
              {
                icon: <Assessment sx={{ fontSize: 24 }} />,
                title: 'Real-time Monitoring',
                subtitle: '24/7 Security',
                description: 'Continuous monitoring with AI-powered threat detection',
                color: '#f59e0b',
                gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
              },
              {
                icon: <CheckCircle sx={{ fontSize: 24 }} />,
                title: 'Audit Ready',
                subtitle: 'Compliance Reports',
                description: 'Automated audit trails and regulatory reporting systems',
                color: '#06b6d4',
                gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)'
              },
              {
                icon: <FlashOn sx={{ fontSize: 24 }} />,
                title: 'Instant Verification',
                subtitle: 'Fast Processing',
                description: 'Lightning-fast document verification and approval process',
                color: '#ec4899',
                gradient: 'linear-gradient(135deg, #ec4899, #db2777)'
              }
            ]).flat().map((feature, index) => (
              <Card key={index} sx={{
                minWidth: 280,
                height: 200,
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                p: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: feature.gradient
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, height: '100%' }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    background: feature.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    flexShrink: 0
                  }}>
                    {feature.icon}
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 700,
                      color: feature.color,
                      mb: 0.5,
                      fontSize: '1.1rem'
                    }}>
                      {feature.title}
                    </Typography>
                    
                    <Typography variant="caption" sx={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      mb: 1.5,
                      display: 'block',
                      fontWeight: 500
                    }}>
                      {feature.subtitle}
                    </Typography>
                    
                    <Typography variant="body2" sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.4,
                      fontSize: '0.85rem'
                    }}>
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      <style>
        {`
          @keyframes scrollLeftToRight {
            0% { transform: translateX(-66.66%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>

      {/* Testimonials */}
      <Container maxWidth="xl" sx={{ py: 12 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 900,
            mb: 8,
            background: 'linear-gradient(135deg, #3b82f6 0%, #22c55e 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: '3rem',
            fontFamily: '"Exo 2", sans-serif',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
        >
          What Our Users Say
        </Typography>

        <Box sx={{ overflow: 'hidden', position: 'relative' }}>
          <Box sx={{
            display: 'flex',
            gap: 3,
            animation: 'scrollTestimonials 25s linear infinite',
            width: 'calc(100% * 3)'
          }}>
            {Array(3).fill([
              {
                name: 'Rajesh Kumar',
                role: 'Textile Business Owner',
                company: 'Kumar Fabrics Ltd',
                text: 'Got ₹25L instantly! No more 90-day payment delays. ReturnX saved my business during peak season.',
                rating: 5,
                avatar: 'R',
                amount: '₹25L funded',
                time: '2 hours ago'
              },
              {
                name: 'Priya Sharma',
                role: 'Angel Investor',
                company: 'Mumbai',
                text: '15.8% returns monthly! Best investment decision ever. Transparent, secure, profitable.',
                rating: 5,
                avatar: 'P',
                amount: '₹18L invested',
                time: '1 day ago'
              },
              {
                name: 'Amit Patel',
                role: 'Manufacturing Owner',
                company: 'Patel Industries',
                text: 'Expanded operations with quick financing. OCR tech approved my invoices in minutes!',
                rating: 5,
                avatar: 'A',
                amount: '₹42L funded',
                time: '3 hours ago'
              },
              {
                name: 'Sneha Gupta',
                role: 'Tech Investor',
                company: 'Bangalore',
                text: 'Blockchain transparency is amazing! Auto-settlements work perfectly. Earning while sleeping.',
                rating: 5,
                avatar: 'S',
                amount: '₹35L invested',
                time: '5 hours ago'
              },
              {
                name: 'Vikram Singh',
                role: 'Export Business',
                company: 'Singh Exports',
                text: 'Solved working capital crisis overnight. Now focusing on growth instead of cash flow.',
                rating: 5,
                avatar: 'V',
                amount: '₹67L funded',
                time: '12 hours ago'
              },
              {
                name: 'Meera Iyer',
                role: 'Portfolio Manager',
                company: 'Chennai',
                text: 'Diversified with invoice financing. Lower risk, higher returns than traditional investments.',
                rating: 5,
                avatar: 'M',
                amount: '₹28L invested',
                time: '6 hours ago'
              }
            ]).flat().map((testimonial, index) => (
              <Card key={index} sx={{
                minWidth: 360,
                height: 220,
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '20px',
                p: 4,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #22c55e, #3b82f6)'
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Avatar sx={{ 
                      background: 'linear-gradient(45deg, #22c55e, #3b82f6)',
                      width: 48,
                      height: 48,
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                    }}>
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 'bold',
                        color: '#ffffff',
                        fontSize: '1.1rem',
                        lineHeight: 1.2,
                        mb: 0.5
                      }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: '#22c55e',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        mb: 0.3
                      }}>
                        {testimonial.role}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.8rem'
                      }}>
                        {testimonial.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#fbbf24', fontSize: 18 }} />
                      ))}
                    </Box>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '0.75rem'
                    }}>
                      {testimonial.time}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ 
                  mb: 3, 
                  color: 'rgba(255, 255, 255, 0.95)',
                  lineHeight: 1.5,
                  fontSize: '0.95rem',
                  fontStyle: 'italic'
                }}>
                  "{testimonial.text}"
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  pt: 2,
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)'
                }}>
                  <Typography variant="body2" sx={{ 
                    color: '#22c55e',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {testimonial.amount}
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: '#3b82f6',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    px: 2,
                    py: 0.5,
                    borderRadius: '12px'
                  }}>
                    Verified User
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>

      <style>
        {`
          @keyframes scrollTestimonials {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}
      </style>

      <Footer />

      <style>
        {`
          @keyframes statusBlink {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
          
          @keyframes borderGlow {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 1; }
          }
          
          @keyframes blockchainData {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(600px); opacity: 0; }
          }
          
          @keyframes nodePulse1 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.8); }
          }
          
          @keyframes nodePulse2 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.8); }
          }
          
          @keyframes nodePulse3 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.8); }
          }
          
          @keyframes nodePulse4 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.8); }
          }
          
          @keyframes dataFlow {
            0% { transform: translateX(0); opacity: 1; }
            100% { transform: translateX(800px); opacity: 0; }
          }
          
          @keyframes pulse1 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.5); }
          }
          
          @keyframes pulse2 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.5); }
          }
          
          @keyframes pulse3 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.5); }
          }
          
          @keyframes pulse4 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.5); }
          }
          
          @keyframes blockchainPulse1 {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
          
          @keyframes blockchainPulse2 {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
          
          @keyframes blockchainPulse3 {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
          
          @keyframes blockchainPulse4 {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
      </style>
    </Box>
  );
};

export default EnhancedHomePage;
