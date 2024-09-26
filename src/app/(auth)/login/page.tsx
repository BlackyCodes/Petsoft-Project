import AuthForm from '@/components/auth-form'
import H1 from '@/components/h1'
import Link from 'next/link'
import React from 'react'

export default function Page() {
  return (
    <main>
      <H1 className=' mb-5 text-center'>Log in</H1>
      <AuthForm  type='logIn'/>




        <p className='mt-6  text-sm text-zinc-500'>
          No Account yet?{" "} <Link 
          className=' font-medium '
          href="/signup">
            
            Sign up</Link>
        </p>

    </main>
  

  )
}
