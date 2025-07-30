import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/dbConnect";
import invoice from "../../../../../../model/invoice";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Await the params in Next.js 15+
    const { id } = await params;

    const existingInvoice = await invoice.findById(id);
    if (!existingInvoice) {
      return NextResponse.json(
        { message: "Invoice not found" }, 
        { status: 404 }
      );
    }

    await invoice.findByIdAndDelete(id);
    
    return NextResponse.json(
      { message: "Invoice deleted successfully" }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete invoice error:", error);
    
    return NextResponse.json(
      { 
        message: "Server error", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }, 
      { status: 500 }
    );
  }
}