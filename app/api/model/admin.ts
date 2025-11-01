// models/admin.ts
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, default: "" },
  password: { type: String, required: true },
  resetToken: { type: String, default: null },
  resetExpires: { type: Date, default: null },
}, { timestamps: true });

// Hash password before save
adminSchema.pre("save", async function (next: any) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
adminSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);
export default Admin;
