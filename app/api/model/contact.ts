import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
  firstName: { type: String, required: true },
  // Allow lastName to be optional because some contact forms submit a single full name
  lastName: { type: String, required: false, default: "" },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, default: "" },
    companyWebsite: { type: String, default: "" },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["new", "contacted", "resolved"], 
      default: "new" 
    },
  },
  { timestamps: true }
);

export const ContactModel =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);
