import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Grid } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import { invoiceAPI } from '../services/api';

function CreateInvoice() {
  const [formData, setFormData] = useState({
    buyerEmail: '',
    amount: '',
    dueDate: '',
    invoiceNumber: ''
  });
  const [files, setFiles] = useState({
    invoiceFile: null,
    purchaseOrder: null,
    deliveryChallan: null
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createMutation = useMutation(invoiceAPI.createInvoice, {
    onSuccess: (data) => {
      setSuccess('Invoice created successfully! Waiting for buyer confirmation.');
      setFormData({ buyerEmail: '', amount: '', dueDate: '', invoiceNumber: '' });
      setFiles({ invoiceFile: null, purchaseOrder: null, deliveryChallan: null });
    },
    onError: (err) => {
      setError(err.response?.data?.message || 'Failed to create invoice');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formDataToSend.append(key, files[key]);
      }
    });

    createMutation.mutate(formDataToSend);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const FileDropzone = ({ name, label, accept }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept,
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        setFiles(prev => ({
          ...prev,
          [name]: acceptedFiles[0]
        }));
      }
    });

    return (
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? '#f5f5f5' : 'transparent'
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="body2">
          {files[name] ? files[name].name : `Drop ${label} here or click to select`}
        </Typography>
      </Box>
    );
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Invoice
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Invoice Number"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Amount (₹)"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buyer Email"
                name="buyerEmail"
                type="email"
                value={formData.buyerEmail}
                onChange={handleChange}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Upload Documents
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Invoice File *
              </Typography>
              <FileDropzone 
                name="invoiceFile" 
                label="invoice file"
                accept={{ 'image/*': [], 'application/pdf': [] }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Purchase Order
              </Typography>
              <FileDropzone 
                name="purchaseOrder" 
                label="purchase order"
                accept={{ 'image/*': [], 'application/pdf': [] }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" gutterBottom>
                Delivery Challan
              </Typography>
              <FileDropzone 
                name="deliveryChallan" 
                label="delivery challan"
                accept={{ 'image/*': [], 'application/pdf': [] }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={createMutation.isLoading}
                sx={{ mt: 2 }}
              >
                {createMutation.isLoading ? 'Creating Invoice...' : 'Create Invoice'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default CreateInvoice;