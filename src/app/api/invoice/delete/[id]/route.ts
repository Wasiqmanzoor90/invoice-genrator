import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/dbConnect";
import invoice from "../../../../../../model/invoice";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = params;

    const existuser = await invoice.findById(id);
    if (!existuser) {
      return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
    }

    await invoice.findByIdAndDelete(id);
    return NextResponse.json({ message: "Invoice deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error }, { status: 500 });
  }
}
