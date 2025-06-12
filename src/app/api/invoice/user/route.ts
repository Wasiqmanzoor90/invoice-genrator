import { cookies } from "next/headers";
import { dbConnect } from "../../../../../lib/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import invoice from "../../../../../model/invoice";

export async function GET()
{
    try {
        await dbConnect();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if(!token)
        {
            return NextResponse.json({message: "Token missing" }, { status: 401 });
        }
        const decoded: any = jwt.verify(token, "secretKeyanyRandomString");
        const userId = decoded.userId;
        const invoices = await invoice.find({userId}).lean();
        return NextResponse.json({ invoices });
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}