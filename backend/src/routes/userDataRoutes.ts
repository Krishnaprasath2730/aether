import express, { Request, Response } from 'express';
import UserCart from '../models/UserCart';
import UserWishlist from '../models/UserWishlist';
import User from '../models/User';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// ==================== CART ROUTES ====================

// Get user's cart
router.get('/cart', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const cart = await UserCart.findOne({ userId: req.userId });

        res.status(200).json({
            items: cart?.items || [],
        });
    } catch (error: any) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Server error retrieving cart', error: error.message });
    }
});

// Save/Update user's cart
router.post('/cart', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { items } = req.body;

        let cart = await UserCart.findOne({ userId: req.userId });

        if (cart) {
            cart.items = items;
            await cart.save();
        } else {
            cart = await UserCart.create({
                userId: req.userId,
                items,
            });
        }

        res.status(200).json({
            message: 'Cart saved successfully',
            items: cart.items,
        });
    } catch (error: any) {
        console.error('Save cart error:', error);
        res.status(500).json({ message: 'Server error saving cart', error: error.message });
    }
});

// Clear user's cart
router.delete('/cart', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await UserCart.findOneAndUpdate(
            { userId: req.userId },
            { items: [] },
            { upsert: true }
        );

        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error: any) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Server error clearing cart', error: error.message });
    }
});

// ==================== WISHLIST ROUTES ====================

// Get user's wishlist
router.get('/wishlist', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const wishlist = await UserWishlist.findOne({ userId: req.userId });

        res.status(200).json({
            items: wishlist?.items || [],
        });
    } catch (error: any) {
        console.error('Get wishlist error:', error);
        res.status(500).json({ message: 'Server error retrieving wishlist', error: error.message });
    }
});

// Save/Update user's wishlist
router.post('/wishlist', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { items } = req.body;

        let wishlist = await UserWishlist.findOne({ userId: req.userId });

        if (wishlist) {
            wishlist.items = items;
            await wishlist.save();
        } else {
            wishlist = await UserWishlist.create({
                userId: req.userId,
                items,
            });
        }

        res.status(200).json({
            message: 'Wishlist saved successfully',
            items: wishlist.items,
        });
    } catch (error: any) {
        console.error('Save wishlist error:', error);
        res.status(500).json({ message: 'Server error saving wishlist', error: error.message });
    }
});

// Clear user's wishlist
router.delete('/wishlist', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await UserWishlist.findOneAndUpdate(
            { userId: req.userId },
            { items: [] },
            { upsert: true }
        );

        res.status(200).json({ message: 'Wishlist cleared successfully' });
    } catch (error: any) {
        console.error('Clear wishlist error:', error);
        res.status(500).json({ message: 'Server error clearing wishlist', error: error.message });
    }
});

// ==================== PROFILE PHOTO ROUTES ====================

// Update profile photo
router.post('/profile-photo', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { profilePhoto } = req.body;

        if (!profilePhoto) {
            res.status(400).json({ message: 'Profile photo is required' });
            return;
        }

        console.log(`Updating profile photo for user: ${req.userId}`);

        const user = await User.findByIdAndUpdate(
            req.userId,
            { profilePhoto },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            message: 'Profile photo updated successfully',
            profilePhoto: user.profilePhoto,
        });
    } catch (error: any) {
        console.error('Update profile photo error:', error);
        res.status(500).json({ message: 'Server error updating profile photo', error: error.message });
    }
});

// Delete profile photo
router.delete('/profile-photo', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        console.log(`Deleting profile photo for user: ${req.userId}`);

        const user = await User.findByIdAndUpdate(
            req.userId,
            { profilePhoto: null },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Profile photo removed successfully' });
    } catch (error: any) {
        console.error('Delete profile photo error:', error);
        res.status(500).json({ message: 'Server error removing profile photo', error: error.message });
    }
});

export default router;

