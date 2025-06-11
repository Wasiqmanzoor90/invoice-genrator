import { dbConnect } from "../../../../../lib/dbConnect";
import ClientUser from "../../../../../model/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existUser = await ClientUser.findOne({ email });
    if (existUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await ClientUser.create({
      username: name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, "secretKeyanyRandomString", {
      expiresIn: "48h",
    });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
        token,
      },
      { status: 201 }
    );

    response.headers.set(
      "Set-Cookie",
      `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${48 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
