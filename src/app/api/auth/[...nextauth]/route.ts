import GitHubProvider from "next-auth/providers/github";
import ClientUser from "../../../../../model/client"; // Your MongoDB user model
import { dbConnect } from "../../../../../lib/dbConnect"; // MongoDB connection
import Jwt from "jsonwebtoken"; // For custom JWT
import { cookies } from "next/headers"; // To store cookie
import NextAuth from "next-auth";

// Define your NextAuth options
export const AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || '', // GitHub App Client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '', // GitHub App Secret
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Secret for session encryption

  callbacks: {
    // Called after successful sign-in
    async signIn({ user }: { user: any }) {
      try {
        await dbConnect();

        // Check if user already exists in MongoDB
        let dbUser = await ClientUser.findOne({ email: user.email });

        // If not, create a new user
        if (!dbUser) {
          dbUser = await ClientUser.create({
            name: user.name,
            email: user.email,
            password: null, // Password is null for OAuth users
          });
        }

        // Create custom JWT containing user info
        const jwtToken = Jwt.sign(
          {
            userId: dbUser._id.toString(),
            email: dbUser.email,
            name: dbUser.name,
          },
          "secretKeyanyRandomString", // Secret key (same one used to decode)
          { expiresIn: "7d" }
        );

        // Store JWT in an HTTP-only cookie
        const cookieStore = await cookies();
        cookieStore.set("token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        return true; // Allow sign-in
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false; // Deny sign-in
      }
    },

    // After login, redirect to /invoice/main
    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/invoice/main`;
    },
  },
};

// Export the NextAuth handler
const handler = NextAuth(AuthOptions);
export { handler as GET, handler as POST };
