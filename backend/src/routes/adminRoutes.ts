import express from 'express';
import * as adminController from '../controllers/adminController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware, adminMiddleware);

// Get all transactions
router.get('/transactions', adminController.getAllTransactions);

// Get system stats
router.get('/stats', adminController.getSystemStats);

export default router;
