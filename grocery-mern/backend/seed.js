// Run: node seed.js
// Seeds sample categories and products into MongoDB

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

const categories = [
  { name: 'Vegetables', slug: 'vegetables', description: 'Fresh farm vegetables' },
  { name: 'Fruits', slug: 'fruits', description: 'Sweet and fresh fruits' },
  { name: 'Dairy', slug: 'dairy', description: 'Milk, curd, paneer and more' },
  { name: 'Bakery', slug: 'bakery', description: 'Fresh baked goods' },
  { name: 'Beverages', slug: 'beverages', description: 'Juices, water, drinks' },
  { name: 'Snacks', slug: 'snacks', description: 'Chips, biscuits and more' },
  { name: 'Grains', slug: 'grains', description: 'Rice, wheat, pulses' },
  { name: 'Meat', slug: 'meat', description: 'Chicken, fish and more' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared old data');

    // Create categories
    const cats = await Category.insertMany(categories);
    console.log(`✅ Created ${cats.length} categories`);

    // Create admin user
    const existingAdmin = await User.findOne({ email: 'admin@freshmart.com' });
    if (!existingAdmin) {
      await User.create({ name: 'Admin User', email: 'admin@freshmart.com', password: 'admin123', role: 'admin' });
      console.log('✅ Admin created: admin@freshmart.com / admin123');
    }

    const vegCat = cats.find(c => c.slug === 'vegetables');
    const fruitCat = cats.find(c => c.slug === 'fruits');
    const dairyCat = cats.find(c => c.slug === 'dairy');
    const grainCat = cats.find(c => c.slug === 'grains');

    const products = [
      { name: 'Fresh Tomatoes', description: 'Ripe red tomatoes, perfect for cooking and salads.', price: 40, discountPrice: 35, category: vegCat._id, unit: 'kg', stock: 100, isFeatured: true, isActive: true, images: ["image-url"] },
      { name: 'Organic Onions', description: 'Farm-fresh organic onions. Great for all Indian dishes.', price: 30, category: vegCat._id, unit: 'kg', stock: 150, isFeatured: true, isActive: true,images: ["image-url"] },
      { name: 'Spinach', description: 'Fresh green spinach leaves, rich in iron and vitamins.', price: 25, category: vegCat._id, unit: 'bunch', stock: 60, isFeatured: true, isActive: true, images: ["image-url"] },
      { name: 'Carrots', description: 'Crunchy orange carrots, great for salads and cooking.', price: 35, discountPrice: 28, category: vegCat._id, unit: 'kg', stock: 80, isFeatured: true, isActive: true, images: ["image-url"] },
      { name: 'Alphonso Mangoes', description: 'Premium Alphonso mangoes from Ratnagiri. King of fruits!', price: 150, discountPrice: 120, category: fruitCat._id, unit: 'kg', stock: 50, isFeatured: true, isActive: true, images: ["image-url"] },
      { name: 'Bananas', description: 'Fresh ripe bananas, rich in potassium.', price: 40, category: fruitCat._id, unit: 'dozen', stock: 200, isFeatured: true, images: ["image-url"] },
      { name: 'Watermelon', description: 'Sweet juicy watermelon, perfect for summer.', price: 25, discountPrice: 20, category: fruitCat._id, unit: 'kg', stock: 30, isFeatured: true, isActive: true,images: ["image-url"] },
      { name: 'Fresh Milk', description: 'Farm-fresh pasteurized full-cream milk.', price: 60, category: dairyCat._id, unit: 'litre', stock: 100, isFeatured: false, isActive: true, images: ["image-url"] },
      { name: 'Paneer', description: 'Fresh homemade paneer, soft and delicious.', price: 80, discountPrice: 70, category: dairyCat._id, unit: 'kg', stock: 40, isFeatured: true, isActive: true, images: ["image-url"] },
      { name: 'Curd', description: 'Thick and creamy fresh curd.', price: 45, category: dairyCat._id, unit: 'kg', stock: 60, isFeatured: false, isActive: true, images: ["image-url"] },
      { name: 'Basmati Rice', description: 'Long-grain aged basmati rice. Perfect for biryani.', price: 120, discountPrice: 99, category: grainCat._id, unit: 'kg', stock: 200, isFeatured: true, isActive: true, images: ["image-url"] },
      { name: 'Toor Dal', description: 'Clean and sorted toor dal for everyday cooking.', price: 85, category: grainCat._id, unit: 'kg', stock: 150, isFeatured: true, isActive: true, images: ["image-url"] },
    ];

    const created = await Product.insertMany(products);

    console.log('🎉 Database seeded successfully');
    console.log('Admin Login: admin@freshmart.com / admin123');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    process.exit(1);
  }
}

seed();
