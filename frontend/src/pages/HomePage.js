import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, Grid, Card, CardContent, 
  AppBar, Toolbar, Avatar, Chip, LinearProgress, Paper, IconButton,
  useTheme, useMediaQuery, Stack, Fade, Grow
} from '@mui/material';
import { 
  TrendingUp, Security, Speed, AccountBalance, Menu, Close,
  PlayArrow, GitHub, LinkedIn, Twitter, Phone, Email, LocationOn
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalInvoices: 0,
    totalFunded: 0,
    activeInvestors: 0,
    avgROI: 0
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Simulate live stats
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        totalInvoices: prev.totalInvoices + Math.floor(Math.random() * 3),
        totalFunded: prev.totalFunded + Math.floor(Math.random() * 50000),
        activeInvestors: prev.activeInvestors + Math.floor(Math.random() * 2),
        avgROI: 12.5 + Math.random() * 2
      }));
    }, 3000);

    // Hero carousel
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(slideInterval);
    };
  }, []);

  const heroSlides = [
    {
      title: "Transform Your Business Cash Flow",
      subtitle: "Get instant funding for your invoices with blockchain security",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "Invest in Real Business Growth", 
      subtitle: "Earn consistent returns by funding verified invoices",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Secure. Fast. Transparent.",
      subtitle: "Blockchain-powered invoice financing for the modern economy",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #2d3748 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Responsive Navigation */}
      <AppBar position="fixed" sx={{ 
        background: 'rgba(0, 0, 0, 0.9)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(74, 222, 128, 0.2)'
      }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ 
              mr: 2, 
              background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
              width: { xs: 32, md: 40 },
              height: { xs: 32, md: 40 }
            }}>
              <Typography variant={isMobile ? 'body2' : 'h6'} sx={{ fontWeight: 'bold' }}>
                RX
              </Typography>
            </Avatar>
            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold', letterSpacing: 1 }}>
              ReturnX
            </Typography>
            <Chip 
              label="LIVE" 
              size="small" 
              sx={{ 
                ml: 2, 
                background: '#ef4444', 
                color: 'white',
                display: { xs: 'none', sm: 'flex' }
              }} 
            />
          </Box>
          
          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, mr: 3 }}>
            {['Features', 'How It Works', 'Stats', 'Contact'].map((item) => (
              <Button 
                key={item}
                color="inherit" 
                sx={{ 
                  '&:hover': { 
                    background: 'rgba(74, 222, 128, 0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {item}
              </Button>
            ))}
          </Box>
          
          {/* Desktop Auth Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/login')}
              sx={{ 
                borderColor: '#4ade80',
                color: '#4ade80',
                '&:hover': { 
                  background: 'rgba(74, 222, 128, 0.1)'
                }
              }}
            >
              Login
            </Button>
            <Button 
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{ 
                background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #22c55e 0%, #eab308 100%)'
                }
              }}
            >
              Get Started
            </Button>
          </Box>
          
          {/* Mobile Menu Button */}
          <IconButton 
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'white' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <Close /> : <Menu />}
          </IconButton>
        </Toolbar>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <Box sx={{ 
            display: { xs: 'block', md: 'none' },
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(20px)',
            p: 2
          }}>
            <Stack spacing={2}>
              {['Features', 'How It Works', 'Stats', 'Contact'].map((item) => (
                <Button 
                  key={item}
                  color="inherit" 
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  {item}
                </Button>
              ))}
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => navigate('/login')}
                sx={{ 
                  borderColor: '#4ade80',
                  color: '#4ade80',
                  mt: 2
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained"
                fullWidth
                onClick={() => navigate('/register')}
                sx={{ 
                  background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)'
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Box>
        )}
      </AppBar>

      {/* Responsive Hero Section */}
      <Box sx={{ 
        minHeight: { xs: '70vh', md: '85vh' },
        display: 'flex', 
        alignItems: 'center',
        position: 'relative',
        pt: { xs: 8, md: 10 },
        pb: { xs: 2, md: 4 }
      }}>
        {heroSlides.map((slide, index) => (
          <Box key={index} sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: slide.gradient,
            opacity: currentSlide === index ? 0.1 : 0,
            transition: 'opacity 1s ease-in-out'
          }} />
        ))}
        
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography 
                    variant={isMobile ? 'h3' : 'h2'}
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: { xs: 1.5, md: 2 },
                      background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.1
                    }}
                  >
                    {heroSlides[currentSlide].title}
                  </Typography>
                  <Typography 
                    variant={isMobile ? 'h6' : 'h5'} 
                    sx={{ 
                      mb: { xs: 2, md: 3 }, 
                      opacity: 0.9,
                      lineHeight: 1.3
                    }}
                  >
                    {heroSlides[currentSlide].subtitle}
                  </Typography>
                  
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={2} 
                    sx={{ mb: { xs: 2, md: 3 } }}
                    alignItems="center"
                  >
                    <Button 
                      variant="contained" 
                      size={isMobile ? 'medium' : 'large'}
                      startIcon={<PlayArrow />}
                      onClick={() => navigate('/register')}
                      sx={{ 
                        background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
                        px: { xs: 3, md: 4 },
                        py: { xs: 1, md: 1.5 },
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        minWidth: { xs: 200, sm: 'auto' },
                        '&:hover': { 
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(74, 222, 128, 0.4)'
                        }
                      }}
                    >
                      Start Investing
                    </Button>
                    <Button 
                      variant="outlined" 
                      size={isMobile ? 'medium' : 'large'}
                      sx={{ 
                        borderColor: 'white',
                        color: 'white',
                        px: { xs: 3, md: 4 },
                        minWidth: { xs: 200, sm: 'auto' },
                        '&:hover': { 
                          background: 'rgba(255, 255, 255, 0.1)'
                        }
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>
                  
                  <Grid container spacing={1} sx={{ justifyContent: { xs: 'center', md: 'flex-start' } }}>
                    <Grid item xs={4} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ color: '#4ade80', fontWeight: 'bold' }}>
                          ₹{(liveStats.totalFunded / 100000).toFixed(1)}L+
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Total Funded
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ color: '#f59e0b', fontWeight: 'bold' }}>
                          {liveStats.avgROI.toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Avg ROI
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4} sm={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant={isMobile ? 'h5' : 'h4'} sx={{ color: '#3b82f6', fontWeight: 'bold' }}>
                          {liveStats.activeInvestors}+
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.7 }}>
                          Active Users
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Fade>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Grow in timeout={1500}>
                <Box sx={{ 
                  position: 'relative',
                  mt: { xs: 2, md: 0 }
                }}>
                  <Paper sx={{ 
                    p: { xs: 3, md: 4 }, 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: 4
                  }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#4ade80' }}>
                       Live Market Activity
                    </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">Market Volume</Typography>
                          <Typography variant="body2">₹{liveStats.totalFunded.toLocaleString()}</Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={75} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #4ade80 0%, #f59e0b 100%)'
                            }
                          }} 
                        />
                      </Box>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(74, 222, 128, 0.1)', borderRadius: 2 }}>
                            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#4ade80' }}>
                              {liveStats.totalInvoices}
                            </Typography>
                            <Typography variant="caption">Live Invoices</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 2, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 2 }}>
                            <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#f59e0b' }}>
                              24/7
                            </Typography>
                            <Typography variant="caption">Market Open</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                </Box>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Responsive Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography 
          variant={isMobile ? 'h4' : 'h3'} 
          align="center" 
          sx={{ 
            mb: { xs: 4, md: 5 }, 
            fontWeight: 'bold',
            px: { xs: 2, md: 0 }
          }}
        >
          Why Choose ReturnX?
        </Typography>
        
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {[
            { icon: <Security />, title: 'Blockchain Security', desc: 'Military-grade encryption with smart contracts', color: '#4ade80' },
            { icon: <Speed />, title: 'Instant Funding', desc: 'Get funded in minutes, not weeks', color: '#f59e0b' },
            { icon: <TrendingUp />, title: 'High Returns', desc: 'Earn up to 15% annual returns', color: '#3b82f6' },
            { icon: <AccountBalance />, title: 'Regulated Platform', desc: 'Fully compliant with financial regulations', color: '#ef4444' }
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Grow in timeout={800 + index * 200}>
                <Card sx={{ 
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${feature.color}40`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: { xs: 'scale(1.02)', md: 'translateY(-10px)' },
                    boxShadow: `0 ${isMobile ? '10px 20px' : '20px 40px'} ${feature.color}30`
                  }
                }}>
                  <CardContent sx={{ textAlign: 'center', p: { xs: 3, md: 4 } }}>
                    <Box sx={{ 
                      color: feature.color, 
                      mb: 2,
                      '& svg': { fontSize: { xs: 40, md: 48 } }
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, lineHeight: 1.5 }}>
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Responsive Footer */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a2332 0%, #0f1419 100%)',
        borderTop: '1px solid rgba(74, 222, 128, 0.2)',
        py: { xs: 3, md: 4 }
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Avatar sx={{ 
                  mr: 2, 
                  background: 'linear-gradient(135deg, #4ade80 0%, #f59e0b 100%)',
                  width: { xs: 32, md: 40 },
                  height: { xs: 32, md: 40 }
                }}>
                  <Typography variant={isMobile ? 'body2' : 'h6'} sx={{ fontWeight: 'bold' }}>
                    RX
                  </Typography>
                </Avatar>
                <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ fontWeight: 'bold' }}>
                  ReturnX
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8, 
                  mb: 3,
                  textAlign: { xs: 'center', md: 'left' },
                  px: { xs: 2, md: 0 }
                }}
              >
                The future of invoice financing. Secure, fast, and transparent blockchain-powered platform.
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 1,
                justifyContent: { xs: 'center', md: 'flex-start' }
              }}>
                {[GitHub, LinkedIn, Twitter].map((Icon, index) => (
                  <IconButton 
                    key={index}
                    sx={{ 
                      color: '#4ade80',
                      '&:hover': { 
                        background: 'rgba(74, 222, 128, 0.1)',
                        transform: 'scale(1.2)'
                      }
                    }}
                  >
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ mb: 2, color: '#4ade80', textAlign: { xs: 'center', md: 'left' } }}>
                Platform
              </Typography>
              <Stack spacing={1}>
                {['For Sellers', 'For Buyers', 'For Investors', 'API Docs'].map((item) => (
                  <Typography 
                    key={item} 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.8, 
                      cursor: 'pointer',
                      textAlign: { xs: 'center', md: 'left' },
                      '&:hover': { color: '#4ade80' }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Typography variant="h6" sx={{ mb: 2, color: '#4ade80', textAlign: { xs: 'center', md: 'left' } }}>
                Company
              </Typography>
              <Stack spacing={1}>
                {['About Us', 'Careers', 'Press', 'Legal'].map((item) => (
                  <Typography 
                    key={item} 
                    variant="body2" 
                    sx={{ 
                      opacity: 0.8, 
                      cursor: 'pointer',
                      textAlign: { xs: 'center', md: 'left' },
                      '&:hover': { color: '#4ade80' }
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: '#4ade80', textAlign: { xs: 'center', md: 'left' } }}>
                Contact Us
              </Typography>
              <Stack spacing={1} alignItems={{ xs: 'center', md: 'flex-start' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    hello@returnx.finance
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Phone sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +91 98765 43210
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Mumbai, India
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
            mt: 4, 
            pt: 4, 
            textAlign: 'center' 
          }}>
            <Typography variant="body2" sx={{ opacity: 0.6, px: { xs: 2, md: 0 } }}>
              © 2025 ReturnX. All rights reserved. | Built with ❤️ for the future of finance.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;