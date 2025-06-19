import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import ClientUser from "../../../../../model/client";
import { dbConnect } from "../../../../../lib/dbConnect";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Define the options inside the same file (not exported)
const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }: { user: any }) {
      try {
        await dbConnect();

        let dbUser = await ClientUser.findOne({ email: user.email });

        if (!dbUser) {
          dbUser = await ClientUser.create({
            name: user.name,
            email: user.email,
            password: null,
          });
        }

        const jwtToken = Jwt.sign(
          {
            userId: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
          },
          "secretKeyanyRandomString",
          { expiresIn: "7d" }
        );

        const cookieStore = await cookies();
        cookieStore.set("token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
        });

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/invoice/main`;
    },
  },
};

// Create and export the NextAuth handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
