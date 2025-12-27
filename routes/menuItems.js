const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const upload = require('../middleware/upload');
const { verifyToken, requireAdmin } = require('../middleware/auth');

// GET all menu items with optional filtering
router.get('/', async (req, res) => {
    try {
        const { dietType, foodType, budgetFriendly, cuisine, available, search } = req.query;

        // Build query object
        let query = {};

        if (dietType) query.dietType = dietType;
        if (foodType) query.foodType = foodType;
        if (budgetFriendly !== undefined) query.budgetFriendly = budgetFriendly === 'true';
        if (cuisine) query.cuisine = cuisine;
        if (available !== undefined) query.available = available === 'true';

        // Add search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const menuItems = await MenuItem.find(query).sort({ createdAt: -1 });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu items', error: error.message });
    }
});

// GET single menu item by ID
router.get('/:id', async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching menu item', error: error.message });
    }
});

// POST create new menu item (admin only)
router.post('/', verifyToken, requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const menuItemData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            dietType: req.body.dietType,
            foodType: req.body.foodType,
            cuisine: req.body.cuisine,
            budgetFriendly: req.body.budgetFriendly === 'true',
            available: req.body.available === 'true'
        };

        // Add image path if file was uploaded
        if (req.file) {
            menuItemData.image = `/uploads/${req.file.filename}`;
        }

        const newMenuItem = new MenuItem(menuItemData);
        const savedMenuItem = await newMenuItem.save();
        res.status(201).json(savedMenuItem);
    } catch (error) {
        res.status(400).json({ message: 'Error creating menu item', error: error.message });
    }
});

// PUT update menu item (admin only)
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            dietType: req.body.dietType,
            foodType: req.body.foodType,
            cuisine: req.body.cuisine,
            budgetFriendly: req.body.budgetFriendly === 'true',
            available: req.body.available === 'true'
        };

        // Update image path if new file was uploaded
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json(updatedMenuItem);
    } catch (error) {
        res.status(400).json({ message: 'Error updating menu item', error: error.message });
    }
});

// DELETE menu item (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const deletedMenuItem = await MenuItem.findByIdAndDelete(req.params.id);

        if (!deletedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.json({ message: 'Menu item deleted successfully', item: deletedMenuItem });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting menu item', error: error.message });
    }
});

module.exports = router;
