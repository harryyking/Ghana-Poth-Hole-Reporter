import SubscriptionButton from '@/components/SubscriptionButton'
import React from 'react'


const page = () => {
  return (
    <div className='flex justify-center items-center p-2'>
        <SubscriptionButton 
        planAmount={30}
        planName='Basic'
        planCode='1232'
        userEmail='arthurharry06@gmail'
        userId='2331'
        />
    </div>
  )
}

export default page 