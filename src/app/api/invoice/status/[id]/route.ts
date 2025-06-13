import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../../lib/dbConnect";
import invoice from "../../../../../../model/invoice";


export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { status } = await req.json();
    try {
        await dbConnect();
        const updateInvoice = await invoice.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updateInvoice) {
            return NextResponse.json({ message: "Invoice not found" }, { status: 404 });
        }
        return NextResponse.json({ messgae: "Invoice Updated", invoice: updateInvoice }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ message: "Server error", error }, { status: 500 });
    }
}