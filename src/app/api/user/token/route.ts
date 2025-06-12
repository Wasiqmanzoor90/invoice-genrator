import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


export async function GET() {
    try {


        const cookiestore = await cookies();

        const token = cookiestore.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Token is not valid", data: {} });
        }
        // Verify the JWT token
        const verify = jwt.verify(token, "secretKeyanyRandomString");
        return NextResponse.json({ message: "Token is valid", data: verify });
    } catch (error) {
        console.log(error);
    }
}