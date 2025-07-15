import mongoose, { Schema } from "mongoose";

// Define the schema for a User
const userSchema = new Schema({
  // Unique identifier provided by Google for the user
  // This is crucial for linking the Auth.js session to your database user.
  googleId: {
    type: String,
    required: [true, 'Google ID is required.'],
    unique: true, // Ensures each Google ID is unique in the collection
    index: true // Create an index for faster lookups by Google ID
  },
  // User's full name from Google profile
  name: {
    type: String,
    required: [true, 'User name is required.'],
    trim: true // Remove whitespace from both ends of the string
  },
  // User's email address from Google profile
  // This is used by the Uploadthing middleware to find the user.
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true, // Ensures each email is unique across all users
    trim: true,
    lowercase: true, // Store emails in lowercase for case-insensitive lookups
    match: [/.+@.+\..+/, 'Please enter a valid email address.'] // Basic email format validation
  },
  // URL to the user's profile picture from Google (optional)
  image: {
    type: String,
    default: null // Can be null if no image is provided by Google or user
  },
  // Timestamp when the user account was created
  createdAt: {
    type: Date,
    default: Date.now // Automatically set to the current date/time upon creation
  },
  // Timestamp when the user account was last updated
  updatedAt: {
    type: Date,
    default: Date.now // Automatically set to the current date/time upon creation/update
  }
});

// Mongoose pre-save middleware to update the 'updatedAt' field
// This ensures that the 'updatedAt' timestamp is always current when a document is saved.
userSchema.pre('save', function(next) {
  this.updatedAt = new Date(); // Correctly update the 'updatedAt' field
  next();
});

// Create the Mongoose model from the schema
// We check if the model already exists to prevent Mongoose from recompiling it
// in development mode during hot reloads (common in Next.js).
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
