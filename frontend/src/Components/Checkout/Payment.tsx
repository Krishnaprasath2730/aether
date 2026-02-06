import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Stepper, Step, StepLabel, Radio, RadioGroup, Dialog, DialogContent, CircularProgress, Alert } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';

interface CardErrors {
  [key: string]: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { totalPrice, totalItems, items, clearCart } = useCart();
  const { shippingInfo, createOrder, currentOrder } = useCheckout();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Redirect if no shipping info or empty cart
  useEffect(() => {
    if (items.length === 0 && !currentOrder) {
      navigate('/checkout/cart');
    } else if (!shippingInfo && items.length > 0) {
      navigate('/checkout/shipping');
    }
  }, [items, shippingInfo, currentOrder, navigate]);

  const shippingMethod = shippingInfo?.shippingMethod || 'standard';
  const shippingCosts = { standard: 0, express: 15, overnight: 30 };
  const shippingCost = totalPrice >= 200 ? 0 : shippingCosts[shippingMethod];
  const finalTotal = totalPrice + shippingCost;

  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ').slice(0, 19) : '';
  };

  const formatExpiry = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const validateCard = (): boolean => {
    const errors: CardErrors = {};
    
    const cardNumber = cardData.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      errors.cardNumber = 'Card number is required';
    } else if (cardNumber.length < 15 || cardNumber.length > 16) {
      errors.cardNumber = 'Please enter a valid card number';
    }

    if (!cardData.cardName.trim()) {
      errors.cardName = 'Cardholder name is required';
    }

    const expiry = cardData.expiry.replace('/', '');
    if (!expiry) {
      errors.expiry = 'Expiry date is required';
    } else if (expiry.length < 4) {
      errors.expiry = 'Please enter a valid expiry date';
    } else {
      const month = parseInt(expiry.slice(0, 2));
      const year = parseInt('20' + expiry.slice(2, 4));
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      if (month < 1 || month > 12) {
        errors.expiry = 'Invalid month';
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        errors.expiry = 'Card has expired';
      }
    }

    if (!cardData.cvv) {
      errors.cvv = 'CVV is required';
    } else if (cardData.cvv.length < 3) {
      errors.cvv = 'Please enter a valid CVV';
    }

    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    
    if (cardErrors[name]) {
      setCardErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    try {
      // Create order
      const order = createOrder(items, paymentMethod);
      setOrderId(order.id);
      
      // Clear cart after successful payment
      clearCart();
      
      setIsProcessing(false);
      setIsSuccess(true);
    } catch (error) {
      setIsProcessing(false);
      console.error('Order creation failed:', error);
    }
  };

  const handleSuccessClose = () => {
    navigate('/');
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit / Debit Card', icon: <CreditCardIcon />, description: 'Pay securely with your card' },
    { id: 'paypal', name: 'PayPal', icon: <PaymentIcon />, description: 'Fast and secure checkout' },
    { id: 'bank', name: 'Bank Transfer', icon: <AccountBalanceIcon />, description: 'Direct bank transfer' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Stepper */}
      <Stepper activeStep={2} sx={{ mb: 6 }}>
        <Step completed><StepLabel>Cart</StepLabel></Step>
        <Step completed><StepLabel>Shipping</StepLabel></Step>
        <Step><StepLabel>Payment</StepLabel></Step>
      </Stepper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {/* Payment Form */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 60%' }, maxWidth: { md: '65%' } }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Payment Method</Typography>
            
            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {paymentMethods.map(method => (
                <Box
                  key={method.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2.5,
                    mb: 1.5,
                    border: paymentMethod === method.id ? '2px solid #2C2C2C' : '1px solid #e0e0e0',
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: paymentMethod === method.id ? '#fafafa' : 'white',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  <Radio value={method.id} sx={{ '&.Mui-checked': { color: '#2C2C2C' } }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 2, 
                      bgcolor: paymentMethod === method.id ? '#2C2C2C' : '#f5f5f5',
                      color: paymentMethod === method.id ? 'white' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}>
                      {method.icon}
                    </Box>
                    <Box>
                      <Typography fontWeight={600}>{method.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{method.description}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </RadioGroup>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <Box sx={{ mt: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <LockIcon fontSize="small" sx={{ color: '#4caf50' }} />
                  <Typography variant="subtitle2" fontWeight={600}>Secure Card Payment</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: '1 1 100%' }}>
                    <TextField
                      fullWidth
                      required
                      label="Card Number"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={handleCardChange}
                      error={!!cardErrors.cardNumber}
                      helperText={cardErrors.cardNumber}
                      inputProps={{ maxLength: 19 }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 100%' }}>
                    <TextField
                      fullWidth
                      required
                      label="Cardholder Name"
                      name="cardName"
                      placeholder="JOHN DOE"
                      value={cardData.cardName}
                      onChange={handleCardChange}
                      error={!!cardErrors.cardName}
                      helperText={cardErrors.cardName}
                      inputProps={{ style: { textTransform: 'uppercase' } }}
                    />
                  </Box>
                  <Box sx={{ flex: { xs: '1 1 45%' } }}>
                    <TextField
                      fullWidth
                      required
                      label="Expiry Date"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardData.expiry}
                      onChange={handleCardChange}
                      error={!!cardErrors.expiry}
                      helperText={cardErrors.expiry}
                      inputProps={{ maxLength: 5 }}
                    />
                  </Box>
                  <Box sx={{ flex: { xs: '1 1 45%' } }}>
                    <TextField
                      fullWidth
                      required
                      label="CVV"
                      name="cvv"
                      type="password"
                      placeholder="•••"
                      value={cardData.cvv}
                      onChange={handleCardChange}
                      error={!!cardErrors.cvv}
                      helperText={cardErrors.cvv}
                      inputProps={{ maxLength: 4 }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            {paymentMethod === 'paypal' && (
              <Alert severity="info" sx={{ mt: 4 }}>
                You will be redirected to PayPal to complete your purchase securely.
              </Alert>
            )}

            {paymentMethod === 'bank' && (
              <Box sx={{ mt: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 2 }}>Bank Transfer Details</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 2 }}>
                  Bank: AETHER National Bank<br />
                  Account Name: AETHER Inc.<br />
                  Account: 1234-5678-9012<br />
                  SWIFT: AETHERXX<br />
                  Reference: Your Order ID (will be provided after confirmation)
                </Typography>
              </Box>
            )}

            {/* Shipping Summary */}
            {shippingInfo && (
              <Box sx={{ mt: 4, p: 3, bgcolor: '#f9f9f9', borderRadius: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Shipping To:</Typography>
                <Typography variant="body2">
                  {shippingInfo.firstName} {shippingInfo.lastName}<br />
                  {shippingInfo.address}{shippingInfo.apartment && `, ${shippingInfo.apartment}`}<br />
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                  {shippingInfo.email} • {shippingInfo.phone}
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/checkout/shipping')} 
                sx={{ px: 4, borderColor: '#2C2C2C', color: '#2C2C2C' }}
              >
                Back
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isProcessing}
                sx={{ 
                  px: 6, 
                  py: 1.5,
                  bgcolor: '#D5A249', 
                  color: 'black', 
                  fontWeight: 700, 
                  '&:hover': { bgcolor: '#c49a3e' },
                  '&:disabled': { bgcolor: '#e0e0e0' }
                }}
              >
                {isProcessing ? 'Processing...' : `Pay $${finalTotal.toFixed(2)}`}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Order Summary */}
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, maxWidth: { md: '35%' } }}>
          <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 2, p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Order Summary</Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Subtotal ({totalItems} items)</Typography>
              <Typography fontWeight={600}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography fontWeight={600} sx={{ color: shippingCost === 0 ? '#4caf50' : 'inherit' }}>
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, mt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={700}>${finalTotal.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ mt: 4, p: 2, bgcolor: '#fff8e1', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LockIcon fontSize="small" sx={{ color: '#f57c00' }} />
                <Typography variant="caption" fontWeight={600}>
                  Your payment is 100% secure
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                We use industry-standard encryption to protect your data. Your card details are never stored.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Processing/Success Dialog */}
      <Dialog 
        open={isProcessing || isSuccess} 
        PaperProps={{ 
          sx: { 
            p: 4, 
            textAlign: 'center', 
            minWidth: { xs: '90%', sm: 400 },
            borderRadius: 3
          } 
        }}
      >
        <DialogContent>
          {isProcessing && (
            <>
              <CircularProgress size={60} sx={{ mb: 3, color: '#D5A249' }} />
              <Typography variant="h5" fontWeight={700}>Processing Payment...</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please wait while we securely process your order
              </Typography>
            </>
          )}
          {isSuccess && (
            <>
              <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
              <Typography variant="h4" fontWeight={700}>Order Confirmed!</Typography>
              <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                Order ID: <strong>{orderId}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                We've sent a confirmation email with your order details.
                Thank you for shopping with AETHER!
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSuccessClose}
                sx={{ bgcolor: '#2C2C2C', py: 1.5, fontWeight: 700 }}
              >
                Continue Shopping
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Payment;
