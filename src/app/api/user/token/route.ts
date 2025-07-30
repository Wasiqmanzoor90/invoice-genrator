import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookiestore = await cookies();
    const token = cookiestore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token is missing", data: null },
        { status: 401 } //  Unauthorized
      );
    }

    // Verify the JWT token
    const verify = jwt.verify(token, "secretKeyanyRandomString");

    return NextResponse.json(
      { message: "Token is valid", data: verify },
      { status: 200 }
    );
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json(
      { message: "Invalid token", data: null },
      { status: 403 } //  Forbidden
    );
  }
}
