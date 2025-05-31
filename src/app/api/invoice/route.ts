import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/dbConnect";
import invoice from "../../../../model/invoice";

export async function POST(request: NextRequest) {
  try {
    // Make sure to await the database connection
    await dbConnect();
    console.log("Connected to database");
    
    const invoiceData = await request.json();
    console.log('Received invoice data:', invoiceData);
    
    // Validate required fields
    if (!invoiceData.company?.Name || !invoiceData.client?.Name) {
      return NextResponse.json({
        success: false,
        message: 'Company name and client name are required'
      }, { status: 400 });
    }
    
    // Create new invoice with proper data structure
    const newInvoice = new invoice({
      company: invoiceData.company,
      client: invoiceData.client,
      items: invoiceData.items || [],
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      taxRate: invoiceData.taxRate || invoiceData.tax || 0, // Handle both taxRate and tax
      notes: invoiceData.notes || ""
    });
    
    const savedInvoice = await newInvoice.save();
    console.log('Invoice saved successfully:', savedInvoice);
    
    return NextResponse.json({
      success: true,
      data: savedInvoice,
      message: 'Invoice created successfully'
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    
    // More detailed error handling
    if (error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        error: error.message,
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    }, { status: 500 });
  }
}