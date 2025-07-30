import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import invoice from "../../../../model/invoice";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    console.log("Connected to database");

    // Get the token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized: No token" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, "secretKeyanyRandomString");
    const userId = decoded.userId;

    const invoiceData = await request.json();
    console.log("Received invoice data:", invoiceData);

    if (!invoiceData.company?.Name || !invoiceData.client?.Name) {
      return NextResponse.json({
        success: false,
        message: "Company name and client name are required"
      }, { status: 400 });
    }

    // ✅ Generate a random invoice number like "INV-238472"
    const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

    const newInvoice = new invoice({
      company: invoiceData.company,
      client: invoiceData.client,
      items: invoiceData.items || [],
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      taxRate: invoiceData.taxRate || invoiceData.tax || 0,
      notes: invoiceData.notes || "",
      userId: userId,
      invoiceNumber: invoiceNumber, // ✅ assign the generated number
    });

    const savedInvoice = await newInvoice.save();
    console.log("Invoice saved successfully:", savedInvoice);

    return NextResponse.json({
      success: true,
      data: savedInvoice,
      message: "Invoice created successfully"
    }, { status: 201 });

  } catch (error: any) {
    console.error("Error creating invoice:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json({
        success: false,
        message: "Validation error",
        error: error.message,
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: "Failed to create invoice",
      error: error.message
    }, { status: 500 });
  }
}
