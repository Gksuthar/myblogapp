import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ContactModel } from "../model/contact";

// GET - Fetch all contacts (for admin)
export async function GET() {
  try {
    await connectDB();
    const contacts = await ContactModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ data: contacts, count: contacts.length });
  } catch (error) {
    console.error("GET Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

// POST - Create new contact
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      companyWebsite,
      message,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new contact
    const newContact = await ContactModel.create({
      firstName,
      lastName,
      email,
      phone,
      companyName: companyName || "",
      companyWebsite: companyWebsite || "",
      message,
      status: "new",
    });

    return NextResponse.json(
      {
        message: "Contact form submitted successfully",
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

// PATCH - Update contact status (for admin)
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const updatedContact = await ContactModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedContact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Contact status updated",
      data: updatedContact,
    });
  } catch (error) {
    console.error("PATCH Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

// DELETE - Delete contact (for admin)
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedContact = await ContactModel.findByIdAndDelete(id);

    if (!deletedContact) {
      return NextResponse.json(
        { error: "Contact not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Contact Error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
