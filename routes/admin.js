const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// Apply authentication to all admin routes
router.use(verifyToken);
router.use(requireAdmin);

// GET all users (admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// UPDATE user role (admin only)
router.put('/users/:id/role', async (req, res) => {
    try {
        const { role } = req.body;

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be "admin" or "user"' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
});

// DELETE user (admin only)
router.delete('/users/:id', async (req, res) => {
    try {
        // Prevent deleting yourself
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// GET dashboard statistics (admin only)
router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalItems = await MenuItem.countDocuments();
        const vegItems = await MenuItem.countDocuments({ dietType: 'Veg' });
        const nonVegItems = await MenuItem.countDocuments({ dietType: 'Non-Veg' });
        const budgetFriendlyItems = await MenuItem.countDocuments({ budgetFriendly: true });
        const premiumItems = await MenuItem.countDocuments({ budgetFriendly: false });
        const availableItems = await MenuItem.countDocuments({ available: true });
        const unavailableItems = await MenuItem.countDocuments({ available: false });

        // Get counts by food type
        const foodTypeCounts = await MenuItem.aggregate([
            { $group: { _id: '$foodType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // Get counts by cuisine
        const cuisineCounts = await MenuItem.aggregate([
            { $group: { _id: '$cuisine', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            users: {
                total: totalUsers
            },
            menuItems: {
                total: totalItems,
                veg: vegItems,
                nonVeg: nonVegItems,
                budgetFriendly: budgetFriendlyItems,
                premium: premiumItems,
                available: availableItems,
                unavailable: unavailableItems
            },
            foodTypes: foodTypeCounts,
            cuisines: cuisineCounts
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
});

module.exports = router;
