#!/usr/bin/env node
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const TEST_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Provide it via environment variable.');
  process.exit(1);
}

if (!ADMIN_USERNAME) {
  console.error('ADMIN_USERNAME is not set. Provide it via environment variable.');
  process.exit(1);
}

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

    const admin = await Admin.findOne({ username: ADMIN_USERNAME });
    
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
    
    // Optional password test (no automatic reset)
    if (TEST_PASSWORD) {
      const isMatch = await bcrypt.compare(TEST_PASSWORD, admin.password);
      console.log(`\n🔐 Password test for provided ADMIN_PASSWORD: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
    } else {
      console.log('\nℹ️  ADMIN_PASSWORD not provided; skipping password verification.');
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

