import Map from '@/components/Map'
import React from 'react'
import { SessionProvider } from 'next-auth/react'

const page = () => {
  return (
    <div className='min-h-screen'>
      <SessionProvider>
        <Map/>
      </SessionProvider>
    </div>
  )
}

export default page