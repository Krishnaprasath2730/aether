import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Stepper, Step, StepLabel, Dialog, DialogContent, CircularProgress, Alert, Paper, Divider } from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useCart } from '../../context/CartContext';
import { useCheckout } from '../../context/CheckoutContext';
import { useAuth } from '../../context/AuthContext';
import { useScratchCards } from '../../context/ScratchCardContext';
import { toast } from 'react-toastify';
import ScratchCardModal from '../Features/ScratchCardModal';

interface CardErrors {
  [key: string]: string;
}

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { totalPrice, totalItems, items, clearCart } = useCart();
  const { shippingInfo, createOrder, currentOrder } = useCheckout();
  const { user, token, updateUser, isAuthenticated } = useAuth();
  const { addScratchCard } = useScratchCards();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [cardErrors, setCardErrors] = useState<CardErrors>({});
  const [showScratchCard, setShowScratchCard] = useState(false);
  const [scratchCardData, setScratchCardData] = useState<{
    id: string;
    orderAmount: number;
    expiresAt: string;
  } | null>(null);

  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  // Redirect if not authenticated, no shipping info, or empty cart
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to continue checkout');
      navigate('/login');
      return;
    }
    if (items.length === 0 && !currentOrder) {
      navigate('/checkout/cart');
    } else if (!shippingInfo && items.length > 0) {
      navigate('/checkout/shipping');
    }
  }, [items, shippingInfo, currentOrder, isAuthenticated, navigate]);

  const shippingMethod = shippingInfo?.shippingMethod || 'standard';
  // Use cost from context (calculated in Shipping step based on distance)
  const shippingCost = shippingInfo?.shippingCost || 0;
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
      const yearDigits = parseInt(expiry.slice(2, 4));
      // Convert 2-digit year to 4-digit: 00-99 -> 2000-2099
      const year = 2000 + yearDigits;
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

    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      toast.error('Please login to complete your purchase');
      navigate('/login');
      return;
    }

    if (paymentMethod === 'card' && !validateCard()) {
      return;
    }

    if (paymentMethod === 'wallet') {
      if ((user?.walletBalance ?? 0) < finalTotal) {
        toast.error('Insufficient wallet balance');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order via local context (for local history)
      const localOrder = createOrder(items, paymentMethod);
      setOrderId(localOrder.id);

      // Call backend API to create order for ALL payment methods
      try {
        const { apiService } = await import('../../services/api.service');
        const result = await apiService.createOrder({
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalAmount: finalTotal,
          shippingAddress: shippingInfo,
          paymentMethod: paymentMethod
        }, token);

        // Update AuthContext with new wallet balance if wallet payment
        if (paymentMethod === 'wallet' && result.newWalletBalance !== undefined) {
          updateUser({ walletBalance: result.newWalletBalance });
        }

        // Check if scratch card was generated (orders >= $100)
        if (result.scratchCard) {
          const cardData = {
            id: result.scratchCard.id,
            orderAmount: result.scratchCard.orderAmount,
            expiresAt: result.scratchCard.expiresAt
          };
          setScratchCardData(cardData);
          // Add to context for storage
          addScratchCard({
            id: cardData.id,
            orderAmount: cardData.orderAmount,
            expiresAt: cardData.expiresAt,
            isScratched: false,
            isRedeemed: false
          });
          // Show cashback toast ONLY (replaces generic success toast)
          toast.success('🎉 You earned cashback! Check your Rewards!', {
            position: 'top-center',
            autoClose: 5000
          });
        } else {
          toast.success('Order placed successfully!');
        }
      } catch (apiError: any) {
        console.error('Backend API order error:', apiError);
        // Show specific error message if available
        if (apiError.message) {
          toast.error(apiError.message);
        }
        // Continue with local order even if backend fails
        // Show scratch card demo for orders >= $100 even if API fails
        if (finalTotal >= 100) {
          const demoCard = {
            id: 'demo-' + Date.now(),
            orderAmount: finalTotal,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          };
          setScratchCardData(demoCard);
          // Add to context for storage
          addScratchCard({
            ...demoCard,
            isScratched: false,
            isRedeemed: false
          });
          toast.success('🎉 You earned cashback! Check your Rewards!', {
            position: 'top-center',
            autoClose: 5000
          });
        } else {
          toast.error('Order placed, but failed to generate reward. continuing...');
        }
      }

      // Clear cart after successful payment
      clearCart();

      setIsProcessing(false);
      setIsSuccess(true);
    } catch (error: any) {
      setIsProcessing(false);
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to create order. Please try again.');
    }
  };

  const handleSuccessClose = () => {
    navigate('/');
  };

  const paymentMethods = [
    { id: 'card', name: 'Card', icon: <CreditCardIcon />, description: 'Pay securely with your card' },
    { id: 'wallet', name: `Wallet • $${user?.walletBalance?.toLocaleString('en-US') || '0'}`, icon: <AccountBalanceWalletIcon />, description: `Use your balance` },
    { id: 'paypal', name: 'PayPal', icon: <PaymentIcon />, description: 'Fast and secure checkout' },
    { id: 'bank', name: 'Bank', icon: <AccountBalanceIcon />, description: 'Direct bank transfer' }
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
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Select Payment Method</Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
              {paymentMethods.map(method => (
                <Paper
                  key={method.id}
                  elevation={0}
                  onClick={() => setPaymentMethod(method.id)}
                  sx={{
                    flex: '1 1 calc(50% - 16px)',
                    minWidth: '140px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.5,
                    p: 2,
                    border: paymentMethod === method.id ? '2px solid #000' : '1px solid #e0e0e0',
                    borderRadius: 10, // Pill/Rounded style
                    cursor: 'pointer',
                    bgcolor: 'white',
                    transition: 'all 0.2s',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      borderColor: paymentMethod === method.id ? '#000' : '#b0b0b0'
                    }
                  }}
                >
                  <Box sx={{ color: paymentMethod === method.id ? 'black' : '#555', display: 'flex' }}>
                    {method.icon}
                  </Box>
                  <Typography fontWeight={700} sx={{ fontSize: '1rem', color: paymentMethod === method.id ? 'black' : '#555' }}>
                    {method.name}
                  </Typography>
                  {paymentMethod === method.id && (
                    <CheckCircleIcon sx={{ position: 'absolute', top: -10, right: -5, color: 'black', bgcolor: 'white', borderRadius: '50%' }} />
                  )}
                </Paper>
              ))}
            </Box>

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

            {paymentMethod === 'wallet' && (
              <Box sx={{ mt: 4, p: 4, bgcolor: 'white', borderRadius: 4, border: '1px solid #e0e0e0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: '#FFF8E1', borderRadius: '50%', color: '#D5A249' }}>
                      <AccountBalanceWalletIcon fontSize="large" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>Aether Wallet</Typography>
                      <Typography variant="body2" color="text.secondary">Fast, secure payment</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" display="block" color="text.secondary">AVAILABLE BALANCE</Typography>
                    <Typography variant="h5" fontWeight={800} sx={{ color: '#D5A249', fontFamily: 'monospace' }}>
                      ${user?.walletBalance?.toFixed(2) || '0.00'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {(user?.walletBalance ?? 0) >= finalTotal ? (
                  <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />} sx={{ borderRadius: 2 }}>
                    <Typography fontWeight={600}>Balance covers this purchase.</Typography>
                    The amount of <strong>${finalTotal.toFixed(2)}</strong> will be deducted.
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    <Typography fontWeight={600}>Insufficient Funds</Typography>
                    You need <strong>${(finalTotal - (user?.walletBalance || 0)).toFixed(2)}</strong> more.
                  </Alert>
                )}
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
              <Typography color="text.secondary">Shipping ({shippingMethod})</Typography>
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
              {scratchCardData && (
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#D5A249' }}>
                  🎉 You won a scratch card! Check the popup.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Scratch Card Modal */}
      <ScratchCardModal
        open={showScratchCard}
        onClose={() => setShowScratchCard(false)}
        scratchCardData={scratchCardData}
        onRedeem={(amount) => {
          toast.success(`$${amount.toFixed(2)} added to your wallet!`);
        }}
      />
    </Container>
  );
};

export default Payment;
