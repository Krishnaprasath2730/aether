import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Container, Paper, Card, CardContent, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Tab, Tabs,
    TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    InputAdornment, IconButton, Tooltip, Alert, Fade
} from '@mui/material';
import {
    Edit, Save, LocalOffer, TrendingDown, TrendingUp, History
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { products } from '../../data/products';
import { getAdminPrices, setAdminPrice } from '../../context/AutoPurchaseContext';

// Theme Colors
const GOLD = '#D5A249';

interface AdminTransaction {
    _id: string;
    createdAt: string;
    userId: { name: string; email: string };
    type: string;
    description: string;
    amount: number;
    status: string;
}

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    walletBalance: number;
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalTransactions: 0, totalFunds: 0 });
    const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [tabValue, setTabValue] = useState(0);

    // Price Management State
    const [adminPrices, setAdminPricesState] = useState<Record<string, number>>({});
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [editPrice, setEditPrice] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceFilter, setPriceFilter] = useState<'all' | 'modified'>('all');

    useEffect(() => {
        if (user && user.role !== 'admin') {
            toast.error('Access Denied: Admin only');
            navigate('/');
            return;
        }

        const fetchData = async () => {
            if (!token) return;
            try {
                const [statsData, txData, usersData] = await Promise.all([
                    apiService.getSystemStats(token),
                    apiService.getAllTransactions(token),
                    apiService.getAllUsers(token)
                ]);

                setStats(statsData);
                setTransactions(txData.transactions);
                setUsers(usersData.users as unknown as AdminUser[]);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                toast.error('Failed to load admin dashboard');
            }
        };

        fetchData();
        // Load admin prices
        setAdminPricesState(getAdminPrices());
    }, [token, user, navigate]);

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const getCurrentPrice = (productId: string, originalPrice: number) => {
        return adminPrices[productId] ?? originalPrice;
    };

    const handleSavePrice = (productId: string, productName: string, originalPrice: number) => {
        const newPrice = parseFloat(editPrice);
        if (isNaN(newPrice) || newPrice <= 0) {
            toast.error('Please enter a valid price');
            return;
        }

        const oldPrice = getCurrentPrice(productId, originalPrice);
        setAdminPrice(productId, newPrice, productName, oldPrice, user?.name || 'Admin');

        // Update local state
        setAdminPricesState(prev => ({ ...prev, [productId]: newPrice }));
        setEditingProductId(null);
        setEditPrice('');

        toast.success(`✅ Price updated for ${productName}: ${formatCurrency(oldPrice)} → ${formatCurrency(newPrice)}`);
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = priceFilter === 'all' ||
            (priceFilter === 'modified' && adminPrices[p.id] !== undefined);
        return matchesSearch && matchesFilter;
    });

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', mb: 4 }}>
                Admin Dashboard
            </Typography>

            {/* Stats Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 6 }}>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                    <Card sx={{ bgcolor: '#1a1a1a', color: 'white', height: '100%' }}>
                        <CardContent>
                            <Typography color="rgba(255,255,255,0.7)" gutterBottom>
                                Total Users
                            </Typography>
                            <Typography variant="h3">
                                {stats.totalUsers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                    <Card sx={{ bgcolor: '#1a1a1a', color: 'white', height: '100%' }}>
                        <CardContent>
                            <Typography color="rgba(255,255,255,0.7)" gutterBottom>
                                Total Transactions
                            </Typography>
                            <Typography variant="h3">
                                {stats.totalTransactions}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
                <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 16px)' } }}>
                    <Card sx={{ bgcolor: '#ffffff', color: 'black', border: '1px solid #e0e0e0', height: '100%' }}>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Total Funds in System
                            </Typography>
                            <Typography variant="h3" sx={{ color: '#D4AF37', fontWeight: 'bold' }}>
                                {formatCurrency(stats.totalFunds)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Tabs */}
            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} indicatorColor="primary" textColor="primary">
                    <Tab label="All Transactions" />
                    <Tab label="Users & Balances" />
                    <Tab label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LocalOffer sx={{ fontSize: 18 }} />
                            Price Management
                            {Object.keys(adminPrices).length > 0 && (
                                <Chip label={Object.keys(adminPrices).length} size="small" sx={{ bgcolor: GOLD, color: '#000', fontWeight: 700, height: 22, minWidth: 22 }} />
                            )}
                        </Box>
                    } />
                </Tabs>
            </Paper>

            {/* Transactions Table */}
            {tabValue === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell>Date</TableCell>
                                <TableCell>User</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((tx: any) => (
                                <TableRow key={tx._id}>
                                    <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight="bold">{tx.userId?.name || 'Unknown'}</Typography>
                                        <Typography variant="caption" color="textSecondary">{tx.userId?.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={tx.type} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{tx.description}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>
                                        {formatCurrency(tx.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={tx.status} size="small" color={tx.status === 'completed' ? 'success' : 'default'} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Users Table */}
            {tabValue === 1 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Wallet Balance</TableCell>
                                <TableCell>Joined Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((u: any) => (
                                <TableRow key={u._id}>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Chip label={u.role} color={u.role === 'admin' ? 'secondary' : 'default'} size="small" />
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: u.walletBalance > 0 ? 'green' : 'inherit' }}>
                                        {formatCurrency(u.walletBalance || 0)}
                                    </TableCell>
                                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Price Management Tab */}
            {tabValue === 2 && (
                <Fade in timeout={400}>
                    <Box>
                        <Alert
                            severity="info"
                            icon={<LocalOffer sx={{ color: GOLD }} />}
                            sx={{
                                mb: 3, borderRadius: 2, bgcolor: '#FFF9E6',
                                border: '1px solid rgba(213,162,73,0.3)',
                                '& .MuiAlert-icon': { color: GOLD }
                            }}
                        >
                            <Typography variant="body2" fontWeight={600}>
                                SmartAutoPay Price Management
                            </Typography>
                            <Typography variant="body2">
                                Change product prices here. When a price drops to a user's target, SmartAutoPay will automatically
                                deduct from their wallet and place the order. No random fluctuations — prices only change when you update them.
                            </Typography>
                        </Alert>

                        {/* Search & Filter */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                            <TextField
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                size="small"
                                sx={{
                                    flex: 1, minWidth: 250,
                                    '& .MuiOutlinedInput-root': { borderRadius: 2 }
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip
                                    label="All Products"
                                    onClick={() => setPriceFilter('all')}
                                    sx={{
                                        bgcolor: priceFilter === 'all' ? '#1a1a1a' : '#f5f5f5',
                                        color: priceFilter === 'all' ? '#fff' : '#000',
                                        fontWeight: 600, cursor: 'pointer',
                                        '&:hover': { bgcolor: priceFilter === 'all' ? '#333' : '#e0e0e0' }
                                    }}
                                />
                                <Chip
                                    label="Modified Prices"
                                    onClick={() => setPriceFilter('modified')}
                                    sx={{
                                        bgcolor: priceFilter === 'modified' ? '#1a1a1a' : '#f5f5f5',
                                        color: priceFilter === 'modified' ? '#fff' : '#000',
                                        fontWeight: 600, cursor: 'pointer',
                                        '&:hover': { bgcolor: priceFilter === 'modified' ? '#333' : '#e0e0e0' }
                                    }}
                                />
                            </Box>
                        </Box>

                        <TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#1a1a1a' }}>
                                        <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Product</TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Category</TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Original Price</TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Current Price</TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Change</TableCell>
                                        <TableCell sx={{ color: '#fff', fontWeight: 700 }} align="center">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProducts.map((product) => {
                                        const currentPrice = getCurrentPrice(product.id, product.price);
                                        const isModified = adminPrices[product.id] !== undefined;
                                        const priceChange = isModified
                                            ? ((currentPrice - product.price) / product.price * 100).toFixed(1)
                                            : null;
                                        const isEditing = editingProductId === product.id;

                                        return (
                                            <TableRow
                                                key={product.id}
                                                sx={{
                                                    '&:hover': { bgcolor: '#fafafa' },
                                                    bgcolor: isModified ? 'rgba(213,162,73,0.03)' : 'inherit'
                                                }}
                                            >
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Box sx={{
                                                            width: 45, height: 45, borderRadius: 1.5, overflow: 'hidden',
                                                            border: '1px solid #e0e0e0', flexShrink: 0
                                                        }}>
                                                            <img src={product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        </Box>
                                                        <Typography variant="body2" fontWeight={600}>{product.name}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={product.category} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        sx={{
                                                            color: isModified ? '#999' : '#000',
                                                            textDecoration: isModified ? 'line-through' : 'none'
                                                        }}
                                                    >
                                                        {formatCurrency(product.price)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {isEditing ? (
                                                        <TextField
                                                            autoFocus
                                                            size="small"
                                                            type="number"
                                                            value={editPrice}
                                                            onChange={(e) => setEditPrice(e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleSavePrice(product.id, product.name, product.price);
                                                                if (e.key === 'Escape') setEditingProductId(null);
                                                            }}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start"><Typography sx={{ color: GOLD, fontWeight: 700 }}>₹</Typography></InputAdornment>
                                                            }}
                                                            sx={{
                                                                width: 160,
                                                                '& .MuiOutlinedInput-root': {
                                                                    borderRadius: 1.5,
                                                                    '&.Mui-focused fieldset': { borderColor: GOLD }
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" fontWeight={700} sx={{ color: isModified ? GOLD : '#000' }}>
                                                            {formatCurrency(currentPrice)}
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {priceChange !== null && (
                                                        <Chip
                                                            size="small"
                                                            icon={parseFloat(priceChange) < 0 ? <TrendingDown sx={{ fontSize: 14 }} /> : <TrendingUp sx={{ fontSize: 14 }} />}
                                                            label={`${priceChange}%`}
                                                            sx={{
                                                                bgcolor: parseFloat(priceChange) < 0 ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                                                                color: parseFloat(priceChange) < 0 ? '#4CAF50' : '#F44336',
                                                                fontWeight: 600, fontSize: '0.75rem',
                                                                '& .MuiChip-icon': { color: parseFloat(priceChange) < 0 ? '#4CAF50' : '#F44336' }
                                                            }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {isEditing ? (
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                            <Tooltip title="Save">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => handleSavePrice(product.id, product.name, product.price)}
                                                                    sx={{ bgcolor: 'rgba(76,175,80,0.1)', '&:hover': { bgcolor: 'rgba(76,175,80,0.2)' } }}
                                                                >
                                                                    <Save sx={{ fontSize: 18, color: '#4CAF50' }} />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Cancel">
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => setEditingProductId(null)}
                                                                    sx={{ bgcolor: 'rgba(244,67,54,0.1)', '&:hover': { bgcolor: 'rgba(244,67,54,0.2)' } }}
                                                                >
                                                                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#F44336' }}>✕</Typography>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                    ) : (
                                                        <Tooltip title="Edit Price">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => {
                                                                    setEditingProductId(product.id);
                                                                    setEditPrice(currentPrice.toString());
                                                                }}
                                                                sx={{
                                                                    bgcolor: '#f5f5f5', '&:hover': { bgcolor: '#e0e0e0' }
                                                                }}
                                                            >
                                                                <Edit sx={{ fontSize: 18 }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Fade>
            )}
        </Container>
    );
};

export default AdminDashboard;
