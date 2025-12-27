const mongoose = require('mongoose');
require('dotenv').config();

const MenuItem = require('./models/MenuItem');

// Sample dishes with images
const sampleDishes = [
    {
        name: 'Butter Chicken',
        description: 'Tender chicken pieces in rich creamy tomato gravy with aromatic spices',
        price: 325,
        dietType: 'Non-Veg',
        foodType: 'Main Course',
        cuisine: 'Indian',
        budgetFriendly: false,
        available: true,
        image: '/uploads/butter_chicken_1766813070392.png'
    },
    {
        name: 'Paneer Tikka',
        description: 'Marinated cottage cheese grilled to perfection with bell peppers and onions',
        price: 180,
        dietType: 'Veg',
        foodType: 'Appetizer',
        cuisine: 'Indian',
        budgetFriendly: true,
        available: true,
        image: '/uploads/paneer_tikka_1766813087235.png'
    },
    {
        name: 'Chicken Biryani',
        description: 'Fragrant basmati rice layered with spiced chicken and aromatic herbs',
        price: 280,
        dietType: 'Non-Veg',
        foodType: 'Main Course',
        cuisine: 'Indian',
        budgetFriendly: false,
        available: true,
        image: '/uploads/chicken_biryani_1766813105102.png'
    },
    {
        name: 'Dal Makhani',
        description: 'Creamy black lentils slow-cooked with butter and cream',
        price: 150,
        dietType: 'Veg',
        foodType: 'Main Course',
        cuisine: 'Indian',
        budgetFriendly: true,
        available: true,
        image: '/uploads/dal_makhani_1766813122030.png'
    },
    {
        name: 'Chicken Manchurian',
        description: 'Crispy chicken balls tossed in spicy Indo-Chinese sauce',
        price: 220,
        dietType: 'Non-Veg',
        foodType: 'Appetizer',
        cuisine: 'Chinese',
        budgetFriendly: true,
        available: true,
        image: '/uploads/chicken_manchurian_1766813140619.png'
    },
    {
        name: 'Veg Hakka Noodles',
        description: 'Stir-fried noodles with fresh vegetables and soy sauce',
        price: 140,
        dietType: 'Veg',
        foodType: 'Main Course',
        cuisine: 'Chinese',
        budgetFriendly: true,
        available: true,
        image: '/uploads/hakka_noodles_1766813157550.png'
    },
    {
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with fresh mozzarella, basil, and tomato sauce',
        price: 250,
        dietType: 'Veg',
        foodType: 'Main Course',
        cuisine: 'Italian',
        budgetFriendly: false,
        available: true
    },
    {
        name: 'Chicken Alfredo Pasta',
        description: 'Creamy fettuccine pasta with grilled chicken in white sauce',
        price: 295,
        dietType: 'Non-Veg',
        foodType: 'Main Course',
        cuisine: 'Italian',
        budgetFriendly: false,
        available: true
    },
    {
        name: 'Spring Rolls',
        description: 'Crispy vegetable rolls served with sweet chili sauce',
        price: 120,
        dietType: 'Veg',
        foodType: 'Appetizer',
        cuisine: 'Chinese',
        budgetFriendly: true,
        available: true
    },
    {
        name: 'Fish Tikka',
        description: 'Marinated fish pieces grilled with Indian spices',
        price: 350,
        dietType: 'Non-Veg',
        foodType: 'Appetizer',
        cuisine: 'Indian',
        budgetFriendly: false,
        available: true
    },
    {
        name: 'Gulab Jamun',
        description: 'Soft milk dumplings soaked in rose-scented sugar syrup',
        price: 80,
        dietType: 'Veg',
        foodType: 'Dessert',
        cuisine: 'Indian',
        budgetFriendly: true,
        available: true
    },
    {
        name: 'Chocolate Brownie',
        description: 'Rich chocolate brownie with vanilla ice cream',
        price: 120,
        dietType: 'Veg',
        foodType: 'Dessert',
        cuisine: 'Continental',
        budgetFriendly: true,
        available: true
    },
    {
        name: 'Mango Lassi',
        description: 'Refreshing yogurt drink blended with ripe mangoes',
        price: 90,
        dietType: 'Veg',
        foodType: 'Beverage',
        cuisine: 'Indian',
        budgetFriendly: true,
        available: true
    },
    {
        name: 'Fresh Lime Soda',
        description: 'Sparkling water with fresh lime and a hint of salt or sugar',
        price: 60,
        dietType: 'Veg',
        foodType: 'Beverage',
        cuisine: 'Other',
        budgetFriendly: true,
        available: true
    },
    {
        name: 'Tandoori Chicken',
        description: 'Chicken marinated in yogurt and spices, cooked in tandoor',
        price: 380,
        dietType: 'Non-Veg',
        foodType: 'Main Course',
        cuisine: 'Indian',
        budgetFriendly: false,
        available: true
    },
    {
        name: 'Masala Dosa',
        description: 'Crispy rice crepe filled with spiced potato filling',
        price: 100,
        dietType: 'Veg',
        foodType: 'Main Course',
        cuisine: 'Indian',
        budgetFriendly: true,
        available: true
    },
    {
        name: 'Pad Thai',
        description: 'Stir-fried rice noodles with vegetables, peanuts, and tamarind sauce',
        price: 240,
        dietType: 'Veg',
        foodType: 'Main Course',
        cuisine: 'Thai',
        budgetFriendly: false,
        available: true
    },
    {
        name: 'Chicken Tacos',
        description: 'Soft tortillas filled with seasoned chicken, salsa, and guacamole',
        price: 270,
        dietType: 'Non-Veg',
        foodType: 'Main Course',
        cuisine: 'Mexican',
        budgetFriendly: false,
        available: true
    },
    {
        name: 'Tiramisu',
        description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
        price: 180,
        dietType: 'Veg',
        foodType: 'Dessert',
        cuisine: 'Italian',
        budgetFriendly: false,
        available: true
    },
    {
        name: 'Green Tea',
        description: 'Premium Japanese green tea, hot or iced',
        price: 70,
        dietType: 'Veg',
        foodType: 'Beverage',
        cuisine: 'Japanese',
        budgetFriendly: true,
        available: true
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        console.log('🔍 Checking for existing dishes and updating with images...');

        let addedCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;

        for (const dish of sampleDishes) {
            const existing = await MenuItem.findOne({ name: dish.name });

            if (!existing) {
                // Add new dish
                await MenuItem.create(dish);
                addedCount++;
                console.log(`✨ Added: ${dish.name}${dish.image ? ' (with image)' : ''}`);
            } else if (dish.image && !existing.image) {
                // Update existing dish with image
                existing.image = dish.image;
                await existing.save();
                updatedCount++;
                console.log(`🖼️  Updated with image: ${dish.name}`);
            } else {
                skippedCount++;
                console.log(`⏭️  Already complete: ${dish.name}`);
            }
        }

        const totalCount = await MenuItem.countDocuments();
        const withImages = await MenuItem.countDocuments({ image: { $ne: null } });

        console.log('\n📊 Summary:');
        console.log(`✨ ${addedCount} new dishes added`);
        console.log(`🖼️  ${updatedCount} dishes updated with images`);
        console.log(`⏭️  ${skippedCount} dishes unchanged`);
        console.log(`📋 Total dishes in database: ${totalCount}`);
        console.log(`🖼️  Dishes with images: ${withImages}`);

        mongoose.connection.close();
        console.log('\n✅ Seed completed successfully!');
    })
    .catch((err) => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
