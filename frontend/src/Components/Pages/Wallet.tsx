import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Tooltip, CircularProgress, Tabs, Tab, Alert } from '@mui/material';
import { AccountBalanceWallet, History, CallMade, CallReceived, Send, Refresh, Add } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api.service';
import { toast } from 'react-toastify';
import QRCode from 'react-qr-code';

const Wallet: React.FC = () => {
    const { token, user, updateUser } = useAuth();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openAddFunds, setOpenAddFunds] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [tabValue, setTabValue] = useState(0);

    // Transfer State
    const [recipientEmail, setRecipientEmail] = useState('');
    const [transferAmount, setTransferAmount] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);

    const fetchWalletData = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await apiService.getWallet(token);
            setBalance(data.balance);
            setTransactions(data.transactions);
        } catch (error) {
            console.error('Error fetching wallet:', error);
            // toast.error('Failed to load wallet data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, [token]);

    const handleAddFunds = async () => {
        const amount = parseFloat(amountToAdd);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            const result = await apiService.addFunds(amount, token!);
            toast.success('Funds added successfully');
            setOpenAddFunds(false);
            setAmountToAdd('');
            setBalance(result.balance);
            updateUser({ walletBalance: result.balance }); // Sync with AuthContext
            fetchWalletData();
        } catch (error: any) {
            toast.error(error.message || 'Failed to add funds');
        }
    };

    const handleTransfer = async () => {
        const amount = parseFloat(transferAmount);
        if (!recipientEmail || isNaN(amount) || amount <= 0) {
            toast.error('Please enter valid details');
            return;
        }

        if (amount > balance) {
            toast.error('Insufficient balance');
            return;
        }

        try {
            setTransferLoading(true);
            const result = await apiService.transferFunds(recipientEmail, amount, token!);
            toast.success('Transfer successful!');
            setRecipientEmail('');
            setTransferAmount('');
            setTabValue(0); // Go back to overview
            setBalance(result.balance);
            updateUser({ walletBalance: result.balance }); // Sync with AuthContext
            fetchWalletData();
        } catch (error: any) {
            toast.error(error.message || 'Transfer failed');
        } finally {
            setTransferLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>
                My Wallet
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                Manage your digital assets, view transactions, and transfer funds.
            </Typography>

            <Paper sx={{ mb: 4 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, v) => setTabValue(v)}
                    centered
                    sx={{
                        '& .MuiTabs-indicator': { backgroundColor: '#D4AF37', height: 3 },
                        '& .MuiTab-root': { fontWeight: 'bold', fontSize: '1rem', textTransform: 'none', px: 4 }
                    }}
                >
                    <Tab
                        icon={<AccountBalanceWallet sx={{ mb: 0.5 }} />}
                        label="Overview"
                        sx={{ color: tabValue === 0 ? '#D4AF37 !important' : 'text.secondary' }}
                    />
                    <Tab
                        icon={<Send sx={{ mb: 0.5 }} />}
                        label="Send Money"
                        sx={{ color: tabValue === 1 ? '#D4AF37 !important' : 'text.secondary' }}
                    />
                </Tabs>
            </Paper>

            {/* Overview Tab */}
            {tabValue === 0 && (
                <Box>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                        {/* Balance Card & QR */}
                        <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 40%' }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Balance Card - Credit Card Style */}
                            <Paper
                                elevation={12}
                                sx={{
                                    p: 4,
                                    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                                    color: 'white',
                                    borderRadius: 5,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    minHeight: 220,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                }}
                            >
                                {/* Decorative Circles */}
                                <Box sx={{
                                    position: 'absolute', top: -50, right: -50, width: 200, height: 200,
                                    borderRadius: '50%', background: 'rgba(255,255,255,0.05)'
                                }} />
                                <Box sx={{
                                    position: 'absolute', bottom: -80, left: -40, width: 200, height: 200,
                                    borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)'
                                }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                                    <Box>
                                        <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 2 }}>
                                            TOTAL BALANCE
                                        </Typography>
                                        <Typography variant="h3" sx={{ fontWeight: 700, mt: 1, fontFamily: 'monospace' }}>
                                            {formatCurrency(balance)}
                                        </Typography>
                                    </Box>
                                    <AccountBalanceWallet sx={{ fontSize: 40, opacity: 0.8, color: '#D4AF37' }} />
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1, mt: 4 }}>
                                    <Box>
                                        <Typography variant="caption" display="block" sx={{ opacity: 0.6 }}>WALLET HOLDER</Typography>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ letterSpacing: 1 }}>
                                            {user?.name || 'AETHER USER'}
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => setOpenAddFunds(true)}
                                        sx={{
                                            borderRadius: 8,
                                            px: 3,
                                            py: 1,
                                            bgcolor: 'rgba(212, 175, 55, 1)',
                                            color: '#000',
                                            fontWeight: 800,
                                            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
                                            '&:hover': { bgcolor: '#f1c40f', transform: 'translateY(-2px)' },
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Top Up
                                    </Button>
                                </Box>
                            </Paper>

                            {/* Wallet ID / QR */}
                            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, background: '#fff', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Receive Money</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                                    Scan to copy your wallet address instantly.
                                </Typography>
                                <Box sx={{
                                    p: 2,
                                    bgcolor: '#fff',
                                    display: 'inline-block',
                                    borderRadius: 3,
                                    border: '1px solid #f0f0f0',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                }}>
                                    <QRCode
                                        value={user?.email || 'unknown'}
                                        size={160}
                                        fgColor="#1a1a1a"
                                    />
                                </Box>
                                <Box sx={{ mt: 3, p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2, display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" color="textSecondary">ID:</Typography>
                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>{user?.email}</Typography>
                                </Box>
                            </Paper>
                        </Box>

                        {/* Recent Activity */}
                        <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Recent Activity
                                </Typography>
                                <Tooltip title="Refresh">
                                    <IconButton onClick={fetchWalletData}>
                                        <Refresh />
                                    </IconButton>
                                </Tooltip>
                            </Box>

                            <Paper elevation={0} sx={{ p: 0, bgcolor: 'transparent' }}>
                                {transactions.length === 0 ? (
                                    <Box sx={{ p: 4, textAlign: 'center', border: '1px dashed #ccc', borderRadius: 2 }}>
                                        <History sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                        <Typography color="textSecondary">No transactions yet</Typography>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {transactions.map((tx: any) => (
                                            <Paper key={tx._id} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box sx={{
                                                    p: 1.5,
                                                    borderRadius: '50%',
                                                    bgcolor: tx.type === 'deposit' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                                    color: tx.type === 'deposit' ? 'green' : 'red'
                                                }}>
                                                    {tx.type === 'deposit' ? <CallReceived /> : <CallMade />}
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        {tx.description}
                                                    </Typography>
                                                    <Typography variant="caption" color="textSecondary">
                                                        {new Date(tx.createdAt).toLocaleDateString()} • {new Date(tx.createdAt).toLocaleTimeString()}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: tx.type === 'deposit' ? 'green' : 'red',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {tx.type === 'deposit' ? '+' : '-'}{formatCurrency(tx.amount)}
                                                </Typography>
                                            </Paper>
                                        ))}
                                    </Box>
                                )}
                            </Paper>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Transfer Tab */}
            {tabValue === 1 && (
                <Container maxWidth="sm">
                    <Paper elevation={4} sx={{ p: 5, borderRadius: 4, mt: 2, background: 'linear-gradient(to bottom right, #ffffff, #f9f9f9)' }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box sx={{
                                display: 'inline-flex',
                                p: 2,
                                borderRadius: '50%',
                                bgcolor: 'rgba(212, 175, 55, 0.1)',
                                color: '#D4AF37',
                                mb: 2
                            }}>
                                <Send sx={{ fontSize: 40 }} />
                            </Box>
                            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ fontFamily: '"Playfair Display", serif' }}>
                                Send Money
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Instantly transfer funds to another user.
                            </Typography>
                        </Box>

                        <TextField
                            fullWidth
                            label="Recipient's Email Address"
                            placeholder="e.g. friend@example.com"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            sx={{ mb: 3 }}
                            InputProps={{
                                startAdornment: <Typography color="textSecondary" sx={{ mr: 1, color: '#D4AF37' }}>@</Typography>
                            }}
                            variant="outlined"
                        />

                        <TextField
                            fullWidth
                            label="Amount to Transfer"
                            type="number"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            sx={{ mb: 4 }}
                            InputProps={{
                                startAdornment: <Typography color="textSecondary" sx={{ mr: 1, color: '#D4AF37', fontWeight: 'bold' }}>$</Typography>
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleTransfer}
                            disabled={transferLoading}
                            sx={{
                                py: 1.8,
                                bgcolor: '#D4AF37',
                                color: 'black',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                '&:hover': { bgcolor: '#b8962e' },
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                            }}
                        >
                            {transferLoading ? <CircularProgress size={26} color="inherit" /> : 'Confirm Transfer'}
                        </Button>

                        <Alert severity="info" sx={{ mt: 4, borderRadius: 2, bgcolor: 'rgba(33, 150, 243, 0.05)', border: '1px solid rgba(33, 150, 243, 0.2)' }}>
                            Transactions are secure and instant. Please double-check the recipient's email.
                        </Alert>
                    </Paper>
                </Container>
            )}

            {/* Add Funds Dialog */}
            <Dialog open={openAddFunds} onClose={() => setOpenAddFunds(false)}>
                <DialogTitle>Add Virtual Funds</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Amount ($)"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={amountToAdd}
                        onChange={(e) => setAmountToAdd(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddFunds(false)}>Cancel</Button>
                    <Button onClick={handleAddFunds} variant="contained" color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Wallet;
