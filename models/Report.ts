import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the Report document to ensure type safety
export interface IReport extends Document {
  issueType: string;
  description: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  photoUrl?: string | null;
  status: 'Reported' | 'In Progress' | 'Resolved' | 'Rejected';
  reportedAt: Date;
  lastUpdated: Date;
}

// Define the schema for a Report
const reportSchema: Schema<IReport> = new Schema({
  // Type of the issue being reported (e.g., Pothole, Broken Streetlight)
  issueType: {
    type: String,
    required: [true, 'Issue type is required.'], // Enforce presence of issue type
    trim: true // Remove whitespace from both ends of a string
  },
  // Detailed description of the issue
  description: {
    type: String,
    required: [true, 'Description is required.'], // Enforce presence of description
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters.'] // Limit description length
  },
  // Location of the reported issue, stored as a GeoJSON Point
  location: {
    type: {
      type: String, // Specifies the GeoJSON type, must be 'Point'
      enum: ['Point'], // Ensures that only 'Point' is accepted for this type
      required: [true, 'Location type is required and must be "Point".']
    },
    // Coordinates for the GeoJSON Point: [longitude, latitude]
    coordinates: {
      type: [Number], // Array of numbers: [longitude, latitude]
      required: [true, 'Coordinates are required.'],
      // Custom validator to ensure coordinates array has exactly two numbers
      validate: {
        validator: function(v: number[]) { // Corrected type to number[]
          return Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' && typeof v[1] === 'number';
        },
        message: (props: { value: any; }) => `${props.value} is not a valid coordinate pair (must be [longitude, latitude]).`
      }
    }
  },
  // URL to an optional photo of the issue
  photoUrl: {
    type: String,
    default: null // Default to null if no photo is provided
  },
  // Current status of the report
  status: {
    type: String,
    enum: ['Reported', 'In Progress', 'Resolved', 'Rejected'], // Allowed status values
    default: 'Reported' // Initial status when a report is created
  },
  // Timestamp when the report was created
  reportedAt: {
    type: Date,
    default: Date.now // Automatically set to the current date/time upon creation
  },
  // Timestamp when the report was last updated
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Create a 2dsphere index on the 'location' field
// This is crucial for performing efficient geospatial queries (e.g., $near, $geoWithin)
// MongoDB uses the WGS84 reference system for geospatial queries on GeoJSON objects with 2dsphere indexes.
reportSchema.index({ location: '2dsphere' });

// Create the Mongoose model from the schema
// We check if the model already exists to prevent Mongoose from recompiling it
// in development mode during hot reloads (common in Next.js).
const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', reportSchema);

export default Report;
