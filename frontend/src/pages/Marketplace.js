import React, { useState } from 'react';
import { Container, Grid, Card, CardContent, Typography, Button, Box, Chip, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { invoiceAPI } from '../services/api';

function Marketplace() {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  
  const queryClient = useQueryClient();
  const { data: invoices, isLoading } = useQuery('marketplace', invoiceAPI.getMarketplace);
  
  const fundMutation = useMutation(
    ({ invoiceId, discountedAmount }) => invoiceAPI.fund(invoiceId, discountedAmount),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('marketplace');
        setOpenDialog(false);
        setSelectedInvoice(null);
        setFundAmount('');
      }
    }
  );

  const handleFund = (invoice) => {
    setSelectedInvoice(invoice);
    setFundAmount(((invoice.amount || 0) * 0.9).toString()); // 10% discount default
    setOpenDialog(true);
  };

  const confirmFunding = () => {
    if (selectedInvoice && fundAmount) {
      fundMutation.mutate({
        invoiceId: selectedInvoice.id,
        discountedAmount: parseFloat(fundAmount)
      });
    }
  };

  const getRiskColor = (riskScore) => {
    if (riskScore < 30) return 'success';
    if (riskScore < 70) return 'warning';
    return 'error';
  };

  const getRiskLabel = (riskScore) => {
    if (riskScore < 30) return 'Low Risk';
    if (riskScore < 70) return 'Medium Risk';
    return 'High Risk';
  };

  if (isLoading) return <Typography>Loading marketplace...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Invoice Marketplace
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Invest in verified invoices and earn returns
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {invoices?.map((invoice) => (
          <Grid item xs={12} md={6} lg={4} key={invoice.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6">
                    ₹{(invoice.amount || 0).toLocaleString()}
                  </Typography>
                  <Chip 
                    label={getRiskLabel(invoice.riskScore)}
                    color={getRiskColor(invoice.riskScore)}
                    size="small"
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Seller:</strong> {invoice.seller}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Buyer:</strong> {invoice.buyer}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Tenure:</strong> {invoice.tenure} days
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Expected ROI:</strong> ₹{(invoice.expectedROI || 0).toFixed(2)}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleFund(invoice)}
                  >
                    Fund Invoice
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {invoices?.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No invoices available for funding at the moment
          </Typography>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Fund Invoice</DialogTitle>
        <DialogContent>
          {selectedInvoice && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Invoice Details
              </Typography>
              <Typography>Amount: ₹{selectedInvoice.amount || 0}</Typography>
              <Typography>Seller: {selectedInvoice.seller}</Typography>
              <Typography>Buyer: {selectedInvoice.buyer}</Typography>
              <Typography>Tenure: {selectedInvoice.tenure} days</Typography>
              
              <TextField
                fullWidth
                label="Your Investment Amount"
                type="number"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                margin="normal"
                helperText={`Potential profit: ₹${((selectedInvoice.amount || 0) - parseFloat(fundAmount || 0)).toFixed(2)}`}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={confirmFunding} 
            variant="contained"
            disabled={fundMutation.isLoading || !fundAmount}
          >
            {fundMutation.isLoading ? 'Processing...' : 'Confirm Investment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Marketplace;