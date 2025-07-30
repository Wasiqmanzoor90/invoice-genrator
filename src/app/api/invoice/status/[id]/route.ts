import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/dbConnect";
import invoice from "../../../../../../model/invoice";

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // CHANGE 1: Added Promise<> type
) {
  try {
    await dbConnect();
    
    const { id } = await params; // CHANGE 2: Added await before params
    const { status } = await req.json();
    
    const updateInvoice = await invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updateInvoice) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { 
        message: "Invoice Updated", // CHANGE 3: Fixed typo "messgae" -> "message"
        invoice: updateInvoice 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Update invoice status error:", error); // CHANGE 4: Added error logging
    
    return NextResponse.json(
      { 
        message: "Server error", 
        error: error instanceof Error ? error.message : "Unknown error" // CHANGE 5: Better error handling
      }, 
      { status: 500 }
    );
  }
}