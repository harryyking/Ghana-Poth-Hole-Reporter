// app/api/reports/route.ts (Conceptual - requires file parsing setup)
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Report from '../../../models/Report';

// Disable bodyParser for this route if you're handling multipart/form-data manually

export async function POST(request: Request) {
  await dbConnect();

  try {
   

    // If you ARE handling file upload on the server:
    // You'd get these from the parsed form data
    const formData = await request.formData(); // Next.js 13+ provides this
    const issueType = formData.get('issueType') as string;
    const description = formData.get('description') as string;
    const longitude = parseFloat(formData.get('longitude') as string);
    const latitude = parseFloat(formData.get('latitude') as string);
    const photo = formData.get('photo') as File | null; // This is the actual File object

    let photoUrl: string | null = null;
    if (photo) {

      console.log(`Received file: ${photo.name}, type: ${photo.type}, size: ${photo.size}`);
      // In a real app: photoUrl = await uploadFileToCloudStorage(photo);
      // For now, setting a placeholder if a file was provided:
      photoUrl = `https://example.com/uploads/${Date.now()}-${photo.name}`;
    }

    // Construct the GeoJSON Point object
    const location = {
      type: 'Point',
      coordinates: [longitude, latitude], // Ensure they are numbers
    };

    // Basic validation (more robust validation should be done here)
    if (!issueType || !description || isNaN(longitude) || isNaN(latitude)) {
      return NextResponse.json({ message: 'Missing required fields or invalid location data.' }, { status: 400 });
    }

    const newReport = new Report({
      issueType,
      description,
      location,
      photoUrl,
    });

    await newReport.save();

    return NextResponse.json({ message: 'Report submitted successfully!', report: newReport }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting report:', error);
    return NextResponse.json({ message: 'Failed to submit report', error: error.message }, { status: 500 });
  }
}

// GET /api/reports (remains largely the same)
export async function GET(request: Request) {
  await dbConnect();

  try {
    const reports = await Report.find({});

    const geoJsonFeatures = reports.map(report => ({
        type: 'Feature',
        geometry: report.location,
        properties: {
            issueType: report.issueType,
            description: report.description,
            status: report.status,
            photoUrl: report.photoUrl,
            reportedAt: report.reportedAt.toISOString(),
            lastUpdated: report.lastUpdated.toISOString()
        }
    }));

    return NextResponse.json({
        type: 'FeatureCollection',
        features: geoJsonFeatures
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ message: 'Failed to fetch reports', error: error.message }, { status: 500 });
  }
}