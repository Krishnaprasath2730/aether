import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tab, Tabs } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

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
    }, [token, user, navigate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 6 }}>
            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', mb: 4 }}>
                Admin Dashboard
            </Typography>

            {/* Stats Cards */}
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
        </Container>
    );
};

export default AdminDashboard;
