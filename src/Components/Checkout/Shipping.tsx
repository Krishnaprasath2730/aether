import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, TextField, Button, Grid, Stepper, Step, StepLabel, FormControlLabel, Checkbox, Radio, RadioGroup, Alert } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { useCart } from '../../context/CartContext';
import { useCheckout, type ShippingInfo } from '../../context/CheckoutContext';

interface FormErrors {
  [key: string]: string;
}

const Shipping: React.FC = () => {
  const navigate = useNavigate();
  const { totalPrice, totalItems, items } = useCart();
  const { shippingInfo, setShippingInfo } = useCheckout();
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/checkout/cart');
    }
  }, [items, navigate]);

  const [formData, setFormData] = useState<Omit<ShippingInfo, 'shippingMethod'>>({
    firstName: shippingInfo?.firstName || '',
    lastName: shippingInfo?.lastName || '',
    email: shippingInfo?.email || '',
    phone: shippingInfo?.phone || '',
    address: shippingInfo?.address || '',
    apartment: shippingInfo?.apartment || '',
    city: shippingInfo?.city || '',
    state: shippingInfo?.state || '',
    zipCode: shippingInfo?.zipCode || '',
    country: shippingInfo?.country || 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express' | 'overnight'>(
    shippingInfo?.shippingMethod || 'standard'
  );
  const [saveInfo, setSaveInfo] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingOptions = [
    { id: 'standard' as const, name: 'Standard Delivery', price: 0, time: '5-7 business days', icon: '📦' },
    { id: 'express' as const, name: 'Express Delivery', price: 15, time: '2-3 business days', icon: '🚚' },
    { id: 'overnight' as const, name: 'Overnight Delivery', price: 30, time: 'Next business day', icon: '✈️' }
  ];

  const selectedShipping = shippingOptions.find(o => o.id === shippingMethod)!;
  const shippingCost = totalPrice >= 200 ? 0 : selectedShipping.price;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate brief processing
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save shipping info
    setShippingInfo({
      ...formData,
      shippingMethod
    });

    setIsSubmitting(false);
    navigate('/checkout/payment');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Stepper */}
      <Stepper activeStep={1} sx={{ mb: 6 }}>
        <Step completed><StepLabel>Cart</StepLabel></Step>
        <Step><StepLabel>Shipping</StepLabel></Step>
        <Step><StepLabel>Payment</StepLabel></Step>
      </Stepper>

      <Grid container spacing={6}>
        {/* Shipping Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Contact Information</Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  placeholder="you@example.com"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  placeholder="(555) 123-4567"
                />
              </Grid>
            </Grid>

            <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Shipping Address</Typography>
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  required
                  label="Street Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  placeholder="123 Main Street"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Apartment, suite, etc. (optional)"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleChange}
                  placeholder="Apt 4B"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  label="ZIP Code"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={!!errors.zipCode}
                  helperText={errors.zipCode}
                  placeholder="12345"
                />
              </Grid>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox 
                  checked={saveInfo} 
                  onChange={(e) => setSaveInfo(e.target.checked)} 
                  sx={{ '&.Mui-checked': { color: '#D5A249' } }}
                />
              }
              label="Save this information for next time"
              sx={{ mt: 2 }}
            />

            {/* Shipping Method */}
            <Typography variant="h5" fontWeight={700} sx={{ mt: 5, mb: 3 }}>Shipping Method</Typography>
            
            {totalPrice >= 200 && (
              <Alert severity="success" sx={{ mb: 3 }}>
                🎉 You qualify for FREE shipping on all methods!
              </Alert>
            )}
            
            <RadioGroup value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value as typeof shippingMethod)}>
              {shippingOptions.map(option => (
                <Box
                  key={option.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2.5,
                    mb: 1.5,
                    border: shippingMethod === option.id ? '2px solid #2C2C2C' : '1px solid #e0e0e0',
                    borderRadius: 2,
                    cursor: 'pointer',
                    bgcolor: shippingMethod === option.id ? '#fafafa' : 'white',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setShippingMethod(option.id)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Radio value={option.id} sx={{ '&.Mui-checked': { color: '#2C2C2C' } }} />
                    <Typography fontSize="1.5rem">{option.icon}</Typography>
                    <Box>
                      <Typography fontWeight={600}>{option.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{option.time}</Typography>
                    </Box>
                  </Box>
                  <Typography fontWeight={600} sx={{ color: totalPrice >= 200 || option.price === 0 ? '#4caf50' : 'inherit' }}>
                    {totalPrice >= 200 || option.price === 0 ? 'FREE' : `$${option.price}`}
                  </Typography>
                </Box>
              ))}
            </RadioGroup>

            <Box sx={{ display: 'flex', gap: 2, mt: 4, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/checkout/cart')} 
                sx={{ px: 4, borderColor: '#2C2C2C', color: '#2C2C2C' }}
              >
                Back to Cart
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isSubmitting}
                sx={{ 
                  px: 6, 
                  py: 1.5,
                  bgcolor: '#2C2C2C', 
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'black' } 
                }}
              >
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ bgcolor: '#f9f9f9', borderRadius: 2, p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Order Summary</Typography>
            
            {/* Items Preview */}
            <Box sx={{ mb: 3, maxHeight: 200, overflow: 'auto' }}>
              {items.slice(0, 3).map(item => (
                <Box key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{ width: 50, height: 60, objectFit: 'cover', borderRadius: 1 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{item.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.selectedColor} / {item.selectedSize} × {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={600}>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              {items.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{items.length - 3} more items
                </Typography>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography color="text.secondary">Subtotal ({totalItems} items)</Typography>
              <Typography fontWeight={600}>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShippingOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Typography color="text.secondary">{selectedShipping.name}</Typography>
              </Box>
              <Typography fontWeight={600} sx={{ color: shippingCost === 0 ? '#4caf50' : 'inherit' }}>
                {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 3, mt: 2, borderTop: '1px solid #e0e0e0' }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={700}>${(totalPrice + shippingCost).toFixed(2)}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Shipping;
