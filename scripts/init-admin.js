#!/usr/bin/env node
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 1) Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/appblog';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const RESET_PASSWORD = (process.env.ADMIN_RESET_PASSWORD || 'false').toLowerCase() === 'true';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set. Provide it via environment variable.');
  process.exit(1);
}

// 2) Minimal Admin schema (matches app/api/model/admin.ts)
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, default: '', trim: true },
  password: { type: String, required: true },
  resetToken: { type: String, default: null },
  resetExpires: { type: Date, default: null },
}, { timestamps: true });

AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Ensure indexes are built (unique username/email)
    await Admin.init();

    const existing = await Admin.findOne({ username: ADMIN_USERNAME });

    if (existing && !RESET_PASSWORD) {
      console.log('ℹAdmin user already exists. Skipping.');
      console.log(`Username: ${existing.username}`);
      console.log('To reset the password, run with ADMIN_RESET_PASSWORD=true');
      return 0;
    }

    if (existing && RESET_PASSWORD) {
      existing.password = ADMIN_PASSWORD;
      existing.email = existing.email || ADMIN_EMAIL;
      await existing.save();
      console.log('🔐 Admin password reset successfully');
      return 0;
    }

    const admin = new Admin({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      email: ADMIN_EMAIL,
    });
    await admin.save();
    console.log('🎉 Admin user created successfully');
    console.log(`   Username: ${ADMIN_USERNAME}`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    return 0;
  } catch (err) {
    if (err?.code === 11000) {
      console.error('⚠️  Duplicate key error (username/email unique). User likely exists.');
      return 0;
    }
    console.error('❌ Error seeding admin:', err);
    return 1;
  } finally {
    await mongoose.connection.close();
    console.log('🔚 MongoDB connection closed');
  }
}

main().then(code => process.exit(code));