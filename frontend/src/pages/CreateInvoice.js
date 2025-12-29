import React, { useState } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box,
  Grid, Alert, CircularProgress, Card, Chip
} from '@mui/material';
import { Upload, Receipt, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../services/api';
import { motion } from 'framer-motion';

function CreateInvoice() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    buyerName: '',
    buyerEmail: '',
    amount: '',
    dueDate: '',
    description: '',
    category: 'Services'
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Creating invoice with data:', formData);
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      files.forEach(file => {
        formDataToSend.append('documents', file);
      });

      const response = await invoiceAPI.uploadInvoice(formDataToSend);
      console.log('Invoice created:', response);
      
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Invoice creation error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  if (success) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ p: 6, textAlign: 'center', bgcolor: '#f0fdf4', border: '1px solid #22c55e' }}>
            <CheckCircle sx={{ fontSize: 64, color: '#22c55e', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#15803d', mb: 2 }}>
              Invoice Created Successfully!
            </Typography>
            <Typography variant="body1" sx={{ color: '#166534', mb: 3 }}>
              Your invoice has been submitted and is pending buyer verification.
            </Typography>
            <Chip label="Redirecting to dashboard..." sx={{ bgcolor: '#22c55e', color: 'white' }} />
          </Card>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Create New Invoice
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Upload your invoice details to get funded by investors
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount (Rs.)"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buyer Name"
                value={formData.buyerName}
                onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buyer Email"
                type="email"
                value={formData.buyerEmail}
                onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                SelectProps={{ native: true }}
              >
                <option value="Services">Services</option>
                <option value="Products">Products</option>
                <option value="Consulting">Consulting</option>
                <option value="Other">Other</option>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ 
                border: '2px dashed #e0e0e0',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                '&:hover': { borderColor: '#2563eb' }
              }}>
                <Upload sx={{ fontSize: 48, color: '#64748b', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Upload Invoice Documents
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  PDF, JPG, PNG files (Max 10MB each)
                </Typography>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outlined" component="span">
                    Choose Files
                  </Button>
                </label>
                {files.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {files.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        sx={{ m: 0.5 }}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Receipt />}
              sx={{ flex: 1 }}
            >
              {loading ? 'Creating Invoice...' : 'Create Invoice'}
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default CreateInvoice;