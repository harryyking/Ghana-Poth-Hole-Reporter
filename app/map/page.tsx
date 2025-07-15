"use client" // This page component itself is a client component

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import dynamic from 'next/dynamic' // Import dynamic from next/dynamic

// Dynamically import the Map component
// This ensures the Map component (and its heavy MapTiler SDK) is only loaded on the client-side
// ssr: false is crucial for components that interact directly with browser APIs like `window` or `navigator` (e.g., geolocation)
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false, // Do not render this component on the server side
  loading: () => <p className="text-center p-4">Loading map...</p>, // Optional: Add a loading indicator
});

const Page = () => {
  return (
    <div className='min-h-screen'>
      {/* SessionProvider wraps the components that need session access */}
      <SessionProvider>
        {/* Render the dynamically imported Map component */}
        <Map/>
      </SessionProvider>
    </div>
  )
}

export default Page;
