import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "../../../../../lib/dbConnect";
import ClientUser from "../../../../../model/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: "All Fields are required" }, { status: 400 });
    }

    // ❌ BUG: This should be { email }, not just email
    const existUser = await ClientUser.findOne({ email });

    if (!existUser) {
      return NextResponse.json({ message: "User does not exist" }, { status: 404 });
    }

    const passCheck = await bcrypt.compare(password, existUser.password);
    if (!passCheck) {
      return NextResponse.json({ message: "Invalid Password" }, { status: 401 });
    }

    // ✅ Create token
    const userId = existUser._id;
    const token = jwt.sign({ userId }, "secretKeyanyRandomString", {
      expiresIn: "48h",
    });

    const expire = new Date(Date.now() + 48 * 60 * 60 * 1000).toUTCString();

    return new Response(
      JSON.stringify({
        message: "User Login Successfully!",
        token,
        user: {
          _id: existUser._id,
          username: existUser.username,
          email: existUser.email,
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Set-Cookie": `token=${token}; HttpOnly; Path=/; SameSite=Strict; Expires=${expire}`,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server Error! Please try again later." }, { status: 500 });
  }
}
