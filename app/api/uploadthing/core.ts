import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import dbConnect from "@/lib/dbConnect"; // Import your DB connection utility
import User from "@/models/User"; // Import your Mongoose User model
import { auth } from "@/auth";

const f = createUploadthing();

// Middleware to check if a session exists and return the user's ID and email
const withAuth = async () => {
  // Use getServerSession to get the session
  const session = await auth()

  if (!session?.user?.id || !session?.user?.email) {
    throw new UploadThingError("Unauthorized: No valid session found");
  }

  // Connect to the database to query the user
  await dbConnect();

  // Query database to confirm the user exists using your Mongoose User model
  // Assuming session.user.id corresponds to googleId or _id in your User model
  // If session.user.id is the MongoDB _id, use findById. If it's googleId, use findOne({ googleId: ... })
  const user = await User.findOne({ email: session.user.email }).select('id email'); // Fetch user by email

  if (!user) {
    throw new UploadThingError("Unauthorized: User not found in database");
  }

  // Return metadata for the upload
  return { userId: user.id.toString(), userEmail: user.email }; // Ensure userId is a string
};

export const ourFileRouter: FileRouter = {
  // This route is for general user uploads (e.g., profile pictures, report photos)
  problemUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async () => {
      const { userId, userEmail } = await withAuth(); // Authenticate and get user info
      console.log("User authenticated for upload:", userId, userEmail);
      // Return metadata for the upload
      return { userId, userEmail };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for user ID:", metadata.userId);
      console.log("User Email:", metadata.userEmail);
      console.log("File URL:", file.ufsUrl); // Use file.url as it's the public URL

      // You might want to save this file URL to the user's profile or a specific report
      // For example, if it's a profile picture:
      // await User.findByIdAndUpdate(metadata.userId, { image: file.url });

      return {
        uploadedBy: metadata.userId,
        url: file.ufsUrl,
        name: file.name,
        key: file.key,
      };
    }),

} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
