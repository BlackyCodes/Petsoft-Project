
import Logo from '@/components/Logo'

import React from 'react'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <main className='flex  flex-col items-center justify-center min-h-screen gap-y-5 '>
        <Logo/>
        {children}
        
      
    </main>
  )
}
