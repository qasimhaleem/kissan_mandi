const path = require('path');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const { Product } = require('./models/Product');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

async function runTest() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected successfully.');

  try {
    // 1. Create or find verified test farmer
    const phone = '03009998877';
    let farmer = await User.findOne({ phone });
    if (!farmer) {
      farmer = await User.create({
        name: 'Mardan Farmer Khan',
        phone,
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'farmer',
        district: 'Mardan',
        status: 'active',
        isVerified: true,
        farmerProfile: {
          farmSizeAcres: 25,
          primaryCrops: ['Tomatoes', 'Wheat', 'Sugarcane'],
          experienceYears: 12,
          farmAddress: 'Village Gujar Garhi, Mardan',
          cnic: '16101-1234567-1',
        },
      });
      console.log('Created test farmer:', farmer.name);
    } else {
      farmer.farmerProfile = {
        farmSizeAcres: 25,
        primaryCrops: ['Tomatoes', 'Wheat', 'Sugarcane'],
        experienceYears: 12,
        farmAddress: 'Village Gujar Garhi, Mardan',
        cnic: '16101-1234567-1',
      };
      await farmer.save();
      console.log('Updated existing test farmer profile.');
    }

    // 2. Clean previous test products
    await Product.deleteMany({ farmer: farmer._id, title: 'Fresh Mardan Tomatoes' });

    // 3. Create product listing
    const product = await Product.create({
      title: 'Fresh Mardan Tomatoes',
      farmer: farmer._id,
      category: 'Vegetables',
      description: 'Grade A fresh farm tomatoes, directly harvested and sorted.',
      price: 120,
      unit: 'KG',
      quantity: 2000,
      minOrder: 100,
      location: {
        district: 'Mardan',
        address: 'Gujar Garhi loading point',
        type: 'Point',
        coordinates: [72.0404, 34.1989],
      },
      images: [
        'https://res.cloudinary.com/djtvxlmdu/image/upload/v1/sample1.jpg',
        'https://res.cloudinary.com/djtvxlmdu/image/upload/v1/sample2.jpg',
      ],
      status: 'active',
    });
    console.log('Product created:', product.title, 'Slug:', product.slug);

    // 4. Verify analytics
    const myProducts = await Product.find({ farmer: farmer._id });
    const totalInventory = myProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalValue = myProducts.reduce((sum, p) => sum + (p.price * p.quantity || 0), 0);

    console.log('Analytics Check:');
    console.log(' - Total listings:', myProducts.length);
    console.log(' - Total inventory (KG):', totalInventory);
    console.log(' - Total portfolio value (PKR):', totalValue);

    if (totalInventory < 2000 || totalValue < 240000) {
      throw new Error('Analytics calculation incorrect');
    }

    // 5. Query public marketplace
    const foundByCat = await Product.find({ status: 'active', category: 'Vegetables' });
    const foundByDist = await Product.find({ status: 'active', 'location.district': 'Mardan' });
    const foundByPrice = await Product.find({ status: 'active', price: { $gte: 100, $lte: 150 } });

    console.log('Marketplace Category filter count:', foundByCat.length);
    console.log('Marketplace District filter count:', foundByDist.length);
    console.log('Marketplace Price filter count:', foundByPrice.length);

    if (foundByCat.length === 0 || foundByDist.length === 0 || foundByPrice.length === 0) {
      throw new Error('Marketplace filtering failed');
    }

    // 6. Test product inquiry simulation
    product.inquiriesCount = (product.inquiriesCount || 0) + 1;
    await product.save();
    console.log('Inquiry count successfully incremented to:', product.inquiriesCount);

    // 7. Test status toggle (Pause -> Reactivate)
    product.status = 'paused';
    await product.save();

    const activeCheck = await Product.find({ _id: product._id, status: 'active' });
    if (activeCheck.length !== 0) {
      throw new Error('Paused product should not be returned in active queries');
    }
    console.log('Paused status verified: hidden from active marketplace.');

    product.status = 'active';
    await product.save();
    console.log('Reactivated product successfully.');

    console.log('\nALL PHASE 4 & PHASE 5 BACKEND VERIFICATIONS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('Test error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
}

runTest();
