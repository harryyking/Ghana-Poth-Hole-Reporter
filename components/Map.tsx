"use client"
import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import ReportDialog from './ReportForm'; // Import the ReportDialog component
import SignInDialog from './SignInDialog'; // Import the new SignInDialog component
import { useSession, signIn } from 'next-auth/react'; // Import useSession and signIn
import { Button } from "@/components/ui/button"; // Assuming you have this button component
import { LogIn } from "lucide-react"; // Icon for the sign-in button

// Define the type for the location object
interface Location {
    lng: number;
    lat: number;
}

const Map: React.FC = () => {
    // useRef hook to hold the map container DOM element
    const mapContainer = useRef<HTMLDivElement | null>(null);
    // useRef hook to hold the MapTiler Map instance
    const map = useRef<maptilersdk.Map | null>(null);

    // Get session status from NextAuth.js
    const { data: session, status } = useSession();
    const isAuthenticated = status === 'authenticated';

    // State to store the user's current location, initialized to null
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    // State to control the visibility of the report dialog
    const [isReportDialogOpen, setIsReportDialogOpen] = useState<boolean>(false);
    // State to control the visibility of the sign-in dialog
    const [isSignInDialogOpen, setIsSignInDialogOpen] = useState<boolean>(false);
    // State to store the location selected by the user for reporting
    const [selectedReportLocation, setSelectedReportLocation] = useState<Location | null>(null);

    // Define the central location for Ghana (Accra) as a fallback
    const defaultGhanaLocation: Location = { lng: -0.1989, lat: 5.5606 };
    // Define the initial zoom level for the map
    const zoom: number = 14;

    // Configure MapTiler SDK with your API key
    // Ensure NEXT_PUBLIC_MAPTILER_API_KEY is set in your .env.local file
    maptilersdk.config.apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY!;

    useEffect(() => {
        // Prevent map from initializing more than once
        if (map.current) return;

        // Ensure the map container DOM element is available
        if (!mapContainer.current) return;

        // Function to initialize and display the map
        const initializeMap = (centerLocation: Location) => {
            map.current = new maptilersdk.Map({
                container: mapContainer.current!, // The DOM element to render the map into
                style: maptilersdk.MapStyle.STREETS, // Use the default Streets style
                center: [centerLocation.lng, centerLocation.lat], // Set the map center
                zoom: zoom // Set the initial zoom level
            });

            // Add a marker to the map at the specified location
            const initialMarker = new maptilersdk.Marker({ color: "#FF0000" }) // Red color for the marker
                .setLngLat([centerLocation.lng, centerLocation.lat]) // Set marker coordinates
                .addTo(map.current); // Add the marker to the map instance

            // Create a popup and attach it to the marker
            const initialPopup = new maptilersdk.Popup({ offset: 25 })
                .setHTML("<h3>Your current location</h3><p>This is where you are!</p>");

            initialMarker.setPopup(initialPopup);

            // Open the popup automatically on page load
            initialPopup.addTo(map.current);

            // Add new GeoJSON source for reported issues
            // This source will fetch data from your backend API endpoint
            map.current.on('load', () => {
                map.current?.addSource('reported-issues', {
                    type: 'geojson',
                    data: '/api/reports' // This URL should point to your backend API endpoint
                                        // that serves the GeoJSON data of reported issues.
                                        // For development, you might use a local endpoint like http://localhost:3000/api/reports
                });

                // Add a layer to display the markers from the 'reported-issues' source
                map.current?.addLayer({
                    id: 'reported-issues-layer',
                    type: 'circle', // Display issues as circles (markers)
                    source: 'reported-issues',
                    paint: {
                        'circle-radius': 6,
                        'circle-color': '#007bff', // Blue color for reported issues
                        'circle-stroke-color': '#ffffff', // White border
                        'circle-stroke-width': 1,
                        'circle-opacity': 0.8
                    }
                });

                // Optional: Add click event to show popup with issue details for existing reports
                map.current?.on('click', 'reported-issues-layer', (e) => {
                    if (e.features && e.features.length > 0) {
                        const feature = e.features[0];
                        const geometry = feature.geometry;

                        // Ensure the geometry exists, is a Point type, and has coordinates
                        if (!geometry || geometry.type !== 'Point' || !geometry.coordinates) {
                            console.warn(
                                'Clicked feature does not have a valid GeoJSON Point geometry or coordinates.',
                                'Feature:', feature
                            );
                            return; // Exit if geometry is not a Point or coordinates are missing/invalid
                        }

                        // Cast coordinates to the expected tuple type
                        const coordinates = geometry.coordinates as [number, number];

                        // Assuming your GeoJSON properties contain 'issueType' and 'description'
                        const issueType = feature.properties?.issueType || 'Unknown Issue';
                        const description = feature.properties?.description || 'No description provided.';
                        const status = feature.properties?.status || 'Reported';
                        const reportedAt = feature.properties?.reportedAt ?
                                            new Date(feature.properties.reportedAt).toLocaleString() : 'N/A';

                        new maptilersdk.Popup()
                            .setLngLat(coordinates) // Use the extracted coordinates
                            .setHTML(`
                                <h3>${issueType}</h3>
                                <p><strong>Status:</strong> ${status}</p>
                                <p>${description}</p>
                                <p><small>Reported: ${reportedAt}</small></p>
                            `)
                            .addTo(map.current!);
                    }
                });

                // Change the cursor to a pointer when hovering over the reported issues layer
                map.current?.on('mouseenter', 'reported-issues-layer', () => {
                    if (map.current) map.current.getCanvas().style.cursor = 'pointer';
                });

                // Change it back when it leaves
                map.current?.on('mouseleave', 'reported-issues-layer', () => {
                    if (map.current) map.current.getCanvas().style.cursor = '';
                });
            });

            // Add a click listener to the map itself to allow users to select a new report location
            map.current.on('click', (e) => {
                const clickedLngLat = e.lngLat;
                setSelectedReportLocation({ lng: clickedLngLat.lng, lat: clickedLngLat.lat });

                // Conditionally open report dialog or sign-in dialog
                if (isAuthenticated) {
                    setIsReportDialogOpen(true); // Open the report dialog
                } else {
                    setIsSignInDialogOpen(true); // Open the sign-in dialog
                }
            });
        };

        // Attempt to get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    const currentLocation: Location = { lng: longitude, lat: latitude };
                    setUserLocation(currentLocation); // Store user's location in state
                    initializeMap(currentLocation); // Initialize map with user's location
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    // Fallback to default Ghana location if geolocation fails or is denied
                    initializeMap(defaultGhanaLocation);
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 } // Geolocation options
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
            // Fallback to default Ghana location if geolocation is not supported
            initializeMap(defaultGhanaLocation);
        }

        // Clean up function: remove the map instance when the component unmounts
        return () => {
            map.current?.remove();
            map.current = null;
        };
    }, [isAuthenticated]); // Re-run effect if authentication status changes

    // Function to handle successful report submission (from dialog)
    const handleReportSubmitted = () => {
        setIsReportDialogOpen(false); // Close the dialog
        setSelectedReportLocation(null); // Clear selected location
        // Optionally, refresh the 'reported-issues' source to show the new marker
        if (map.current && map.current.getSource('reported-issues')) {
            (map.current.getSource('reported-issues') as maptilersdk.GeoJSONSource).setData('/api/reports');
        }
    };

    // Function to handle dialog close without submission
    const handleReportDialogClose = () => {
        setIsReportDialogOpen(false);
        setSelectedReportLocation(null);
    };

    // Function to handle sign-in dialog close
    const handleSignInDialogClose = () => {
        setIsSignInDialogOpen(false);
    };

    return (
        <div className="w-full overflow-hidden relative">
            {/* The div that MapTiler SDK will use to render the map */}
            <div ref={mapContainer} className="map w-full h-full" />

            {/* Sign In Button on the map */}
            {!isAuthenticated && (
                <div className="absolute top-4 right-4 z-10">
                    <Button onClick={() => setIsSignInDialogOpen(true)} className=" bg-white shadow-md">
                        <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </Button>
                </div>
            )}

            {/* Report Dialog Component */}
            {isReportDialogOpen && selectedReportLocation && (
                <ReportDialog
                    isOpen={isReportDialogOpen}
                    onClose={handleReportDialogClose}
                    onSubmitSuccess={handleReportSubmitted}
                    location={selectedReportLocation}
                />
            )}

            {/* Sign In Dialog Component */}
            {isSignInDialogOpen && (
                <SignInDialog
                    isOpen={isSignInDialogOpen}
                    onClose={handleSignInDialogClose}
                />
            )}
        </div>
    );
};

export default Map;
