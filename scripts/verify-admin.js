#!/usr/bin/env node
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/appblog';

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, default: '', trim: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null },
  resetExpires: { type: Date, default: null },
}, { timestamps: true });

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const admin = await Admin.findOne({ username: 'AdminDashboard' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Available admins:');
      const allAdmins = await Admin.find({});
      allAdmins.forEach(a => {
        console.log(`  - Username: "${a.username}" (exact match required)`);
      });
      return 1;
    }

    console.log('✅ Admin user found!');
    console.log(`   Username: "${admin.username}"`);
    console.log(`   Email: ${admin.email || 'N/A'}`);
    console.log(`   Password hash exists: ${admin.password ? 'Yes' : 'No'}`);
    console.log(`   Password hash length: ${admin.password?.length || 0}`);
    
    // Test password
    const testPassword = 'Admin@1234';
    const isMatch = await bcrypt.compare(testPassword, admin.password);
    console.log(`\n🔐 Password test for "Admin@1234": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    
    if (!isMatch) {
      console.log('\n⚠️  Password does not match! Resetting password...');
      admin.password = testPassword;
      await admin.save();
      console.log('✅ Password reset successfully!');
    }
    
    return 0;
  } catch (err) {
    console.error('❌ Error:', err);
    return 1;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔚 MongoDB connection closed');
  }
}

main().then(code => process.exit(code));

