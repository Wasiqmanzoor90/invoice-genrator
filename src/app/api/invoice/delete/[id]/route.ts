import { dbConnect } from "../../../../../../lib/dbConnect";
import invoice from "../../../../../../model/invoice";


export async function POST(req: Request,{params}:{params:{id: string}})
{
    try {
        await dbConnect();
        const { id } = params;
        const existuser = await invoice.findById(id);
        if(!existuser) {
            return new Response(JSON.stringify({ message: "Invoice not found" }), { status: 404 });
        }
        await invoice.findByIdAndDelete(id);
        return new Response(JSON.stringify({ message: "Invoice deleted successfully" }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Server error", error }), { status: 500 });
    }
}