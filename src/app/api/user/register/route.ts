import { dbConnect } from "../../../../../lib/dbConnect";
import ClientUser from "../../../../../model/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest)
{
try {
    await dbConnect();
    const body = await req.json();
    const {name, email, password} = body;
    if(!name|| !email ||!password)
    {
        return NextResponse.json({message:"All fields are required"}, {status:400});
    };

    const existUser = await ClientUser.findOne({email});
    if(!existUser)
    {
        return NextResponse.json({message:"User Already Exist"}, {status:400});
    }

    const newUser = new ClientUser({name, email, password});
    await newUser.save();
    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
} catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
}
}